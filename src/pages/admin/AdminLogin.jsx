import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail } from 'lucide-react';
import { loginAPI, setAuth } from '../../utils/api';
import '../Login.css'; // Reusing the login styling but will add dark theme inline

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await loginAPI(email, password);
      // Validasi tambahan: Pastikan akun tersebut bersatatus admin
      if (data.user.role !== 'admin') {
        throw new Error('Akses ditolak. Anda bukan Administrator.');
      }
      setAuth(data.token, data.user);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Login gagal. Periksa kredensial Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container animate-fade-in" style={{ backgroundColor: '#1a2332' }}>
      <div className="login-split login-left" style={{ background: 'linear-gradient(135deg, #151c28 0%, #1e293b 100%)', color: 'white' }}>
        <div className="login-brand glass-panel" style={{ background: 'rgba(0,0,0,0.3)', borderColor: 'rgba(255,255,255,0.1)' }}>
          <ShieldCheck className="text-emerald" size={32} />
          <h1 className="brand-title" style={{ color: 'white' }}>Tani.Admin</h1>
        </div>
        <div className="left-content">
          <h2 className="left-headline">Pusat Kendali<br/>Sistem<br/><span className="text-gradient">Tani.Smart</span></h2>
          <p className="left-sub" style={{ color: '#aebacd' }}>Panel administrator eksklusif untuk staf pengelola platform. Harap masuk menggunakan kredensial rahasia Anda.</p>
        </div>
        <div className="login-footer" style={{ color: '#6b7a90' }}>
          <p>&copy; 2026 Administrator Tani.Smart</p>
        </div>
      </div>
      <div className="login-split login-right" style={{ backgroundColor: '#151c28' }}>
        <div className="login-form-wrapper glass-panel" style={{ background: '#1e293b', borderColor: 'rgba(255,255,255,0.05)' }}>
          <div className="form-header">
            <h3 style={{ color: 'white' }}>Login Administrator</h3>
            <p style={{ color: '#aebacd' }}>Akses Terbatas: Hanya untuk Admin</p>
          </div>
          {error && <div className="login-error">{error}</div>}
          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <label style={{ color: '#cbd5e1' }}>Username / Email</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={18} style={{ color: '#64748b' }} />
                <input 
                  type="text" 
                  placeholder="admin"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ background: '#0f172a', color: 'white', borderColor: 'rgba(255,255,255,0.1)' }}
                />
              </div>
            </div>
            <div className="input-group">
              <label style={{ color: '#cbd5e1' }}>Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} style={{ color: '#64748b' }} />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ background: '#0f172a', color: 'white', borderColor: 'rgba(255,255,255,0.1)' }}
                />
              </div>
            </div>
            <button type="submit" className="btn-primary login-btn" disabled={loading} style={{ background: '#10b981', color: 'white' }}>
              {loading ? 'Mengautentikasi...' : 'Akses Dashboard'}
            </button>
            <div className="login-links" style={{ textAlign: 'center', marginTop: '1rem' }}>
              <a href="/login" style={{ color: '#aebacd', textDecoration: 'none', fontSize: '0.9rem' }}>← Kembali ke Login Petani</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
