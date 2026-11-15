export const config = {
  runtime: 'edge',
  regions: ['iad1'],
};

export default async function handler(req) {
  const url = new URL(req.url);
  const targetUrl = `https://openrouter.ai${url.pathname}${url.search}`;

  const headers = new Headers(req.headers);
  headers.set('Host', 'openrouter.ai');
  headers.delete('x-forwarded-for');
  headers.delete('x-real-ip');
  headers.delete('x-vercel-ip-country');
  headers.delete('x-vercel-forwarded-for');

  const response = await fetch(targetUrl, {
    method: req.method,
    headers,
    body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : null,
  });

  const newHeaders = new Headers(response.headers);
  newHeaders.set('Access-Control-Allow-Origin', '*');

  return new Response(response.body, {
    status: response.status,
    headers: newHeaders,
  });
}
