import { Router } from 'express';

const router = Router();

// Database penyakit (expert system fallback)
const DISEASES = [
  { id: 1, name: 'Bercak Daun (Blast)', plant: 'Padi', cause: 'Jamur Pyricularia oryzae', symptoms: ['bercak coklat pada daun', 'daun menguning', 'bintik berlian pada daun', 'leher malai membusuk', 'daun mengering'], severity: 'Tinggi', recommendations: ['Semprotkan fungisida berbahan aktif trisiklazol.', 'Kurangi pemberian pupuk nitrogen/urea berlebih.', 'Jaga sirkulasi air pada area lahan.', 'Gunakan varietas padi tahan blast.', 'Lakukan pergiliran tanaman setiap musim.'] },
  { id: 2, name: 'Hawar Daun Bakteri (HDB)', plant: 'Padi', cause: 'Bakteri Xanthomonas oryzae', symptoms: ['daun menguning dari ujung', 'lesi berair pada daun', 'daun layu', 'eksudat bakteri berwarna kuning', 'bau pada daun'], severity: 'Tinggi', recommendations: ['Semprotkan bakterisida streptomisin.', 'Tanam varietas tahan HDB.', 'Atur jarak tanam.', 'Hindari pemupukan nitrogen berlebih.', 'Buang tanaman terinfeksi parah.'] },
  { id: 3, name: 'Bulai (Downy Mildew)', plant: 'Jagung', cause: 'Jamur Peronosclerospora maydis', symptoms: ['garis kuning/putih pada daun', 'daun menggulung', 'tanaman kerdil', 'daun pucat berjalur', 'serbuk putih pada daun'], severity: 'Tinggi', recommendations: ['Semprotkan fungisida metalaksil.', 'Gunakan benih berlabel.', 'Cabut tanaman terinfeksi.', 'Rotasi tanaman minimal 2 musim.', 'Tanam varietas tahan bulai.'] },
  { id: 4, name: 'Karat Daun', plant: 'Jagung', cause: 'Jamur Puccinia sorghi', symptoms: ['bintik karat orange pada daun', 'pustul coklat kemerahan', 'daun mengering', 'daun menguning', 'tanaman layu'], severity: 'Sedang', recommendations: ['Semprotkan fungisida mancozeb.', 'Tanam varietas tahan karat.', 'Bersihkan sisa tanaman.', 'Atur jarak tanam optimal.', 'Pemupukan berimbang kalium.'] },
  { id: 5, name: 'Layu Fusarium', plant: 'Tomat', cause: 'Jamur Fusarium oxysporum', symptoms: ['daun bagian bawah menguning', 'tanaman layu saat siang', 'batang coklat jika dibelah', 'layu satu sisi tanaman', 'akar membusuk'], severity: 'Tinggi', recommendations: ['Cabut tanaman terinfeksi.', 'Berikan Trichoderma sp.', 'Perbaiki drainase lahan.', 'Rotasi tanaman 3 tahun.', 'Gunakan benih berfungisida.'] },
  { id: 6, name: 'Busuk Buah Antraknosa', plant: 'Cabai', cause: 'Jamur Colletotrichum capsici', symptoms: ['bercak hitam cekung pada buah', 'buah membusuk', 'buah keriting', 'bintik coklat pada daun', 'buah gugur sebelum matang'], severity: 'Tinggi', recommendations: ['Semprotkan fungisida mankozeb.', 'Panen segera saat matang.', 'Bersihkan buah jatuh.', 'Atur jarak tanam.', 'Gunakan mulsa plastik.'] },
  { id: 7, name: 'Virus Kuning (Gemini Virus)', plant: 'Cabai', cause: 'Begomovirus via kutu kebul', symptoms: ['daun menguning dan mengkerut', 'daun menggulung ke atas', 'tanaman kerdil', 'buah kecil dan sedikit', 'kutu kebul pada daun'], severity: 'Tinggi', recommendations: ['Kendalikan kutu kebul.', 'Gunakan mulsa perak.', 'Pasang perangkap kuning.', 'Cabut tanaman terinfeksi.', 'Tanam tanaman penghalang.'] },
  { id: 8, name: 'Karat Daun Kedelai', plant: 'Kedelai', cause: 'Jamur Phakopsora pachyrhizi', symptoms: ['bintik kecil keabu-abuan pada daun', 'daun menguning', 'daun gugur prematur', 'pustul pada permukaan bawah daun', 'tanaman layu'], severity: 'Sedang', recommendations: ['Semprotkan fungisida trifloksistrobin.', 'Tanam varietas tahan karat.', 'Monitoring rutin tiap minggu.', 'Tanam awal musim.', 'Bersihkan gulma.'] },
  { id: 9, name: 'Wereng Batang Coklat', plant: 'Padi', cause: 'Hama Nilaparvata lugens', symptoms: ['tanaman menguning dari bawah', 'batang padi coklat', 'tanaman rebah (hopperburn)', 'embun jelaga pada tanaman', 'serangga kecil di pangkal batang'], severity: 'Sangat Tinggi', recommendations: ['Semprotkan insektisida BPMC/fipronil.', 'Gunakan varietas tahan wereng.', 'Hindari penanaman serempak.', 'Jangan gunakan piretroid.', 'Atur pengairan berselang.'] },
  { id: 10, name: 'Penggerek Batang Jagung', plant: 'Jagung', cause: 'Hama Ostrinia furnacalis', symptoms: ['lubang pada batang', 'serbuk gerek pada batang', 'batang patah', 'tongkol rusak dan berlubang', 'tanaman layu tiba-tiba'], severity: 'Sedang', recommendations: ['Aplikasikan insektisida karbofuran.', 'Gunakan perangkap feromon.', 'Bersihkan sisa tanaman.', 'Tanam serempak.', 'Pelepasan Trichogramma sp.'] },
];

