import React, { useState, useEffect } from 'react';
import { Calendar, CheckSquare, Square, Clock, Plus, X, Trash2, Edit3 } from 'lucide-react';
import { getJadwal, createJadwal, updateJadwal, deleteJadwal } from '../utils/api';
import './JadwalKegiatan.css';

const TYPES = ['Pemupukan', 'Penyiraman', 'Pestisida', 'Panen', 'Tanam', 'Perawatan', 'Lainnya'];
const PRIORITIES = ['Tinggi', 'Medium', 'Rendah'];

export default function JadwalKegiatan() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Semua');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', date: '', time: '08:00', type: 'Pemupukan', priority: 'Medium' });

  useEffect(() => { fetchJadwal(); }, []);

  const fetchJadwal = async () => {
    try { setTasks(await getJadwal()); } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const openAdd = () => {
    setEditItem(null);
    setForm({ title: '', date: new Date().toISOString().split('T')[0], time: '08:00', type: 'Pemupukan', priority: 'Medium' });
    setShowModal(true);
  };

  const openEdit = (task) => {
    setEditItem(task);
    setForm({ title: task.title, date: task.date, time: task.time, type: task.type, priority: task.priority });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      if (editItem) {
        await updateJadwal(editItem.id, { ...form, status: editItem.status });
      } else {
        await createJadwal({ ...form, status: 'Pending' });
      }
      setShowModal(false);
      fetchJadwal();
    } catch (err) { alert(err.message); }
    finally { setSaving(false); }
  };

  const toggleStatus = async (task) => {
    const newStatus = task.status === 'Done' ? 'Pending' : 'Done';
    try { await updateJadwal(task.id, { ...task, status: newStatus }); fetchJadwal(); }
    catch (err) { alert(err.message); }
  };

  const handleDelete = async (id) => {
    try { await deleteJadwal(id); fetchJadwal(); }
    catch (err) { alert(err.message); }
  };

  const filtered = tasks.filter(t => {
    if (activeTab === 'Pending') return t.status !== 'Done';
    if (activeTab === 'Selesai') return t.status === 'Done';
    return true;
  });

  const now = new Date();
  const currentDay = now.getDate();
  const currentMonth = now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay();

  // Mark days with events
  const eventDays = new Set(tasks.map(t => {
    const d = new Date(t.date);
    if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) return d.getDate();
    return null;
  }).filter(Boolean));

  const pendingCount = tasks.filter(t => t.status !== 'Done').length;
  const doneCount = tasks.filter(t => t.status === 'Done').length;

  return (
    <div className="jadwal-kegiatan animate-fade-in">
      <div className="page-header">
        <div>
          <h2>Jadwal & Tugas</h2>
          <p className="text-muted">Kelola kegiatan harian dan operasional kebun Anda.</p>
        </div>
        <button className="btn-primary" onClick={openAdd}>
          <Plus size={18} /> Tambah Kegiatan
        </button>
      </div>

      <div className="schedule-layout">
        <div className="calendar-sidebar glass-panel">
          <h3>📅 {currentMonth}</h3>
          <div className="cal-stats">
            <span className="text-warning">{pendingCount} pending</span>
            <span className="text-emerald">{doneCount} selesai</span>
          </div>
          <div className="mock-calendar">
            <div className="cal-grid">
              {['S','S','R','K','J','S','M'].map((d, i) => <div key={i} className="cal-day-label">{d}</div>)}
              {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} className="cal-day empty"></div>)}
              {Array.from({ length: daysInMonth }).map((_, i) => (
                <div key={i} className={`cal-day ${i + 1 === currentDay ? 'active' : ''} ${eventDays.has(i + 1) ? 'has-event' : ''}`}>
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="task-list">
          <div className="task-list-header">
            <h3>Daftar Tugas ({filtered.length})</h3>
            <div className="task-tabs">
              {['Semua', 'Pending', 'Selesai'].map(tab => (
                <button key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>{tab}</button>
              ))}
            </div>
          </div>

          {loading ? (
            <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Memuat jadwal...</p>
          ) : filtered.length === 0 ? (
            <div className="empty-state glass-panel">
              <Calendar size={48} style={{ opacity: 0.3 }} />
              <h3>Tidak ada tugas</h3>
              <p className="text-muted">{activeTab !== 'Semua' ? `Tidak ada tugas ${activeTab.toLowerCase()}.` : 'Klik "Tambah Kegiatan" untuk memulai.'}</p>
            </div>
          ) : (
            <div className="tasks-container">
              {filtered.map((task) => (
                <div key={task.id} className={`task-card glass-panel ${task.status === 'Done' ? 'done' : ''}`}>
                  <div className="task-checkbox" onClick={() => toggleStatus(task)} style={{ cursor: 'pointer' }}>
                    {task.status === 'Done' ? <CheckSquare size={22} className="text-emerald" /> : <Square size={22} className="text-muted" />}
                  </div>
                  <div className="task-content">
                    <h4>{task.title}</h4>
                    <div className="task-meta">
                      <span className="task-date"><Calendar size={14} /> {task.date}</span>
                      <span className="task-time"><Clock size={14} /> {task.time}</span>
                    </div>
                  </div>
                  <div className="task-tags">
                    <span className="task-type">{task.type}</span>
                    <span className={`task-priority priority-${(task.priority || 'medium').toLowerCase()}`}>{task.priority}</span>
                  </div>
                  <div className="task-actions-btns">
                    <button className="btn-icon-sm" title="Edit" onClick={() => openEdit(task)}><Edit3 size={14} /></button>
                    <button className="btn-icon-sm danger" title="Hapus" onClick={() => handleDelete(task.id)}><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content glass-panel animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editItem ? 'Edit Kegiatan' : 'Tambah Kegiatan Baru'}</h3>
              <button className="btn-icon" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Judul Kegiatan</label>
                <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Mis: Pemupukan Blok Utara" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Tanggal</label>
                  <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Waktu</label>
                  <input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Jenis Kegiatan</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                    {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Prioritas</label>
                  <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                    {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Batal</button>
              <button className="btn-primary" onClick={handleSave} disabled={saving || !form.title.trim()}>
                {saving ? 'Menyimpan...' : editItem ? 'Update' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
