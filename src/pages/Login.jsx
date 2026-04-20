import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Lock, Mail, ArrowRight, Loader } from 'lucide-react';
import { loginAPI, setAuth } from '../utils/api';
import './Login.css';

export default function Login() {
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
      setAuth(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login gagal. Periksa email dan password Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container animate-fade-in">
      <div className="login-split login-left">
        <div className="login-brand glass-panel">
          <Leaf className="brand-icon" size={32} />
          <h1 className="brand-title">Tani.Smart</h1>
        </div>
        <div className="left-content">
          <h2 className="left-headline">Masa Depan<br/>Pertanian Ada<br/><span className="text-gradient">Di Tangan Anda</span></h2>
          <p className="left-sub">Kelola lahan, pantau tanaman, dan tingkatkan hasil panen dengan teknologi presisi yang dirancang khusus untuk petani modern.</p>
        </div>
        <div className="login-footer">
          <p>&copy; 2026 Tani.Smart System</p>
        </div>
        {/* Decorative elements */}
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>
      <div className="login-split login-right">
        <div className="login-form-wrapper glass-panel">
          <div className="form-header">
            <h3>Selamat Datang</h3>
            <p>Silakan masuk ke akun Anda untuk melanjutkan</p>
          </div>
          {error && <div className="login-error">{error}</div>}
          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <label>Email</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={18} />
                <input 
                  type="email" 
                  placeholder="dimas@tanismart.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="input-group">
              <label>Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-actions">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Ingat saya</span>
              </label>
              <a href="#" className="forgot-password">Lupa Password?</a>
            </div>
            <button type="submit" className="btn-primary login-btn" disabled={loading}>
              {loading ? <><Loader size={18} className="spin" /> Memproses...</> : <>Masuk Sekarang <ArrowRight size={18} /></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
