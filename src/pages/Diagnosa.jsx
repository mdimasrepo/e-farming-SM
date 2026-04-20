import React, { useState } from 'react';
import { UploadCloud, CheckCircle, AlertTriangle } from 'lucide-react';
import './Ekstensi.css';

export default function Diagnosa() {
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleUpload = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setIsAnalyzed(true);
    }, 2000);
  };

  return (
    <div className="extensi-container animate-fade-in">
      <div className="extensi-header">
        <h1 className="text-gradient">Diagnosa AI</h1>
        <p className="text-muted">Deteksi penyakit tanaman secara otomatis dengan teknologi Computer Vision.</p>
      </div>

      <div className="diagnosa-layout">
        <div className="upload-area glass-panel">
          <input type="file" id="file-upload" className="file-input" hidden />
          <label htmlFor="file-upload" className="upload-label">
            <UploadCloud size={48} color="var(--emerald-primary)" />
            <h3>Upload Foto Tanaman/Daun</h3>
            <p className="text-muted">Drag & drop atau klik untuk memilih file (JPG, PNG)</p>
          </label>
          <button className="btn-primary" onClick={handleUpload} disabled={analyzing} style={{ marginTop: '1rem', width: '100%' }}>
            {analyzing ? 'Menganalisis...' : 'Mulai Diagnosa'}
          </button>
        </div>

        {isAnalyzed && (
          <div className="result-area glass-panel animate-fade-in">
            <div className="result-header">
              <CheckCircle color="var(--emerald-primary)" />
              <h3>Hasil Analisis: Bercak Daun (Blast)</h3>
            </div>
            <div className="result-body">
              <p><strong>Penyebab:</strong> Jamur Pyricularia oryzae</p>
              <p><strong>Akurasi AI:</strong> 94%</p>
              
              <div className="recommendation">
                <h4><AlertTriangle size={16} /> Rekomendasi Tindakan:</h4>
                <ul>
                  <li>Segera semprotkan fungisida berbahan aktif trisiklazol.</li>
                  <li>Kurangi pemberian pupuk urea.</li>
                  <li>Jaga sirkulasi air pada area lahan.</li>
                </ul>
              </div>
            </div>
            <button className="btn-primary" style={{ marginTop: '1rem' }}>Konsultasi dengan Pakar</button>
          </div>
        )}
      </div>
    </div>
  );
}
