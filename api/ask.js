export default async function handler(req, res) {
  const origin = req.headers.origin || '';
  const allowed = 'https://widget-rag.vercel.app';

  if (req.method === 'OPTIONS') {
    if (allowed.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      return res.status(204).end();
    }
    return res.status(403).end();
  }

  if (allowed.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  if (req.method === 'GET') {
    return res.status(200).send('ok');
  }

  if (req.method === 'POST') {
    return res.status(200).send('ok');
  }

  return res.status(405).send('Method Not Allowed');
}
