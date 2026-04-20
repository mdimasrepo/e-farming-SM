import { Router } from 'express';

const router = Router();

// Database penyakit tanaman — Expert System berbasis gejala (fallback)
const DISEASES = [
  {
    id: 1, name: 'Bercak Daun (Blast)', plant: 'Padi', cause: 'Jamur Pyricularia oryzae',
    symptoms: ['bercak coklat pada daun', 'daun menguning', 'bintik berlian pada daun', 'leher malai membusuk', 'daun mengering'],
    severity: 'Tinggi',
    recommendations: ['Semprotkan fungisida berbahan aktif trisiklazol atau isoprotiolan.', 'Kurangi pemberian pupuk nitrogen/urea berlebih.', 'Jaga sirkulasi air pada area lahan.', 'Gunakan varietas padi tahan blast seperti Inpari 30, Inpari 33.', 'Lakukan pergiliran tanaman setiap musim.'],
  },
  {
    id: 2, name: 'Hawar Daun Bakteri (HDB)', plant: 'Padi', cause: 'Bakteri Xanthomonas oryzae pv. oryzae',
    symptoms: ['daun menguning dari ujung', 'lesi berair pada daun', 'daun layu', 'eksudat bakteri berwarna kuning', 'bau pada daun'],
    severity: 'Tinggi',
    recommendations: ['Semprotkan bakterisida berbahan aktif streptomisin.', 'Tanam varietas tahan HDB (Inpari 1, Ciherang).', 'Atur jarak tanam agar tidak terlalu rapat.', 'Hindari pemupukan nitrogen berlebih.', 'Buang tanaman yang sudah terinfeksi parah.'],
  },
  {
    id: 3, name: 'Bulai (Downy Mildew)', plant: 'Jagung', cause: 'Jamur Peronosclerospora maydis',
    symptoms: ['garis kuning/putih pada daun', 'daun menggulung', 'tanaman kerdil', 'daun pucat berjalur', 'serbuk putih pada daun'],
    severity: 'Tinggi',
    recommendations: ['Semprotkan fungisida metalaksil saat pagi hari.', 'Gunakan benih berlabel yang sudah diperlakukan fungisida.', 'Cabut dan musnahkan tanaman terinfeksi segera.', 'Lakukan rotasi tanaman minimal 2 musim.', 'Tanam varietas tahan bulai (BISI-18, NK-33).'],
  },
  {
    id: 4, name: 'Karat Daun', plant: 'Jagung', cause: 'Jamur Puccinia sorghi',
    symptoms: ['bintik karat orange pada daun', 'pustul coklat kemerahan', 'daun mengering', 'daun menguning', 'tanaman layu'],
    severity: 'Sedang',
    recommendations: ['Semprotkan fungisida mancozeb atau propikonazol.', 'Tanam varietas jagung yang tahan karat.', 'Bersihkan sisa-sisa tanaman setelah panen.', 'Atur jarak tanam yang optimal.', 'Pemupukan berimbang terutama kalium.'],
  },
  {
    id: 5, name: 'Layu Fusarium', plant: 'Tomat', cause: 'Jamur Fusarium oxysporum f.sp. lycopersici',
    symptoms: ['daun bagian bawah menguning', 'tanaman layu saat siang', 'batang coklat jika dibelah', 'layu satu sisi tanaman', 'akar membusuk'],
    severity: 'Tinggi',
    recommendations: ['Cabut dan musnahkan tanaman terinfeksi.', 'Berikan Trichoderma sp. pada tanah sebelum tanam.', 'Perbaiki drainase lahan agar tidak tergenang.', 'Lakukan rotasi tanaman minimal 3 tahun.', 'Gunakan benih yang sudah diberi fungisida.'],
  },
  {
    id: 6, name: 'Busuk Buah Antraknosa', plant: 'Cabai', cause: 'Jamur Colletotrichum capsici',
    symptoms: ['bercak hitam cekung pada buah', 'buah membusuk', 'buah keriting', 'bintik coklat pada daun', 'buah gugur sebelum matang'],
    severity: 'Tinggi',
    recommendations: ['Semprotkan fungisida mankozeb secara berkala.', 'Panen buah sesegera mungkin saat matang.', 'Bersihkan buah jatuh dan sisa tanaman.', 'Atur jarak tanam agar sirkulasi udara baik.', 'Gunakan mulsa plastik untuk mengurangi percikan air.'],
  },
  {
    id: 7, name: 'Virus Kuning (Gemini Virus)', plant: 'Cabai', cause: 'Begomovirus ditularkan kutu kebul (Bemisia tabaci)',
    symptoms: ['daun menguning dan mengkerut', 'daun menggulung ke atas', 'tanaman kerdil', 'buah kecil dan sedikit', 'kutu kebul pada daun'],
    severity: 'Tinggi',
    recommendations: ['Kendalikan kutu kebul dengan insektisida imidakloprid.', 'Gunakan mulsa perak untuk mengusir kutu kebul.', 'Pasang perangkap kuning berperekat.', 'Cabut tanaman terinfeksi segera.', 'Tanam tanaman penghalang di sekeliling lahan.'],
  },
  {
    id: 8, name: 'Karat Daun Kedelai', plant: 'Kedelai', cause: 'Jamur Phakopsora pachyrhizi',
    symptoms: ['bintik kecil keabu-abuan pada daun', 'daun menguning', 'daun gugur prematur', 'pustul pada permukaan bawah daun', 'tanaman layu'],
    severity: 'Sedang',
    recommendations: ['Semprotkan fungisida trifloksistrobin + tebukonazol.', 'Tanam varietas tahan karat (Anjasmoro).', 'Lakukan monitoring rutin setiap minggu.', 'Tanam pada awal musim untuk menghindari puncak serangan.', 'Bersihkan gulma di sekitar lahan.'],
  },
  {
    id: 9, name: 'Wereng Batang Coklat', plant: 'Padi', cause: 'Hama Nilaparvata lugens',
    symptoms: ['tanaman menguning dari bawah', 'batang padi coklat', 'tanaman rebah (hopperburn)', 'embun jelaga pada tanaman', 'serangga kecil di pangkal batang'],
    severity: 'Sangat Tinggi',
    recommendations: ['Semprotkan insektisida BPMC atau fipronil pada pangkal batang.', 'Gunakan varietas tahan wereng (Inpari 13, Ciherang).', 'Hindari penanaman serempak skala luas.', 'Jangan gunakan insektisida piretroid (memicu ledakan populasi).', 'Atur pengairan berselang (intermittent irrigation).'],
  },
  {
    id: 10, name: 'Penggerek Batang Jagung', plant: 'Jagung', cause: 'Hama Ostrinia furnacalis',
    symptoms: ['lubang pada batang', 'serbuk gerek pada batang', 'batang patah', 'tongkol rusak dan berlubang', 'tanaman layu tiba-tiba'],
    severity: 'Sedang',
    recommendations: ['Aplikasikan insektisida karbofuran pada pucuk tanaman.', 'Gunakan perangkap feromon untuk memantau populasi.', 'Bersihkan sisa tanaman setelah panen.', 'Tanam serempak dalam satu hamparan.', 'Pelepasan parasitoid Trichogramma sp. sebagai agen hayati.'],
  },
];

