export default async function handler(req, res) {
  const origin = req.headers.origin || '';
  const allowed = 'https://widget-rag.vercel.app';

  if (req.method === 'OPTIONS') {
    if (allowed.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      return res.status(204).end();
    }
    return res.status(403).end();
  }

  if (!allowed.includes(origin)) {
    return res.status(403).send('Origin not allowed');
  }

  res.setHeader('Access-Control-Allow-Origin', origin);

  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const { chatInput, sessionId } = req.body ?? {};
    const upstream = await fetch(process.env.N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.N8N_API_KEY
      },
      body: JSON.stringify({
        chatInput,
        sessionId: sessionId ?? 'web'
      })
    });

    const text = await upstream.text();
    return res.status(upstream.status).send(text);
  } catch {
    return res.status(500).send('Proxy error');
  }
}