// Rule-based fallback
function ruleBasedDiagnosis(plant, symptoms) {
  let results = DISEASES.map(disease => {
    if (plant && disease.plant !== plant) return null;
    const matched = disease.symptoms.filter(s => symptoms.includes(s));
    const confidence = Math.round((matched.length / disease.symptoms.length) * 100);
    return { id: disease.id, name: disease.name, plant: disease.plant, cause: disease.cause, severity: disease.severity, confidence, matchedSymptoms: matched, totalSymptoms: disease.symptoms.length, recommendations: disease.recommendations };
  }).filter(Boolean).sort((a, b) => b.confidence - a.confidence).filter(r => r.confidence > 0).slice(0, 3);

  if (results.length === 0) return { diagnosis: null, message: 'Tidak ditemukan penyakit yang cocok.', source: 'expert-system' };
  return { diagnosis: results[0], alternatives: results.slice(1), source: 'expert-system', analyzedAt: new Date().toISOString() };
}

// OpenRouter AI — text analysis
async function aiTextDiagnosis(plant, symptoms) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey || apiKey.includes('your_')) return null;

  const prompt = `Kamu adalah sistem pakar diagnosa penyakit tanaman pertanian di Indonesia. Analisis gejala berikut.

Tanaman: ${plant}
Gejala: ${symptoms.join(', ')}

Berikan respons HANYA dalam format JSON (tanpa markdown):
{"name":"Nama penyakit","cause":"Penyebab","severity":"Rendah/Sedang/Tinggi/Sangat Tinggi","confidence":85,"explanation":"Penjelasan singkat","recommendations":["Rekomendasi 1","Rekomendasi 2","Rekomendasi 3","Rekomendasi 4","Rekomendasi 5"],"prevention":"Tips pencegahan"}`;

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'HTTP-Referer': 'http://localhost:5000', 'X-Title': 'Tani.Smart' },
      body: JSON.stringify({ model: 'openai/gpt-oss-120b:free', messages: [{ role: 'system', content: 'Kamu ahli pertanian Indonesia. Jawab dalam bahasa Indonesia dan format JSON.' }, { role: 'user', content: prompt }], temperature: 0.3, max_tokens: 800 }),
    });
    const data = await res.json();
    if (!data.choices?.[0]) return null;
    const json = JSON.parse(data.choices[0].message.content.trim().match(/\{[\s\S]*\}/)?.[0]);
    return {
      diagnosis: { name: json.name, plant, cause: json.cause, severity: json.severity, confidence: json.confidence || 85, matchedSymptoms: symptoms, totalSymptoms: symptoms.length, recommendations: json.recommendations || [], explanation: json.explanation || '', prevention: json.prevention || '' },
      alternatives: [], source: 'ai', analyzedAt: new Date().toISOString(),
    };
  } catch (err) { console.error('AI text error:', err.message); return null; }
}

