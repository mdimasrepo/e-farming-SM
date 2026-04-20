import { pgTable, serial, varchar, decimal, integer, text, date, time, timestamp, bigint } from 'drizzle-orm/pg-core';

// ==============================
// USERS
// ==============================
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 150 }).unique().notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  role: varchar('role', { length: 20 }).default('petani'),
  createdAt: timestamp('created_at').defaultNow(),
});

// ==============================
// LAHAN
// ==============================
export const lahan = pgTable('lahan', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  area: decimal('area', { precision: 10, scale: 2 }).notNull(),
  soilType: varchar('soil_type', { length: 50 }),
  irrigation: varchar('irrigation', { length: 20 }),
  status: varchar('status', { length: 20 }).default('Aktif'),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

// ==============================
// TANAMAN
// ==============================
export const tanaman = pgTable('tanaman', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  lahanId: integer('lahan_id').references(() => lahan.id, { onDelete: 'set null' }),
  name: varchar('name', { length: 100 }).notNull(),
  lahanName: varchar('lahan_name', { length: 100 }),
  icon: varchar('icon', { length: 10 }),
  plantDate: date('plant_date').notNull(),
  estHarvest: date('est_harvest'),
  progress: integer('progress').default(0),
  health: varchar('health', { length: 30 }).default('Baik'),
  createdAt: timestamp('created_at').defaultNow(),
});

// ==============================
// JADWAL KEGIATAN
// ==============================
export const jadwal = pgTable('jadwal', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  date: date('date').notNull(),
  time: time('time'),
  type: varchar('type', { length: 50 }),
  priority: varchar('priority', { length: 20 }).default('Medium'),
  status: varchar('status', { length: 20 }).default('Pending'),
  createdAt: timestamp('created_at').defaultNow(),
});

// ==============================
// INVENTORI
// ==============================
export const inventori = pgTable('inventori', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  item: varchar('item', { length: 150 }).notNull(),
  category: varchar('category', { length: 50 }),
  stock: integer('stock').default(0),
  unit: varchar('unit', { length: 20 }),
  status: varchar('status', { length: 20 }).default('Aman'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ==============================
// LAPORAN PRODUKTIVITAS
// ==============================
export const laporanProduktivitas = pgTable('laporan_produktivitas', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  month: varchar('month', { length: 10 }),
  padi: integer('padi').default(0),
  jagung: integer('jagung').default(0),
  kedelai: integer('kedelai').default(0),
});

// ==============================
// LAPORAN REVENUE
// ==============================
export const laporanRevenue = pgTable('laporan_revenue', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  quarter: varchar('quarter', { length: 5 }),
  revenue: bigint('revenue', { mode: 'number' }).default(0),
  expense: bigint('expense', { mode: 'number' }).default(0),
});
