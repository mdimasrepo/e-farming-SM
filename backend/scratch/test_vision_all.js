const API_KEY = process.env.OPENROUTER_API_KEY;

const models = [
  'nvidia/nemotron-3.5-content-safety:free',
  'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
  'google/gemma-4-26b-a4b-it:free',
  'google/gemma-4-31b-it:free',
  'google/lyria-3-pro-preview',
  'google/lyria-3-clip-preview',
  'openrouter/free',
  'nvidia/nemotron-nano-12b-v2-vl:free'
];

async function test() {
  for (const m of models) {
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + API_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: m,
          messages: [{ role: 'user', content: [ { type: 'text', text: 'describe this' }, { type: 'image_url', image_url: { url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==' } } ] }],
          max_tokens: 10
        })
      });
      const data = await res.json();
      console.log(m, res.status, data.error ? data.error.message : 'OK');
    } catch(e) {
      console.log(m, 'FETCH ERROR', e.message);
    }
  }
}
test();
