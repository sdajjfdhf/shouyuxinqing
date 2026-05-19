import http from 'node:http';
import { URL } from 'node:url';

const PORT = Number(process.env.PORT || 8787);
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1/chat/completions';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

function json(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  });
  res.end(JSON.stringify(data));
}

function getBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 1_000_000) {
        reject(new Error('Request body too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

async function handleChat(req, res) {
  if (!OPENAI_API_KEY) {
    json(res, 500, { error: 'OPENAI_API_KEY is missing on server.' });
    return;
  }

  const body = await getBody(req);
  const message = String(body?.message || '').trim();
  const partnerName = String(body?.partnerName || '森林伙伴').trim();
  const context = Array.isArray(body?.context) ? body.context : [];

  if (!message) {
    json(res, 400, { error: 'message is required' });
    return;
  }

  const systemPrompt = `你是「兽予心晴」里的动物伙伴${partnerName}。语气温柔、简短、共情，不诊断不下结论，不给危险建议。每次只回复 1～3 句自然对话，中文。严禁输出话术清单、分类标题（如「I.」「类别一」）、编号列表或一次性罗列多条模板句。`;

  const payload = {
    model: OPENAI_MODEL,
    temperature: 0.7,
    messages: [
      { role: 'system', content: systemPrompt },
      ...context,
      { role: 'user', content: message }
    ]
  };

  const upstream = await fetch(OPENAI_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify(payload)
  });

  if (!upstream.ok) {
    const text = await upstream.text();
    json(res, 502, { error: `Upstream AI failed: ${upstream.status}`, detail: text.slice(0, 500) });
    return;
  }

  const data = await upstream.json();
  const reply = data?.choices?.[0]?.message?.content?.trim() || '';
  json(res, 200, { reply });
}

const server = http.createServer(async (req, res) => {
  try {
    if (!req.url) {
      json(res, 404, { error: 'Not found' });
      return;
    }
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      });
      res.end();
      return;
    }

    if (url.pathname === '/health' && req.method === 'GET') {
      json(res, 200, { ok: true, service: 'shouyu-xinqing-backend' });
      return;
    }

    if (url.pathname === '/api/chat' && req.method === 'POST') {
      await handleChat(req, res);
      return;
    }

    json(res, 404, { error: 'Not found' });
  } catch (err) {
    json(res, 500, { error: err?.message || 'Server error' });
  }
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[shouyu-xinqing-backend] listening on http://localhost:${PORT}`);
});
