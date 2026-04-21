import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';

const router = Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Semua field wajib diisi.' });
    }

    // Cek apakah email sudah terdaftar
    const existing = await db.select().from(users).where(eq(users.email, email));
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Email sudah terdaftar.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [newUser] = await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
    }).returning();

    // Generate token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: 'Registrasi berhasil!',
      token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, photoUrl: newUser.photoUrl },
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Terjadi kesalahan server.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email dan password harus diisi.' });
    }

    // Cari user
    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user) {
      return res.status(401).json({ error: 'Email atau password salah.' });
    }

    // Verifikasi password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Email atau password salah.' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      message: 'Login berhasil!',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, photoUrl: user.photoUrl },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Terjadi kesalahan server.' });
  }
});

// PUT /api/auth/profile — Update nama
import { authMiddleware } from '../middleware/auth.js';

router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, photoUrl } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (photoUrl !== undefined) updateData.photoUrl = photoUrl;

    if (Object.keys(updateData).length === 0) return res.status(400).json({ error: 'Tidak ada data untuk diperbarui.' });

    const [updated] = await db.update(users)
      .set(updateData)
      .where(eq(users.id, req.user.id))
      .returning({ id: users.id, name: users.name, email: users.email, role: users.role, photoUrl: users.photoUrl });

    res.json(updated);
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Gagal memperbarui profil.' });
  }
});

// PUT /api/auth/change-password — Ganti password
router.put('/change-password', authMiddleware, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) return res.status(400).json({ error: 'Semua field wajib diisi.' });
    if (newPassword.length < 6) return res.status(400).json({ error: 'Password baru minimal 6 karakter.' });

    // Ambil user & verifikasi password lama
    const [user] = await db.select().from(users).where(eq(users.id, req.user.id));
    if (!user) return res.status(404).json({ error: 'User tidak ditemukan.' });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Password lama salah.' });

    const hashedNew = await bcrypt.hash(newPassword, 10);
    await db.update(users).set({ password: hashedNew }).where(eq(users.id, req.user.id));

    res.json({ message: 'Password berhasil diubah.' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ error: 'Gagal mengubah password.' });
  }
});

export default router;
