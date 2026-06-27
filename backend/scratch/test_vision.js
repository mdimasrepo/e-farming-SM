const API_KEY = process.env.OPENROUTER_API_KEY;

const models = [
  'google/gemini-2.0-flash-exp:free',
  'google/gemini-2.0-flash-lite-preview-02-05:free',
  'meta-llama/llama-3.2-90b-vision-instruct:free',
  'meta-llama/llama-3.2-11b-vision-instruct:free',
  'qwen/qwen-vl-plus:free',
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
