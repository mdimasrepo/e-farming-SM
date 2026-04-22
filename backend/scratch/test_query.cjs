const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres:postgres@localhost:5432/tani_smart' });
client.connect().then(() => {
  client.query('insert into "transaksi_jualbeli" ("user_id", "type", "item_name", "quantity", "price_per_unit", "total_nominal", "status") values (1, \'Jual\', \'test\', 10, 100, 1000, \'Pending\')').then((res) => {
    console.log('INSERT SUCCESS');
    client.end();
  }).catch(e => {
    console.log('INSERT ERR', e.message);
    client.end();
  });
});
