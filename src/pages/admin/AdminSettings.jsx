import React, { useState, useEffect } from 'react';
import { getAdminSettings, updateAdminSettings, testAdminApiKey } from '../../utils/api';
import { Settings, ShieldAlert, Key, CheckCircle2, XCircle } from 'lucide-react';

export default function AdminSettings() {
  const [settings, setSettings] = useState({ maintenance: false, apiKeyConfigured: false, apiKeyPreview: '' });
  const [apiKey, setApiKey] = useState('');
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
      const data = await getAdminSettings();
      setSettings(data);
      if (data.apiKeyPreview) setApiKey(data.apiKeyPreview);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateAdminSettings({ maintenance: settings.maintenance, apiKey });
      const data = await getAdminSettings();
      setSettings(data);
      if (data.apiKeyPreview) setApiKey(data.apiKeyPreview);
      alert('Pengaturan berhasil disimpan!');
    } catch (err) {
      alert('Gagal menyimpan: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleTestKey = async () => {
    setTestResult('testing');
    try {
      const res = await testAdminApiKey(apiKey);
      if (res.valid) {
        setTestResult('success');
      } else {
        setTestResult('error');
      }
    } catch (err) {
      setTestResult('error');
    }
  };

  if (loading) return <div>Memuat Pengaturan...</div>;

  return (
    <div className="admin-settings animate-fade-in">
      <div className="admin-stats-grid">
        
        {/* Maintenance Toggle */}
        <div className="admin-card" style={{ flex: 1 }}>
          <div className="admin-card-header">
            <h3>Mode Pemeliharaan (Maintenance)</h3>
          </div>
          <div className="admin-card-body">
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div className={`stat-icon ${settings.maintenance ? 'warning' : 'primary'}`}>
                <ShieldAlert size={28} />
              </div>
              <div>
                <h4 style={{ marginBottom: '8px' }}>Status: {settings.maintenance ? 'AKTIF' : 'NONAKTIF'}</h4>
                <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  Jika diaktifkan, seluruh pengguna reguler (petani) tidak akan dapat mengakses sistem dan akan dialihkan ke halaman Maintenance. Admin tetap dapat mengakses panel ini.
                </p>
                <label className="switch" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <div style={{
                    width: '50px', height: '26px', background: settings.maintenance ? 'var(--warning)' : 'var(--glass-border)',
                    borderRadius: '50px', position: 'relative', transition: '0.3s'
                  }} onClick={() => setSettings({ ...settings, maintenance: !settings.maintenance })}>
                    <div style={{
                      width: '20px', height: '20px', background: '#fff', borderRadius: '50%',
                      position: 'absolute', top: '3px', left: settings.maintenance ? '27px' : '3px', transition: '0.3s'
                    }} />
                  </div>
                  <span style={{ marginLeft: '12px', fontWeight: 600 }}>
                    {settings.maintenance ? 'Matikan Mode Maintenance' : 'Aktifkan Mode Maintenance'}
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* API Key Management */}
        <div className="admin-card" style={{ flex: 1 }}>
          <div className="admin-card-header">
            <h3>Konfigurasi AI (OpenRouter)</h3>
          </div>
          <div className="admin-card-body">
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div className={`stat-icon ${settings.apiKeyConfigured ? 'primary' : 'danger'}`}>
                <Key size={28} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ marginBottom: '8px' }}>API Key OpenRouter</h4>
                <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  Digunakan untuk fitur Diagnosa AI dan Konsultasi Pakar. Key disimpan di memori server dan aktif hingga restart.
                </p>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <input 
                    type="password" 
                    className="form-input" 
                    value={apiKey} 
                    onChange={e => { setApiKey(e.target.value); setTestResult(null); }} 
                    placeholder="sk-or-v1-..." 
                  />
                  {!settings.apiKeyConfigured && <small className="text-danger">API Key belum dikonfigurasi!</small>}
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button className="btn-secondary" onClick={handleTestKey} disabled={!apiKey || testResult === 'testing'}>
                    {testResult === 'testing' ? 'Menguji...' : 'Test Koneksi'}
                  </button>
                  {testResult === 'success' && <span className="text-emerald" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={16} /> Valid</span>}
                  {testResult === 'error' && <span className="text-danger" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><XCircle size={16} /> Invalid</span>}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn-primary" onClick={handleSave} disabled={saving} style={{ padding: '12px 24px', fontSize: '1rem' }}>
          {saving ? 'Menyimpan...' : 'Simpan Semua Pengaturan'}
        </button>
      </div>
    </div>
  );
}
