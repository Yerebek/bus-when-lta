import type { IncomingMessage, ServerResponse } from 'node:http';

export interface ServerlessRequest extends IncomingMessage {
  query?: Record<string, unknown>;
}

export interface ServerlessResponse extends ServerResponse {
  status?: (code: number) => ServerlessResponse;
  json?: (body: unknown) => void;
}

function sendJson(res: ServerlessResponse, statusCode: number, payload: unknown): void {
  const statusFn = res.status;
  const jsonFn = res.json;
  if (typeof statusFn === 'function' && typeof jsonFn === 'function') {
    const target = statusFn.call(res, statusCode);
    if (target && typeof target.json === 'function') {
      target.json(payload);
      return;
    }
  }
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

export default async function handler(
  req: ServerlessRequest,
  res: ServerlessResponse
): Promise<void> {
  if (req.method && req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  const hasAccountKey = Boolean(process.env.LTA_ACCOUNT_KEY?.trim());

  res.setHeader('Cache-Control', 'no-store');
  sendJson(res, 200, {
    status: 'ok',
    service: 'sg-bustiming-api',
    ltaConfigured: hasAccountKey,
    endpointVersion: 'v3',
    timestamp: new Date().toISOString(),
  });
}
