import { Router } from 'express';

const router = Router();

// GET /api/cuaca?lat=-4.73&lon=105.28
router.get('/', async (req, res) => {
  try {
    const lat = req.query.lat || '-4.73';
    const lon = req.query.lon || '105.28';

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,precipitation&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Asia/Jakarta&forecast_days=7`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return res.status(502).json({ error: 'Gagal mengambil data cuaca.' });
    }

    const weatherCodeMap = {
      0: { label: 'Cerah', icon: 'Sun' },
      1: { label: 'Cerah Berawan', icon: 'Sun' },
      2: { label: 'Berawan Sebagian', icon: 'Cloud' },
      3: { label: 'Mendung', icon: 'Cloud' },
      45: { label: 'Berkabut', icon: 'Cloud' },
      48: { label: 'Kabut Tebal', icon: 'Cloud' },
      51: { label: 'Gerimis Ringan', icon: 'CloudDrizzle' },
      53: { label: 'Gerimis', icon: 'CloudDrizzle' },
      55: { label: 'Gerimis Lebat', icon: 'CloudDrizzle' },
      61: { label: 'Hujan Ringan', icon: 'CloudRain' },
      63: { label: 'Hujan Sedang', icon: 'CloudRain' },
      65: { label: 'Hujan Lebat', icon: 'CloudRain' },
      71: { label: 'Salju Ringan', icon: 'CloudSnow' },
      80: { label: 'Hujan Singkat', icon: 'CloudRain' },
      81: { label: 'Hujan Sedang', icon: 'CloudRain' },
      82: { label: 'Hujan Sangat Lebat', icon: 'CloudRain' },
      95: { label: 'Badai Petir', icon: 'CloudLightning' },
    };

    const getWeather = (code) => weatherCodeMap[code] || { label: 'Tidak Diketahui', icon: 'Cloud' };

    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

    const current = {
      temperature: data.current.temperature_2m,
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      precipitation: data.current.precipitation,
      ...getWeather(data.current.weather_code),
    };

    const forecast = data.daily.time.map((date, i) => {
      const d = new Date(date);
      return {
        day: dayNames[d.getDay()],
        date,
        tempMax: data.daily.temperature_2m_max[i],
        tempMin: data.daily.temperature_2m_min[i],
        precipitation: data.daily.precipitation_sum[i],
        ...getWeather(data.daily.weather_code[i]),
      };
    });

    res.json({ current, forecast, location: { lat, lon } });

  } catch (err) {
    console.error('Cuaca error:', err);
    res.status(500).json({ error: 'Gagal mengambil data cuaca.' });
  }
});

// GET /api/cuaca/search?q=bandar+lampung
// Cari desa/kecamatan/kota seluruh Indonesia menggunakan Open-Meteo Geocoding
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q;

    if (!query || query.trim().length < 2) {
      return res.json([]);
    }

    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=id&country_code=ID`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return res.json([]);
    }

    const results = data.results.map((r) => ({
      id: r.id,
      name: r.name,
      admin1: r.admin1 || '',     // Provinsi
      admin2: r.admin2 || '',     // Kabupaten/Kota
      admin3: r.admin3 || '',     // Kecamatan
      admin4: r.admin4 || '',     // Desa/Kelurahan
      latitude: r.latitude,
      longitude: r.longitude,
      displayName: [r.name, r.admin3, r.admin2, r.admin1].filter(Boolean).join(', '),
    }));

    res.json(results);

  } catch (err) {
    console.error('Geocoding error:', err);
    res.status(500).json({ error: 'Gagal mencari lokasi.' });
  }
});

export default router;
