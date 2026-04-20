import React from 'react';
import { BookOpen, Video, PlayCircle } from 'lucide-react';
import './Ekstensi.css';

export default function Edukasi() {
  const articles = [
    { id: 1, title: 'Teknik Pemupukan Berimbang untuk Padi', type: 'Artikel', category: 'Padi' },
    { id: 2, title: 'Mengenal Hama Wereng dan Pencegahannya', type: 'Video', category: 'Hama' },
    { id: 3, title: 'Irigasi Tetes untuk Lahan Kering', type: 'Artikel', category: 'Sistem' },
    { id: 4, title: 'Cara Fermentasi Pupuk Kompos Sendiri', type: 'Video', category: 'Pupuk' },
  ];

  return (
    <div className="extensi-container animate-fade-in">
      <div className="extensi-header">
        <h1 className="text-gradient">Pusat Edukasi</h1>
        <p className="text-muted">Tingkatkan wawasan bertani Anda dengan materi pilihan dari para ahli.</p>
      </div>

      <div className="edu-grid">
        {articles.map((item) => (
          <div key={item.id} className="edu-card glass-panel">
            <div className="edu-thumbnail">
              {item.type === 'Video' ? <Video size={36} color="rgba(255,255,255,0.7)" /> : <BookOpen size={36} color="rgba(255,255,255,0.7)" />}
              {item.type === 'Video' && <div className="play-btn"><PlayCircle size={48} fill="var(--emerald-primary)" color="white"/></div>}
            </div>
            <div className="edu-content">
              <span className="edu-tag">{item.category}</span>
              <h3>{item.title}</h3>
              <p className="text-muted">{item.type} • 5 min read</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
