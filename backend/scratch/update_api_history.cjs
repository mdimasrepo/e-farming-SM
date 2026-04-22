const fs = require('fs');
let content = fs.readFileSync('d:/aplikasi skripsi/dimas/src/utils/api.js', 'utf8');

// Append getRiwayatTransaksi if it doesn't exist
if (!content.includes('getRiwayatTransaksi')) {
  content = content.replace('export async function beliBarang', \`export async function getRiwayatTransaksi() {
  return apiFetch('/jualbeli');
}

export async function beliBarang\`);
  fs.writeFileSync('d:/aplikasi skripsi/dimas/src/utils/api.js', content, 'utf8');
}
