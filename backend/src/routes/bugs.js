import { Router } from 'express';
import { db } from '../db/index.js';
import { bugReports, users } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// GET /api/bugs — User: get my bug reports
router.get('/', authMiddleware, async (req, res) => {
  try {
    const reports = await db.select()
      .from(bugReports)
      .where(eq(bugReports.userId, req.user.id))
      .orderBy(desc(bugReports.createdAt));
    res.json(reports);
  } catch (err) {
    console.error('Get bugs error:', err);
    res.status(500).json({ error: 'Gagal memuat laporan.' });
  }
});

// POST /api/bugs — User: create bug report
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;
    if (!title) return res.status(400).json({ error: 'Judul wajib diisi.' });

    const [newBug] = await db.insert(bugReports).values({
      userId: req.user.id,
      title,
      description: description || '',
      category: category || 'Bug',
      priority: priority || 'Medium',
    }).returning();

    res.status(201).json(newBug);
  } catch (err) {
    console.error('Create bug error:', err);
    res.status(500).json({ error: 'Gagal membuat laporan.' });
  }
});

// GET /api/bugs/count — User: get unread count (reports with admin reply they haven't seen)
router.get('/count', authMiddleware, async (req, res) => {
  try {
    const reports = await db.select()
      .from(bugReports)
      .where(eq(bugReports.userId, req.user.id));
    const withReply = reports.filter(r => r.adminReply && r.status !== 'Closed');
    res.json({ total: reports.length, unread: withReply.length });
  } catch (err) {
    res.json({ total: 0, unread: 0 });
  }
});

export default router;
