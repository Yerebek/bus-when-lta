import React, { useMemo, useState } from 'react';
import {
  Accessibility,
  ChevronDown,
  ChevronUp,
  Pause,
  Pin,
  Play,
  RefreshCw,
  Star,
} from 'lucide-react';
import { getRouteSummary } from '../services/busApi';
import {
  BusArrivalResponse,
  BusServiceArrival,
  BusStop,
  FavoriteStop,
  NextBusSlot,
} from '../types/bus';
import {
  formatArrivalLabel,
  formatClockTime,
  getBusTypeLabel,
  getLoadMeta,
  getMinutesUntil,
} from '../utils/time';

interface ArrivalBoardProps {
  stop?: BusStop;
  stopCode: string;
  arrivals: BusArrivalResponse | null;
  nowMs: number;
  isLoading: boolean;
  error: string | null;
  isFavorite: boolean;
  favoriteData?: FavoriteStop;
  autoRefresh: boolean;
  secondsToRefresh: number;
  onToggleAutoRefresh: () => void;
  onRefresh: () => void;
  onToggleFavorite: () => void;
  onTogglePinnedService: (serviceNo: string) => void;
}

type ServiceFilterMode = 'all' | 'pinned' | 'wab';

const ArrivalSlotCell: React.FC<{
  slot?: NextBusSlot;
  nowMs: number;
  isPrimary?: boolean;
}> = ({ slot, nowMs, isPrimary = false }) => {
  if (!slot || !slot.EstimatedArrival) {
    return (
      <div className="flex flex-col gap-1">
        <span className="font-mono text-base font-medium tabular-nums text-slate-400">
          —
        </span>
        <span className="text-[11px] text-slate-400">No schedule</span>
      </div>
    );
  }

  const minutes = getMinutesUntil(slot.EstimatedArrival, nowMs);
  const label = formatArrivalLabel(minutes);
  const clock = formatClockTime(slot.EstimatedArrival);
  const loadMeta = getLoadMeta(slot.Load);
  const deckLabel = getBusTypeLabel(slot.Type);
  const isArriving = minutes !== null && minutes <= 0;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline gap-2">
        <span
          className={`font-mono tabular-nums tracking-tight ${
            isPrimary ? 'text-xl sm:text-2xl font-bold' : 'text-base sm:text-lg font-semibold'
          } ${
            isArriving
              ? 'text-[#C8102E]'
              : isPrimary
              ? 'text-slate-900'
              : 'text-slate-700'
          }`}
        >
          {label}
        </span>
        <span className="font-mono text-[11px] tabular-nums text-slate-400">
          {clock}
        </span>
      </div>

      {/* Crowd load bar + explicit text label (accessible, never hue-only) */}
      <div className="flex items-center gap-2 text-[11px] text-slate-500">
        <span
          className={`inline-block h-1.5 w-4 rounded-xs ${loadMeta.barColor}`}
          aria-hidden="true"
        />
        <span className={`font-medium ${loadMeta.textColor}`}>{loadMeta.label}</span>
        <span aria-hidden="true" className="text-slate-300">·</span>
        <span>{deckLabel}</span>
        {slot.Feature === 'WAB' && (
          <span
            title="Wheelchair Accessible Bus"
            className="inline-flex items-center text-slate-500"
            aria-label="Wheelchair Accessible"
          >
            <Accessibility className="h-3 w-3" />
          </span>
        )}
      </div>
    </div>
  );
};

