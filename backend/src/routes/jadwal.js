import { Router } from 'express';
import { db } from '../db/index.js';
import { jadwal } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

// GET /api/jadwal
router.get('/', async (req, res) => {
  try {
    const result = await db.select().from(jadwal).where(eq(jadwal.userId, req.user.id));
    res.json(result);
  } catch (err) {
    console.error('Get jadwal error:', err);
    res.status(500).json({ error: 'Gagal mengambil data jadwal.' });
  }
});

// POST /api/jadwal
router.post('/', async (req, res) => {
  try {
    const { title, date, time, type, priority, status } = req.body;

    if (!title || !date) {
      return res.status(400).json({ error: 'Judul dan tanggal kegiatan wajib diisi.' });
    }

    const [newJadwal] = await db.insert(jadwal).values({
      userId: req.user.id,
      title,
      date,
      time,
      type,
      priority: priority || 'Medium',
      status: status || 'Pending',
    }).returning();

    res.status(201).json(newJadwal);
  } catch (err) {
    console.error('Create jadwal error:', err);
    res.status(500).json({ error: 'Gagal menambahkan jadwal.' });
  }
});

// PUT /api/jadwal/:id
router.put('/:id', async (req, res) => {
  try {
    const { title, date, time, type, priority, status } = req.body;

    const [updated] = await db.update(jadwal)
      .set({ title, date, time, type, priority, status })
      .where(and(eq(jadwal.id, parseInt(req.params.id)), eq(jadwal.userId, req.user.id)))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: 'Jadwal tidak ditemukan.' });
    }

    res.json(updated);
  } catch (err) {
    console.error('Update jadwal error:', err);
    res.status(500).json({ error: 'Gagal mengupdate jadwal.' });
  }
});

// DELETE /api/jadwal/:id
router.delete('/:id', async (req, res) => {
  try {
    const [deleted] = await db.delete(jadwal)
      .where(and(eq(jadwal.id, parseInt(req.params.id)), eq(jadwal.userId, req.user.id)))
      .returning();

    if (!deleted) {
      return res.status(404).json({ error: 'Jadwal tidak ditemukan.' });
    }

    res.json({ message: 'Jadwal berhasil dihapus.', deleted });
  } catch (err) {
    console.error('Delete jadwal error:', err);
    res.status(500).json({ error: 'Gagal menghapus jadwal.' });
  }
});

export default router;
