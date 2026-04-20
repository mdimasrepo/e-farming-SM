import React, { useState } from 'react';
import { BookOpen, Video, PlayCircle, Clock, ChevronRight, ArrowLeft, Search, Leaf, Bug, Droplets, Sun } from 'lucide-react';
import './Ekstensi.css';

const ARTICLES = [
  {
    id: 1, title: 'Teknik Pemupukan Berimbang untuk Padi Sawah', type: 'Artikel', category: 'Pupuk', icon: Leaf, readTime: '8 menit',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    content: `Pemupukan berimbang adalah kunci keberhasilan budidaya padi sawah. Berikut panduan lengkapnya:\n\n**1. Pupuk Dasar (Sebelum Tanam)**\nBerikan pupuk organik (kompos/pupuk kandang) sebanyak 2-3 ton/ha. Ini akan memperbaiki struktur tanah dan meningkatkan kapasitas tanah menahan air.\n\n**2. Pupuk Susulan Pertama (7-14 HST)**\nAplikasikan Urea 100 kg/ha + SP-36 100 kg/ha. Sebarkan merata saat kondisi macak-macak (air setinggi 2-3 cm).\n\n**3. Pupuk Susulan Kedua (21-28 HST)**\nBerikan Urea 50 kg/ha + KCl 50 kg/ha. Ini untuk mendukung fase vegetatif (pertumbuhan anakan).\n\n**4. Pupuk Susulan Ketiga (35-40 HST)**\nAplikasikan Urea 50 kg/ha + KCl 50 kg/ha. Pada fase ini tanaman membutuhkan kalium untuk pembentukan malai.\n\n**Tips Penting:**\n- Gunakan Leaf Color Chart (LCC) untuk menentukan kebutuhan nitrogen\n- Jangan memupuk saat hujan deras\n- Pupuk organik harus matang sempurna sebelum diaplikasikan\n- pH tanah optimal untuk padi adalah 5.5-7.0`,
  },
  {
    id: 2, title: 'Mengenal Hama Wereng dan Cara Pencegahannya', type: 'Artikel', category: 'Hama', icon: Bug, readTime: '6 menit',
    gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
    content: `Wereng Batang Coklat (WBC) adalah hama utama tanaman padi yang bisa menyebabkan kerugian besar.\n\n**Ciri-ciri Serangan:**\n- Tanaman menguning dari pangkal batang\n- Tampak embun jelaga pada daun\n- Tanaman rebah (hopperburn) pada serangan berat\n- Terdapat serangga kecil berwarna coklat di pangkal batang\n\n**Siklus Hidup:**\nWereng betina meletakkan telur di dalam jaringan pelepah daun. Satu betina dapat menghasilkan 100-300 telur. Siklus hidup lengkap sekitar 25-30 hari.\n\n**Pencegahan:**\n1. Gunakan varietas tahan wereng (Inpari 13, Ciherang, Mekongga)\n2. Atur jarak tanam 25x25 cm untuk sirkulasi udara\n3. Hindari penggunaan insektisida piretroid (mematikan musuh alami)\n4. Terapkan pengairan berselang (intermittent irrigation)\n5. Pasang lampu perangkap untuk monitoring populasi\n\n**Pengendalian:**\n- Semprotkan insektisida BPMC atau fipronil pada pangkal batang\n- Gunakan agen hayati Beauveria bassiana\n- Lepaskan predator alami: laba-laba, kumbang coccinella`,
  },
  {
    id: 3, title: 'Irigasi Tetes: Solusi Hemat Air untuk Lahan Kering', type: 'Artikel', category: 'Irigasi', icon: Droplets, readTime: '7 menit',
    gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    content: `Irigasi tetes adalah metode pemberian air langsung ke zona perakaran tanaman melalui emitter/dripper.\n\n**Keuntungan Irigasi Tetes:**\n- Hemat air hingga 50-70% dibanding irigasi konvensional\n- Mengurangi gulma karena hanya area perakaran yang basah\n- Dapat dikombinasikan dengan fertigasi (pupuk cair)\n- Mengurangi risiko penyakit karena daun tidak basah\n\n**Komponen Utama:**\n1. **Sumber air** — sumur, tangki, atau saluran\n2. **Filter** — saringan pasir atau disk filter\n3. **Mainline** — pipa utama PVC 2-3 inch\n4. **Lateral** — selang PE 16mm\n5. **Emitter/Dripper** — debit 2-4 liter/jam\n\n**Pemasangan Sederhana:**\n1. Hubungkan tangki air (elevasi 1-2 meter) ke filter\n2. Sambungkan ke pipa utama lalu ke lateral\n3. Pasang dripper sesuai jarak tanam\n4. Atur jadwal penyiraman: pagi dan sore, 15-30 menit\n\n**Cocok untuk:**\nCabai, tomat, melon, semangka, stroberi, dan tanaman hortikultura lainnya.`,
  },
  {
    id: 4, title: 'Cara Membuat Pupuk Kompos dari Limbah Pertanian', type: 'Artikel', category: 'Pupuk', icon: Leaf, readTime: '5 menit',
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    content: `Pupuk kompos berkualitas bisa dibuat dari limbah pertanian di sekitar Anda.\n\n**Bahan yang Dibutuhkan:**\n- Jerami padi atau sisa tanaman (karbon/coklat)\n- Kotoran ternak sapi/kambing (nitrogen/hijau)\n- EM4 atau MOL (mikroorganisme lokal)\n- Air secukupnya\n- Gula/molase 2 sendok makan\n\n**Langkah Pembuatan:**\n1. Cacah jerami dan sisa tanaman menjadi ukuran 5-10 cm\n2. Susun secara berlapis: bahan coklat → kotoran ternak → bahan coklat (rasio 3:1)\n3. Siramkan larutan EM4 (10ml EM4 + 2 sdm gula + 1 liter air) ke setiap lapisan\n4. Tutup dengan terpal, buat lubang ventilasi\n5. Balik setiap 7 hari sekali\n6. Jaga kelembaban 40-60% (peras: air menetes sedikit = pas)\n\n**Tanda Kompos Matang (30-45 hari):**\n- Warna hitam kecoklatan\n- Tidak berbau\n- Suhu sama dengan suhu kamar\n- Tekstur remah dan gembur\n\n**Dosis Penggunaan:**\n- Padi: 2-3 ton/ha\n- Sayuran: 5-10 ton/ha\n- Tanaman buah: 5-10 kg/pohon`,
  },
  {
    id: 5, title: 'Panduan Budidaya Cabai Rawit Produktif', type: 'Artikel', category: 'Budidaya', icon: Sun, readTime: '10 menit',
    gradient: 'linear-gradient(135deg, #f43f5e, #e11d48)',
    content: `Cabai rawit memiliki nilai ekonomi tinggi dan bisa dibudidayakan di lahan terbatas.\n\n**Persiapan:**\n- Benih varietas unggul (Dewata, Bara, Cakra Hijau)\n- Semai di tray selama 21-25 hari\n- Siapkan bedengan lebar 100 cm, tinggi 30 cm\n- Pasang mulsa plastik hitam perak\n\n**Penanaman:**\n- Jarak tanam: 50x60 cm\n- Tanam sore hari untuk mengurangi stress\n- Berikan furadan di lubang tanam untuk pencegahan hama\n\n**Pemeliharaan:**\n1. **Penyiraman**: 2x sehari (pagi & sore), gunakan irigasi tetes jika memungkinkan\n2. **Pemupukan**: NPK 15-15-15 setiap 2 minggu + pupuk daun\n3. **Pewiwilan**: Buang tunas air di bawah percabangan pertama\n4. **Ajir**: Pasang ajir bambu tinggi 80-100 cm saat umur 3 minggu\n\n**Pengendalian Hama:**\n- Kutu kebul → mulsa perak + perangkap kuning + imidakloprid\n- Antraknosa → fungisida mankozeb + jarak tanam optimal\n- Thrips → insektisida abamektin\n\n**Panen:**\n- Mulai panen umur 75-85 HST\n- Panen setiap 3-5 hari\n- Produktivitas: 8-15 ton/ha per musim`,
  },
  {
    id: 6, title: 'Mengenal Teknologi Pertanian Presisi (Precision Farming)', type: 'Artikel', category: 'Teknologi', icon: Sun, readTime: '6 menit',
    gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)',
    content: `Pertanian presisi menggunakan teknologi untuk mengoptimalkan input dan hasil pertanian.\n\n**Komponen Utama:**\n1. **Sensor Tanah** — mengukur pH, kelembaban, dan nutrisi tanah secara real-time\n2. **Drone Pertanian** — pemetaan lahan, pemantauan tanaman, dan penyemprotan presisi\n3. **IoT & Otomasi** — sistem irigasi otomatis berdasarkan data sensor\n4. **GPS & GIS** — pemetaan zona manajemen lahan\n5. **AI & Machine Learning** — prediksi cuaca, deteksi penyakit dari foto\n\n**Manfaat:**\n- Efisiensi pupuk hingga 30% dengan aplikasi variabel rate\n- Deteksi dini penyakit tanaman melalui analisis citra\n- Pengurangan penggunaan pestisida hingga 50%\n- Penghematan air irigasi dengan sensor kelembaban\n\n**Aplikasi Tani.Smart:**\nAplikasi ini merupakan contoh implementasi pertanian presisi yang terjangkau:\n- Diagnosa penyakit tanaman dengan AI Vision\n- Monitoring cuaca real-time per lokasi\n- Manajemen jadwal perawatan terstruktur\n- Pencatatan inventori dan laporan produktivitas\n\n**Masa Depan:**\nPertanian presisi diprediksi akan menjadi standar dalam 5-10 tahun ke depan, terutama dengan semakin terjangkaunya sensor IoT dan layanan cloud computing.`,
  },
];

