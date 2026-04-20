import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Search, Layers, X, Edit, Trash2 } from 'lucide-react';
import { getLahan, createLahan, deleteLahan } from '../utils/api';
import './ManajemenLahan.css';

export default function ManajemenLahan() {
  const [lands, setLands] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', area: '', soilType: 'Lempung', irrigation: 'Baik' });

  useEffect(() => {
    fetchLahan();
  }, []);

  const fetchLahan = async () => {
    try {
      const data = await getLahan();
      setLands(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      await createLahan(form);
      setIsModalOpen(false);
      setForm({ name: '', area: '', soilType: 'Lempung', irrigation: 'Baik' });
      fetchLahan();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus lahan ini?')) return;
    try {
      await deleteLahan(id);
      fetchLahan();
    } catch (err) {
      alert(err.message);
    }
  };

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

      {loading ? (
        <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Memuat data lahan...</p>
      ) : (
        <div className="land-grid">
          {lands.map((land) => (
            <div key={land.id} className="land-card glass-panel">
              <div className="land-image-wrapper">
                <img src={land.imageUrl || 'https://images.unsplash.com/photo-1592982537447-6f2aa0c8cb08?w=500'} alt={land.name} className="land-image" />
                <div className={`status-badge ${(land.status || 'aktif').toLowerCase()}`}>
                  {land.status}
                </div>
              </div>
              <div className="land-content">
                <h3>{land.name}</h3>
                <div className="land-meta">
                  <div className="meta-item">
                    <MapPin size={16} /> <span>{land.area} Hektar</span>
                  </div>
                  <div className="meta-item">
                    <Layers size={16} /> <span>{land.soilType}</span>
                  </div>
                </div>
                <div className="land-actions">
                  <button className="btn-icon text-info" title="Edit Lahan">
                    <Edit size={18} />
                  </button>
                  <button className="btn-icon text-danger" title="Hapus Lahan" onClick={() => handleDelete(land.id)}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
                <input type="text" className="form-input" placeholder="Contoh: Blok Barat" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Luas Lahan (Hektar)</label>
                  <input type="number" step="0.1" className="form-input" placeholder="0.0" value={form.area} onChange={(e) => setForm({...form, area: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Jenis Tanah</label>
                  <select className="form-input" value={form.soilType} onChange={(e) => setForm({...form, soilType: e.target.value})}>
                    <option>Lempung</option>
                    <option>Gambut</option>
                    <option>Andosol</option>
                    <option>Pasir Berlempung</option>
                    <option>Lempung Berliat</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Sistem Irigasi</label>
                <select className="form-input" value={form.irrigation} onChange={(e) => setForm({...form, irrigation: e.target.value})}>
                  <option>Baik</option>
                  <option>Sedang</option>
                  <option>Buruk</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setIsModalOpen(false)}>Batal</button>
              <button className="btn-primary" onClick={handleSubmit}>Simpan Lahan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
