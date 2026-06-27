/**
 * Auto-migration script: creates the chat_messages table if it doesn't exist.
 * This runs before the server starts so production DB is always up to date.
 */
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import pg from 'pg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

if (!process.env.DATABASE_URL) {
  console.error('\n🚨 ERROR: DATABASE_URL tidak ditemukan di environment variables!');
  console.error('👉 Harap tambahkan variabel lingkungan DATABASE_URL di dashboard Railway Anda.');
  console.error('   1. Buka dashboard Railway Anda.');
  console.error('   2. Masuk ke tab "Variables" di layanan backend.');
  console.error('   3. Tambahkan key: DATABASE_URL dengan value koneksi database PostgreSQL Anda.');
  console.error('   4. Klik Save dan Deploy ulang.\n');
  process.exit(1);
}

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('railway') || process.env.DATABASE_URL?.includes('render')
    ? { rejectUnauthorized: false }
    : false,
});

async function migrate() {
  const client = await pool.connect();
  try {
    console.log('🔄 Running migrations...');

    // Create chat_messages table if not exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS "chat_messages" (
        "id"            SERIAL PRIMARY KEY,
        "user_id"       INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "is_from_admin" BOOLEAN NOT NULL DEFAULT false,
        "message"       TEXT NOT NULL,
        "is_read"       BOOLEAN DEFAULT false,
        "created_at"    TIMESTAMP DEFAULT NOW()
      );
    `);

    // Create index for faster queries per user
    await client.query(`
      CREATE INDEX IF NOT EXISTS "chat_messages_user_id_idx"
      ON "chat_messages" ("user_id");
    `);

    console.log('✅ Migration completed: chat_messages table is ready.');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
