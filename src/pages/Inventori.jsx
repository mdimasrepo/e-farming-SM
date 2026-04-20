import React from 'react';
import { PackageSearch, Download, Plus, AlertTriangle } from 'lucide-react';
import './Inventori.css';

const MOCK_INVENTORY = [
  { id: 1, item: 'Pupuk NPK Mutiara', category: 'Pupuk', stock: 150, unit: 'Kg', status: 'Aman', lastUpdated: '18 Apr 2026' },
  { id: 2, item: 'Pestisida Organik', category: 'Obat', stock: 5, unit: 'Liter', status: 'Kritis', lastUpdated: '20 Apr 2026' },
  { id: 3, item: 'Benih Jagung Hibrida', category: 'Benih', stock: 25, unit: 'Kg', status: 'Aman', lastUpdated: '15 Apr 2026' },
  { id: 4, item: 'Solar (BBM Traktor)', category: 'Bahan Bakar', stock: 10, unit: 'Liter', status: 'Menipis', lastUpdated: '19 Apr 2026' },
];

export default function Inventori() {
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
            <h3>24</h3>
            <p className="text-muted">Total Jenis Barang</p>
          </div>
        </div>
        <div className="stat-card glass-panel alert">
          <AlertTriangle className="text-danger animate-pulse" size={32} />
          <div>
            <h3>2</h3>
            <p className="text-danger">Barang Stok Kritis</p>
          </div>
        </div>
      </div>

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
            {MOCK_INVENTORY.map((inv) => (
              <tr key={inv.id}>
                <td className="item-name">{inv.item}</td>
                <td><span className={`cat-badge ${inv.category.toLowerCase().replace(' ', '-')}`}>{inv.category}</span></td>
                <td className="stock-value">
                  <span className={inv.status === 'Kritis' ? 'text-danger font-medium' : ''}>
                    {inv.stock} {inv.unit}
                  </span>
                </td>
                <td>
                  <span className={`status-pill ${inv.status.toLowerCase()}`}>
                    {inv.status}
                  </span>
                </td>
                <td className="text-muted">{inv.lastUpdated}</td>
                <td>
                  <button className="btn-link">Update</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
