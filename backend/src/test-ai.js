import 'dotenv/config';

const apiKey = process.env.OPENROUTER_API_KEY;
console.log('API Key:', apiKey ? apiKey.substring(0, 20) + '...' : 'NOT FOUND');

// Use a tiny test image (1x1 pixel red PNG in base64)
const testImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI6QAAAABJRU5ErkJggg==';

const VISION_MODELS = [
  'nvidia/nemotron-nano-12b-v2-vl:free',
  'google/gemma-4-31b-it:free',
  'nvidia/nemotron-3-super-120b-a12b:free',
];

for (const model of VISION_MODELS) {
  console.log(`\nTesting vision: ${model}`);
  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://agrotani.railway.app',
        'X-Title': 'Agro.Tani',
      },
      body: JSON.stringify({
        model,
        messages: [{
          role: 'user',
          content: [
            { type: 'text', text: 'Apa yang kamu lihat di gambar ini? Jawab singkat.' },
            { type: 'image_url', image_url: { url: testImage } },
          ],
        }],
        max_tokens: 50,
      }),
    });
    const data = await res.json();
    if (data.choices?.[0]) {
      console.log('SUCCESS:', data.choices[0].message.content.trim().substring(0, 80));
    } else {
      console.log(`FAILED (HTTP ${res.status}):`, data.error?.message || JSON.stringify(data).substring(0, 150));
    }
  } catch (e) {
    console.log('ERROR:', e.message);
  }
}
