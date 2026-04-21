import React, { useState, useEffect } from 'react';
import { getAdminUsers, updateAdminUser, deleteAdminUser } from '../../utils/api';
import { Search, Edit3, Trash2, X } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('Semua');
  
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [newRole, setNewRole] = useState('petani');

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      setUsers(await getAdminUsers());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setNewRole(user.role);
    setShowModal(true);
  };

  const saveEdit = async () => {
    try {
      await updateAdminUser(editUser.id, { role: newRole });
      setShowModal(false);
      fetchUsers();
    } catch (err) { alert(err.message); }
  };

  const handleDelete = async (user) => {
    if (window.confirm(`Yakin ingin menghapus ${user.name}?`)) {
      try {
        await deleteAdminUser(user.id);
        fetchUsers();
      } catch (err) { alert(err.message); }
    }
  };

  const filtered = users.filter(u => {
    const matchRole = filterRole === 'Semua' || u.role === filterRole.toLowerCase();
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  if (loading) return <div>Memuat...</div>;

  return (
    <div className="admin-users animate-fade-in">
      <div className="admin-card">
        <div className="admin-card-header">
          <h3>Manajemen Pengguna</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <select style={{ padding: '6px 12px', borderRadius: '6px' }} value={filterRole} onChange={e => setFilterRole(e.target.value)}>
              <option value="Semua">Semua Role</option>
              <option value="Petani">Petani</option>
              <option value="Admin">Admin</option>
            </select>
            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--glass-bg)', padding: '4px 12px', borderRadius: '6px', border: '1px solid var(--glass-border)' }}>
              <Search size={16} />
              <input type="text" placeholder="Cari nama/email..." style={{ background: 'transparent', border: 'none', outline: 'none', marginLeft: '8px' }} value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
        </div>
        <div className="admin-card-body" style={{ padding: 0 }}>
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nama</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Tgl Daftar</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(user => (
                  <tr key={user.id}>
                    <td className="text-muted">#{user.id}</td>
                    <td style={{ fontWeight: 600 }}>{user.name}</td>
                    <td>{user.email}</td>
                    <td><span className={`admin-badge ${user.role === 'admin' ? 'danger' : 'info'}`}>{user.role}</span></td>
                    <td>{new Date(user.createdAt).toLocaleDateString('id-ID')}</td>
                    <td>
                      <div className="admin-actions">
                        <button className="admin-btn-action edit" onClick={() => handleEdit(user)}><Edit3 size={16} /></button>
                        <button className="admin-btn-action delete" onClick={() => handleDelete(user)}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Ubah Role Pengguna</h3>
              <button className="btn-icon" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <p>Pengguna: <strong>{editUser.name}</strong> ({editUser.email})</p>
              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label>Role</label>
                <select className="form-input" value={newRole} onChange={e => setNewRole(e.target.value)}>
                  <option value="petani">Petani</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Batal</button>
              <button className="btn-primary" onClick={saveEdit}>Simpan Perubahan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
