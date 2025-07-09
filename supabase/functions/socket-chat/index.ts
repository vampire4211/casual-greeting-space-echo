import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { headers } = req
  const upgradeHeader = headers.get("upgrade") || ""

  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { status: 400 })
  }

  const { socket, response } = Deno.upgradeWebSocket(req)
  
  // Initialize Supabase client
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )
  
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
        // Save message to PostgreSQL
        try {
          const { error: saveError } = await supabase
            .from('chat_messages')
            .insert({
              customer_id,
              vendor_id,
              sender,
              message
            })

          if (saveError) {
            console.error('Error saving message to PostgreSQL:', saveError)
            socket.send(JSON.stringify({
              type: 'error',
              message: 'Failed to save message'
            }))
            return
          }

          // Broadcast message to room participants
          const messageData = {
            type: 'new_message',
            customer_id,
            vendor_id,
            message,
            sender,
            timestamp: new Date().toISOString()
          }

          // Broadcast to all clients in the same room
          for (const [clientSocket, clientData] of clients.entries()) {
            if (clientData.room === `${customer_id}_${vendor_id}`) {
              if (clientSocket.readyState === WebSocket.OPEN) {
                clientSocket.send(JSON.stringify(messageData))
              }
            }
          }
        } catch (error) {
          console.error('Error saving message to PostgreSQL:', error)
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