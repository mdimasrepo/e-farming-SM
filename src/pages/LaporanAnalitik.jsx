import React from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from 'recharts';
import { TrendingUp, Download, PieChart, Activity, DollarSign } from 'lucide-react';
import './LaporanAnalitik.css';

export default function LaporanAnalitik() {
  const productivityData = [
    { name: 'Jan', padi: 120, jagung: 80, kedelai: 40 },
    { name: 'Feb', padi: 132, jagung: 90, kedelai: 45 },
    { name: 'Mar', padi: 101, jagung: 70, kedelai: 50 },
    { name: 'Apr', padi: 145, jagung: 110, kedelai: 60 },
    { name: 'Mei', padi: 160, jagung: 130, kedelai: 75 },
    { name: 'Jun', padi: 180, jagung: 140, kedelai: 80 },
    { name: 'Jul', padi: 195, jagung: 155, kedelai: 90 },
  ];

  const revenueData = [
    { name: 'Q1', revenue: 4000, expense: 2400 },
    { name: 'Q2', revenue: 3000, expense: 1398 },
    { name: 'Q3', revenue: 2000, expense: 9800 },
    { name: 'Q4', revenue: 2780, expense: 3908 },
  ];

  const summaryCards = [
    { title: 'Total Panen (Ton)', value: '1,240', change: '+12%', icon: PieChart, color: 'var(--emerald-primary)' },
    { title: 'Pendapatan', value: 'Rp 450M', change: '+8%', icon: DollarSign, color: 'var(--info)' },
    { title: 'Pengeluaran', value: 'Rp 120M', change: '-4%', icon: Activity, color: 'var(--danger)' },
    { title: 'Tingkat Keberhasilan', value: '94%', change: '+2%', icon: TrendingUp, color: 'var(--warning)' },
  ];

  return (
    <div className="laporan-container animate-fade-in">
      <div className="laporan-header">
        <div>
          <h1 className="text-gradient">Laporan & Analitik</h1>
          <p className="text-muted">Pantau performa dan produktivitas pertanian Anda</p>
        </div>
        <button className="btn-primary">
          <Download size={18} />
          <span>Unduh Laporan</span>
        </button>
      </div>

      <div className="summary-grid">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          const isPositive = card.change.startsWith('+');
          return (
            <div key={index} className="summary-card glass-panel">
              <div className="summary-icon" style={{ backgroundColor: `${card.color}20`, color: card.color }}>
                <Icon size={24} />
              </div>
              <div className="summary-info">
                <h3>{card.title}</h3>
                <div className="summary-value-row">
                  <span className="summary-value">{card.value}</span>
                  <span className={`summary-change ${isPositive ? 'positive' : 'negative'}`}>
                    {card.change}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="charts-grid">
        <div className="chart-panel glass-panel">
          <div className="chart-header">
            <h2>Tren Produktivitas Bulanan</h2>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={productivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" />
                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--glass-border)', color: 'var(--text-primary)' }}
                />
                <Legend />
                <Line type="monotone" dataKey="padi" name="Padi" stroke="var(--emerald-primary)" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                <Line type="monotone" dataKey="jagung" name="Jagung" stroke="var(--warning)" strokeWidth={3} dot={{r: 4}} />
                <Line type="monotone" dataKey="kedelai" name="Kedelai" stroke="var(--info)" strokeWidth={3} dot={{r: 4}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-panel glass-panel">
          <div className="chart-header">
            <h2>Pendapatan vs Pengeluaran</h2>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" />
                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--glass-border)', color: 'var(--text-primary)' }}
                />
                <Legend />
                <Bar dataKey="revenue" name="Pendapatan (Juta)" fill="var(--emerald-primary)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Pengeluaran (Juta)" fill="var(--danger)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
