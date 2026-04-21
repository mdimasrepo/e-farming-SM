import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';

export default function AdminEdukasi() {
  const [articles] = useState([
    { id: 1, title: 'Panduan Lengkap Menanam Padi SRI', category: 'Tanaman Pangan', readTime: '5 Menit' },
    { id: 2, title: 'Cara Membuat Pupuk Kompos Organik', category: 'Kesuburan Tanah', readTime: '7 Menit' },
    { id: 3, title: 'Pengendalian Hama Wereng Terpadu', category: 'Hama & Penyakit', readTime: '6 Menit' },
    { id: 4, title: 'Teknik Irigasi Tetes untuk Lahan Kering', category: 'Teknologi Bertani', readTime: '8 Menit' },
  ]);

  return (
    <div className="admin-edukasi animate-fade-in">
      <div className="admin-card">
        <div className="admin-card-header">
          <h3>Konten Edukasi</h3>
          <span className="text-muted text-sm">Mode Read-Only</span>
        </div>
        <div className="admin-card-body" style={{ padding: 0 }}>
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Judul Artikel</th>
                  <th>Kategori</th>
                  <th>Estimasi Baca</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {articles.map(article => (
                  <tr key={article.id}>
                    <td style={{ fontWeight: 600 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <BookOpen size={16} className="text-emerald" /> {article.title}
                      </div>
                    </td>
                    <td>{article.category}</td>
                    <td>{article.readTime}</td>
                    <td><span className="admin-badge success">Published</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
