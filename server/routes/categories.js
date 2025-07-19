const express = require('express');
const { query } = require('../config/database');
const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM categories ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get category by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM categories WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get vendors by category
router.get('/:id/vendors', async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // First get category name
    const categoryResult = await query('SELECT name FROM categories WHERE id = $1', [id]);
    
    if (categoryResult.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const categoryName = categoryResult.rows[0].name;

    const result = await query(`
      SELECT v.*, 
             COALESCE(AVG(r.rating), 0) as avg_rating,
             COUNT(r.id) as review_count
      FROM vendors v
      LEFT JOIN customer_vendor_reviews r ON v.id = r.vendor_id
      WHERE v.categories::jsonb ? $1
      GROUP BY v.id
      ORDER BY avg_rating DESC, v.created_at DESC
      LIMIT $2 OFFSET $3
    `, [categoryName, limit, offset]);

    res.json(result.rows);
  } catch (error) {
    console.error('Get vendors by category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;