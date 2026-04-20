import { Router } from 'express';
import { db } from '../db/index.js';
import { tanaman } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

// GET /api/tanaman
router.get('/', async (req, res) => {
  try {
    const result = await db.select().from(tanaman).where(eq(tanaman.userId, req.user.id));
    res.json(result);
  } catch (err) {
    console.error('Get tanaman error:', err);
    res.status(500).json({ error: 'Gagal mengambil data tanaman.' });
  }
});

// POST /api/tanaman
router.post('/', async (req, res) => {
  try {
    const { name, lahanId, lahanName, icon, plantDate, estHarvest, progress, health } = req.body;

    if (!name || !plantDate) {
      return res.status(400).json({ error: 'Nama tanaman dan tanggal tanam wajib diisi.' });
    }

    const [newTanaman] = await db.insert(tanaman).values({
      userId: req.user.id,
      name,
      lahanId,
      lahanName,
      icon,
      plantDate,
      estHarvest,
      progress: progress || 0,
      health: health || 'Baik',
    }).returning();

    res.status(201).json(newTanaman);
  } catch (err) {
    console.error('Create tanaman error:', err);
    res.status(500).json({ error: 'Gagal menambahkan tanaman.' });
  }
});

// PUT /api/tanaman/:id
router.put('/:id', async (req, res) => {
  try {
    const { name, lahanId, lahanName, icon, plantDate, estHarvest, progress, health } = req.body;

    const [updated] = await db.update(tanaman)
      .set({ name, lahanId, lahanName, icon, plantDate, estHarvest, progress, health })
      .where(and(eq(tanaman.id, parseInt(req.params.id)), eq(tanaman.userId, req.user.id)))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: 'Data tanaman tidak ditemukan.' });
    }

    res.json(updated);
  } catch (err) {
    console.error('Update tanaman error:', err);
    res.status(500).json({ error: 'Gagal mengupdate tanaman.' });
  }
});

// DELETE /api/tanaman/:id
router.delete('/:id', async (req, res) => {
  try {
    const [deleted] = await db.delete(tanaman)
      .where(and(eq(tanaman.id, parseInt(req.params.id)), eq(tanaman.userId, req.user.id)))
      .returning();

    if (!deleted) {
      return res.status(404).json({ error: 'Data tanaman tidak ditemukan.' });
    }

    res.json({ message: 'Data tanaman berhasil dihapus.', deleted });
  } catch (err) {
    console.error('Delete tanaman error:', err);
    res.status(500).json({ error: 'Gagal menghapus tanaman.' });
  }
});

export default router;
