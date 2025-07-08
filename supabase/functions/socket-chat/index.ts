import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const { headers } = req
  const upgradeHeader = headers.get("upgrade") || ""

  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { status: 400 })
  }

  const { socket, response } = Deno.upgradeWebSocket(req)
  
  // Store connected clients
  const clients = new Map()
  
  socket.onopen = () => {
    console.log("Client connected")
  }

  socket.onmessage = async (event) => {
    try {
      const data = JSON.parse(event.data)
      const { type, customer_id, vendor_id, message, sender, room } = data

      if (type === 'join_room') {
        // Join a chat room
        clients.set(socket, { customer_id, vendor_id, room: `${customer_id}_${vendor_id}` })
        socket.send(JSON.stringify({
          type: 'room_joined',
          room: `${customer_id}_${vendor_id}`
        }))
      } else if (type === 'send_message') {
        // Broadcast message to room participants
        const messageData = {
          type: 'new_message',
          customer_id,
          vendor_id,
          message,
          sender,
          timestamp: new Date().toISOString()
        }

        // Send to MongoDB via edge function
        try {
          const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/mongodb-chat`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
            },
            body: JSON.stringify({
              customer_id,
              vendor_id,
              message,
              sender
            })
          })

          if (response.ok) {
            // Broadcast to all clients in the same room
            for (const [clientSocket, clientData] of clients.entries()) {
              if (clientData.room === `${customer_id}_${vendor_id}`) {
                if (clientSocket.readyState === WebSocket.OPEN) {
                  clientSocket.send(JSON.stringify(messageData))
                }
              }
            }
          }
        } catch (error) {
          console.error('Error saving message to MongoDB:', error)
          socket.send(JSON.stringify({
            type: 'error',
            message: 'Failed to save message'
          }))
        }
      }
    } catch (error) {
      console.error('Error processing message:', error)
      socket.send(JSON.stringify({
        type: 'error',
        message: 'Invalid message format'
      }))
    }
  }

  socket.onclose = () => {
    clients.delete(socket)
    console.log("Client disconnected")
  }

  socket.onerror = (error) => {
    console.error("WebSocket error:", error)
    clients.delete(socket)
  }

  return response
})