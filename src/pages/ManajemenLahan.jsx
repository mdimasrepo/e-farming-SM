import React, { useState } from 'react';
import { MapPin, Plus, Search, Layers, X, Edit, Trash2 } from 'lucide-react';
import './ManajemenLahan.css';

const MOCK_LANDS = [
  { id: 1, name: 'Blok Utara - Sawah', area: '2.5 Hektar', status: 'Aktif', soilType: 'Lempung Berliat', irrigation: 'Baik', image: 'https://images.unsplash.com/photo-1592982537447-6f2aa0c8cb08?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
  { id: 2, name: 'Blok Selatan - Kebun', area: '1.2 Hektar', status: 'Istirahat', soilType: 'Gambut', irrigation: 'Sedang', image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
  { id: 3, name: 'Blok Timur - Palawija', area: '0.8 Hektar', status: 'Aktif', soilType: 'Pasir Berlempung', irrigation: 'Baik', image: 'https://images.unsplash.com/photo-1599839619722-39751411ea63?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
];

export default function ManajemenLahan() {
  const [lands, setLands] = useState(MOCK_LANDS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="manajemen-lahan animate-fade-in">
      <div className="page-header">
        <div>
          <h2>Manajemen Lahan</h2>
          <p className="text-muted">Kelola blok lahan pertanian dan informasi tanah Anda.</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Tambah Lahan Baru
        </button>
      </div>

      <div className="controls-bar">
        <div className="search-bar inline">
          <Search size={18} className="search-icon"/>
          <input type="text" placeholder="Cari nama blok atau jenis tanah..." />
        </div>
        <div className="filter-controls">
          <button className="btn-filter active">Semua Lahan</button>
          <button className="btn-filter">Aktif</button>
          <button className="btn-filter">Istirahat</button>
        </div>
      </div>

      <div className="land-grid">
        {lands.map((land) => (
          <div key={land.id} className="land-card glass-panel">
            <div className="land-image-wrapper">
              <img src={land.image} alt={land.name} className="land-image" />
              <div className={`status-badge ${land.status.toLowerCase()}`}>
                {land.status}
              </div>
            </div>
            <div className="land-content">
              <h3>{land.name}</h3>
              <div className="land-meta">
                <div className="meta-item">
                  <MapPin size={16} /> <span>{land.area}</span>
                </div>
                <div className="meta-item">
                  <Layers size={16} /> <span>{land.soilType}</span>
                </div>
              </div>
              <div className="land-actions">
                <button className="btn-icon text-info" title="Edit Lahan">
                  <Edit size={18} />
                </button>
                <button className="btn-icon text-danger" title="Hapus Lahan">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel animate-fade-in">
            <div className="modal-header">
              <h3>Tambah Lahan Baru</h3>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Nama Blok Lahan</label>
                <input type="text" className="form-input" placeholder="Contoh: Blok Barat" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Luas Lahan (Hektar)</label>
                  <input type="number" step="0.1" className="form-input" placeholder="0.0" />
                </div>
                <div className="form-group">
                  <label>Jenis Tanah</label>
                  <select className="form-input">
                    <option>Lempung</option>
                    <option>Gambut</option>
                    <option>Andosol</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Sistem Irigasi</label>
                <select className="form-input">
                  <option>Baik</option>
                  <option>Sedang</option>
                  <option>Buruk</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setIsModalOpen(false)}>Batal</button>
              <button className="btn-primary" onClick={() => setIsModalOpen(false)}>Simpan Lahan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
