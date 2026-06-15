import express from 'express';
import { db } from '../db/index.js';
import { chatMessages, users } from '../db/schema.js';
import { eq, desc, asc, or } from 'drizzle-orm';
import { authMiddleware } from '../middleware/auth.js';
import { adminMiddleware } from '../middleware/admin.js';

const router = express.Router();

// ==========================================
// PETANI ENDPOINTS
// ==========================================

// Get chat history for logged in user
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const history = await db.select()
      .from(chatMessages)
      .where(eq(chatMessages.userId, req.user.id))
      .orderBy(asc(chatMessages.createdAt));
      
    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil riwayat chat' });
  }
});

// Send message as user
router.post('/send', authMiddleware, async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ message: 'Pesan tidak boleh kosong' });

  try {
    const [newMessage] = await db.insert(chatMessages).values({
      userId: req.user.id,
      isFromAdmin: false,
      message,
    }).returning();

    // Broadcast to Admin and the User
    if (req.io) {
      req.io.to('admin_room').emit('newMessage', newMessage);
      req.io.to(`user_${req.user.id}`).emit('newMessage', newMessage);
    }

    res.json(newMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengirim pesan' });
  }
});

// ==========================================
// ADMIN ENDPOINTS
// ==========================================

// Get list of users who have chat history
router.get('/admin/conversations', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    // Get unique user IDs from chat messages
    const allMessages = await db.select({
      userId: chatMessages.userId,
      message: chatMessages.message,
      createdAt: chatMessages.createdAt,
      isFromAdmin: chatMessages.isFromAdmin,
      isRead: chatMessages.isRead
    })
    .from(chatMessages)
    .orderBy(desc(chatMessages.createdAt));

    // Group by user and get latest message
    const conversationsMap = new Map();
    allMessages.forEach(msg => {
      if (!conversationsMap.has(msg.userId)) {
        conversationsMap.set(msg.userId, msg);
      }
    });

    // Fetch user details for these IDs
    const userIds = Array.from(conversationsMap.keys());
    let usersList = [];
    
    if (userIds.length > 0) {
      // In Drizzle, we can fetch all users and filter, or use inArray (but we'll just fetch all and filter in memory for simplicity if not using inArray)
      const allUsers = await db.select({ id: users.id, name: users.name, photoUrl: users.photoUrl }).from(users);
      
      usersList = userIds.map(id => {
        const userDetails = allUsers.find(u => u.id === id) || { name: 'Unknown User' };
        return {
          user: userDetails,
          latestMessage: conversationsMap.get(id)
        };
      });
    }

    res.json(usersList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil daftar percakapan' });
  }
});

// Get chat history for specific user (Admin view)
router.get('/admin/history/:userId', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const history = await db.select()
      .from(chatMessages)
      .where(eq(chatMessages.userId, parseInt(userId)))
      .orderBy(asc(chatMessages.createdAt));
      
    // Mark as read
    await db.update(chatMessages)
      .set({ isRead: true })
      .where(eq(chatMessages.userId, parseInt(userId)));
      
    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil riwayat chat user' });
  }
});

// Send message as admin
router.post('/admin/send/:userId', authMiddleware, adminMiddleware, async (req, res) => {
  const { message } = req.body;
  const { userId } = req.params;
  if (!message) return res.status(400).json({ message: 'Pesan tidak boleh kosong' });

  try {
    const [newMessage] = await db.insert(chatMessages).values({
      userId: parseInt(userId),
      isFromAdmin: true,
      message,
    }).returning();

    // Broadcast to the specific user and admin room
    if (req.io) {
      req.io.to(`user_${userId}`).emit('newMessage', newMessage);
      req.io.to('admin_room').emit('newMessage', newMessage);
    }

    res.json(newMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengirim pesan' });
  }
});

export default router;
