const { supabase } = require('../config/supabase');

// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

// Middleware to check if user is a vendor
const requireVendor = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  if (req.session.user.user_type !== 'vendor') {
    return res.status(403).json({ error: 'Vendor access required' });
  }
  
  next();
};

// Middleware to check if user is a customer
const requireCustomer = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  if (req.session.user.user_type !== 'customer') {
    return res.status(403).json({ error: 'Customer access required' });
  }
  
  next();
};

// Middleware to check if user is an admin
const requireAdmin = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  if (req.session.user.user_type !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  next();
};

// Middleware to verify Supabase JWT token (for hybrid auth scenarios)
const verifySupabaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No valid token provided' });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.supabaseUser = user;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: 'Token verification failed' });
  }
};

module.exports = {
  requireAuth,
  requireVendor,
  requireCustomer,
  requireAdmin,
  verifySupabaseToken
};