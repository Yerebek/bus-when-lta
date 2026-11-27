import { BusLoad, BusType } from '../types/bus';

export function getMinutesUntil(isoTimestamp: string, nowMs: number): number | null {
  if (!isoTimestamp) return null;
  const target = new Date(isoTimestamp).getTime();
  if (Number.isNaN(target)) return null;
  const diffMin = Math.floor((target - nowMs) / 60_000);
  return Math.max(0, diffMin);
}

export function formatArrivalLabel(minutes: number | null): string {
  if (minutes === null) return '—';
  if (minutes <= 0) return 'Arr';
  return `${minutes} min`;
}

export function formatClockTime(isoTimestamp: string): string {
  if (!isoTimestamp) return '—';
  const date = new Date(isoTimestamp);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleTimeString('en-SG', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function getLoadMeta(load: BusLoad): {
  label: string;
  barColor: string;
  textColor: string;
} {
  switch (load) {
    case 'SEA':
      return {
        label: 'Seats',
        barColor: 'bg-emerald-600',
        textColor: 'text-emerald-700',
      };
    case 'SDA':
      return {
        label: 'Standing',
        barColor: 'bg-amber-500',
        textColor: 'text-amber-700',
      };
    case 'LSD':
      return {
        label: 'Limited',
        barColor: 'bg-red-600',
        textColor: 'text-red-700',
      };
  }
}

export function getBusTypeLabel(type: BusType): string {
  switch (type) {
    case 'DD':
      return 'Double';
    case 'BD':
      return 'Bendy';
    case 'SD':
    default:
      return 'Single';
  }
}
