const express = require('express');
const Joi = require('joi');
const { query } = require('../config/database');
const { requireAuth, requireCustomer } = require('../middleware/auth');
const router = express.Router();

const reviewSchema = Joi.object({
  vendor_id: Joi.string().uuid().required(),
  booking_id: Joi.string().uuid(),
  rating: Joi.number().integer().min(1).max(5).required(),
  review_text: Joi.string().allow(''),
  review_images: Joi.array().items(Joi.string())
});

// Create review
router.post('/', requireCustomer, async (req, res) => {
  try {
    const { error: validationError, value } = reviewSchema.validate(req.body);
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
      booking_id,
      rating,
      review_text,
      review_images
    } = value;

    // Check if review already exists for this booking
    if (booking_id) {
      const existingReview = await query(
        'SELECT id FROM customer_vendor_reviews WHERE customer_id = $1 AND booking_id = $2',
        [customerId, booking_id]
      );

      if (existingReview.rows.length > 0) {
        return res.status(400).json({ error: 'Review already exists for this booking' });
      }
    }

    const result = await query(`
      INSERT INTO customer_vendor_reviews 
      (customer_id, vendor_id, booking_id, rating, review_text, review_images)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [customerId, vendor_id, booking_id, rating, review_text, JSON.stringify(review_images || [])]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get reviews for vendor
router.get('/vendor/:vendorId', async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const result = await query(`
      SELECT r.*, c.name as customer_name
      FROM customer_vendor_reviews r
      JOIN customers c ON r.customer_id = c.id
      WHERE r.vendor_id = $1
      ORDER BY r.created_at DESC
      LIMIT $2 OFFSET $3
    `, [vendorId, limit, offset]);

    res.json(result.rows);
  } catch (error) {
    console.error('Get vendor reviews error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update review (customer only)
router.put('/:id', requireCustomer, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.session.user.id;
    const { rating, review_text, review_images } = req.body;

    const result = await query(`
      UPDATE customer_vendor_reviews 
      SET rating = $1, review_text = $2, review_images = $3, updated_at = NOW()
      WHERE id = $4 AND customer_id IN (
        SELECT id FROM customers WHERE user_id = $5
      )
      RETURNING *
    `, [rating, review_text, JSON.stringify(review_images || []), id, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Review not found or unauthorized' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;