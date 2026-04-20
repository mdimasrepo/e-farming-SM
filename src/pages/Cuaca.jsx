import React from 'react';
import { Sun, Cloud, CloudRain, Wind, Droplet } from 'lucide-react';
import './Ekstensi.css';

export default function Cuaca() {
  const forecast = [
    { day: 'Sen', icon: Sun, temp: '32°C' },
    { day: 'Sel', icon: Cloud, temp: '30°C' },
    { day: 'Rab', icon: CloudRain, temp: '26°C' },
    { day: 'Kam', icon: Cloud, temp: '29°C' },
    { day: 'Jum', icon: Sun, temp: '33°C' },
    { day: 'Sab', icon: CloudRain, temp: '25°C' },
    { day: 'Min', icon: Sun, temp: '31°C' },
  ];

  return (
    <div className="extensi-container animate-fade-in">
      <div className="extensi-header">
        <h1 className="text-gradient">Prediksi Cuaca Lahan</h1>
        <p className="text-muted">Pantau kondisi iklim mikro harian untuk menentukan jadwal tanam/panen.</p>
      </div>

      <div className="weather-today glass-panel">
        <div className="weather-main">
          <Sun size={80} color="var(--warning)" />
          <div className="weather-temp">
            <h2>32°C</h2>
            <p>Cerah Berawan</p>
            <span className="location">Kec. Ngemplak, Boyolali</span>
          </div>
        </div>
        
        <div className="weather-details">
          <div className="w-detail-item">
            <Droplet size={20} color="var(--info)" />
            <div>
              <p className="text-muted">Kelembapan</p>
              <strong>65%</strong>
            </div>
          </div>
          <div className="w-detail-item">
            <Wind size={20} color="var(--text-secondary)" />
            <div>
              <p className="text-muted">Kecepatan Angin</p>
              <strong>12 km/h</strong>
            </div>
          </div>
          <div className="w-detail-item">
            <CloudRain size={20} color="var(--emerald-primary)" />
            <div>
              <p className="text-muted">Curah Hujan</p>
              <strong>0 mm</strong>
            </div>
          </div>
        </div>
      </div>

      <h2 style={{ marginTop: '2rem', marginBottom: '1rem', fontSize: '1.2rem' }}>Prakiraan 7 Hari Kedepan</h2>
      <div className="forecast-grid">
        {forecast.map((f, i) => {
          const Icon = f.icon;
          return (
            <div key={i} className="forecast-card glass-panel">
              <p className="f-day">{f.day}</p>
              <Icon size={32} color={f.icon === Sun ? "var(--warning)" : (f.icon === CloudRain ? "var(--info)" : "var(--text-secondary)")} />
              <p className="f-temp">{f.temp}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
