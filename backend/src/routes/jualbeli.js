import { Router } from 'express';
import { db } from '../db/index.js';
import { transaksiJualBeli, inventori, users } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

// GET /api/jualbeli
// Riwayat untuk Petani
router.get('/', async (req, res) => {
  try {
    const history = await db.select().from(transaksiJualBeli)
      .where(eq(transaksiJualBeli.userId, req.user.id));
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data transaksi.' });
  }
});

// GET /api/jualbeli/admin/pengajuan
// Daftar transaksi 'Jual' yang masih 'Pending'
router.get('/admin/pengajuan', async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    
    // Gunakan inner join untuk menampilkan nama petani
    const reqs = await db.select({
      id: transaksiJualBeli.id,
      userId: transaksiJualBeli.userId,
      userName: users.name,
      itemName: transaksiJualBeli.itemName,
      quantity: transaksiJualBeli.quantity,
      pricePerUnit: transaksiJualBeli.pricePerUnit,
      totalNominal: transaksiJualBeli.totalNominal,
      status: transaksiJualBeli.status,
      date: transaksiJualBeli.date
    }).from(transaksiJualBeli)
    .leftJoin(users, eq(transaksiJualBeli.userId, users.id))
    .where(and(eq(transaksiJualBeli.type, 'Jual'), eq(transaksiJualBeli.status, 'Pending')));
    
    res.json(reqs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal mengambil data pengajuan.' });
  }
});

// PUT /api/jualbeli/admin/terima/:id
router.put('/admin/terima/:id', async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    
    const trxId = parseInt(req.params.id);
    const [trx] = await db.select().from(transaksiJualBeli).where(eq(transaksiJualBeli.id, trxId));
    if (!trx || trx.status !== 'Pending') return res.status(400).json({ error: 'Transaksi tidak valid.' });

    // Update status transaksi menjadi Diterima
    await db.update(transaksiJualBeli).set({ status: 'Selesai' }).where(eq(transaksiJualBeli.id, trxId));

    // Dapatkan adminId target (admin pertama)
    const adminUsers = await db.select().from(users).where(eq(users.role, 'admin'));
    const adminId = adminUsers.length > 0 ? adminUsers[0].id : req.user.id;

    // Masukkan ke inventori Koperasi (Gudang Panen)
    let [adminItem] = await db.select().from(inventori)
      .where(and(eq(inventori.item, trx.itemName), eq(inventori.userId, adminId)));
      
    if (adminItem) {
      await db.update(inventori).set({ stock: Number(adminItem.stock) + Number(trx.quantity) }).where(eq(inventori.id, adminItem.id));
    } else {
      await db.insert(inventori).values({
        userId: adminId,
        item: trx.itemName,
        category: 'Hasil Panen', // FORCED
        stock: Number(trx.quantity),
        unit: 'Kg', 
        status: 'Aman'
      });
    }

    res.json({ message: 'Penjualan disetujui, dan barang masuk inventaris Koperasi.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal menerima pengajuan.' });
  }
});

// PUT /api/jualbeli/admin/tolak/:id
router.put('/admin/tolak/:id', async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    
    const trxId = parseInt(req.params.id);
    const [trx] = await db.select().from(transaksiJualBeli).where(eq(transaksiJualBeli.id, trxId));
    if (!trx || trx.status !== 'Pending') return res.status(400).json({ error: 'Transaksi tidak valid.' });

    // Update status transaksi menjadi Ditolak
    await db.update(transaksiJualBeli).set({ status: 'Ditolak' }).where(eq(transaksiJualBeli.id, trxId));

    // Kembalikan (Refund) stok ke Inventori Petani
    let [userItem] = await db.select().from(inventori)
      .where(and(eq(inventori.item, trx.itemName), eq(inventori.userId, trx.userId)));
      
    if (userItem) {
      await db.update(inventori).set({ stock: Number(userItem.stock) + Number(trx.quantity) }).where(eq(inventori.id, userItem.id));
    } else {
      await db.insert(inventori).values({
        userId: trx.userId,
        item: trx.itemName,
        category: 'Hasil Panen',
        stock: Number(trx.quantity),
        unit: 'Kg', 
        status: 'Aman'
      });
    }

    res.json({ message: 'Penjualan ditolak. Barang dikembalikan ke inventori Petani.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal menolak pengajuan.' });
  }
});

