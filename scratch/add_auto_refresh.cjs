const fs = require('fs');

// 1. Modifikasi Inventori.jsx
let invCode = fs.readFileSync('src/pages/Inventori.jsx', 'utf8');

const silentFetchInv = `
  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchDataSilent();
    }, 5000); // Auto refresh tiap 5 detik
    return () => clearInterval(interval);
  }, [activeTab]);

  const fetchDataSilent = async () => {
    try {
      if (activeTab === 'katalog') {
        const data = await getKatalog();
        setKatalog(data);
      } else if (activeTab === 'local') {
        const data = await getInventori();
        setLocalInv(data);
      } else if (activeTab === 'riwayat') {
        const data = await getRiwayatTransaksi();
        setRiwayat(data);
      }
    } catch (err) {} 
  };
`;
invCode = invCode.replace(/useEffect\(\(\) => \{ fetchData\(\); \}, \[activeTab\]\);/g, silentFetchInv);
fs.writeFileSync('src/pages/Inventori.jsx', invCode);

// 2. Modifikasi AdminInventori.jsx
let adminInvCode = fs.readFileSync('src/pages/admin/AdminInventori.jsx', 'utf8');
const silentFetchAdmin = `
  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchDataSilent();
    }, 5000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const fetchDataSilent = async () => {
    try {
      if (activeTab === 'suplai') {
        setSuplai(await getInventori('', 'suplai'));
      } else if (activeTab === 'panen') {
        setPanen(await getInventori('', 'panen'));
      } else if (activeTab === 'pengajuan') {
        setPengajuan(await getAdminPengajuan());
      }
    } catch (err) {}
  };
`;
adminInvCode = adminInvCode.replace(/useEffect\(\(\) => \{[\s\S]*?\}, \[activeTab\]\);/g, silentFetchAdmin);
fs.writeFileSync('src/pages/admin/AdminInventori.jsx', adminInvCode);

// 3. Modifikasi backend server.js (tambah compression)
let serverCode = fs.readFileSync('backend/src/server.js', 'utf8');
if (!serverCode.includes("import compression from 'compression'")) {
    serverCode = serverCode.replace("import cors from 'cors';", "import cors from 'cors';\nimport compression from 'compression';");
    serverCode = serverCode.replace("app.use(cors());", "app.use(cors());\napp.use(compression());");
    fs.writeFileSync('backend/src/server.js', serverCode);
}
console.log('Update selesai.');
