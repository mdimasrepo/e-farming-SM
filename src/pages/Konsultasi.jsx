import React from 'react';
import { MessageSquare, Star, Phone } from 'lucide-react';
import './Ekstensi.css';

export default function Konsultasi() {
  const pakar = [
    { id: 1, name: 'Dr. Ir. Wahyudi', focus: 'Ahli Hama Tanaman', rating: 4.9, status: 'Online' },
    { id: 2, name: 'Siti Aminah, SP.', focus: 'Manajemen Tanah/Pupuk', rating: 4.8, status: 'Sibuk' },
    { id: 3, name: 'Budi Santoso, M.Si', focus: 'Penyuluh Padi & Palawija', rating: 4.7, status: 'Online' },
  ];

  return (
    <div className="extensi-container animate-fade-in">
      <div className="extensi-header">
        <h1 className="text-gradient">Konsultasi Pakar</h1>
        <p className="text-muted">Diskusikan masalah pertanian Anda langsung dengan ahlinya.</p>
      </div>

      <div className="pakar-list">
        {pakar.map((p) => (
          <div key={p.id} className="pakar-card glass-panel">
            <div className="pakar-avatar">
              <div className="avatar-placeholder">{p.name.charAt(0)}</div>
              <div className={`status-dot ${p.status === 'Online' ? 'online' : 'busy'}`}></div>
            </div>
            <div className="pakar-info">
              <h3>{p.name}</h3>
              <p className="focus">{p.focus}</p>
              <div className="rating">
                <Star size={14} fill="var(--warning)" color="var(--warning)" />
                <span>{p.rating}</span>
              </div>
            </div>
            <div className="pakar-actions">
              <button className="btn-icon"><Phone size={18} /></button>
              <button className="btn-primary" disabled={p.status !== 'Online'}>
                <MessageSquare size={16} /> Chat
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
