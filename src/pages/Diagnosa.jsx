import React, { useState, useEffect } from 'react';
import { Stethoscope, CheckCircle, AlertTriangle, Loader, ChevronRight, RotateCcw, Shield, Bug, Leaf } from 'lucide-react';
import { getGejala, analyzeDiagnosa } from '../utils/api';
import './Ekstensi.css';

const plantIcons = { Padi: '🌾', Jagung: '🌽', Tomat: '🍅', Cabai: '🌶️', Kedelai: '🌱' };

export default function Diagnosa() {
  const [step, setStep] = useState(1); // 1: pilih tanaman, 2: pilih gejala, 3: hasil
  const [gejalaData, setGejalaData] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingGejala, setLoadingGejala] = useState(true);

  useEffect(() => {
    fetchGejala();
  }, []);

  const fetchGejala = async () => {
    try {
      const data = await getGejala();
      setGejalaData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingGejala(false);
    }
  };

  const currentSymptoms = gejalaData.find(g => g.plant === selectedPlant)?.symptoms || [];

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
    );
  };

  const handleAnalyze = async () => {
    if (selectedSymptoms.length === 0) return;
    setLoading(true);
    try {
      const data = await analyzeDiagnosa(selectedPlant, selectedSymptoms);
      setResult(data);
      setStep(3);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setSelectedPlant('');
    setSelectedSymptoms([]);
    setResult(null);
  };

  const severityColor = (s) => s === 'Sangat Tinggi' || s === 'Tinggi' ? 'var(--danger)' : s === 'Sedang' ? 'var(--warning)' : 'var(--emerald-primary)';

  return (
    <div className="extensi-container animate-fade-in">
      <div className="extensi-header">
        <h1 className="text-gradient">Diagnosa AI</h1>
        <p className="text-muted">Sistem pakar deteksi penyakit tanaman berbasis analisis gejala.</p>
      </div>

      {/* Progress Steps */}
      <div className="diagnosa-steps">
        <div className={`d-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'done' : ''}`}>
          <div className="step-num">1</div>
          <span>Pilih Tanaman</span>
        </div>
        <div className="step-line"></div>
        <div className={`d-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'done' : ''}`}>
          <div className="step-num">2</div>
          <span>Pilih Gejala</span>
        </div>
        <div className="step-line"></div>
        <div className={`d-step ${step >= 3 ? 'active' : ''}`}>
          <div className="step-num">3</div>
          <span>Hasil Diagnosa</span>
        </div>
      </div>

      {/* Step 1: Pilih Tanaman */}
      {step === 1 && (
        <div className="diagnosa-step-content animate-fade-in">
          <h2>Pilih Jenis Tanaman</h2>
          <p className="text-muted">Pilih tanaman yang ingin Anda diagnosa kesehatannya.</p>
          
          {loadingGejala ? (
            <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}><Loader size={20} className="spin" /> Memuat data...</p>
          ) : (
            <div className="plant-select-grid">
              {gejalaData.map(g => (
                <div
                  key={g.plant}
                  className={`plant-select-card glass-panel ${selectedPlant === g.plant ? 'selected' : ''}`}
                  onClick={() => setSelectedPlant(g.plant)}
                >
                  <span className="plant-emoji">{plantIcons[g.plant] || '🌿'}</span>
                  <h3>{g.plant}</h3>
                  <span className="symptom-count">{g.symptoms.length} gejala</span>
                </div>
              ))}
            </div>
          )}

          <div className="step-actions">
            <button className="btn-primary" disabled={!selectedPlant} onClick={() => setStep(2)}>
              Lanjutkan <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Pilih Gejala */}
      {step === 2 && (
        <div className="diagnosa-step-content animate-fade-in">
          <h2>Pilih Gejala pada {plantIcons[selectedPlant]} {selectedPlant}</h2>
          <p className="text-muted">Centang semua gejala yang Anda amati pada tanaman ({selectedSymptoms.length} dipilih).</p>

          <div className="symptom-grid">
            {currentSymptoms.map((symptom, i) => (
              <div
                key={i}
                className={`symptom-chip ${selectedSymptoms.includes(symptom) ? 'active' : ''}`}
                onClick={() => toggleSymptom(symptom)}
              >
                <div className="chip-check">
                  {selectedSymptoms.includes(symptom) ? <CheckCircle size={18} /> : <div className="chip-empty"></div>}
                </div>
                <span>{symptom}</span>
              </div>
            ))}
          </div>

          <div className="step-actions">
            <button className="btn-secondary" onClick={() => { setStep(1); setSelectedSymptoms([]); }}>Kembali</button>
            <button className="btn-primary" disabled={selectedSymptoms.length === 0 || loading} onClick={handleAnalyze}>
              {loading ? <><Loader size={18} className="spin" /> Menganalisis...</> : <>Mulai Diagnosa <Stethoscope size={18} /></>}
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
                  {result.source === 'ai' && (
                    <span className="ai-badge">🤖 AI — {result.model}</span>
                  )}
                  {result.source === 'rule-based' && (
                    <span className="rule-badge">📋 Expert System</span>
                  )}
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