// POST /api/jualbeli/jual
// Menjual hasil panen (Mengurangi stok, menjadi PENDING)
router.post('/jual', async (req, res) => {
  try {
    const { inventoryId, quantity, pricePerUnit } = req.body;
    
    // Cari barang di inventori Petani
    const [userItem] = await db.select().from(inventori)
      .where(and(eq(inventori.id, inventoryId), eq(inventori.userId, req.user.id)));
      
    if (!userItem || userItem.stock < quantity) {
      return res.status(400).json({ error: 'Stok tidak mencukupi atau barang tidak ditemukan.' });
    }

    const totalNominal = parseInt(quantity) * parseInt(pricePerUnit);

    // Record Transaksi untuk Petani
    await db.insert(transaksiJualBeli).values({
      userId: req.user.id,
      type: 'Jual',
      itemName: userItem.item,
      quantity: quantity,
      pricePerUnit: pricePerUnit,
      totalNominal: totalNominal,
      status: 'Pending' // ALUR BARU: HOLD DULU
    });

    // Reduce stock Petani sementara (Locked)
    const rest = userItem.stock - quantity;
    if (rest === 0) {
      await db.delete(inventori).where(eq(inventori.id, userItem.id));
    } else {
      await db.update(inventori).set({ stock: rest }).where(eq(inventori.id, userItem.id));
    }

    res.json({ message: 'Pengajuan penjualan sukses dibuat, menunggu persetujuan pusat.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal melakukan transaksi jual.' });
  }
});

// POST /api/jualbeli/beli
// Membeli inventori logistik/alat dari Koperasi Pusat (Admin)
router.post('/beli', async (req, res) => {
  try {
    const { inventoryId, quantity, pricePerUnit } = req.body;
    
    // Cari Admin ID
    const adminUsers = await db.select().from(users).where(eq(users.role, 'admin'));
    const adminId = adminUsers.length > 0 ? adminUsers[0].id : 1;

    // Cari barang di inventori Koperasi / Pusat
    const [adminItem] = await db.select().from(inventori)
      .where(and(eq(inventori.id, inventoryId), eq(inventori.userId, adminId)));
      
    if (!adminItem) {
      return res.status(404).json({ error: 'Barang tidak tersedia di Toko Koperasi Pusat.' });
    }

    const totalNominal = parseInt(quantity) * parseInt(pricePerUnit);

    // Record Transaksi untuk Petani (Langsung Selesai)
    await db.insert(transaksiJualBeli).values({
      userId: req.user.id,
      type: 'Beli',
      itemName: adminItem.item,
      quantity: quantity,
      pricePerUnit: pricePerUnit,
      totalNominal: totalNominal,
      status: 'Selesai'
    });

    // Kurangi stok Koperasi
    await db.update(inventori)
      .set({ stock: Math.max(0, adminItem.stock - parseInt(quantity)) })
      .where(eq(inventori.id, adminItem.id));

    // Tambah ke Gudang Petani
    let [userItem] = await db.select().from(inventori)
      .where(and(eq(inventori.item, adminItem.item), eq(inventori.userId, req.user.id)));
      
    if (userItem) {
      await db.update(inventori).set({ stock: userItem.stock + parseInt(quantity) }).where(eq(inventori.id, userItem.id));
    } else {
      await db.insert(inventori).values({
        userId: req.user.id,
        item: adminItem.item,
        category: adminItem.category,
        stock: parseInt(quantity),
        unit: adminItem.unit,
        status: 'Aman'
      });
    }

    res.json({ message: 'Berhasil membeli barang dari Pusat.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal melakukan transaksi beli.' });
  }
});

export default router;
