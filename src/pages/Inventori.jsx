import React, { useState, useEffect } from 'react';
import { PackageSearch, Download, Plus, AlertTriangle } from 'lucide-react';
import { getInventori, updateInventori } from '../utils/api';
import './Inventori.css';

export default function Inventori() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventori();
  }, []);

  const fetchInventori = async () => {
    try {
      const data = await getInventori();
      setInventory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalItems = inventory.length;
  const criticalItems = inventory.filter(i => i.status === 'Kritis' || i.status === 'Menipis').length;

  return (
    <div className="inventori animate-fade-in">
      <div className="page-header">
        <div>
          <h2>Inventori Logistik</h2>
          <p className="text-muted">Pantau ketersediaan stok pupuk, benih, dan perlengkapan lainnya.</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary">
            <Download size={18} /> Ekspor Data
          </button>
          <button className="btn-primary">
            <Plus size={18} /> Tambah Barang
          </button>
        </div>
      </div>

      <div className="inventory-stats">
        <div className="stat-card glass-panel">
          <PackageSearch className="text-info" size={32} />
          <div>
            <h3>{totalItems}</h3>
            <p className="text-muted">Total Jenis Barang</p>
          </div>
        </div>
        <div className="stat-card glass-panel alert">
          <AlertTriangle className="text-danger animate-pulse" size={32} />
          <div>
            <h3>{criticalItems}</h3>
            <p className="text-danger">Barang Stok Kritis</p>
          </div>
        </div>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Memuat data inventori...</p>
      ) : (
        <div className="table-container glass-panel">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Nama Barang</th>
                <th>Kategori</th>
                <th>Sisa Stok</th>
                <th>Status</th>
                <th>Tgl. Update</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((inv) => (
                <tr key={inv.id}>
                  <td className="item-name">{inv.item}</td>
                  <td><span className={`cat-badge ${(inv.category || '').toLowerCase().replace(' ', '-')}`}>{inv.category}</span></td>
                  <td className="stock-value">
                    <span className={inv.status === 'Kritis' ? 'text-danger font-medium' : ''}>
                      {inv.stock} {inv.unit}
                    </span>
                  </td>
                  <td>
                    <span className={`status-pill ${(inv.status || 'aman').toLowerCase()}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="text-muted">{inv.updatedAt ? new Date(inv.updatedAt).toLocaleDateString('id-ID') : '-'}</td>
                  <td>
                    <button className="btn-link">Update</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
