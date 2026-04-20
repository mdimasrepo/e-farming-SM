import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import lahanRoutes from './routes/lahan.js';
import tanamanRoutes from './routes/tanaman.js';
import jadwalRoutes from './routes/jadwal.js';
import inventoriRoutes from './routes/inventori.js';
import laporanRoutes from './routes/laporan.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/lahan', lahanRoutes);
app.use('/api/tanaman', tanamanRoutes);
app.use('/api/jadwal', jadwalRoutes);
app.use('/api/inventori', inventoriRoutes);
app.use('/api/laporan', laporanRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Tani.Smart API is running 🌱' });
});

app.listen(PORT, () => {
  console.log(`\n🌱 Tani.Smart API Server berjalan di http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
});
