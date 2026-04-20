import React, { useState, useEffect, useRef } from 'react';
import { Stethoscope, CheckCircle, AlertTriangle, Loader, ChevronRight, RotateCcw, Shield, Bug, Leaf, Camera, UploadCloud, X, Image } from 'lucide-react';
import { getGejala, analyzeDiagnosa, analyzeDiagnosaPhoto } from '../utils/api';
import './Ekstensi.css';

const plantIcons = { Padi: '🌾', Jagung: '🌽', Tomat: '🍅', Cabai: '🌶️', Kedelai: '🌱' };

export default function Diagnosa() {
  const [mode, setMode] = useState(null); // 'gejala' or 'foto'
  const [step, setStep] = useState(0); // 0: pilih mode, 1: tanaman, 2: gejala/foto, 3: hasil
  const [gejalaData, setGejalaData] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingGejala, setLoadingGejala] = useState(true);

  // Photo state
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoBase64, setPhotoBase64] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => { fetchGejala(); }, []);

  const fetchGejala = async () => {
    try { setGejalaData(await getGejala()); } catch (err) { console.error(err); } finally { setLoadingGejala(false); }
  };

  const currentSymptoms = gejalaData.find(g => g.plant === selectedPlant)?.symptoms || [];

  const toggleSymptom = (s) => setSelectedSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert('Ukuran foto maksimal 5MB.'); return; }
    setPhotoPreview(URL.createObjectURL(file));
    const reader = new FileReader();
    reader.onload = () => setPhotoBase64(reader.result);
    reader.readAsDataURL(file);
  };

  const handleAnalyzeGejala = async () => {
    if (selectedSymptoms.length === 0) return;
    setLoading(true);
    try { setResult(await analyzeDiagnosa(selectedPlant, selectedSymptoms)); setStep(3); }
    catch (err) { alert(err.message); }
    finally { setLoading(false); }
  };

  const handleAnalyzePhoto = async () => {
    if (!photoBase64) return;
    setLoading(true);
    try { setResult(await analyzeDiagnosaPhoto(photoBase64, selectedPlant || null)); setStep(3); }
    catch (err) { alert(err.message || 'Gagal menganalisis foto.'); }
    finally { setLoading(false); }
  };

  const handleReset = () => {
    setMode(null); setStep(0); setSelectedPlant(''); setSelectedSymptoms([]);
    setResult(null); setPhotoPreview(null); setPhotoBase64(null);
  };

  const severityColor = (s) => s === 'Sangat Tinggi' || s === 'Tinggi' ? 'var(--danger)' : s === 'Sedang' ? 'var(--warning)' : 'var(--emerald-primary)';

  const sourceLabel = (src) => {
    if (src === 'ai' || src === 'ai-vision') return '🤖 Analisis AI';
    return '📋 Expert System';
  };

  return (
    <div className="extensi-container animate-fade-in">
      <div className="extensi-header">
        <h1 className="text-gradient">Diagnosa AI</h1>
        <p className="text-muted">Sistem pakar deteksi penyakit tanaman berbasis AI dan analisis gejala.</p>
      </div>

      {/* Progress Steps */}
      {step > 0 && (
        <div className="diagnosa-steps">
          <div className={`d-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'done' : ''}`}>
            <div className="step-num">1</div>
            <span>{mode === 'foto' ? 'Pilih Tanaman' : 'Pilih Tanaman'}</span>
          </div>
          <div className="step-line"></div>
          <div className={`d-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'done' : ''}`}>
            <div className="step-num">2</div>
            <span>{mode === 'foto' ? 'Unggah Foto' : 'Pilih Gejala'}</span>
          </div>
          <div className="step-line"></div>
          <div className={`d-step ${step >= 3 ? 'active' : ''}`}>
            <div className="step-num">3</div>
            <span>Hasil Diagnosa</span>
          </div>
        </div>
      )}

      {/* Step 0: Pilih Mode */}
      {step === 0 && (
        <div className="diagnosa-step-content animate-fade-in">
          <h2>Pilih Metode Diagnosa</h2>
          <p className="text-muted">Pilih cara Anda ingin mendiagnosa tanaman.</p>
          <div className="mode-grid">
            <div className="mode-card glass-panel" onClick={() => { setMode('gejala'); setStep(1); }}>
              <Stethoscope size={48} color="var(--emerald-primary)" />
              <h3>Analisis Gejala</h3>
              <p className="text-muted">Pilih gejala yang Anda amati pada tanaman secara manual</p>
            </div>
            <div className="mode-card glass-panel" onClick={() => { setMode('foto'); setStep(1); }}>
              <Camera size={48} color="var(--info)" />
              <h3>Unggah Foto</h3>
              <p className="text-muted">Upload foto tanaman/daun untuk dianalisis AI secara otomatis</p>
            </div>
          </div>
        </div>
      )}

      {/* Step 1: Pilih Tanaman */}
      {step === 1 && (
        <div className="diagnosa-step-content animate-fade-in">
          <h2>Pilih Jenis Tanaman {mode === 'foto' && <span className="text-muted" style={{ fontSize: '0.85rem', fontWeight: 400 }}>(opsional)</span>}</h2>
          <p className="text-muted">Pilih tanaman untuk membantu diagnosa lebih akurat.</p>
          {loadingGejala ? (
            <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}><Loader size={20} className="spin" /> Memuat data...</p>
          ) : (
            <div className="plant-select-grid">
              {gejalaData.map(g => (
                <div key={g.plant} className={`plant-select-card glass-panel ${selectedPlant === g.plant ? 'selected' : ''}`}
                  onClick={() => setSelectedPlant(selectedPlant === g.plant ? '' : g.plant)}>
                  <span className="plant-emoji">{plantIcons[g.plant] || '🌿'}</span>
                  <h3>{g.plant}</h3>
                  {mode === 'gejala' && <span className="symptom-count">{g.symptoms.length} gejala</span>}
                </div>
              ))}
            </div>
          )}
          <div className="step-actions">
            <button className="btn-secondary" onClick={() => { setStep(0); setMode(null); setSelectedPlant(''); }}>Kembali</button>
            <button className="btn-primary" disabled={mode === 'gejala' && !selectedPlant} onClick={() => setStep(2)}>
              Lanjutkan <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Step 2A: Pilih Gejala */}
      {step === 2 && mode === 'gejala' && (
        <div className="diagnosa-step-content animate-fade-in">
          <h2>Pilih Gejala pada {plantIcons[selectedPlant]} {selectedPlant}</h2>
          <p className="text-muted">Centang semua gejala yang Anda amati ({selectedSymptoms.length} dipilih).</p>
          <div className="symptom-grid">
            {currentSymptoms.map((symptom, i) => (
              <div key={i} className={`symptom-chip ${selectedSymptoms.includes(symptom) ? 'active' : ''}`} onClick={() => toggleSymptom(symptom)}>
                <div className="chip-check">
                  {selectedSymptoms.includes(symptom) ? <CheckCircle size={18} /> : <div className="chip-empty"></div>}
                </div>
                <span>{symptom}</span>
              </div>
            ))}
          </div>
          <div className="step-actions">
            <button className="btn-secondary" onClick={() => { setStep(1); setSelectedSymptoms([]); }}>Kembali</button>
            <button className="btn-primary" disabled={selectedSymptoms.length === 0 || loading} onClick={handleAnalyzeGejala}>
              {loading ? <><Loader size={18} className="spin" /> Menganalisis...</> : <>Mulai Diagnosa <Stethoscope size={18} /></>}
            </button>
          </div>
        </div>
      )}

      {/* Step 2B: Upload Foto */}
      {step === 2 && mode === 'foto' && (
        <div className="diagnosa-step-content animate-fade-in">
          <h2>Unggah Foto Tanaman</h2>
          <p className="text-muted">Upload foto daun, batang, atau buah tanaman yang ingin didiagnosa.</p>

          {!photoPreview ? (
            <div className="photo-upload-area glass-panel" onClick={() => fileRef.current?.click()}>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={handlePhotoSelect} />
              <UploadCloud size={56} color="var(--emerald-primary)" />
              <h3>Klik untuk memilih foto</h3>
              <p className="text-muted">Atau drag & drop di sini (JPG, PNG — Max 5MB)</p>
            </div>
          ) : (
            <div className="photo-preview-container">
              <div className="photo-preview glass-panel">
                <img src={photoPreview} alt="Preview tanaman" />
                <button className="photo-remove" onClick={() => { setPhotoPreview(null); setPhotoBase64(null); }}>
                  <X size={18} />
                </button>
              </div>
              <p className="text-muted" style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                <Image size={14} style={{ verticalAlign: '-2px' }} /> Foto siap dianalisis oleh AI
              </p>
            </div>
          )}

          <div className="step-actions">
            <button className="btn-secondary" onClick={() => { setStep(1); setPhotoPreview(null); setPhotoBase64(null); }}>Kembali</button>
            <button className="btn-primary" disabled={!photoBase64 || loading} onClick={handleAnalyzePhoto}>
              {loading ? <><Loader size={18} className="spin" /> AI Menganalisis Foto...</> : <>Analisis Foto <Camera size={18} /></>}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Hasil */}
      {step === 3 && result && (
        <div className="diagnosa-step-content animate-fade-in">
          {result.diagnosis ? (
            <>
              <div className="diagnosa-result-card glass-panel">
                <div className="result-badge-row">
                  <div className="result-badge">
                    <Bug size={24} />
                    <span>Diagnosa Utama</span>
                  </div>
                  <span className={result.source?.includes('ai') ? 'ai-badge' : 'rule-badge'}>{sourceLabel(result.source)}</span>
                </div>
                <h2>{result.diagnosis.name}</h2>
                <div className="result-meta-row">
                  <span className="result-plant"><Leaf size={14} /> {result.diagnosis.plant}</span>
                  <span className="result-confidence" style={{ color: result.diagnosis.confidence >= 60 ? 'var(--emerald-primary)' : 'var(--warning)' }}>
                    Akurasi: {result.diagnosis.confidence}%
                  </span>
                  <span className="result-severity" style={{ color: severityColor(result.diagnosis.severity) }}>
                    <Shield size={14} /> {result.diagnosis.severity}
                  </span>
                </div>

                <div className="result-detail">
                  <p><strong>Penyebab:</strong> {result.diagnosis.cause}</p>
                  <p><strong>Gejala cocok:</strong> {result.diagnosis.matchedSymptoms.join(', ')}</p>
                  {result.diagnosis.explanation && (
                    <p className="ai-explanation"><strong>Analisis AI:</strong> {result.diagnosis.explanation}</p>
                  )}
                </div>

                <div className="recommendation">
                  <h4><AlertTriangle size={16} /> Rekomendasi Tindakan:</h4>
                  <ul>
                    {result.diagnosis.recommendations.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>

                {result.diagnosis.prevention && (
                  <div className="prevention-box">
                    <h4><Shield size={16} /> Pencegahan:</h4>
                    <p>{result.diagnosis.prevention}</p>
                  </div>
                )}
              </div>

              {result.alternatives && result.alternatives.length > 0 && (
                <div className="alt-diagnosa">
                  <h3>Kemungkinan Penyakit Lain</h3>
                  <div className="alt-grid">
                    {result.alternatives.map(alt => (
                      <div key={alt.id} className="alt-card glass-panel">
                        <div className="alt-header">
                          <h4>{alt.name}</h4>
                          <span className="alt-conf">{alt.confidence}%</span>
                        </div>
                        <p className="text-muted">{alt.cause}</p>
                        <p className="text-sm">Gejala cocok: {alt.matchedSymptoms.join(', ')}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="no-result glass-panel">
              <Stethoscope size={48} style={{ opacity: 0.3 }} />
              <h3>Tidak Ada Penyakit Terdeteksi</h3>
              <p className="text-muted">{result.message}</p>
            </div>
          )}

          <div className="step-actions">
            <button className="btn-primary" onClick={handleReset}>
              <RotateCcw size={18} /> Diagnosa Ulang
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
