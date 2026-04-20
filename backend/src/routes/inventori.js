import { Router } from 'express';
import { db } from '../db/index.js';
import { inventori } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

// GET /api/inventori
router.get('/', async (req, res) => {
  try {
    const result = await db.select().from(inventori).where(eq(inventori.userId, req.user.id));
    res.json(result);
  } catch (err) {
    console.error('Get inventori error:', err);
    res.status(500).json({ error: 'Gagal mengambil data inventori.' });
  }
});

// POST /api/inventori
router.post('/', async (req, res) => {
  try {
    const { item, category, stock, unit, status } = req.body;

    if (!item) {
      return res.status(400).json({ error: 'Nama barang wajib diisi.' });
    }

    const [newItem] = await db.insert(inventori).values({
      userId: req.user.id,
      item,
      category,
      stock: stock || 0,
      unit,
      status: status || 'Aman',
    }).returning();

    res.status(201).json(newItem);
  } catch (err) {
    console.error('Create inventori error:', err);
    res.status(500).json({ error: 'Gagal menambahkan barang.' });
  }
});

// PUT /api/inventori/:id
router.put('/:id', async (req, res) => {
  try {
    const { item, category, stock, unit, status } = req.body;

    const [updated] = await db.update(inventori)
      .set({ item, category, stock, unit, status, updatedAt: new Date() })
      .where(and(eq(inventori.id, parseInt(req.params.id)), eq(inventori.userId, req.user.id)))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: 'Barang tidak ditemukan.' });
    }

    res.json(updated);
  } catch (err) {
    console.error('Update inventori error:', err);
    res.status(500).json({ error: 'Gagal mengupdate barang.' });
  }
});

// DELETE /api/inventori/:id
router.delete('/:id', async (req, res) => {
  try {
    const [deleted] = await db.delete(inventori)
      .where(and(eq(inventori.id, parseInt(req.params.id)), eq(inventori.userId, req.user.id)))
      .returning();

    if (!deleted) {
      return res.status(404).json({ error: 'Barang tidak ditemukan.' });
    }

    res.json({ message: 'Barang berhasil dihapus.', deleted });
  } catch (err) {
    console.error('Delete inventori error:', err);
    res.status(500).json({ error: 'Gagal menghapus barang.' });
  }
});

export default router;
