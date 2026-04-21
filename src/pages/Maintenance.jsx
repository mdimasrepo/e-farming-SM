import React, { useEffect, useState } from 'react';
import { Wrench, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { clearAuth, checkMaintenanceStatus } from '../utils/api';

export default function Maintenance() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(null);

  // Poll setiap 5 detik, jika maintenance dimatikan → redirect otomatis
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await checkMaintenanceStatus();
        if (!res.active) {
          setCountdown(3);
        }
      } catch (err) {
        // Server mungkin restart, abaikan
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Countdown redirect
  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) {
      navigate('/dashboard');
      return;
    }
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--bg-primary) 0%, rgba(16, 185, 129, 0.05) 100%)',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <div className="glass-panel" style={{ maxWidth: '500px', width: '100%', padding: '3rem', position: 'relative', overflow: 'hidden' }}>
        
        {/* Animated Background Blob */}
        <div style={{
          position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px',
          background: 'var(--warning)', filter: 'blur(80px)', opacity: 0.2, borderRadius: '50%'
        }}></div>

        <div style={{ 
          width: '80px', height: '80px', borderRadius: '20px', 
          background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 2rem', border: '1px solid rgba(245, 158, 11, 0.2)',
          animation: 'pulse 2s infinite'
        }}>
          <Wrench size={40} />
        </div>
        
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>
          {countdown !== null ? 'Sistem Kembali Online! 🎉' : 'Tani.Smart Sedang Dalam Pemeliharaan'}
        </h1>
        <p className="text-muted" style={{ fontSize: '1.1rem', marginBottom: '2rem', lineHeight: 1.6 }}>
          {countdown !== null 
            ? `Pemeliharaan telah selesai. Anda akan dialihkan ke Dashboard dalam ${countdown} detik...`
            : 'Sistem kami saat ini sedang menjalani peningkatan dan pemeliharaan rutin untuk memberikan layanan yang lebih baik. Kami akan segera kembali!'
          }
        </p>
        
        <button className="btn-secondary" onClick={handleLogout} style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px' }}>
          <ArrowLeft size={18} /> Kembali ke halaman Login
        </button>
      </div>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.4); }
          50% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(245, 158, 11, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
        }
      `}</style>
    </div>
  );
}
