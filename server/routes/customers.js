const express = require('express');
const { query } = require('../config/database');
const { requireAuth, requireCustomer } = require('../middleware/auth');
const router = express.Router();

// Get customer profile
router.get('/profile', requireCustomer, async (req, res) => {
  try {
    const userId = req.session.user.id;

    const result = await query(
      'SELECT * FROM customers WHERE user_id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer profile not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get customer profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update customer profile
router.put('/profile', requireCustomer, async (req, res) => {
  try {
    const userId = req.session.user.id;
    const { name, phone_number, gender } = req.body;

    const result = await query(`
      UPDATE customers 
      SET name = $1, phone_number = $2, gender = $3
      WHERE user_id = $4
      RETURNING *
    `, [name, phone_number, gender, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer profile not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update customer profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get customer bookings
router.get('/bookings', requireCustomer, async (req, res) => {
  try {
    const userId = req.session.user.id;

    // Get customer record
    const customerResult = await query(
      'SELECT id FROM customers WHERE user_id = $1',
      [userId]
    );

    if (customerResult.rows.length === 0) {
      return res.status(404).json({ error: 'Customer profile not found' });
    }

    const customerId = customerResult.rows[0].id;

    const result = await query(`
      SELECT b.*, v.business_name, v.vendor_name, v.email as vendor_email
      FROM customer_vendor_bookings b
      JOIN vendors v ON b.vendor_id = v.id
      WHERE b.customer_id = $1
      ORDER BY b.created_at DESC
    `, [customerId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Get customer bookings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;