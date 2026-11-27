import type { IncomingMessage, ServerResponse } from 'node:http';

const LTA_BUS_ARRIVAL_V3_URL =
  'https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival';

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

function getQueryParam(req: ServerlessRequest, key: string): string | undefined {
  if (req.query && key in req.query) {
    const val = req.query[key];
    if (typeof val === 'string') return val;
    if (Array.isArray(val) && typeof val[0] === 'string') return val[0];
  }
  if (req.url) {
    const parsed = new URL(req.url, 'http://localhost');
    return parsed.searchParams.get(key) ?? undefined;
  }
  return undefined;
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

  const accountKey = process.env.LTA_ACCOUNT_KEY?.trim();
  if (!accountKey) {
    sendJson(res, 503, {
      error: 'LTA_ACCOUNT_KEY is not configured on the server.',
      code: 'MISSING_API_KEY',
    });
    return;
  }

  const rawBusStopCode = getQueryParam(req, 'BusStopCode')?.trim() ?? '';
  const rawServiceNo = getQueryParam(req, 'ServiceNo')?.trim();

  if (!/^\d{5}$/.test(rawBusStopCode)) {
    sendJson(res, 400, {
      error: 'Invalid BusStopCode. Expected a 5-digit Singapore bus stop code (e.g. 04121).',
      code: 'INVALID_BUS_STOP_CODE',
    });
    return;
  }

  if (rawServiceNo !== undefined && rawServiceNo !== '' && !/^[A-Za-z0-9]{1,6}$/.test(rawServiceNo)) {
    sendJson(res, 400, {
      error: 'Invalid ServiceNo format.',
      code: 'INVALID_SERVICE_NO',
    });
    return;
  }

  const upstreamUrl = new URL(LTA_BUS_ARRIVAL_V3_URL);
  upstreamUrl.searchParams.set('BusStopCode', rawBusStopCode);
  if (rawServiceNo) {
    upstreamUrl.searchParams.set('ServiceNo', rawServiceNo);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const upstreamResponse = await fetch(upstreamUrl.toString(), {
      method: 'GET',
      headers: {
        AccountKey: accountKey,
        Accept: 'application/json',
      },
      signal: controller.signal,
    });

    if (!upstreamResponse.ok) {
      sendJson(res, 502, {
        error: `Upstream LTA DataMall request failed with status ${upstreamResponse.status}.`,
        code: 'UPSTREAM_ERROR',
      });
      return;
    }

    const data = await upstreamResponse.json();
    res.setHeader('Cache-Control', 'no-store');
    sendJson(res, 200, data);
  } catch (err) {
    const isAbort = err instanceof Error && err.name === 'AbortError';
    sendJson(res, isAbort ? 504 : 502, {
      error: isAbort
        ? 'LTA DataMall request timed out.'
        : 'Unable to reach LTA DataMall service.',
      code: isAbort ? 'UPSTREAM_TIMEOUT' : 'UPSTREAM_FETCH_FAILED',
    });
  } finally {
    clearTimeout(timeout);
  }
}
