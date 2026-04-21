import React, { useState, useEffect } from 'react';
import { Bug, MessageSquare, Trash2, Send, AlertCircle, CheckCircle2, Clock, Filter } from 'lucide-react';
import { getAdminBugs, updateAdminBug, deleteAdminBug } from '../../utils/api';

export default function AdminBugReports() {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => { fetchBugs(); }, []);

  const fetchBugs = async () => {
    try { setBugs(await getAdminBugs()); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateAdminBug(id, { status });
      fetchBugs();
    } catch (err) { alert('Gagal update status'); }
  };

  const handleReply = async (id) => {
    if (!replyText.trim()) return;
    try {
      await updateAdminBug(id, { adminReply: replyText, status: 'In Progress' });
      setReplyingId(null); setReplyText('');
      fetchBugs();
    } catch (err) { alert('Gagal mengirim balasan'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus laporan ini?')) return;
    try { await deleteAdminBug(id); fetchBugs(); }
    catch (err) { alert('Gagal menghapus'); }
  };

  const filtered = filter === 'all' ? bugs : bugs.filter(b => b.status === filter);

  const statusIcon = (s) => {
    if (s === 'Open') return <Clock size={14} />;
    if (s === 'In Progress') return <AlertCircle size={14} />;
    return <CheckCircle2 size={14} />;
  };

  const statusColor = (s) => {
    if (s === 'Open') return { bg: 'rgba(245,158,11,0.15)', color: 'var(--warning)' };
    if (s === 'In Progress') return { bg: 'rgba(59,130,246,0.15)', color: 'var(--info)' };
    return { bg: 'rgba(16,185,129,0.15)', color: 'var(--emerald-primary)' };
  };

  const catEmoji = (c) => {
    if (c === 'Bug') return '🐛';
    if (c === 'Saran') return '💡';
    if (c === 'UI') return '🎨';
    return '📝';
  };

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Memuat laporan...</div>;

  return (
    <div className="admin-dashboard animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Bug size={24} className="text-emerald" /> Laporan Bug & Masukan
          </h2>
          <p className="text-muted" style={{ marginTop: '4px' }}>
            {bugs.length} laporan total • {bugs.filter(b => b.status === 'Open').length} menunggu tindakan
          </p>
        </div>
        {/* Filter */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', 'Open', 'In Progress', 'Resolved'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{
                padding: '6px 14px', borderRadius: '50px', border: '1px solid var(--glass-border)',
                background: filter === f ? 'var(--emerald-primary)' : 'transparent',
                color: filter === f ? '#fff' : 'var(--text-secondary)',
                cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, transition: '0.2s'
              }}>
              {f === 'all' ? 'Semua' : f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="admin-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Bug size={48} style={{ opacity: 0.15, marginBottom: '1rem' }} />
          <h3>Tidak ada laporan</h3>
          <p className="text-muted">Belum ada laporan bug dari pengguna.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map(bug => {
            const sc = statusColor(bug.status);
            return (
              <div key={bug.id} className="admin-card" style={{ overflow: 'hidden' }}>
                <div className="admin-card-body" style={{ padding: '1.25rem' }}>
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span style={{ fontSize: '1.2rem' }}>{catEmoji(bug.category)}</span>
                        <h4 style={{ margin: 0 }}>{bug.title}</h4>
                        <span style={{ ...sc, padding: '2px 10px', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', background: sc.bg, color: sc.color }}>
                          {statusIcon(bug.status)} {bug.status}
                        </span>
                      </div>
                      <p className="text-muted" style={{ fontSize: '0.8rem', margin: 0 }}>
                        oleh <strong>{bug.reporter_name}</strong> ({bug.reporter_email}) • {new Date(bug.createdAt).toLocaleString('id-ID')}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <select value={bug.status} onChange={e => handleStatusChange(bug.id, e.target.value)}
                        style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.8rem', cursor: 'pointer' }}>
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                      <button onClick={() => handleDelete(bug.id)} style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', border: 'none', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  {bug.description && (
                    <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', marginBottom: '0.75rem', fontSize: '0.9rem', lineHeight: 1.6 }}>
                      {bug.description}
                    </div>
                  )}

                  {/* Existing Reply */}
                  {bug.adminReply && (
                    <div style={{ padding: '10px 12px', borderRadius: '8px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', marginBottom: '0.75rem', fontSize: '0.85rem' }}>
                      <strong style={{ color: 'var(--emerald-primary)' }}>Balasan Admin:</strong> {bug.adminReply}
                    </div>
                  )}

                  {/* Reply Form */}
                  {replyingId === bug.id ? (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input type="text" className="form-input" value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Tulis balasan untuk user..." style={{ flex: 1 }} />
                      <button className="btn-primary" onClick={() => handleReply(bug.id)} style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Send size={14} /> Kirim
                      </button>
                      <button className="btn-secondary" onClick={() => { setReplyingId(null); setReplyText(''); }} style={{ padding: '8px 12px' }}>Batal</button>
                    </div>
                  ) : (
                    <button onClick={() => { setReplyingId(bug.id); setReplyText(bug.adminReply || ''); }}
                      style={{ background: 'none', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MessageSquare size={14} /> {bug.adminReply ? 'Edit Balasan' : 'Balas'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
