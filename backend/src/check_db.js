import pg from 'pg';
const { Client } = pg;
const client = new Client({
  connectionString: 'postgresql://postgres:ydCjiYNmuJezfMvvxXuaBzLwOeUmNSDj@turntable.proxy.rlwy.net:43120/railway',
  ssl: { rejectUnauthorized: false }
});
async function check() {
  await client.connect();
  const res = await client.query('SELECT id, "image_url" FROM edukasi WHERE "image_url" LIKE \'%unsplash%\'');
  
  for (const row of res.rows) {
    try {
      const resp = await fetch(row.image_url);
      console.log('ID', row.id, resp.status);
    } catch (e) {
      console.log('ID', row.id, 'ERROR');
    }
  }
  await client.end();
}
check().catch(e => console.error(e));
