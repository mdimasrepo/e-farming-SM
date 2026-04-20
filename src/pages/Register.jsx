import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Leaf, Lock, Mail, User, ArrowRight, Loader, Eye, EyeOff, Check, X } from 'lucide-react';
import { registerAPI, setAuth } from '../utils/api';
import './Login.css';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Password strength checks
  const checks = useMemo(() => ({
    minLength: password.length >= 6,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    match: password.length > 0 && password === confirmPassword,
  }), [password, confirmPassword]);

  const strengthScore = Object.values(checks).filter(Boolean).length;
  const strengthLabel = strengthScore <= 1 ? 'Lemah' : strengthScore <= 3 ? 'Sedang' : strengthScore <= 4 ? 'Kuat' : 'Sangat Kuat';
  const strengthColor = strengthScore <= 1 ? 'var(--danger)' : strengthScore <= 3 ? 'var(--warning)' : 'var(--emerald-primary)';

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!checks.minLength) {
      setError('Password minimal 6 karakter.');
      return;
    }

    if (!checks.match) {
      setError('Password dan konfirmasi password tidak cocok.');
      return;
    }

    setLoading(true);

    try {
      const data = await registerAPI(name, email, password);
      setAuth(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registrasi gagal. Coba lagi.');
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
          <h2 className="left-headline">Bergabung<br/>Bersama<br/><span className="text-gradient">Petani Cerdas</span></h2>
          <p className="left-sub">Daftarkan akun Anda dan mulai kelola pertanian dengan lebih efisien menggunakan teknologi modern.</p>
        </div>
        <div className="login-footer">
          <p>&copy; 2026 Tani.Smart System</p>
        </div>
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>
      <div className="login-split login-right">
        <div className="login-form-wrapper glass-panel">
          <div className="form-header">
            <h3>Buat Akun Baru</h3>
            <p>Isi data diri Anda untuk mendaftar</p>
          </div>
          {error && <div className="login-error">{error}</div>}
          <form onSubmit={handleRegister} className="login-form">
            <div className="input-group">
              <label>Nama Lengkap</label>
              <div className="input-wrapper">
                <User className="input-icon" size={18} />
                <input 
                  type="text" 
                  placeholder="Nama lengkap Anda"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="input-group">
              <label>Email</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={18} />
                <input 
                  type="email" 
                  placeholder="email@contoh.com"
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
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Password Strength Bar */}
              {password.length > 0 && (
                <div className="pw-strength">
                  <div className="pw-strength-bar">
                    <div className="pw-strength-fill" style={{ width: `${(strengthScore / 5) * 100}%`, backgroundColor: strengthColor }}></div>
                  </div>
                  <span className="pw-strength-label" style={{ color: strengthColor }}>{strengthLabel}</span>
                </div>
              )}
            </div>

            <div className="input-group">
              <label>Konfirmasi Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input 
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Ulangi password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button type="button" className="toggle-password" onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Password Checklist */}
            {password.length > 0 && (
              <div className="pw-checklist">
                <CheckItem ok={checks.minLength} label="Minimal 6 karakter" />
                <CheckItem ok={checks.hasUpper} label="Huruf besar (A-Z)" />
                <CheckItem ok={checks.hasLower} label="Huruf kecil (a-z)" />
                <CheckItem ok={checks.hasNumber} label="Angka (0-9)" />
                <CheckItem ok={checks.match} label="Password cocok" />
              </div>
            )}

            <button type="submit" className="btn-primary login-btn" disabled={loading}>
              {loading ? <><Loader size={18} className="spin" /> Memproses...</> : <>Daftar Sekarang <ArrowRight size={18} /></>}
            </button>
            <p className="auth-switch">
              Sudah punya akun? <Link to="/login" className="auth-link">Masuk di sini</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

function CheckItem({ ok, label }) {
  return (
    <div className={`pw-check-item ${ok ? 'passed' : ''}`}>
      {ok ? <Check size={14} /> : <X size={14} />}
      <span>{label}</span>
    </div>
  );
}
