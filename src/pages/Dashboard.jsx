import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
  BarChart, Bar
} from 'recharts';
import { CloudRain, Thermometer, Droplets, Wind, TrendingUp } from 'lucide-react';
import './Dashboard.css';

const performanceData = [
  { name: 'Jan', revenue: 4000, cost: 2400 },
  { name: 'Feb', revenue: 3000, cost: 1398 },
  { name: 'Mar', revenue: 2000, cost: 9800 },
  { name: 'Apr', revenue: 2780, cost: 3908 },
  { name: 'May', revenue: 1890, cost: 4800 },
  { name: 'Jun', revenue: 2390, cost: 3800 },
  { name: 'Jul', revenue: 3490, cost: 4300 },
];

const cropHealthData = [
  { name: 'Padi', health: 95 },
  { name: 'Jagung', health: 80 },
  { name: 'Kedelai', health: 65 },
  { name: 'Tomat', health: 90 }
];

export default function Dashboard() {
  return (
    <div className="dashboard animate-fade-in">
      <div className="dashboard-header">
        <div>
          <h2>Ikhtisar Pertanian</h2>
          <p className="text-muted">Pantau kondisi lahan dan metrik panen Anda hari ini.</p>
        </div>
        <button className="btn-primary">
          <TrendingUp size={18} /> Buat Laporan
        </button>
      </div>

      <div className="metrics-grid">
        <div className="metric-card glass-panel orange-glow">
          <div className="metric-icon bg-orange">
            <Thermometer size={24} />
          </div>
          <div className="metric-info">
            <p>Suhu Rata-rata</p>
            <h3>28.4°C</h3>
            <span className="trend positive">+1.2% dari minggu lalu</span>
          </div>
        </div>
        
        <div className="metric-card glass-panel blue-glow">
          <div className="metric-icon bg-blue">
            <CloudRain size={24} />
          </div>
          <div className="metric-info">
            <p>Curah Hujan</p>
            <h3>120 mm</h3>
            <span className="trend positive">+5% dari minggu lalu</span>
          </div>
        </div>

        <div className="metric-card glass-panel green-glow">
          <div className="metric-icon bg-green">
            <Droplets size={24} />
          </div>
          <div className="metric-info">
            <p>Kelembapan Tanah</p>
            <h3>64%</h3>
            <span className="trend neutral">Optimal</span>
          </div>
        </div>

        <div className="metric-card glass-panel purple-glow">
          <div className="metric-icon bg-purple">
            <Wind size={24} />
          </div>
          <div className="metric-info">
            <p>Kecepatan Angin</p>
            <h3>12 km/h</h3>
            <span className="trend negative">Lebih kencang</span>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card glass-panel">
          <div className="chart-header">
            <h3>Proyeksi Panen (Ton)</h3>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--emerald-primary)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--emerald-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="revenue" stroke="var(--emerald-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card glass-panel">
          <div className="chart-header">
            <h3>Kesehatan Tanaman (%)</h3>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cropHealthData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" horizontal={false} />
                <XAxis type="number" stroke="var(--text-secondary)" />
                <YAxis dataKey="name" type="category" stroke="var(--text-secondary)" />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '8px' }} />
                <Bar dataKey="health" fill="var(--info)" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
