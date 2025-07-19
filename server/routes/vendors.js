const express = require('express');
const Joi = require('joi');
const { query } = require('../config/database');
const { requireAuth, requireVendor } = require('../middleware/auth');
const router = express.Router();

// Get all vendors
router.get('/', async (req, res) => {
  try {
    const { category, location, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let queryText = `
      SELECT v.*, 
             COALESCE(AVG(r.rating), 0) as avg_rating,
             COUNT(r.id) as review_count
      FROM vendors v
      LEFT JOIN customer_vendor_reviews r ON v.id = r.vendor_id
    `;
    
    const queryParams = [];
    const conditions = [];

    if (category) {
      conditions.push(`v.categories::jsonb ? $${queryParams.length + 1}`);
      queryParams.push(category);
    }

    if (location) {
      conditions.push(`v.address ILIKE $${queryParams.length + 1}`);
      queryParams.push(`%${location}%`);
    }

    if (conditions.length > 0) {
      queryText += ' WHERE ' + conditions.join(' AND ');
    }

    queryText += `
      GROUP BY v.id
      ORDER BY avg_rating DESC, v.created_at DESC
      LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
    `;

    queryParams.push(limit, offset);

    const result = await query(queryText, queryParams);
    res.json(result.rows);
  } catch (error) {
    console.error('Get vendors error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get vendor by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(`
      SELECT v.*, 
             COALESCE(AVG(r.rating), 0) as avg_rating,
             COUNT(r.id) as review_count
      FROM vendors v
      LEFT JOIN customer_vendor_reviews r ON v.id = r.vendor_id
      WHERE v.id = $1
      GROUP BY v.id
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get vendor error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update vendor profile
router.put('/profile', requireVendor, async (req, res) => {
  try {
    const vendorId = req.session.user.id;
    const updates = req.body;

    const validFields = [
      'vendor_name', 'business_name', 'phone_number', 'address',
      'business_info', 'pricing_info', 'availability_info',
      'categories', 'pan', 'aadhar', 'gst'
    ];

    const setClause = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(updates)) {
      if (validFields.includes(key)) {
        setClause.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    if (setClause.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    values.push(vendorId);
    const updateQuery = `
      UPDATE vendors 
      SET ${setClause.join(', ')}
      WHERE user_id = $${paramCount}
      RETURNING *
    `;

    const result = await query(updateQuery, values);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update vendor error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get vendor dashboard data
router.get('/dashboard/stats', requireVendor, async (req, res) => {
  try {
    const vendorId = req.session.user.id;

    // Get vendor record
    const vendorResult = await query(
      'SELECT id FROM vendors WHERE user_id = $1',
      [vendorId]
    );

    if (vendorResult.rows.length === 0) {
      return res.status(404).json({ error: 'Vendor profile not found' });
    }

    const vendorDbId = vendorResult.rows[0].id;

    // Get bookings count
    const bookingsResult = await query(
      'SELECT COUNT(*) as total_bookings FROM customer_vendor_bookings WHERE vendor_id = $1',
      [vendorDbId]
    );

    // Get reviews count and average rating
    const reviewsResult = await query(
      'SELECT COUNT(*) as total_reviews, COALESCE(AVG(rating), 0) as avg_rating FROM customer_vendor_reviews WHERE vendor_id = $1',
      [vendorDbId]
    );

    // Get recent bookings
    const recentBookingsResult = await query(`
      SELECT b.*, c.name as customer_name, c.email as customer_email
      FROM customer_vendor_bookings b
      JOIN customers c ON b.customer_id = c.id
      WHERE b.vendor_id = $1
      ORDER BY b.created_at DESC
      LIMIT 5
    `, [vendorDbId]);

    res.json({
      stats: {
        total_bookings: parseInt(bookingsResult.rows[0].total_bookings),
        total_reviews: parseInt(reviewsResult.rows[0].total_reviews),
        avg_rating: parseFloat(reviewsResult.rows[0].avg_rating)
      },
      recent_bookings: recentBookingsResult.rows
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;