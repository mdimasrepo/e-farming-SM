import { Router } from 'express';

const router = Router();

// GET /api/cuaca?lat=-7.57&lon=110.82
router.get('/', async (req, res) => {
  try {
    const lat = req.query.lat || '-4.73';   // Default: Lampung Tengah
    const lon = req.query.lon || '105.28';

    // Open-Meteo API — gratis, tanpa API key
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,precipitation&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Asia/Jakarta&forecast_days=7`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return res.status(502).json({ error: 'Gagal mengambil data cuaca dari Open-Meteo.' });
    }

    // Format response agar lebih mudah digunakan frontend
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

    const current = {
      temperature: data.current.temperature_2m,
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      precipitation: data.current.precipitation,
      ...getWeather(data.current.weather_code),
    };

    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

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

export default router;