// Rule-based fallback
function ruleBasedDiagnosis(plant, symptoms) {
  let results = DISEASES.map(disease => {
    if (plant && disease.plant !== plant) return null;
    const matchedSymptoms = disease.symptoms.filter(s => symptoms.includes(s));
    const score = matchedSymptoms.length / disease.symptoms.length;
    const confidence = Math.round(score * 100);
    return {
      id: disease.id, name: disease.name, plant: disease.plant, cause: disease.cause,
      severity: disease.severity, confidence, matchedSymptoms, totalSymptoms: disease.symptoms.length,
      recommendations: disease.recommendations,
    };
  }).filter(Boolean);

  results.sort((a, b) => b.confidence - a.confidence);
  results = results.filter(r => r.confidence > 0).slice(0, 3);

  if (results.length === 0) {
    return { diagnosis: null, message: 'Tidak ditemukan penyakit yang cocok. Silakan konsultasi dengan pakar pertanian.', source: 'rule-based' };
  }

  return { diagnosis: results[0], alternatives: results.slice(1), source: 'rule-based', analyzedAt: new Date().toISOString() };
}

// OpenRouter AI analysis
async function aiDiagnosis(plant, symptoms) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey || apiKey === 'your_openrouter_api_key_here') {
    return null; // Fallback ke rule-based
  }

  const prompt = `Kamu adalah sistem pakar diagnosa penyakit tanaman pertanian di Indonesia. Analisis gejala berikut dan berikan diagnosa dalam format JSON.

Tanaman: ${plant}
Gejala yang diamati: ${symptoms.join(', ')}

Berikan respons HANYA dalam format JSON berikut (tanpa markdown, tanpa penjelasan tambahan):
{
  "name": "Nama penyakit",
  "cause": "Penyebab penyakit",
  "severity": "Rendah/Sedang/Tinggi/Sangat Tinggi",
  "confidence": 85,
  "explanation": "Penjelasan singkat mengapa gejala ini mengarah ke penyakit tersebut",
  "recommendations": [
    "Rekomendasi tindakan 1",
    "Rekomendasi tindakan 2",
    "Rekomendasi tindakan 3",
    "Rekomendasi tindakan 4",
    "Rekomendasi tindakan 5"
  ],
  "prevention": "Tips pencegahan di masa depan"
}`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:5000',
        'X-Title': 'Tani.Smart Diagnosa AI',
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b:free',
        messages: [
          { role: 'system', content: 'Kamu adalah ahli pertanian Indonesia yang sangat berpengalaman dalam diagnosa penyakit tanaman. Jawab selalu dalam bahasa Indonesia dan format JSON.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 800,
      }),
    });

    const data = await response.json();

    if (!data.choices || data.choices.length === 0) {
      console.error('OpenRouter: no choices returned', data);
      return null;
    }

    const content = data.choices[0].message.content.trim();

    // Parse JSON dari respons AI
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('OpenRouter: invalid JSON response');
      return null;
    }

    const aiResult = JSON.parse(jsonMatch[0]);

    return {
      diagnosis: {
        name: aiResult.name,
        plant,
        cause: aiResult.cause,
        severity: aiResult.severity,
        confidence: aiResult.confidence || 85,
        matchedSymptoms: symptoms,
        totalSymptoms: symptoms.length,
        recommendations: aiResult.recommendations || [],
        explanation: aiResult.explanation || '',
        prevention: aiResult.prevention || '',
      },
      alternatives: [],
      source: 'ai',
      model: 'openai/gpt-oss-120b:free',
      analyzedAt: new Date().toISOString(),
    };

  } catch (err) {
    console.error('OpenRouter AI error:', err.message);
    return null;
  }
}

// GET /api/diagnosa/gejala
router.get('/gejala', (req, res) => {
  const byPlant = {};
  DISEASES.forEach(d => {
    if (!byPlant[d.plant]) byPlant[d.plant] = new Set();
    d.symptoms.forEach(s => byPlant[d.plant].add(s));
  });

  const result = Object.entries(byPlant).map(([plant, symptoms]) => ({
    plant,
    symptoms: [...symptoms],
  }));

  res.json(result);
});

// POST /api/diagnosa/analyze
router.post('/analyze', async (req, res) => {
  try {
    const { plant, symptoms } = req.body;

    if (!symptoms || symptoms.length === 0) {
      return res.status(400).json({ error: 'Pilih minimal 1 gejala untuk diagnosa.' });
    }

    // Coba AI dulu, fallback ke rule-based
    const aiResult = await aiDiagnosis(plant, symptoms);

    if (aiResult) {
      return res.json(aiResult);
    }

    // Fallback: rule-based expert system
    const ruleResult = ruleBasedDiagnosis(plant, symptoms);
    return res.json(ruleResult);

  } catch (err) {
    console.error('Diagnosa error:', err);
    res.status(500).json({ error: 'Gagal melakukan diagnosa.' });
  }
});

export default router;
