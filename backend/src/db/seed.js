import 'dotenv/config';
import bcrypt from 'bcryptjs';
import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import * as schema from './schema.js';

const { Pool } = pg;

async function seed() {
  // Buat database jika belum ada
  const adminPool = new Pool({
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'postgres',
  });

  try {
    const checkDb = await adminPool.query(
      "SELECT 1 FROM pg_database WHERE datname = 'tani_smart'"
    );
    if (checkDb.rows.length === 0) {
      await adminPool.query('CREATE DATABASE tani_smart');
      console.log('✅ Database tani_smart berhasil dibuat.');
    } else {
      console.log('ℹ️  Database tani_smart sudah ada.');
    }
  } catch (err) {
    console.error('⚠️  Gagal membuat database:', err.message);
  } finally {
    await adminPool.end();
  }

  // Koneksi ke tani_smart
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema });

  console.log('\n🌱 Memulai seeding data...\n');

  try {
    // === ADMIN USER ===
    const adminExists = await db.select().from(schema.users).where(eq(schema.users.email, 'admin'));
    let hashedPasswordAdmin = await bcrypt.hash('admin123', 10);
    if (adminExists.length === 0) {
      await db.insert(schema.users).values({
        name: 'Administrator',
        email: 'admin',
        password: hashedPasswordAdmin,
        role: 'admin',
      });
      console.log(`✅ Admin: admin (password: admin123)`);
    }

    let hashedPassword = await bcrypt.hash('password123', 10);

    // === KONSULTASI PAKAR ===
    const existingPakar = await db.select().from(schema.konsultasiPakar);
    if (existingPakar.length === 0) {
      const pakarData = [
        { name: 'Dr. Ir. Wahyudi', focus: 'Ahli Hama & Penyakit Tanaman', emoji: '🐛', color: '#ef4444', wa: '6281234567890', prompt: 'Kamu adalah Dr. Ir. Wahyudi, ahli hama dan penyakit tanaman di Indonesia dengan pengalaman 20 tahun. Kamu sangat berpengetahuan tentang pengendalian hama terpadu (PHT), pestisida organik, dan biologis.', status: 'Online' },
        { name: 'Siti Aminah, SP., M.Si', focus: 'Ahli Manajemen Tanah', emoji: '🌱', color: '#10b981', wa: '6281234567891', prompt: 'Kamu adalah Siti Aminah, SP., M.Si, ahli manajemen tanah dan pemupukan. Kamu sangat berpengetahuan tentang kesuburan tanah, pupuk organik & anorganik, pH tanah, dan teknik konservasi lahan.', status: 'Online' },
        { name: 'Budi Santoso, M.Si', focus: 'Spesialis Padi & Palawija', emoji: '🌾', color: '#f59e0b', wa: '6281234567892', prompt: 'Kamu adalah Budi Santoso, M.Si, penyuluh pertanian senior spesialis padi dan palawija. Kamu sangat berpengetahuan tentang varietas padi unggul, teknik budidaya SRI, dan penanganan pasca panen.', status: 'Offline' },
        { name: 'AI Asisten Umum', focus: 'Pertanian Umum & Panduan', emoji: '🤖', color: '#3b82f6', wa: '6281234567893', prompt: 'Kamu adalah ahli pertanian Indonesia yang berpengalaman luas di berbagai bidang pertanian termasuk hortikultura, tanaman pangan, perkebunan, dan peternakan.', status: 'Online' },
      ];
      await db.insert(schema.konsultasiPakar).values(pakarData);
      console.log(`✅ Pakar Konsultasi: ${pakarData.length} orang`);
    }

    // Cek apakah user (petani) sudah ada (hindari duplikasi)
    const existingUser = await db.select().from(schema.users).where(eq(schema.users.email, 'dimas@tanismart.com'));
    
    if (existingUser.length > 0) {
      console.log('ℹ️  Data seed petani sudah ada. Tidak ada perubahan.\n');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('  Login Petani : dimas@tanismart.com (pw: password123)');
      console.log('  Login Admin  : admin (pw: admin123)');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      // Fix: don't end pool twice
      return; 
    }

    // === USERS ===
    const [user] = await db.insert(schema.users).values({
      name: 'Dimas Alzani',
      email: 'dimas@tanismart.com',
      password: hashedPassword,
      role: 'petani',
    }).returning();
    console.log(`✅ User: ${user.email} (password: password123)`);

    // === LAHAN ===
    const lahanData = [
      { userId: user.id, name: 'Blok Utara - Sawah', area: '2.50', soilType: 'Lempung Berliat', irrigation: 'Baik', status: 'Aktif', imageUrl: 'https://images.unsplash.com/photo-1592982537447-6f2aa0c8cb08?w=500' },
      { userId: user.id, name: 'Blok Selatan - Kebun', area: '1.20', soilType: 'Gambut', irrigation: 'Sedang', status: 'Istirahat', imageUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500' },
      { userId: user.id, name: 'Blok Timur - Palawija', area: '0.80', soilType: 'Pasir Berlempung', irrigation: 'Baik', status: 'Aktif', imageUrl: 'https://images.unsplash.com/photo-1599839619722-39751411ea63?w=500' },
    ];
    await db.insert(schema.lahan).values(lahanData);
    console.log(`✅ Lahan: ${lahanData.length} blok`);

    // === TANAMAN ===
    const tanamanData = [
      { userId: user.id, name: 'Padi IR64', lahanName: 'Blok Utara', icon: '🌾', plantDate: '2026-02-10', estHarvest: '2026-05-20', progress: 65, health: 'Baik' },
      { userId: user.id, name: 'Jagung Manis', lahanName: 'Blok Timur', icon: '🌽', plantDate: '2026-03-05', estHarvest: '2026-06-05', progress: 40, health: 'Perlu Perhatian' },
      { userId: user.id, name: 'Tomat Cherry', lahanName: 'Blok Barat', icon: '🍅', plantDate: '2026-01-20', estHarvest: '2026-04-20', progress: 95, health: 'Siap Panen' },
      { userId: user.id, name: 'Kacang Kedelai', lahanName: 'Blok Selatan', icon: '🌱', plantDate: '2026-03-15', estHarvest: '2026-06-15', progress: 25, health: 'Baik' },
    ];
    await db.insert(schema.tanaman).values(tanamanData);
    console.log(`✅ Tanaman: ${tanamanData.length} jenis`);

    // === JADWAL ===
    const jadwalData = [
      { userId: user.id, title: 'Pemupukan NPK Blok Utara', date: '2026-04-21', time: '07:00', type: 'Pemupukan', priority: 'High', status: 'Pending' },
      { userId: user.id, title: 'Penyiraman Tomat Cherry', date: '2026-04-21', time: '16:00', type: 'Perawatan', priority: 'Medium', status: 'Pending' },
      { userId: user.id, title: 'Cek Hama Jagung Blok Timur', date: '2026-04-20', time: '08:00', type: 'Inspeksi', priority: 'High', status: 'Done' },
    ];
    await db.insert(schema.jadwal).values(jadwalData);
    console.log(`✅ Jadwal: ${jadwalData.length} kegiatan`);

    // === INVENTORI ===
    const inventoriData = [
      { userId: user.id, item: 'Pupuk NPK Mutiara', category: 'Pupuk', stock: 150, unit: 'Kg', status: 'Aman' },
      { userId: user.id, item: 'Pestisida Organik', category: 'Obat', stock: 5, unit: 'Liter', status: 'Kritis' },
      { userId: user.id, item: 'Benih Jagung Hibrida', category: 'Benih', stock: 25, unit: 'Kg', status: 'Aman' },
      { userId: user.id, item: 'Solar (BBM Traktor)', category: 'Bahan Bakar', stock: 10, unit: 'Liter', status: 'Menipis' },
    ];
    await db.insert(schema.inventori).values(inventoriData);
    console.log(`✅ Inventori: ${inventoriData.length} barang`);

    // === LAPORAN PRODUKTIVITAS ===
    const prodData = [
      { userId: user.id, month: 'Jan', padi: 120, jagung: 80, kedelai: 40 },
      { userId: user.id, month: 'Feb', padi: 132, jagung: 90, kedelai: 45 },
      { userId: user.id, month: 'Mar', padi: 101, jagung: 70, kedelai: 50 },
      { userId: user.id, month: 'Apr', padi: 145, jagung: 110, kedelai: 60 },
      { userId: user.id, month: 'Mei', padi: 160, jagung: 130, kedelai: 75 },
      { userId: user.id, month: 'Jun', padi: 180, jagung: 140, kedelai: 80 },
      { userId: user.id, month: 'Jul', padi: 195, jagung: 155, kedelai: 90 },
    ];
    await db.insert(schema.laporanProduktivitas).values(prodData);
    console.log(`✅ Laporan Produktivitas: ${prodData.length} bulan`);

    // === LAPORAN REVENUE ===
    const revenueData = [
      { userId: user.id, quarter: 'Q1', revenue: 4000, expense: 2400 },
      { userId: user.id, quarter: 'Q2', revenue: 3000, expense: 1398 },
      { userId: user.id, quarter: 'Q3', revenue: 2000, expense: 9800 },
      { userId: user.id, quarter: 'Q4', revenue: 2780, expense: 3908 },
    ];
    await db.insert(schema.laporanRevenue).values(revenueData);
    console.log(`✅ Laporan Revenue: ${revenueData.length} kuartal`);



    console.log('\n🎉 Seeding selesai!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  Login Petani : dimas@tanismart.com (pw: password123)');
    console.log('  Login Admin  : admin (pw: admin123)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (err) {
    console.error('❌ Seeding gagal:', err);
  } finally {
    await pool.end();
  }
}

seed();
