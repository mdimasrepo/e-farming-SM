import React from 'react';
import { Calendar, Watch, CheckCircle2, AlertCircle } from 'lucide-react';
import './DataTanaman.css';

const MOCK_CROPS = [
  { id: 1, name: 'Padi IR64', land: 'Blok Utara', plantDate: '10 Feb 2026', estHarvest: '20 Mei 2026', progress: 65, health: 'Baik', icon: '🌾' },
  { id: 2, name: 'Jagung Manis', land: 'Blok Timur', plantDate: '05 Mar 2026', estHarvest: '05 Jun 2026', progress: 40, health: 'Perlu Perhatian', icon: '🌽' },
  { id: 3, name: 'Tomat Cherry', land: 'Blok Barat', plantDate: '20 Jan 2026', estHarvest: '20 Apr 2026', progress: 95, health: 'Siap Panen', icon: '🍅' },
  { id: 4, name: 'Kacang Kedelai', land: 'Blok Selatan', plantDate: '15 Mar 2026', estHarvest: '15 Jun 2026', progress: 25, health: 'Baik', icon: '🌱' },
];

export default function DataTanaman() {
  return (
    <div className="data-tanaman animate-fade-in">
      <div className="page-header">
        <div>
          <h2>Data Tanaman</h2>
          <p className="text-muted">Pantau pertumbuhan dan masa panen seluruh tanaman Anda.</p>
        </div>
        <button className="btn-primary">
          Tambah Data Tanaman
        </button>
      </div>

      <div className="crop-controls">
        <div className="progress-summary glass-panel">
          <div className="summary-stat">
            <span className="stat-value text-emerald">4</span>
            <span className="stat-label">Total Jenis Tanaman</span>
          </div>
          <div className="summary-stat">
            <span className="stat-value text-info">1</span>
            <span className="stat-label">Siap Panen Bulan Ini</span>
          </div>
          <div className="summary-stat">
            <span className="stat-value text-warning">1</span>
            <span className="stat-label">Perlu Perawatan Ekstra</span>
          </div>
        </div>
      </div>

      <div className="crop-grid">
        {MOCK_CROPS.map((crop) => (
          <div key={crop.id} className="crop-card glass-panel">
            <div className="crop-header">
              <div className="crop-title-area">
                <div className="crop-emoji">{crop.icon}</div>
                <div>
                  <h3>{crop.name}</h3>
                  <span className="crop-land">{crop.land}</span>
                </div>
              </div>
              <div className="crop-health" data-status={crop.health === 'Baik' ? 'good' : crop.health === 'Siap Panen' ? 'excellent' : 'warning'}>
                {crop.health === 'Baik' ? <CheckCircle2 size={16} /> : crop.health === 'Siap Panen' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{crop.health}</span>
              </div>
            </div>

            <div className="crop-progress-container">
              <div className="progress-labels">
                <span>Progress Tumbuh</span>
                <span>{crop.progress}%</span>
              </div>
              <div className="progress-bar-bg">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${crop.progress}%`, background: crop.progress > 80 ? 'var(--emerald-primary)' : crop.progress > 40 ? 'var(--info)' : 'var(--warning)' }}
                ></div>
              </div>
            </div>

            <div className="crop-timeline">
              <div className="timeline-item">
                <Watch size={16} className="text-muted" />
                <div className="timeline-text">
                  <span className="label">Tanam</span>
                  <span className="value">{crop.plantDate}</span>
                </div>
              </div>
              <div className="timeline-line"></div>
              <div className="timeline-item">
                <Calendar size={16} className="text-emerald" />
                <div className="timeline-text">
                  <span className="label">Estimasi Panen</span>
                  <span className="value font-medium">{crop.estHarvest}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
