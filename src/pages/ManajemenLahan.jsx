import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Search, Layers, X, Edit3, Trash2, Droplets, Ruler } from 'lucide-react';
import { getLahan, createLahan, updateLahan, deleteLahan } from '../utils/api';
import './ManajemenLahan.css';

const SOIL_TYPES = ['Lempung', 'Gambut', 'Andosol', 'Pasir Berlempung', 'Lempung Berliat'];
const IRRIGATIONS = ['Baik', 'Sedang', 'Buruk'];
const STATUSES = ['Aktif', 'Istirahat'];

export default function ManajemenLahan() {
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [form, setForm] = useState({ name: '', area: '', soilType: 'Lempung', irrigation: 'Baik', status: 'Aktif' });

  useEffect(() => { fetchLahan(); }, []);

  const fetchLahan = async () => {
    try { setLands(await getLahan()); } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const openAdd = () => {
    setEditItem(null);
    setForm({ name: '', area: '', soilType: 'Lempung', irrigation: 'Baik', status: 'Aktif' });
    setShowModal(true);
  };

  const openEdit = (land) => {
    setEditItem(land);
    setForm({ name: land.name, area: land.area, soilType: land.soilType, irrigation: land.irrigation, status: land.status || 'Aktif' });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      if (editItem) {
        await updateLahan(editItem.id, { ...form, area: Number(form.area) });
      } else {
        await createLahan({ ...form, area: Number(form.area) });
      }
      setShowModal(false);
      fetchLahan();
    } catch (err) { alert(err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try { await deleteLahan(id); setDeleteConfirm(null); fetchLahan(); }
    catch (err) { alert(err.message); }
  };

  const filtered = lands.filter(l => {
    const matchStatus = filterStatus === 'Semua' || (l.status || 'Aktif') === filterStatus;
    const matchSearch = l.name.toLowerCase().includes(searchQuery.toLowerCase()) || (l.soilType || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalArea = lands.reduce((s, l) => s + (Number(l.area) || 0), 0);

  return (
    <div className="manajemen-lahan animate-fade-in">
      <div className="page-header">
        <div>
          <h2>Manajemen Lahan</h2>
          <p className="text-muted">Kelola blok lahan pertanian dan informasi tanah Anda.</p>
        </div>
        <button className="btn-primary" onClick={openAdd}>
          <Plus size={18} /> Tambah Lahan Baru
        </button>
      </div>

      {/* Stats */}
      <div className="lahan-stats">
        <div className="stat-mini glass-panel">
          <Layers size={20} className="text-emerald" />
          <div><strong>{lands.length}</strong> <span className="text-muted">Blok Lahan</span></div>
        </div>
        <div className="stat-mini glass-panel">
          <Ruler size={20} className="text-info" />
          <div><strong>{totalArea.toFixed(1)}</strong> <span className="text-muted">Hektar Total</span></div>
        </div>
        <div className="stat-mini glass-panel">
          <Droplets size={20} className="text-warning" />
          <div><strong>{lands.filter(l => l.irrigation === 'Baik').length}</strong> <span className="text-muted">Irigasi Baik</span></div>
        </div>
      </div>

      <div className="controls-bar">
        <div className="search-bar inline">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Cari nama blok atau jenis tanah..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <div className="filter-controls">
          {['Semua', 'Aktif', 'Istirahat'].map(s => (
            <button key={s} className={`btn-filter ${filterStatus === s ? 'active' : ''}`} onClick={() => setFilterStatus(s)}>{s === 'Semua' ? 'Semua Lahan' : s}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Memuat data lahan...</p>
      ) : filtered.length === 0 ? (
        <div className="empty-state glass-panel">
          <MapPin size={48} style={{ opacity: 0.3 }} />
          <h3>{lands.length === 0 ? 'Belum ada lahan' : 'Tidak ditemukan'}</h3>
          <p className="text-muted">{lands.length === 0 ? 'Klik "Tambah Lahan Baru" untuk memulai.' : 'Coba kata kunci atau filter lain.'}</p>
        </div>
      ) : (
        <div className="land-grid">
          {filtered.map((land) => (
            <div key={land.id} className="land-card glass-panel">
              <div className="land-image-wrapper">
                <img src={land.imageUrl || 'https://images.unsplash.com/photo-1592982537447-6f2aa0c8cb08?w=500'} alt={land.name} className="land-image" />
                <div className={`status-badge ${(land.status || 'aktif').toLowerCase()}`}>{land.status || 'Aktif'}</div>
              </div>
              <div className="land-content">
                <h3>{land.name}</h3>
                <div className="land-meta">
                  <div className="meta-item"><MapPin size={16} /> <span>{land.area} Hektar</span></div>
                  <div className="meta-item"><Layers size={16} /> <span>{land.soilType}</span></div>
                  <div className="meta-item"><Droplets size={16} /> <span>Irigasi: {land.irrigation}</span></div>
                </div>
                <div className="land-actions">
                  <button className="btn-icon-sm" title="Edit" onClick={() => openEdit(land)}><Edit3 size={15} /></button>
                  <button className="btn-icon-sm danger" title="Hapus" onClick={() => setDeleteConfirm(land.id)}><Trash2 size={15} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content glass-panel animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editItem ? 'Edit Lahan' : 'Tambah Lahan Baru'}</h3>
              <button className="btn-icon" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Nama Blok Lahan</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Contoh: Blok Barat" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Luas (Hektar)</label>
                  <input type="number" step="0.1" value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} placeholder="0.0" />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Jenis Tanah</label>
                  <select value={form.soilType} onChange={e => setForm({ ...form, soilType: e.target.value })}>
                    {SOIL_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Sistem Irigasi</label>
                  <select value={form.irrigation} onChange={e => setForm({ ...form, irrigation: e.target.value })}>
                    {IRRIGATIONS.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Batal</button>
              <button className="btn-primary" onClick={handleSave} disabled={saving || !form.name.trim()}>
                {saving ? 'Menyimpan...' : editItem ? 'Update' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal-content glass-panel small animate-fade-in" onClick={e => e.stopPropagation()}>
            <h3>Hapus Lahan?</h3>
            <p className="text-muted">Data lahan yang dihapus tidak dapat dikembalikan.</p>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setDeleteConfirm(null)}>Batal</button>
              <button className="btn-danger" onClick={() => handleDelete(deleteConfirm)}>Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
