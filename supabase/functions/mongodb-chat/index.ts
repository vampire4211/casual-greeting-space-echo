import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { MongoClient } from "https://deno.land/x/mongo@v0.32.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ChatMessage {
  sender: "customer" | "vendor"
  message: string
  timestamp: Date
}

interface ChatDocument {
  customer_id: number
  vendor_id: number
  messages: ChatMessage[]
  started_at: Date
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const mongoUrl = Deno.env.get('MONGODB_URL')
    if (!mongoUrl) {
      throw new Error('MongoDB URL not configured')
    }

    console.log('Connecting to MongoDB...')
    const client = new MongoClient()
    
    // Replace <db_password> placeholder with actual password from environment
    const finalUrl = mongoUrl.replace('<db_password>', Deno.env.get('MONGODB_PASSWORD') || 'defaultpassword')
    await client.connect(finalUrl)
    
    const db = client.database("eventsathi")
    const chatCollection = db.collection<ChatDocument>("chat_storage")

    const { method } = req
    const url = new URL(req.url)
    const pathSegments = url.pathname.split('/').filter(Boolean)
    
    if (method === 'GET') {
      // Get chat messages between customer and vendor
      const customerId = parseInt(url.searchParams.get('customer_id') || '0')
      const vendorId = parseInt(url.searchParams.get('vendor_id') || '0')
      
      if (!customerId || !vendorId) {
        return new Response(
          JSON.stringify({ error: 'customer_id and vendor_id are required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const chat = await chatCollection.findOne({
        customer_id: customerId,
        vendor_id: vendorId
      })

      return new Response(
        JSON.stringify({ chat: chat || { messages: [] } }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    if (method === 'POST') {
      const { customer_id, vendor_id, message, sender } = await req.json()
      
      if (!customer_id || !vendor_id || !message || !sender) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const newMessage: ChatMessage = {
        sender,
        message,
        timestamp: new Date()
      }

      // Try to update existing chat, or create new one
      const updateResult = await chatCollection.updateOne(
        { customer_id: parseInt(customer_id), vendor_id: parseInt(vendor_id) },
        {
          $push: { messages: newMessage },
          $setOnInsert: { 
            customer_id: parseInt(customer_id), 
            vendor_id: parseInt(vendor_id),
            started_at: new Date() 
          }
        },
        { upsert: true }
      )

      await client.close()

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Message sent successfully',
          messageData: newMessage
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})