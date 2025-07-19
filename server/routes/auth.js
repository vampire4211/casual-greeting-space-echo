const express = require('express');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const { query } = require('../config/database');
const { supabase } = require('../config/supabase');
const router = express.Router();

// Validation schemas
const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  user_type: Joi.string().valid('customer', 'vendor').required(),
  name: Joi.string().min(2).max(100),
  vendor_name: Joi.string().min(2).max(100),
  business_name: Joi.string().min(2).max(100),
  phone: Joi.string().pattern(/^[0-9]{10}$/),
  pan_number: Joi.string().pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/),
  aadhaar_number: Joi.string().pattern(/^[0-9]{12}$/),
  categories: Joi.array().items(Joi.string())
});

const signinSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Sign up route
router.post('/signup', async (req, res) => {
  try {
    const { error: validationError, value } = signupSchema.validate(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError.details[0].message });
    }

    const { email, password, user_type, ...userData } = value;

    // Check if user already exists in our database
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          user_type,
          ...userData
        }
      }
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    // Hash password for our database
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insert user into our PostgreSQL database
    const userResult = await query(
      `INSERT INTO users (id, email, password_hash, user_type, created_at) 
       VALUES ($1, $2, $3, $4, NOW()) RETURNING id, email, user_type, created_at`,
      [authData.user.id, email, hashedPassword, user_type]
    );

    const user = userResult.rows[0];

    // Insert into specific user type table
    if (user_type === 'customer') {
      await query(
        `INSERT INTO customers (user_id, name, email, phone_number) 
         VALUES ($1, $2, $3, $4)`,
        [user.id, userData.name || '', email, userData.phone || '']
      );
    } else if (user_type === 'vendor') {
      await query(
        `INSERT INTO vendors (user_id, vendor_name, business_name, email, phone_number, pan, aadhar, categories) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          user.id,
          userData.vendor_name || '',
          userData.business_name || '',
          email,
          userData.phone || '',
          userData.pan_number || '',
          userData.aadhaar_number || '',
          JSON.stringify(userData.categories || [])
        ]
      );
    }

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        email: user.email,
        user_type: user.user_type
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Sign in route
router.post('/signin', async (req, res) => {
  try {
    const { error: validationError, value } = signinSchema.validate(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError.details[0].message });
    }

    const { email, password } = value;

    // Get user from our database
    const userResult = await query(
      'SELECT id, email, password_hash, user_type FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = userResult.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      return res.status(401).json({ error: authError.message });
    }

    // Store user in session
    req.session.user = {
      id: user.id,
      email: user.email,
      user_type: user.user_type,
      supabase_session: authData.session
    };

    res.json({
      message: 'Sign in successful',
      user: {
        id: user.id,
        email: user.email,
        user_type: user.user_type
      },
      session: authData.session
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Sign out route
router.post('/signout', async (req, res) => {
  try {
    // Sign out from Supabase
    if (req.session.user && req.session.user.supabase_session) {
      await supabase.auth.signOut();
    }

    // Destroy session
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destruction error:', err);
        return res.status(500).json({ error: 'Could not sign out' });
      }
      
      res.clearCookie('connect.sid');
      res.json({ message: 'Signed out successfully' });
    });
  } catch (error) {
    console.error('Signout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user route
router.get('/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  res.json({
    user: {
      id: req.session.user.id,
      email: req.session.user.email,
      user_type: req.session.user.user_type
    }
  });
});

// Check session status
router.get('/status', (req, res) => {
  res.json({
    authenticated: !!req.session.user,
    user: req.session.user ? {
      id: req.session.user.id,
      email: req.session.user.email,
      user_type: req.session.user.user_type
    } : null
  });
});

module.exports = router;