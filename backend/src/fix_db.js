import pg from 'pg';
const { Client } = pg;
const client = new Client({
  connectionString: 'postgresql://postgres:ydCjiYNmuJezfMvvxXuaBzLwOeUmNSDj@turntable.proxy.rlwy.net:43120/railway',
  ssl: { rejectUnauthorized: false }
});

async function fixDb() {
  await client.connect();

  const updates = [
    { id: 9, url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80' },
    { id: 13, url: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=800&q=80' },
    // For ID 5, it seems the Base64 is corrupted or too large to render efficiently. Let's replace it with a working Unsplash image.
    { id: 5, url: 'https://images.unsplash.com/photo-1595801968843-15794625fc96?w=800&q=80' }
  ];

  for (const { id, url } of updates) {
    await client.query('UPDATE edukasi SET "image_url" = $1 WHERE id = $2', [url, id]);
    console.log(`Updated ID ${id} with ${url}`);
  }

  await client.end();
}

fixDb().catch(console.error);
