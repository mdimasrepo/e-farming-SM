import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Lock, Mail, ArrowRight } from 'lucide-react';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate login
    navigate('/dashboard');
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
          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <label>Email</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={18} />
                <input 
                  type="email" 
                  placeholder="petani@cerdas.com"
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
            <button type="submit" className="btn-primary login-btn">
              Masuk Sekarang <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
