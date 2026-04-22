const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres:postgres@localhost:5432/tani_smart' });
client.connect().then(() => {
  client.query(`
    CREATE TABLE IF NOT EXISTS transaksi_jualbeli (
      id serial PRIMARY KEY NOT NULL,
      user_id integer NOT NULL,
      type varchar(50) NOT NULL,
      item_name varchar(255) NOT NULL,
      quantity numeric NOT NULL,
      price_per_unit numeric NOT NULL,
      total_nominal numeric NOT NULL,
      date timestamp DEFAULT now() NOT NULL
    );
  `).then(() => {
    console.log('TABLE CREATED');
    return client.end();
  }).catch(e => { console.error('QUERY ERR', e); client.end(); });
}).catch(console.error);
