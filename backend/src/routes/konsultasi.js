import { Router } from 'express';

const router = Router();

// POST /api/konsultasi/chat — Chat dengan AI Pakar Pertanian
router.post('/chat', async (req, res) => {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey || apiKey.includes('your_')) {
      return res.status(503).json({ error: 'API AI belum dikonfigurasi.' });
    }

    const { message, history, pakarType } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Pesan tidak boleh kosong.' });
    }

    const pakarProfiles = {
      'hama': 'Kamu adalah Dr. Ir. Wahyudi, ahli hama dan penyakit tanaman di Indonesia dengan pengalaman 20 tahun. Kamu sangat berpengetahuan tentang pengendalian hama terpadu (PHT), pestisida organik, dan biologis.',
      'tanah': 'Kamu adalah Siti Aminah, SP., M.Si, ahli manajemen tanah dan pemupukan. Kamu sangat berpengetahuan tentang kesuburan tanah, pupuk organik & anorganik, pH tanah, dan teknik konservasi lahan.',
      'padi': 'Kamu adalah Budi Santoso, M.Si, penyuluh pertanian senior spesialis padi dan palawija. Kamu sangat berpengetahuan tentang varietas padi unggul, teknik budidaya SRI, dan penanganan pasca panen.',
      'umum': 'Kamu adalah ahli pertanian Indonesia yang berpengalaman luas di berbagai bidang pertanian termasuk hortikultura, tanaman pangan, perkebunan, dan peternakan.',
    };

    const systemPrompt = `${pakarProfiles[pakarType] || pakarProfiles['umum']}

Aturan:
- Jawab selalu dalam bahasa Indonesia yang ramah dan mudah dipahami petani
- Berikan jawaban praktis dan actionable
- Jika ditanya di luar bidang pertanian, arahkan kembali ke topik pertanian
- Gunakan emoji sesekali untuk membuat percakapan lebih hidup
- Jawaban singkat dan padat, maksimal 3 paragraf`;

    // Build message history
    const messages = [{ role: 'system', content: systemPrompt }];
    
    if (history && Array.isArray(history)) {
      history.slice(-6).forEach(h => {
        messages.push({ role: h.role, content: h.content });
      });
    }
    
    messages.push({ role: 'user', content: message });

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:5000',
        'X-Title': 'Tani.Smart Konsultasi',
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b:free',
        messages,
        temperature: 0.7,
        max_tokens: 600,
      }),
    });

    const data = await response.json();

    if (!data.choices?.[0]) {
      console.error('Konsultasi AI error:', data);
      return res.status(503).json({ error: 'AI sedang tidak tersedia, coba lagi nanti.' });
    }

    res.json({
      reply: data.choices[0].message.content.trim(),
      timestamp: new Date().toISOString(),
    });

  } catch (err) {
    console.error('Konsultasi error:', err);
    res.status(500).json({ error: 'Gagal memproses konsultasi.' });
  }
});

export default router;
