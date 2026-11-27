import {
  generateSimulatedArrivals,
  getEstimatedRouteSummary,
  SINGAPORE_BUS_STOPS,
} from '../data/singaporeBusData';
import { ApiHealthStatus, BusArrivalResponse, BusRouteSummary, BusStop } from '../types/bus';

export async function fetchApiHealth(): Promise<ApiHealthStatus | null> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) return null;
    return (await res.json()) as ApiHealthStatus;
  } catch {
    return null;
  }
}

export async function fetchBusArrivals(
  busStopCode: string,
  serviceNo?: string
): Promise<BusArrivalResponse> {
  const cleanCode = busStopCode.trim();
  const params = new URLSearchParams({ BusStopCode: cleanCode });
  if (serviceNo && serviceNo.trim()) {
    params.set('ServiceNo', serviceNo.trim());
  }

  try {
    const res = await fetch(`/api/busarrival?${params.toString()}`);

    if (res.ok) {
      const payload = await res.json();
      return {
        BusStopCode: payload.BusStopCode ?? cleanCode,
        Services: Array.isArray(payload.Services) ? payload.Services : [],
        fetchedAt: Date.now(),
        source: 'live',
      };
    }

    const errorPayload = await res.json().catch(() => ({}));

    // When LTA_ACCOUNT_KEY is not yet configured on the server, gracefully fall back
    // to simulated arrival timings so the frontend remains functional in preview.
    if (res.status === 503 && errorPayload?.code === 'MISSING_API_KEY') {
      const simulated = generateSimulatedArrivals(cleanCode);
      return {
        ...simulated,
        source: 'simulated',
      };
    }

    throw new Error(
      errorPayload?.error || `Failed to fetch arrivals for stop ${cleanCode} (${res.status})`
    );
  } catch (err) {
    if (err instanceof TypeError) {
      // Network/offline fallback
      const simulated = generateSimulatedArrivals(cleanCode);
      return {
        ...simulated,
        source: 'simulated',
      };
    }
    throw err;
  }
}

export function getBusStopByCode(busStopCode: string): BusStop | undefined {
  return SINGAPORE_BUS_STOPS.find((stop) => stop.BusStopCode === busStopCode.trim());
}

export function searchBusStops(query: string): BusStop[] {
  const q = query.trim().toLowerCase();
  if (!q) return SINGAPORE_BUS_STOPS;

  return SINGAPORE_BUS_STOPS.filter((stop) => {
    const codeMatch = stop.BusStopCode.toLowerCase().includes(q);
    const descMatch = stop.Description.toLowerCase().includes(q);
    const roadMatch = stop.RoadName.toLowerCase().includes(q);
    const mrtMatch = stop.NearbyMRT?.toLowerCase().includes(q) ?? false;
    const serviceMatch = stop.Services.some((svc) => svc.toLowerCase() === q);
    return codeMatch || descMatch || roadMatch || mrtMatch || serviceMatch;
  });
}

export function getRouteSummary(serviceNo: string): BusRouteSummary {
  return getEstimatedRouteSummary(serviceNo);
}
