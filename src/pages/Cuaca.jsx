import React, { useState, useEffect, useRef } from 'react';
import { Sun, Cloud, CloudRain, CloudDrizzle, CloudLightning, CloudSnow, Wind, Droplet, Loader, Search, MapPin } from 'lucide-react';
import { getCuaca, searchLokasi } from '../utils/api';
import './Ekstensi.css';

const iconMap = { Sun, Cloud, CloudRain, CloudDrizzle, CloudLightning, CloudSnow };

export default function Cuaca() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [locationName, setLocationName] = useState('Lampung Tengah, Lampung');

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    fetchCuaca();

    // Close dropdown on outside click
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const fetchCuaca = async (lat, lon) => {
    setLoading(true);
    setError('');
    try {
      const data = await getCuaca(lat, lon);
      setWeather(data);
    } catch (err) {
      setError('Gagal memuat data cuaca.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.trim().length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const results = await searchLokasi(value);
        setSearchResults(results);
        setShowDropdown(true);
      } catch (err) {
        console.error(err);
      } finally {
        setSearching(false);
      }
    }, 400);
  };

  const selectLocation = (loc) => {
    setLocationName(loc.displayName);
    setSearchQuery('');
    setShowDropdown(false);
    setSearchResults([]);
    fetchCuaca(loc.latitude, loc.longitude);
  };

  if (loading && !weather) {
    return (
      <div className="extensi-container animate-fade-in">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '5rem', gap: '1rem', color: 'var(--text-secondary)' }}>
          <Loader size={24} className="spin" /> Memuat data cuaca...
        </div>
      </div>
    );
  }

  const CurrentIcon = weather ? (iconMap[weather.current.icon] || Cloud) : Cloud;

  return (
    <div className="extensi-container animate-fade-in">
      <div className="extensi-header">
        <h1 className="text-gradient">Prediksi Cuaca Lahan</h1>
        <p className="text-muted">Data cuaca real-time dari seluruh Indonesia. Cari desa atau kecamatan Anda.</p>
      </div>

      {/* Search Bar */}
      <div className="cuaca-search-container" ref={searchRef}>
        <div className="cuaca-search-bar glass-panel">
          <Search size={20} className="cuaca-search-icon" />
          <input
            type="text"
            placeholder="Cari desa, kecamatan, atau kota di Indonesia..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
          />
          {searching && <Loader size={18} className="spin cuaca-search-spinner" />}
        </div>

        {showDropdown && searchResults.length > 0 && (
          <div className="cuaca-dropdown glass-panel">
            {searchResults.map((loc) => (
              <div key={loc.id} className="cuaca-dropdown-item" onClick={() => selectLocation(loc)}>
                <MapPin size={16} />
                <div>
                  <strong>{loc.name}</strong>
                  <span className="text-muted">{loc.displayName}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {showDropdown && searchResults.length === 0 && searchQuery.length >= 2 && !searching && (
          <div className="cuaca-dropdown glass-panel">
            <div className="cuaca-dropdown-empty">Lokasi tidak ditemukan.</div>
          </div>
        )}
      </div>

      {error && <div className="login-error" style={{ maxWidth: 500 }}>{error}</div>}

      {weather && (
        <>
          <div className="weather-today glass-panel">
            <div className="weather-main">
              <CurrentIcon size={80} color="var(--warning)" />
              <div className="weather-temp">
                <h2>{weather.current.temperature}°C</h2>
                <p>{weather.current.label}</p>
                <span className="location"><MapPin size={14} style={{ display: 'inline', verticalAlign: '-2px' }} /> {locationName}</span>
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
            {loading && <div className="weather-loading"><Loader size={16} className="spin" /> Memperbarui...</div>}
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
        </>
      )}
    </div>
  );
}
