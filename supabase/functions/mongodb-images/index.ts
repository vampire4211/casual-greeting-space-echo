import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { MongoClient } from "https://deno.land/x/mongo@v0.32.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface VendorImage {
  vendor_id: number
  image_url: string
  uploaded_at: Date
  title?: string
  description?: string
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
    const imagesCollection = db.collection<VendorImage>("vendor_images")

    const { method } = req
    const url = new URL(req.url)
    
    if (method === 'GET') {
      // Get all images for a vendor
      const vendorId = parseInt(url.searchParams.get('vendor_id') || '0')
      
      if (!vendorId) {
        return new Response(
          JSON.stringify({ error: 'vendor_id is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const images = await imagesCollection.find({
        vendor_id: vendorId
      }).toArray()

      return new Response(
        JSON.stringify({ images }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    if (method === 'POST') {
      const { vendor_id, image_url, title, description } = await req.json()
      
      if (!vendor_id || !image_url) {
        return new Response(
          JSON.stringify({ error: 'vendor_id and image_url are required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const newImage: VendorImage = {
        vendor_id: parseInt(vendor_id),
        image_url,
        uploaded_at: new Date(),
        title: title || '',
        description: description || ''
      }

      const result = await imagesCollection.insertOne(newImage)

      await client.close()

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Image saved successfully',
          imageId: result
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (method === 'DELETE') {
      const { vendor_id, image_url } = await req.json()
      
      if (!vendor_id || !image_url) {
        return new Response(
          JSON.stringify({ error: 'vendor_id and image_url are required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      await imagesCollection.deleteOne({
        vendor_id: parseInt(vendor_id),
        image_url
      })

      await client.close()

      return new Response(
        JSON.stringify({ success: true, message: 'Image deleted successfully' }),
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