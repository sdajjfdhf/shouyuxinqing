# 兽予心晴 Backend

Minimal backend proxy for AI chat.

## 1) Set environment variables

PowerShell:

```powershell
$env:OPENAI_API_KEY="sk-..."
$env:OPENAI_MODEL="gpt-4o-mini"
$env:OPENAI_BASE_URL="https://api.openai.com/v1/chat/completions"
$env:PORT="8787"
```

## 2) Start backend

From project root:

```powershell
npm run dev:backend
```

## 3) Verify

Open:

- `http://localhost:8787/health`

Frontend AI settings should use:

- backend mode: enabled
- backend URL: `http://localhost:8787/api/chat`
