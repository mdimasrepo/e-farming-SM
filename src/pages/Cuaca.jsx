import React, { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, CloudDrizzle, CloudLightning, CloudSnow, Wind, Droplet, Loader } from 'lucide-react';
import { getCuaca } from '../utils/api';
import './Ekstensi.css';

const iconMap = {
  Sun,
  Cloud,
  CloudRain,
  CloudDrizzle,
  CloudLightning,
  CloudSnow,
};

export default function Cuaca() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCuaca();
  }, []);

  const fetchCuaca = async () => {
    try {
      const data = await getCuaca();
      setWeather(data);
    } catch (err) {
      setError('Gagal memuat data cuaca.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="extensi-container animate-fade-in">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '5rem', gap: '1rem', color: 'var(--text-secondary)' }}>
          <Loader size={24} className="spin" /> Memuat data cuaca...
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="extensi-container animate-fade-in">
        <div className="extensi-header">
          <h1 className="text-gradient">Prediksi Cuaca Lahan</h1>
        </div>
        <div className="login-error" style={{ maxWidth: 400 }}>{error || 'Data cuaca tidak tersedia.'}</div>
      </div>
    );
  }

  const CurrentIcon = iconMap[weather.current.icon] || Cloud;

  return (
    <div className="extensi-container animate-fade-in">
      <div className="extensi-header">
        <h1 className="text-gradient">Prediksi Cuaca Lahan</h1>
        <p className="text-muted">Data cuaca real-time dari Open-Meteo untuk area pertanian Anda.</p>
      </div>

      <div className="weather-today glass-panel">
        <div className="weather-main">
          <CurrentIcon size={80} color="var(--warning)" />
          <div className="weather-temp">
            <h2>{weather.current.temperature}°C</h2>
            <p>{weather.current.label}</p>
            <span className="location">Kec. Ngemplak, Boyolali</span>
          </div>
        </div>
        
        <div className="weather-details">
          <div className="w-detail-item">
            <Droplet size={20} color="var(--info)" />
            <div>
              <p className="text-muted">Kelembapan</p>
              <strong>{weather.current.humidity}%</strong>
            </div>
          </div>
          <div className="w-detail-item">
            <Wind size={20} color="var(--text-secondary)" />
            <div>
              <p className="text-muted">Kecepatan Angin</p>
              <strong>{weather.current.windSpeed} km/h</strong>
            </div>
          </div>
          <div className="w-detail-item">
            <CloudRain size={20} color="var(--emerald-primary)" />
            <div>
              <p className="text-muted">Curah Hujan</p>
              <strong>{weather.current.precipitation} mm</strong>
            </div>
          </div>
        </div>
      </div>

      <h2 style={{ marginTop: '2rem', marginBottom: '1rem', fontSize: '1.2rem' }}>Prakiraan 7 Hari Kedepan</h2>
      <div className="forecast-grid">
        {weather.forecast.map((f, i) => {
          const FIcon = iconMap[f.icon] || Cloud;
          const isRain = f.icon === 'CloudRain' || f.icon === 'CloudDrizzle';
          const isSun = f.icon === 'Sun';
          return (
            <div key={i} className="forecast-card glass-panel">
              <p className="f-day">{f.day}</p>
              <FIcon size={32} color={isSun ? 'var(--warning)' : isRain ? 'var(--info)' : 'var(--text-secondary)'} />
              <p className="f-temp">{f.tempMax}°</p>
              <p className="f-temp-min">{f.tempMin}°</p>
              {f.precipitation > 0 && (
                <p className="f-rain"><Droplet size={12} /> {f.precipitation} mm</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
