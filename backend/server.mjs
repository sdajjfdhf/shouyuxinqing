import http from 'node:http';
import { URL } from 'node:url';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const PORT = Number(process.env.PORT || 8787);
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1/chat/completions';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

// DeepSeek API configuration
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || '';
const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-chat';

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
  const body = await getBody(req);
  const message = String(body?.message || '').trim();
  const partnerName = String(body?.partnerName || '森林伙伴').trim();
  const context = Array.isArray(body?.context) ? body.context : [];
  const useDeepSeek = Boolean(body?.useDeepSeek);

  if (!message) {
    json(res, 400, { error: 'message is required' });
    return;
  }

  // Determine which API to use
  let apiKey, baseUrl, model;
  if (useDeepSeek) {
    if (!DEEPSEEK_API_KEY) {
      json(res, 500, { error: 'DEEPSEEK_API_KEY is missing on server.' });
      return;
    }
    apiKey = DEEPSEEK_API_KEY;
    baseUrl = DEEPSEEK_BASE_URL;
    model = DEEPSEEK_MODEL;
  } else {
    if (!OPENAI_API_KEY) {
      json(res, 500, { error: 'OPENAI_API_KEY is missing on server.' });
      return;
    }
    apiKey = OPENAI_API_KEY;
    baseUrl = OPENAI_BASE_URL;
    model = OPENAI_MODEL;
  }

  const systemPrompt = `你是「兽予心晴」里的动物伙伴${partnerName}。语气温柔、简短、共情，不诊断不下结论，不给危险建议。每次只回复 1～3 句自然对话，中文。严禁输出话术清单、分类标题（如「I.」「类别一」）、编号列表或一次性罗列多条模板句。`;

  const payload = {
    model: model,
    temperature: 0.7,
    messages: [
      { role: 'system', content: systemPrompt },
      ...context,
      { role: 'user', content: message }
    ]
  };

  const upstream = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
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

async function handleSearch(req, res) {
  const body = await getBody(req);
  const query = String(body?.query || '').trim();
  const useDeepSeek = Boolean(body?.useDeepSeek);

  if (!query) {
    json(res, 400, { error: 'query is required' });
    return;
  }

  // Determine which API to use
  let apiKey, baseUrl, model;
  if (useDeepSeek) {
    if (!DEEPSEEK_API_KEY) {
      json(res, 500, { error: 'DEEPSEEK_API_KEY is missing on server.' });
      return;
    }
    apiKey = DEEPSEEK_API_KEY;
    baseUrl = DEEPSEEK_BASE_URL;
    model = DEEPSEEK_MODEL;
  } else {
    if (!OPENAI_API_KEY) {
      json(res, 500, { error: 'OPENAI_API_KEY is missing on server.' });
      return;
    }
    apiKey = OPENAI_API_KEY;
    baseUrl = OPENAI_BASE_URL;
    model = OPENAI_MODEL;
  }

  const systemPrompt = `你是一位专业的心理学知识助手。用户搜索关于心理健康、情绪管理、心理知识的内容，请根据搜索关键词生成3-5篇相关的心理知识文章。

要求：
1. 每篇文章要有清晰的标题和简介
2. 文章内容要专业、科学、易懂
3. 内容要实用，包含具体的方法和建议
4. 语言要温和、温暖，符合心理健康主题
5. 返回格式必须是JSON数组，包含title、excerpt、content、category、readTime字段

分类选项：情绪管理、焦虑缓解、正念冥想、人际关系、自我成长

示例输出格式：
[
  {
    "title": "文章标题",
    "excerpt": "文章简介摘要",
    "content": "文章详细内容...",
    "category": "分类名称",
    "readTime": "阅读时长"
  }
]`;

  const userPrompt = `根据用户搜索内容："${query}"，生成相关的心理学知识文章。`;

  const payload = {
    model: model,
    temperature: 0.7,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]
  };

  const upstream = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
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

  try {
    const results = JSON.parse(reply);
    json(res, 200, { results });
  } catch {
    // 如果返回不是JSON格式，返回空结果
    json(res, 200, { results: [] });
  }
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

    if (url.pathname === '/api/search' && req.method === 'POST') {
      await handleSearch(req, res);
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