export default function Edukasi() {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');

  const categories = ['Semua', ...new Set(ARTICLES.map(a => a.category))];

  const filtered = ARTICLES.filter(a => {
    const matchCategory = activeCategory === 'Semua' || a.category === activeCategory;
    const matchSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  if (selectedArticle) {
    const Icon = selectedArticle.icon;
    return (
      <div className="extensi-container animate-fade-in">
        <button className="btn-secondary" style={{ marginBottom: '1rem' }} onClick={() => setSelectedArticle(null)}>
          <ArrowLeft size={16} /> Kembali
        </button>

        <div className="article-detail glass-panel">
          <div className="article-hero" style={{ background: selectedArticle.gradient }}>
            <Icon size={48} color="rgba(255,255,255,0.9)" />
          </div>
          <div className="article-body">
            <span className="edu-tag">{selectedArticle.category}</span>
            <h1>{selectedArticle.title}</h1>
            <div className="article-meta">
              <span><Clock size={14} /> {selectedArticle.readTime}</span>
              <span>{selectedArticle.type}</span>
            </div>
            <div className="article-content">
              {selectedArticle.content.split('\n').map((line, i) => {
                // Clean all asterisks for display
                const clean = (txt) => txt.replace(/\*+/g, '');
                
                if (line.startsWith('**') && line.endsWith('**')) return <h3 key={i}>{clean(line)}</h3>;
                if (line.startsWith('- ')) return <li key={i}>{clean(line.slice(2))}</li>;
                if (line.match(/^\d+\.\s/)) return <li key={i} className="numbered">{clean(line)}</li>;
                if (line.trim() === '') return <br key={i} />;
                
                // Split on **bold** patterns, render bold parts as <strong>
                const parts = line.split(/\*\*(.*?)\*\*/g);
                return <p key={i}>{parts.map((part, j) => 
                  j % 2 === 1 ? <strong key={j}>{part}</strong> : part.replace(/\*/g, '')
                )}</p>;
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="extensi-container animate-fade-in">
      <div className="extensi-header">
        <h1 className="text-gradient">Pusat Edukasi</h1>
        <p className="text-muted">Tingkatkan wawasan bertani Anda dengan materi pilihan dari para ahli.</p>
      </div>

      <div className="edu-toolbar">
        <div className="edu-search glass-panel">
          <Search size={18} />
          <input type="text" placeholder="Cari artikel..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <div className="edu-categories">
          {categories.map(cat => (
            <button key={cat} className={`cat-btn ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(cat)}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="edu-grid">
        {filtered.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="edu-card glass-panel" onClick={() => setSelectedArticle(item)}>
              <div className="edu-thumbnail" style={{ background: item.gradient }}>
                <Icon size={36} color="rgba(255,255,255,0.7)" />
              </div>
              <div className="edu-content">
                <span className="edu-tag">{item.category}</span>
                <h3>{item.title}</h3>
                <p className="text-muted"><Clock size={12} /> {item.readTime} • {item.type}</p>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="no-result glass-panel">
          <BookOpen size={48} style={{ opacity: 0.3 }} />
          <h3>Artikel Tidak Ditemukan</h3>
          <p className="text-muted">Coba kata kunci atau kategori lain.</p>
        </div>
      )}
    </div>
  );
}