// OpenRouter AI — vision/photo analysis
async function aiPhotoDiagnosis(imageBase64, plantHint) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey || apiKey.includes('your_')) return null;

  const prompt = `Kamu adalah sistem pakar diagnosa penyakit tanaman pertanian di Indonesia. Analisis foto tanaman ini secara detail.
${plantHint ? `Petunjuk: tanaman ini kemungkinan ${plantHint}.` : ''}

Identifikasi:
1. Jenis tanaman (jika terlihat)
2. Penyakit atau masalah yang terdeteksi
3. Tingkat keparahan
4. Penyebab

Berikan respons HANYA dalam format JSON (tanpa markdown):
{"plant":"Jenis tanaman","name":"Nama penyakit","cause":"Penyebab","severity":"Rendah/Sedang/Tinggi/Sangat Tinggi","confidence":85,"explanation":"Penjelasan detail dari analisis visual foto","recommendations":["Rekomendasi 1","Rekomendasi 2","Rekomendasi 3","Rekomendasi 4","Rekomendasi 5"],"prevention":"Tips pencegahan"}`;

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'HTTP-Referer': 'http://localhost:5000', 'X-Title': 'Tani.Smart' },
      body: JSON.stringify({
        model: 'google/gemma-4-31b-it:free',
        messages: [
          { role: 'system', content: 'Kamu ahli pertanian Indonesia yang sangat berpengalaman dalam mengidentifikasi penyakit tanaman dari foto. Jawab dalam bahasa Indonesia dan format JSON.' },
          { role: 'user', content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: imageBase64 } },
          ]},
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });
    const data = await res.json();
    if (!data.choices?.[0]) { console.error('Vision: no choices', data); return null; }
    const content = data.choices[0].message.content.trim();
    const json = JSON.parse(content.match(/\{[\s\S]*\}/)?.[0]);
    return {
      diagnosis: { name: json.name, plant: json.plant || plantHint || 'Tidak diketahui', cause: json.cause, severity: json.severity, confidence: json.confidence || 80, matchedSymptoms: ['Analisis visual foto'], totalSymptoms: 1, recommendations: json.recommendations || [], explanation: json.explanation || '', prevention: json.prevention || '' },
      alternatives: [], source: 'ai-vision', analyzedAt: new Date().toISOString(),
    };
  } catch (err) { console.error('AI vision error:', err.message); return null; }
}

// GET /api/diagnosa/gejala
router.get('/gejala', (req, res) => {
  const byPlant = {};
  DISEASES.forEach(d => { if (!byPlant[d.plant]) byPlant[d.plant] = new Set(); d.symptoms.forEach(s => byPlant[d.plant].add(s)); });
  res.json(Object.entries(byPlant).map(([plant, symptoms]) => ({ plant, symptoms: [...symptoms] })));
});

// POST /api/diagnosa/analyze — gejala-based
router.post('/analyze', async (req, res) => {
  try {
    const { plant, symptoms } = req.body;
    if (!symptoms || symptoms.length === 0) return res.status(400).json({ error: 'Pilih minimal 1 gejala.' });
    const aiResult = await aiTextDiagnosis(plant, symptoms);
    return res.json(aiResult || ruleBasedDiagnosis(plant, symptoms));
  } catch (err) { console.error('Diagnosa error:', err); res.status(500).json({ error: 'Gagal melakukan diagnosa.' }); }
});

// POST /api/diagnosa/photo — foto-based
router.post('/photo', async (req, res) => {
  try {
    const { image, plantHint } = req.body;
    if (!image) return res.status(400).json({ error: 'Foto tanaman harus diunggah.' });
    const result = await aiPhotoDiagnosis(image, plantHint);
    if (!result) return res.status(503).json({ error: 'AI Vision tidak tersedia. Pastikan API key OpenRouter sudah dikonfigurasi.' });
    return res.json(result);
  } catch (err) { console.error('Photo diagnosa error:', err); res.status(500).json({ error: 'Gagal menganalisis foto.' }); }
});

export default router;
