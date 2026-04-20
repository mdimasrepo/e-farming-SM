import { Router } from 'express';
import { db } from '../db/index.js';
import { laporanProduktivitas, laporanRevenue } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

// GET /api/laporan/produktivitas
router.get('/produktivitas', async (req, res) => {
  try {
    const result = await db.select().from(laporanProduktivitas).where(eq(laporanProduktivitas.userId, req.user.id));
    res.json(result);
  } catch (err) {
    console.error('Get produktivitas error:', err);
    res.status(500).json({ error: 'Gagal mengambil data produktivitas.' });
  }
});

// GET /api/laporan/revenue
router.get('/revenue', async (req, res) => {
  try {
    const result = await db.select().from(laporanRevenue).where(eq(laporanRevenue.userId, req.user.id));
    res.json(result);
  } catch (err) {
    console.error('Get revenue error:', err);
    res.status(500).json({ error: 'Gagal mengambil data revenue.' });
  }
});

export default router;
