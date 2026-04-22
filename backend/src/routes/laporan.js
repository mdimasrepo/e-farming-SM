import { Router } from 'express';
import { db } from '../db/index.js';
import { laporanProduktivitas, transaksiJualBeli } from '../db/schema.js';
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
    const transactions = await db.select().from(transaksiJualBeli)
      .where(eq(transaksiJualBeli.userId, req.user.id));
    
    // Default quarters
    const revenueMap = {
      'Q1': { quarter: 'Q1', revenue: 0, expense: 0 },
      'Q2': { quarter: 'Q2', revenue: 0, expense: 0 },
      'Q3': { quarter: 'Q3', revenue: 0, expense: 0 },
      'Q4': { quarter: 'Q4', revenue: 0, expense: 0 }
    };

    transactions.forEach(t => {
      const date = new Date(t.date);
      const month = date.getMonth(); // 0-11
      let quarter = 'Q1';
      if (month >= 3 && month <= 5) quarter = 'Q2';
      else if (month >= 6 && month <= 8) quarter = 'Q3';
      else if (month >= 9) quarter = 'Q4';

      if (t.type === 'Jual') {
        revenueMap[quarter].revenue += Number(t.totalNominal);
      } else if (t.type === 'Beli') {
        revenueMap[quarter].expense += Number(t.totalNominal);
      }
    });

    res.json(Object.values(revenueMap));
  } catch (err) {
    console.error('Get revenue error:', err);
    res.status(500).json({ error: 'Gagal mengambil data revenue.' });
  }
});

export default router;
