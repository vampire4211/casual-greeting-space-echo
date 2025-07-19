const express = require('express');
const Joi = require('joi');
const { query } = require('../config/database');
const { requireAuth, requireCustomer, requireVendor } = require('../middleware/auth');
const router = express.Router();

const bookingSchema = Joi.object({
  vendor_id: Joi.string().uuid().required(),
  event_date: Joi.date().iso().required(),
  event_type: Joi.string().required(),
  package_details: Joi.object(),
  total_amount: Joi.number().positive(),
  notes: Joi.string().allow('')
});

// Create booking
router.post('/', requireCustomer, async (req, res) => {
  try {
    const { error: validationError, value } = bookingSchema.validate(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError.details[0].message });
    }

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

    const {
      vendor_id,
      event_date,
      event_type,
      package_details,
      total_amount,
      notes
    } = value;

    const result = await query(`
      INSERT INTO customer_vendor_bookings 
      (customer_id, vendor_id, booking_date, event_date, event_type, package_details, total_amount, notes)
      VALUES ($1, $2, NOW(), $3, $4, $5, $6, $7)
      RETURNING *
    `, [customerId, vendor_id, event_date, event_type, JSON.stringify(package_details), total_amount, notes]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get booking by ID
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.session.user.id;
    const userType = req.session.user.user_type;

    let queryText = `
      SELECT b.*, 
             c.name as customer_name, c.email as customer_email,
             v.business_name, v.vendor_name, v.email as vendor_email
      FROM customer_vendor_bookings b
      JOIN customers c ON b.customer_id = c.id
      JOIN vendors v ON b.vendor_id = v.id
      WHERE b.id = $1
    `;

    const queryParams = [id];

    // Add authorization check based on user type
    if (userType === 'customer') {
      queryText += ' AND c.user_id = $2';
      queryParams.push(userId);
    } else if (userType === 'vendor') {
      queryText += ' AND v.user_id = $2';
      queryParams.push(userId);
    }

    const result = await query(queryText, queryParams);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update booking status (vendor only)
router.patch('/:id/status', requireVendor, async (req, res) => {
  try {
    const { id } = req.params;
    const { booking_status } = req.body;
    const userId = req.session.user.id;

    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(booking_status)) {
      return res.status(400).json({ error: 'Invalid booking status' });
    }

    const result = await query(`
      UPDATE customer_vendor_bookings 
      SET booking_status = $1, updated_at = NOW()
      WHERE id = $2 AND vendor_id IN (
        SELECT id FROM vendors WHERE user_id = $3
      )
      RETURNING *
    `, [booking_status, id, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found or unauthorized' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get vendor bookings
router.get('/vendor/list', requireVendor, async (req, res) => {
  try {
    const userId = req.session.user.id;
    const { status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let queryText = `
      SELECT b.*, c.name as customer_name, c.email as customer_email, c.phone_number as customer_phone
      FROM customer_vendor_bookings b
      JOIN customers c ON b.customer_id = c.id
      JOIN vendors v ON b.vendor_id = v.id
      WHERE v.user_id = $1
    `;

    const queryParams = [userId];

    if (status) {
      queryText += ' AND b.booking_status = $2';
      queryParams.push(status);
    }

    queryText += `
      ORDER BY b.created_at DESC
      LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
    `;

    queryParams.push(limit, offset);

    const result = await query(queryText, queryParams);
    res.json(result.rows);
  } catch (error) {
    console.error('Get vendor bookings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;