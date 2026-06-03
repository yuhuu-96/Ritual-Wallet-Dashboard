// Vercel Serverless Function — Ritual TX Proxy
// Route: /api/transactions?address=0x...&limit=3
export default async function handler(req, res) {
  // CORS headers — allow any origin (our Vercel frontend)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { address, limit = '3', offset = '0' } = req.query;

  if (!address || !/^0x[0-9a-fA-F]{40}$/.test(address)) {
    return res.status(400).json({ error: 'Invalid address' });
  }

  try {
    // Date range: last 90 days
    const now = new Date();
    const past = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    const toDate = now.toISOString().slice(0, 10);
    const fromDate = past.toISOString().slice(0, 10);

    const explorerUrl = `https://explorer.ritualfoundation.org/api/indexer-proxy/api/v1/addresses/${address}/transactions?limit=${limit}&offset=${offset}&from_date=${fromDate}&to_date=${toDate}`;

    const response = await fetch(explorerUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RitualDashboard/1.0)',
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(15000)
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Explorer API error', status: response.status });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Proxy failed', message: err.message });
  }
}
