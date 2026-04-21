import React, { useState, useEffect } from 'react';
import { getAdminLahan, getAdminTanaman, getAdminInventori, getAdminJadwal } from '../../utils/api';
import { Search } from 'lucide-react';

// Generik tabel komponen untuk Lahan, Tanaman, Inventori, Jadwal
export default function AdminDataView({ type }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchData();
  }, [type]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let res;
      if (type === 'lahan') res = await getAdminLahan();
      else if (type === 'tanaman') res = await getAdminTanaman();
      else if (type === 'inventori') res = await getAdminInventori();
      else if (type === 'jadwal') res = await getAdminJadwal();
      setData(res);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const filtered = data.filter(item => {
    const s = search.toLowerCase();
    return Object.values(item).some(val => val && val.toString().toLowerCase().includes(s));
  });

  const getColumns = () => {
    if (type === 'lahan') return ['Pemilik', 'Nama Blok', 'Luas', 'Sistem Irigasi', 'Status'];
    if (type === 'tanaman') return ['Pemilik', 'Tanaman', 'Lahan', 'Progress', 'Kesehatan'];
    if (type === 'inventori') return ['Pemilik', 'Barang', 'Kategori', 'Stok', 'Status'];
    if (type === 'jadwal') return ['Pemilik', 'Kegiatan', 'Tanggal', 'Tipe', 'Status'];
    return [];
  };

  const renderRow = (item, type) => {
    if (type === 'lahan') return (
      <>
        <td><strong>{item.owner_name || 'Hapus/Anonim'}</strong></td>
        <td>{item.name}</td>
        <td>{item.area} Ha</td>
        <td>{item.irrigation}</td>
        <td><span className={`admin-badge ${item.status === 'Aktif' ? 'success' : 'warning'}`}>{item.status}</span></td>
      </>
    );
    if (type === 'tanaman') return (
      <>
        <td><strong>{item.owner_name || 'Hapus/Anonim'}</strong></td>
        <td>{item.icon} {item.name}</td>
        <td>{item.lahanName}</td>
        <td>{item.progress}%</td>
        <td><span className={`admin-badge ${item.health === 'Baik' ? 'success' : item.health === 'Siap Panen' ? 'info' : 'danger'}`}>{item.health}</span></td>
      </>
    );
    if (type === 'inventori') return (
      <>
        <td><strong>{item.owner_name || 'Hapus/Anonim'}</strong></td>
        <td>{item.item}</td>
        <td>{item.category}</td>
        <td>{item.stock} {item.unit}</td>
        <td><span className={`admin-badge ${item.status === 'Aman' ? 'success' : 'danger'}`}>{item.status}</span></td>
      </>
    );
    if (type === 'jadwal') return (
      <>
        <td><strong>{item.owner_name || 'Hapus/Anonim'}</strong></td>
        <td>{item.title}</td>
        <td>{item.date}</td>
        <td>{item.type}</td>
        <td><span className={`admin-badge ${item.status === 'Done' ? 'success' : 'warning'}`}>{item.status}</span></td>
      </>
    );
  };

  const titles = { lahan: 'Data Lahan Sistem', tanaman: 'Data Tanaman Sistem', inventori: 'Inventori Global', jadwal: 'Jadwal Agenda Sistem' };

  if (loading) return <div>Memuat {titles[type]}...</div>;

  return (
    <div className="admin-card animate-fade-in">
      <div className="admin-card-header">
        <h3>{titles[type]}</h3>
        <div style={{ display: 'flex', alignItems: 'center', background: 'var(--glass-bg)', padding: '4px 12px', borderRadius: '6px', border: '1px solid var(--glass-border)' }}>
          <Search size={16} />
          <input type="text" placeholder="Cari data..." style={{ background: 'transparent', border: 'none', outline: 'none', marginLeft: '8px' }} value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="admin-card-body" style={{ padding: 0 }}>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                {getColumns().map(col => <th key={col}>{col}</th>)}
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id}>
                  {renderRow(item, type)}
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={getColumns().length} style={{ textAlign: 'center', padding: '2rem' }}>Tidak ada data.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
