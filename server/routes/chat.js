const express = require('express');
const { query } = require('../config/database');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

// Get user's chats
router.get('/', requireAuth, async (req, res) => {
  try {
    const userId = req.session.user.id;
    const userType = req.session.user.user_type;

    let queryText, queryParams;

    if (userType === 'customer') {
      // Get customer record and their chats
      const customerResult = await query(
        'SELECT id FROM customers WHERE user_id = $1',
        [userId]
      );

      if (customerResult.rows.length === 0) {
        return res.status(404).json({ error: 'Customer profile not found' });
      }

      const customerId = customerResult.rows[0].id;

      queryText = `
        SELECT DISTINCT c.*, v.business_name as vendor_name, v.email as vendor_email,
               (SELECT message FROM chat_messages cm 
                WHERE cm.chat_room_id = c.chat_room_id 
                ORDER BY cm.created_at DESC LIMIT 1) as last_message,
               (SELECT created_at FROM chat_messages cm 
                WHERE cm.chat_room_id = c.chat_room_id 
                ORDER BY cm.created_at DESC LIMIT 1) as last_message_time
        FROM customer_vendor_chats c
        JOIN vendors v ON c.vendor_id = v.id
        WHERE c.customer_id = $1 AND c.is_active = true
        ORDER BY c.last_message_at DESC
      `;
      queryParams = [customerId];
    } else if (userType === 'vendor') {
      // Get vendor record and their chats
      const vendorResult = await query(
        'SELECT id FROM vendors WHERE user_id = $1',
        [userId]
      );

      if (vendorResult.rows.length === 0) {
        return res.status(404).json({ error: 'Vendor profile not found' });
      }

      const vendorId = vendorResult.rows[0].id;

      queryText = `
        SELECT DISTINCT c.*, cu.name as customer_name, cu.email as customer_email,
               (SELECT message FROM chat_messages cm 
                WHERE cm.chat_room_id = c.chat_room_id 
                ORDER BY cm.created_at DESC LIMIT 1) as last_message,
               (SELECT created_at FROM chat_messages cm 
                WHERE cm.chat_room_id = c.chat_room_id 
                ORDER BY cm.created_at DESC LIMIT 1) as last_message_time
        FROM customer_vendor_chats c
        JOIN customers cu ON c.customer_id = cu.id
        WHERE c.vendor_id = $1 AND c.is_active = true
        ORDER BY c.last_message_at DESC
      `;
      queryParams = [vendorId];
    } else {
      return res.status(403).json({ error: 'Invalid user type for chat access' });
    }

    const result = await query(queryText, queryParams);
    res.json(result.rows);
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get messages for a chat room
router.get('/:chatRoomId/messages', requireAuth, async (req, res) => {
  try {
    const { chatRoomId } = req.params;
    const userId = req.session.user.id;
    const userType = req.session.user.user_type;

    // Verify user has access to this chat room
    let accessQuery, accessParams;

    if (userType === 'customer') {
      const customerResult = await query(
        'SELECT id FROM customers WHERE user_id = $1',
        [userId]
      );

      if (customerResult.rows.length === 0) {
        return res.status(404).json({ error: 'Customer profile not found' });
      }

      accessQuery = 'SELECT id FROM customer_vendor_chats WHERE chat_room_id = $1 AND customer_id = $2';
      accessParams = [chatRoomId, customerResult.rows[0].id];
    } else if (userType === 'vendor') {
      const vendorResult = await query(
        'SELECT id FROM vendors WHERE user_id = $1',
        [userId]
      );

      if (vendorResult.rows.length === 0) {
        return res.status(404).json({ error: 'Vendor profile not found' });
      }

      accessQuery = 'SELECT id FROM customer_vendor_chats WHERE chat_room_id = $1 AND vendor_id = $2';
      accessParams = [chatRoomId, vendorResult.rows[0].id];
    }

    const accessResult = await query(accessQuery, accessParams);
    if (accessResult.rows.length === 0) {
      return res.status(403).json({ error: 'Access denied to this chat room' });
    }

    // Get messages
    const messagesResult = await query(`
      SELECT * FROM chat_messages 
      WHERE chat_room_id = $1 
      ORDER BY created_at ASC
    `, [chatRoomId]);

    res.json(messagesResult.rows);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Send message
router.post('/:chatRoomId/messages', requireAuth, async (req, res) => {
  try {
    const { chatRoomId } = req.params;
    const { message } = req.body;
    const userId = req.session.user.id;
    const userType = req.session.user.user_type;

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    // Get user record based on type
    let userRecord, sender;

    if (userType === 'customer') {
      const customerResult = await query(
        'SELECT id FROM customers WHERE user_id = $1',
        [userId]
      );

      if (customerResult.rows.length === 0) {
        return res.status(404).json({ error: 'Customer profile not found' });
      }

      userRecord = customerResult.rows[0];
      sender = 'customer';
    } else if (userType === 'vendor') {
      const vendorResult = await query(
        'SELECT id FROM vendors WHERE user_id = $1',
        [userId]
      );

      if (vendorResult.rows.length === 0) {
        return res.status(404).json({ error: 'Vendor profile not found' });
      }

      userRecord = vendorResult.rows[0];
      sender = 'vendor';
    } else {
      return res.status(403).json({ error: 'Invalid user type for chat' });
    }

    // Get chat room details
    const chatResult = await query(
      'SELECT customer_id, vendor_id FROM customer_vendor_chats WHERE chat_room_id = $1',
      [chatRoomId]
    );

    if (chatResult.rows.length === 0) {
      return res.status(404).json({ error: 'Chat room not found' });
    }

    const chat = chatResult.rows[0];

    // Insert message
    const messageResult = await query(`
      INSERT INTO chat_messages 
      (chat_room_id, customer_id, vendor_id, message, sender)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [chatRoomId, chat.customer_id, chat.vendor_id, message.trim(), sender]);

    // Update last message time in chat
    await query(
      'UPDATE customer_vendor_chats SET last_message_at = NOW() WHERE chat_room_id = $1',
      [chatRoomId]
    );

    res.status(201).json(messageResult.rows[0]);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create chat room
router.post('/rooms', requireAuth, async (req, res) => {
  try {
    const { vendor_id } = req.body;
    const userId = req.session.user.id;
    const userType = req.session.user.user_type;

    if (userType !== 'customer') {
      return res.status(403).json({ error: 'Only customers can initiate chats' });
    }

    // Get customer record
    const customerResult = await query(
      'SELECT id FROM customers WHERE user_id = $1',
      [userId]
    );

    if (customerResult.rows.length === 0) {
      return res.status(404).json({ error: 'Customer profile not found' });
    }

    const customerId = customerResult.rows[0].id;

    // Check if chat already exists
    const existingChat = await query(
      'SELECT * FROM customer_vendor_chats WHERE customer_id = $1 AND vendor_id = $2',
      [customerId, vendor_id]
    );

    if (existingChat.rows.length > 0) {
      return res.json(existingChat.rows[0]);
    }

    // Create new chat room
    const chatResult = await query(`
      INSERT INTO customer_vendor_chats (customer_id, vendor_id)
      VALUES ($1, $2)
      RETURNING *
    `, [customerId, vendor_id]);

    res.status(201).json(chatResult.rows[0]);
  } catch (error) {
    console.error('Create chat room error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;