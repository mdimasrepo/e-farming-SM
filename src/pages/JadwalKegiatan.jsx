import React from 'react';
import { Calendar, CheckSquare, Clock, Plus } from 'lucide-react';
import './JadwalKegiatan.css';

const MOCK_TASKS = [
  { id: 1, title: 'Pemupukan NPK Blok Utara', date: '21 Apr 2026', time: '07:00', type: 'Pemupukan', priority: 'High', status: 'Pending' },
  { id: 2, title: 'Penyiraman Tomat Cherry', date: '21 Apr 2026', time: '16:00', type: 'Perawatan', priority: 'Medium', status: 'Pending' },
  { id: 3, title: 'Cek Hama Jagung Blok Timur', date: '20 Apr 2026', time: '08:00', type: 'Inspeksi', priority: 'High', status: 'Done' },
];

export default function JadwalKegiatan() {
  return (
    <div className="jadwal-kegiatan animate-fade-in">
      <div className="page-header">
        <div>
          <h2>Jadwal & Tugas</h2>
          <p className="text-muted">Kelola kegiatan harian dan operasional kebun Anda.</p>
        </div>
        <button className="btn-primary">
          <Plus size={18} /> Tambah Kegiatan
        </button>
      </div>

      <div className="schedule-layout">
        <div className="calendar-sidebar glass-panel">
          <h3>Sistem Kalender Pintar</h3>
          <p className="text-muted text-sm mt-2">Pilih tanggal untuk melihat jadwal secara rinci.</p>
          <div className="mock-calendar">
            <div className="cal-header">April 2026</div>
            <div className="cal-grid">
              {['S','S','R','K','J','S','M'].map((d, i) => <div key={i} className="cal-day-label">{d}</div>)}
              {Array.from({length: 30}).map((_, i) => (
                <div key={i} className={`cal-day ${i+1 === 20 ? 'active' : ''} ${[21, 25].includes(i+1) ? 'has-event' : ''}`}>
                  {i+1}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="task-list">
          <div className="task-list-header">
            <h3>Daftar Tugas (20 - 21 Apr)</h3>
            <div className="task-tabs">
              <button className="tab active">Semua</button>
              <button className="tab">Pending</button>
              <button className="tab">Selesai</button>
            </div>
          </div>

          <div className="tasks-container">
            {MOCK_TASKS.map((task) => (
              <div key={task.id} className={`task-card glass-panel ${task.status === 'Done' ? 'done' : ''}`}>
                <div className="task-checkbox">
                  <CheckSquare size={24} className={task.status === 'Done' ? 'text-emerald' : 'text-muted'} />
                </div>
                <div className="task-content">
                  <h4>{task.title}</h4>
                  <div className="task-meta">
                    <span className="task-date">
                      <Calendar size={14} /> {task.date}
                    </span>
                    <span className="task-time">
                      <Clock size={14} /> {task.time}
                    </span>
                  </div>
                </div>
                <div className="task-tags">
                  <span className="task-type">{task.type}</span>
                  <span className={`task-priority priority-${task.priority.toLowerCase()}`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
