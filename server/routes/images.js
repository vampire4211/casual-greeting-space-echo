const express = require('express');
const multer = require('multer');
const { supabaseAdmin } = require('../config/supabase');
const { query } = require('../config/database');
const { requireAuth, requireVendor } = require('../middleware/auth');
const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Upload vendor images
router.post('/vendor/upload', requireVendor, upload.array('images', 10), async (req, res) => {
  try {
    const userId = req.session.user.id;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    // Get vendor record
    const vendorResult = await query(
      'SELECT id FROM vendors WHERE user_id = $1',
      [userId]
    );

    if (vendorResult.rows.length === 0) {
      return res.status(404).json({ error: 'Vendor profile not found' });
    }

    const vendorId = vendorResult.rows[0].id;
    const uploadedImages = [];

    for (const file of files) {
      const fileName = `${vendorId}/${Date.now()}-${file.originalname}`;
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from('vendor-images')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        continue;
      }

      // Get public URL
      const { data: { publicUrl } } = supabaseAdmin.storage
        .from('vendor-images')
        .getPublicUrl(fileName);

      // Save to database
      const imageResult = await query(`
        INSERT INTO vendor_images (vendor_id, image_url, title, description)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `, [vendorId, publicUrl, req.body.title || '', req.body.description || '']);

      uploadedImages.push(imageResult.rows[0]);
    }

    res.json({
      message: `${uploadedImages.length} images uploaded successfully`,
      images: uploadedImages
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get vendor images
router.get('/vendor/:vendorId', async (req, res) => {
  try {
    const { vendorId } = req.params;

    const result = await query(
      'SELECT * FROM vendor_images WHERE vendor_id = $1 ORDER BY created_at DESC',
      [vendorId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get vendor images error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete vendor image
router.delete('/:imageId', requireVendor, async (req, res) => {
  try {
    const { imageId } = req.params;
    const userId = req.session.user.id;

    // Get image details and verify ownership
    const imageResult = await query(`
      SELECT vi.*, v.user_id 
      FROM vendor_images vi
      JOIN vendors v ON vi.vendor_id = v.id
      WHERE vi.id = $1 AND v.user_id = $2
    `, [imageId, userId]);

    if (imageResult.rows.length === 0) {
      return res.status(404).json({ error: 'Image not found or unauthorized' });
    }

    const image = imageResult.rows[0];

    // Extract file path from URL
    const urlParts = image.image_url.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const vendorId = urlParts[urlParts.length - 2];
    const filePath = `${vendorId}/${fileName}`;

    // Delete from Supabase Storage
    const { error: deleteError } = await supabaseAdmin.storage
      .from('vendor-images')
      .remove([filePath]);

    if (deleteError) {
      console.error('Storage delete error:', deleteError);
    }

    // Delete from database
    await query('DELETE FROM vendor_images WHERE id = $1', [imageId]);

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;