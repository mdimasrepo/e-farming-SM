import { Router } from 'express';
import { db } from '../db/index.js';
import { lahan } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

// GET /api/lahan
router.get('/', async (req, res) => {
  try {
    const result = await db.select().from(lahan).where(eq(lahan.userId, req.user.id));
    res.json(result);
  } catch (err) {
    console.error('Get lahan error:', err);
    res.status(500).json({ error: 'Gagal mengambil data lahan.' });
  }
});

// POST /api/lahan
router.post('/', async (req, res) => {
  try {
    const { name, area, soilType, irrigation, status, imageUrl } = req.body;

    if (!name || !area) {
      return res.status(400).json({ error: 'Nama dan luas lahan wajib diisi.' });
    }

    const [newLahan] = await db.insert(lahan).values({
      userId: req.user.id,
      name,
      area,
      soilType,
      irrigation,
      status: status || 'Aktif',
      imageUrl,
    }).returning();

    res.status(201).json(newLahan);
  } catch (err) {
    console.error('Create lahan error:', err);
    res.status(500).json({ error: 'Gagal menambahkan lahan.' });
  }
});

// PUT /api/lahan/:id
router.put('/:id', async (req, res) => {
  try {
    const { name, area, soilType, irrigation, status, imageUrl } = req.body;

    const [updated] = await db.update(lahan)
      .set({ name, area, soilType, irrigation, status, imageUrl })
      .where(and(eq(lahan.id, parseInt(req.params.id)), eq(lahan.userId, req.user.id)))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: 'Lahan tidak ditemukan.' });
    }

    res.json(updated);
  } catch (err) {
    console.error('Update lahan error:', err);
    res.status(500).json({ error: 'Gagal mengupdate lahan.' });
  }
});

// DELETE /api/lahan/:id
router.delete('/:id', async (req, res) => {
  try {
    const [deleted] = await db.delete(lahan)
      .where(and(eq(lahan.id, parseInt(req.params.id)), eq(lahan.userId, req.user.id)))
      .returning();

    if (!deleted) {
      return res.status(404).json({ error: 'Lahan tidak ditemukan.' });
    }

    res.json({ message: 'Lahan berhasil dihapus.', deleted });
  } catch (err) {
    console.error('Delete lahan error:', err);
    res.status(500).json({ error: 'Gagal menghapus lahan.' });
  }
});

export default router;
