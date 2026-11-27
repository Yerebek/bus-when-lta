import {
  generateSimulatedArrivals,
  getEstimatedRouteSummary,
  SINGAPORE_BUS_STOPS,
} from '../data/singaporeBusData';
import { BusArrivalResponse, BusRouteSummary, BusStop } from '../types/bus';

/**
 * Frontend API Adapter Layer
 * --------------------------
 * Currently uses simulated LTA DataMall v2 responses so the frontend works standalone.
 * To connect your real LTA DataMall backend proxy later:
 *   1. Set USE_LIVE_API = true
 *   2. Point API_BASE_URL to your proxy route (e.g., '/api/lta')
 *      which attaches your server-side LTA AccountKey header.
 */
export const BUS_API_CONFIG = {
  USE_LIVE_API: false,
  API_BASE_URL: '/api/lta',
};

export async function fetchBusArrivals(busStopCode: string): Promise<BusArrivalResponse> {
  const cleanCode = busStopCode.trim();

  if (BUS_API_CONFIG.USE_LIVE_API) {
    const res = await fetch(
      `${BUS_API_CONFIG.API_BASE_URL}/bus-arrival?BusStopCode=${encodeURIComponent(cleanCode)}`
    );
    if (!res.ok) {
      throw new Error(`Failed to fetch arrivals for stop ${cleanCode} (${res.status})`);
    }
    const payload = await res.json();
    return {
      BusStopCode: payload.BusStopCode ?? cleanCode,
      Services: payload.Services ?? [],
      fetchedAt: Date.now(),
    };
  }

  // Subtle realistic network latency (90-180ms) for smooth UI transitions
  await new Promise((resolve) => setTimeout(resolve, 120));
  return generateSimulatedArrivals(cleanCode);
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
