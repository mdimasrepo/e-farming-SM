import { Router } from 'express';
import { db } from '../db/index.js';
import { konsultasiPakar } from '../db/schema.js';
import { eq } from 'drizzle-orm';

const router = Router();

// GET list pakar (Public)
router.get('/pakar', async (req, res) => {
  try {
    const pakar = await db.select().from(konsultasiPakar);
    res.json(pakar);
  } catch (err) {
    res.status(500).json({ error: 'Gagal memuat daftar pakar' });
  }
});

// POST /chat — Chat dengan AI Pakar Pertanian
router.post('/chat', async (req, res) => {
  try {
    const apiKey = global.CUSTOM_API_KEY || process.env.OPENROUTER_API_KEY;
    console.log('[Konsultasi] API Key found:', apiKey ? apiKey.substring(0, 15) + '...' : 'NONE');
    if (!apiKey) {
      return res.status(503).json({ error: 'API AI belum dikonfigurasi.' });
    }

    const { message, history, pakarId } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Pesan tidak boleh kosong.' });
    }

    // Get pakar prompt from DB
    let systemPrompt = 'Kamu adalah ahli pertanian Indonesia yang berpengalaman luas.';
    if (pakarId) {
      try {
        const pakarRecords = await db.select().from(konsultasiPakar).where(eq(konsultasiPakar.id, parseInt(pakarId)));
        if (pakarRecords.length > 0 && pakarRecords[0].prompt) {
          systemPrompt = pakarRecords[0].prompt;
        }
      } catch (dbErr) {
        console.warn('[Konsultasi] Could not fetch pakar prompt:', dbErr.message);
      }
    }

    const finalPrompt = `${systemPrompt}

Aturan:
- Jawab selalu dalam bahasa Indonesia yang ramah dan mudah dipahami petani
- Berikan jawaban praktis dan actionable
- Jika ditanya di luar bidang pertanian, arahkan kembali ke topik pertanian
- Gunakan emoji sesekali untuk membuat percakapan lebih hidup
- Jawaban singkat dan padat, maksimal 3 paragraf`;

    // Build message history
    const messages = [{ role: 'system', content: finalPrompt }];
    if (history && Array.isArray(history)) {
      history.slice(-6).forEach(h => {
        messages.push({ role: h.role, content: h.content });
      });
    }
    messages.push({ role: 'user', content: message });

    // Models confirmed working (tested 2026-06-27)
    const KONSULTASI_MODELS = [
      'google/gemma-4-31b-it:free',
      'openai/gpt-oss-20b:free',
      'nvidia/nemotron-3-ultra-550b-a55b:free',
      'nvidia/nemotron-3-super-120b-a12b:free',
      'liquid/lfm-2.5-1.2b-instruct:free',
    ];

    for (const model of KONSULTASI_MODELS) {
      try {
        console.log(`[Konsultasi] Trying model: ${model}`);
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://agrotani.railway.app',
            'X-Title': 'Agro.Tani Konsultasi',
          },
          body: JSON.stringify({
            model,
            messages,
            temperature: 0.7,
            max_tokens: 600,
          }),
        });

        const data = await response.json();

        if (!data.choices?.[0]) {
          console.error(`[Konsultasi] ${model} failed (HTTP ${response.status}):`, data.error?.message || JSON.stringify(data).substring(0, 150));
          continue;
        }

        console.log(`[Konsultasi] SUCCESS with ${model}`);
        return res.json({
          reply: data.choices[0].message.content.trim(),
          timestamp: new Date().toISOString(),
        });
      } catch (err) {
        console.error(`[Konsultasi] ${model} exception:`, err.message);
        continue;
      }
    }

    // All models failed
    console.error('[Konsultasi] All models exhausted. None responded successfully.');
    return res.status(503).json({ error: 'AI sedang tidak tersedia, coba lagi nanti.' });

  } catch (err) {
    console.error('[Konsultasi] Unhandled error:', err);
    res.status(500).json({ error: 'Gagal memproses konsultasi.' });
  }
});

export default router;
