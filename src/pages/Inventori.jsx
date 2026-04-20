import React, { useState, useEffect } from 'react';
import { PackageSearch, Download, Plus, AlertTriangle, Edit3, Trash2, X, Search, Filter } from 'lucide-react';
import { getInventori, createInventori, updateInventori, deleteInventori } from '../utils/api';
import './Inventori.css';

const CATEGORIES = ['Pupuk', 'Benih', 'Pestisida', 'Alat Pertanian', 'Lainnya'];
const STATUS_OPTIONS = ['Aman', 'Menipis', 'Kritis'];

export default function Inventori() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCat, setFilterCat] = useState('Semua');
  const [form, setForm] = useState({ item: '', category: 'Pupuk', stock: '', unit: 'kg', status: 'Aman' });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => { fetchInventori(); }, []);

  const fetchInventori = async () => {
    try { setInventory(await getInventori()); } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const openAdd = () => { setEditItem(null); setForm({ item: '', category: 'Pupuk', stock: '', unit: 'kg', status: 'Aman' }); setShowModal(true); };
  const openEdit = (inv) => { setEditItem(inv); setForm({ item: inv.item, category: inv.category, stock: inv.stock, unit: inv.unit, status: inv.status }); setShowModal(true); };

  const handleSave = async () => {
    if (!form.item.trim()) return;
    setSaving(true);
    try {
      if (editItem) {
        await updateInventori(editItem.id, { ...form, stock: Number(form.stock) });
      } else {
        await createInventori({ ...form, stock: Number(form.stock) });
      }
      setShowModal(false);
      fetchInventori();
    } catch (err) { alert(err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try { await deleteInventori(id); setDeleteConfirm(null); fetchInventori(); }
    catch (err) { alert(err.message); }
  };

  const filtered = inventory.filter(inv => {
    const matchCat = filterCat === 'Semua' || inv.category === filterCat;
    const matchSearch = inv.item.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const totalItems = inventory.length;
  const criticalItems = inventory.filter(i => i.status === 'Kritis' || i.status === 'Menipis').length;
  const totalStock = inventory.reduce((sum, i) => sum + (Number(i.stock) || 0), 0);

  return (
    <div className="inventori animate-fade-in">
      <div className="page-header">
        <div>
          <h2>Inventori Logistik</h2>
          <p className="text-muted">Pantau ketersediaan stok pupuk, benih, dan perlengkapan lainnya.</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={openAdd}>
            <Plus size={18} /> Tambah Barang
          </button>
        </div>
      </div>

      <div className="inventory-stats">
        <div className="stat-card glass-panel">
          <PackageSearch className="text-info" size={32} />
          <div><h3>{totalItems}</h3><p className="text-muted">Total Jenis</p></div>
        </div>
        <div className="stat-card glass-panel">
          <Filter className="text-emerald" size={32} />
          <div><h3>{totalStock.toLocaleString('id-ID')}</h3><p className="text-muted">Total Stok</p></div>
        </div>
        <div className={`stat-card glass-panel ${criticalItems > 0 ? 'alert' : ''}`}>
          <AlertTriangle className={criticalItems > 0 ? 'text-danger animate-pulse' : 'text-muted'} size={32} />
          <div><h3>{criticalItems}</h3><p className={criticalItems > 0 ? 'text-danger' : 'text-muted'}>Stok Kritis</p></div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="inv-toolbar">
        <div className="inv-search glass-panel">
          <Search size={18} />
          <input type="text" placeholder="Cari barang..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <div className="inv-filters">
          {['Semua', ...CATEGORIES].map(cat => (
            <button key={cat} className={`cat-btn ${filterCat === cat ? 'active' : ''}`} onClick={() => setFilterCat(cat)}>{cat}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Memuat data inventori...</p>
      ) : filtered.length === 0 ? (
        <div className="empty-state glass-panel">
          <PackageSearch size={48} style={{ opacity: 0.3 }} />
          <h3>{inventory.length === 0 ? 'Belum ada barang' : 'Tidak ditemukan'}</h3>
          <p className="text-muted">{inventory.length === 0 ? 'Klik "Tambah Barang" untuk memulai.' : 'Coba kata kunci atau kategori lain.'}</p>
        </div>
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
              {filtered.map((inv) => (
                <tr key={inv.id}>
                  <td className="item-name">{inv.item}</td>
                  <td><span className={`cat-badge ${(inv.category || '').toLowerCase().replace(' ', '-')}`}>{inv.category}</span></td>
                  <td className="stock-value">
                    <span className={inv.status === 'Kritis' ? 'text-danger font-medium' : ''}>{inv.stock} {inv.unit}</span>
                  </td>
                  <td><span className={`status-pill ${(inv.status || 'aman').toLowerCase()}`}>{inv.status}</span></td>
                  <td className="text-muted">{inv.updatedAt ? new Date(inv.updatedAt).toLocaleDateString('id-ID') : '-'}</td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-icon-sm" title="Edit" onClick={() => openEdit(inv)}><Edit3 size={15} /></button>
                      <button className="btn-icon-sm danger" title="Hapus" onClick={() => setDeleteConfirm(inv.id)}><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Add/Edit */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content glass-panel animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editItem ? 'Edit Barang' : 'Tambah Barang Baru'}</h3>
              <button className="btn-icon" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Nama Barang</label>
                <input type="text" value={form.item} onChange={e => setForm({ ...form, item: e.target.value })} placeholder="Mis: Pupuk Urea" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Kategori</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Jumlah Stok</label>
                  <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} placeholder="0" />
                </div>
                <div className="form-group">
                  <label>Satuan</label>
                  <select value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })}>
                    <option value="kg">kg</option>
                    <option value="liter">liter</option>
                    <option value="unit">unit</option>
                    <option value="sak">sak</option>
                    <option value="botol">botol</option>
                    <option value="pack">pack</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Batal</button>
              <button className="btn-primary" onClick={handleSave} disabled={saving || !form.item.trim()}>
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
            <h3>Hapus Barang?</h3>
            <p className="text-muted">Data yang dihapus tidak dapat dikembalikan.</p>
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