export const ArrivalBoard: React.FC<ArrivalBoardProps> = ({
  stop,
  stopCode,
  arrivals,
  nowMs,
  isLoading,
  error,
  isFavorite,
  favoriteData,
  autoRefresh,
  secondsToRefresh,
  onToggleAutoRefresh,
  onRefresh,
  onToggleFavorite,
  onTogglePinnedService,
}) => {
  const [filterMode, setFilterMode] = useState<ServiceFilterMode>('all');
  const [serviceQuery, setServiceQuery] = useState('');
  const [expandedService, setExpandedService] = useState<string | null>(null);

  const pinnedSet = useMemo(
    () => new Set(favoriteData?.pinnedServices ?? []),
    [favoriteData]
  );

  const filteredServices = useMemo(() => {
    if (!arrivals) return [];
    const q = serviceQuery.trim().toLowerCase();

    const list = arrivals.Services.filter((svc) => {
      if (q && !svc.ServiceNo.toLowerCase().includes(q)) return false;
      if (filterMode === 'pinned' && !pinnedSet.has(svc.ServiceNo)) return false;
      if (filterMode === 'wab' && svc.NextBus.Feature !== 'WAB') return false;
      return true;
    });

    // Float pinned services to top while maintaining numeric order within each group
    return [...list].sort((a, b) => {
      const aPinned = pinnedSet.has(a.ServiceNo) ? 0 : 1;
      const bPinned = pinnedSet.has(b.ServiceNo) ? 0 : 1;
      if (aPinned !== bPinned) return aPinned - bPinned;
      const numA = parseInt(a.ServiceNo, 10) || 9999;
      const numB = parseInt(b.ServiceNo, 10) || 9999;
      if (numA !== numB) return numA - numB;
      return a.ServiceNo.localeCompare(b.ServiceNo);
    });
  }, [arrivals, serviceQuery, filterMode, pinnedSet]);

  const lastUpdatedText = arrivals
    ? new Date(arrivals.fetchedAt).toLocaleTimeString('en-SG', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })
    : '—';

  return (
    <section
      aria-label="Live bus arrival board"
      className="rounded-xl border border-slate-200 bg-white overflow-hidden"
    >
      {/* Stop Identity Header */}
      <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-mono text-xl sm:text-2xl font-bold tabular-nums text-[#C8102E]">
                {stopCode}
              </span>
              <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                {favoriteData?.nickname || stop?.Description || `Bus Stop ${stopCode}`}
              </h1>
            </div>

            <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-slate-500">
              {favoriteData?.nickname && stop?.Description && (
                <>
                  <span className="font-medium text-slate-700">{stop.Description}</span>
                  <span aria-hidden="true">·</span>
                </>
              )}
              <span>{stop?.RoadName ?? 'Custom Bus Stop Code'}</span>
              {stop?.NearbyMRT && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{stop.NearbyMRT}</span>
                </>
              )}
              {stop?.Region && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{stop.Region} Singapore</span>
                </>
              )}
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">
                {arrivals ? `${arrivals.Services.length} services` : 'Loading'}
              </span>
            </div>
          </div>

          {/* Header Controls */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onToggleFavorite}
              className={`inline-flex h-10 items-center gap-2 rounded-lg border px-3.5 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isFavorite
                  ? 'border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Star
                className={`h-4 w-4 ${
                  isFavorite ? 'fill-amber-400 text-amber-500' : 'text-slate-400'
                }`}
              />
              <span>{isFavorite ? 'Saved Stop' : 'Save Stop'}</span>
            </button>

            <button
              type="button"
              onClick={onToggleAutoRefresh}
              title="Toggle 30-second automatic refresh"
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 whitespace-nowrap shrink-0 cursor-pointer"
            >
              {autoRefresh ? (
                <>
                  <Pause className="h-3.5 w-3.5 text-slate-500" />
                  <span className="font-mono tabular-nums">Auto {secondsToRefresh}s</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 text-slate-500" />
                  <span>Auto Off</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onRefresh}
              disabled={isLoading}
              aria-label="Refresh bus timings"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Filter & Meta Bar */}
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            {/* Interactive segmented filter tabs */}
            <div className="inline-flex items-center gap-1 rounded-lg bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setFilterMode('all')}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  filterMode === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Services
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('pinned')}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  filterMode === 'pinned'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pinned ({pinnedSet.size})
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('wab')}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  filterMode === 'wab'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Wheelchair Accessible
              </button>
            </div>

            <input
              type="text"
              value={serviceQuery}
              onChange={(e) => setServiceQuery(e.target.value)}
              placeholder="Filter bus no..."
              aria-label="Filter bus service number"
              className="h-9 w-36 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#C8102E] focus:outline-none"
            />
          </div>

          <div className="text-xs text-slate-500 font-mono tabular-nums">
            Updated {lastUpdatedText} ·{' '}
            {arrivals?.source === 'live'
              ? 'Live LTA DataMall v3'
              : 'Simulated Preview (set LTA_ACCOUNT_KEY for live v3)'}
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="border-b border-red-100 bg-red-50 px-6 py-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Loading Skeleton State */}
      {isLoading && !arrivals ? (
        <div className="divide-y divide-slate-100">
          {[1, 2, 3, 4, 5].map((row) => (
            <div key={row} className="grid grid-cols-12 items-center gap-4 px-6 py-4 animate-pulse">
              <div className="col-span-3 sm:col-span-2 h-8 w-16 rounded bg-slate-100" />
              <div className="col-span-4 sm:col-span-3 h-10 rounded bg-slate-100" />
              <div className="hidden sm:block sm:col-span-3 h-10 rounded bg-slate-100" />
              <div className="hidden md:block md:col-span-3 h-10 rounded bg-slate-100" />
              <div className="col-span-5 sm:col-span-1 h-8 rounded bg-slate-100" />
            </div>
          ))}
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <p className="text-sm font-semibold text-slate-800">
            {filterMode === 'pinned'
              ? 'No pinned bus services at this stop yet'
              : 'No bus services match your current filter'}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {filterMode === 'pinned'
              ? 'Click the pin icon on any bus row to keep your regular routes at the top.'
              : 'Clear your service filter or switch back to All Services.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setFilterMode('all');
              setServiceQuery('');
            }}
            className="mt-4 inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            Show All Services
          </button>
        </div>
      ) : (
        <div>
          {/* Table Header (Desktop) */}
          <div className="hidden sm:grid sm:grid-cols-12 items-center border-b border-slate-100 bg-slate-50/70 px-6 py-2.5 text-xs font-semibold text-slate-500">
            <div className="col-span-2">Service</div>
            <div className="col-span-3">Next Bus</div>
            <div className="col-span-3">2nd Bus</div>
            <div className="hidden md:block md:col-span-3">3rd Bus</div>
            <div className="col-span-4 md:col-span-1 text-right">Pin</div>
          </div>

          {/* Bus Service Rows */}
          <ul className="divide-y divide-slate-100">
            {filteredServices.map((svc: BusServiceArrival) => {
              const isPinned = pinnedSet.has(svc.ServiceNo);
              const isExpanded = expandedService === svc.ServiceNo;
              const route = isExpanded ? getRouteSummary(svc.ServiceNo) : null;

              return (
                <li key={svc.ServiceNo} className="transition-colors hover:bg-slate-50/60">
                  <div className="grid grid-cols-12 items-center gap-3 px-5 py-4 sm:px-6">
                    {/* Service Number + Operator */}
                    <div className="col-span-4 sm:col-span-2 flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedService(isExpanded ? null : svc.ServiceNo)
                        }
                        aria-expanded={isExpanded}
                        className="group flex items-center gap-2 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8102E] rounded-md"
                      >
                        <span
                          className={`inline-flex min-w-[3.25rem] items-center justify-center rounded-lg border px-2.5 py-1.5 font-display text-base font-bold tabular-nums transition-colors ${
                            isPinned
                              ? 'border-[#C8102E]/30 bg-[#C8102E]/5 text-[#C8102E]'
                              : 'border-slate-200 bg-slate-50 text-slate-900 group-hover:border-slate-300'
                          }`}
                        >
                          {svc.ServiceNo}
                        </span>
                      </button>
                      <div className="hidden lg:flex flex-col text-[11px] text-slate-500">
                        <span className="font-medium text-slate-600">{svc.Operator}</span>
                      </div>
                    </div>

                    {/* Next Bus */}
                    <div className="col-span-6 sm:col-span-3">
                      <ArrivalSlotCell slot={svc.NextBus} nowMs={nowMs} isPrimary />
                    </div>

                    {/* 2nd Bus */}
                    <div className="hidden sm:block sm:col-span-3">
                      <ArrivalSlotCell slot={svc.NextBus2} nowMs={nowMs} />
                    </div>

                    {/* 3rd Bus */}
                    <div className="hidden md:block md:col-span-3">
                      <ArrivalSlotCell slot={svc.NextBus3} nowMs={nowMs} />
                    </div>

                    {/* Row Actions (Pin + Route Expand) */}
                    <div className="col-span-2 sm:col-span-4 md:col-span-1 flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onTogglePinnedService(svc.ServiceNo)}
                        aria-label={
                          isPinned
                            ? `Unpin bus ${svc.ServiceNo}`
                            : `Pin bus ${svc.ServiceNo}`
                        }
                        title={isPinned ? 'Unpin bus service' : 'Pin bus service'}
                        className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors cursor-pointer ${
                          isPinned
                            ? 'bg-[#C8102E]/10 text-[#C8102E] hover:bg-[#C8102E]/15'
                            : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
                        }`}
                      >
                        <Pin className={`h-4 w-4 ${isPinned ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedService(isExpanded ? null : svc.ServiceNo)
                        }
                        aria-label={`Toggle route info for bus ${svc.ServiceNo}`}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Mobile 2nd & 3rd Bus compact row */}
                  <div className="flex sm:hidden items-center gap-6 px-5 pb-3 text-xs text-slate-500">
                    <div>
                      <span className="text-slate-400 mr-1.5">2nd:</span>
                      <span className="font-mono font-semibold tabular-nums text-slate-700">
                        {formatArrivalLabel(
                          getMinutesUntil(svc.NextBus2.EstimatedArrival, nowMs)
                        )}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 mr-1.5">3rd:</span>
                      <span className="font-mono font-semibold tabular-nums text-slate-700">
                        {formatArrivalLabel(
                          getMinutesUntil(svc.NextBus3.EstimatedArrival, nowMs)
                        )}
                      </span>
                    </div>
                    <span className="ml-auto font-medium text-slate-500">{svc.Operator}</span>
                  </div>

                  {/* Inline Route Summary Disclosure */}
                  {isExpanded && route && (
                    <div className="border-t border-slate-100 bg-slate-50/80 px-5 py-3.5 sm:px-6">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="font-semibold text-slate-800">
                          Route {route.ServiceNo}: {route.OriginName} → {route.DestinationName}
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 font-mono tabular-nums">
                          <span>First {route.FirstBus}</span>
                          <span aria-hidden="true">·</span>
                          <span>Last {route.LastBus}</span>
                          <span aria-hidden="true">·</span>
                          <span>Peak {route.FrequencyPeak}</span>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-slate-600">
                        {route.KeyStops.map((stopName, idx) => (
                          <React.Fragment key={stopName}>
                            <span>{stopName}</span>
                            {idx < route.KeyStops.length - 1 && (
                              <span aria-hidden="true" className="text-slate-300">
                                →
                              </span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
};
