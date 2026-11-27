import React, { useMemo, useState } from 'react';
import { ArrowRight, Search, Star } from 'lucide-react';
import { SINGAPORE_BUS_STOPS } from '../data/singaporeBusData';
import { SingaporeRegion } from '../types/bus';

interface StopsDirectoryViewProps {
  selectedStopCode: string;
  onSelectStop: (code: string) => void;
  isFavorite: (code: string) => boolean;
  onToggleFavorite: (code: string) => void;
}

const REGIONS: Array<'All' | SingaporeRegion> = [
  'All',
  'Central',
  'East',
  'West',
  'North',
  'North-East',
];

export const StopsDirectoryView: React.FC<StopsDirectoryViewProps> = ({
  selectedStopCode,
  onSelectStop,
  isFavorite,
  onToggleFavorite,
}) => {
  const [region, setRegion] = useState<'All' | SingaporeRegion>('All');
  const [filterText, setFilterText] = useState('');

  const stops = useMemo(() => {
    const q = filterText.trim().toLowerCase();
    return SINGAPORE_BUS_STOPS.filter((stop) => {
      if (region !== 'All' && stop.Region !== region) return false;
      if (!q) return true;
      return (
        stop.BusStopCode.toLowerCase().includes(q) ||
        stop.Description.toLowerCase().includes(q) ||
        stop.RoadName.toLowerCase().includes(q) ||
        (stop.NearbyMRT?.toLowerCase().includes(q) ?? false) ||
        stop.Services.some((s) => s.toLowerCase() === q)
      );
    });
  }, [region, filterText]);

  return (
    <section className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-xl font-bold text-slate-900">
              Singapore Bus Stops Directory
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Browse major interchanges and MRT-linked bus stops across Singapore.
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Filter code, road, or bus no..."
              aria-label="Filter directory"
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#C8102E] focus:outline-none"
            />
          </div>
        </div>

        {/* Region Filter Tabs */}
        <div className="mt-4 inline-flex flex-wrap items-center gap-1 rounded-lg bg-slate-100 p-1">
          {REGIONS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setRegion(item)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                region === item
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {stops.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <p className="text-sm font-semibold text-slate-800">No matching bus stops</p>
          <p className="mt-1 text-xs text-slate-500">
            Try switching region or clearing your directory search filter.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-100">
          {stops.map((stop) => {
            const starred = isFavorite(stop.BusStopCode);
            const active = selectedStopCode === stop.BusStopCode;
            return (
              <li
                key={stop.BusStopCode}
                className={`flex flex-col gap-3 px-5 py-4 sm:px-6 sm:flex-row sm:items-center sm:justify-between transition-colors hover:bg-slate-50/70 ${
                  active ? 'bg-slate-50' : ''
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-2.5">
                    <span className="font-mono text-sm font-bold tabular-nums text-[#C8102E]">
                      {stop.BusStopCode}
                    </span>
                    <span className="text-base font-semibold text-slate-900">
                      {stop.Description}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500">
                    <span>{stop.RoadName}</span>
                    {stop.NearbyMRT && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>{stop.NearbyMRT}</span>
                      </>
                    )}
                    <span aria-hidden="true">·</span>
                    <span>{stop.Region}</span>
                  </div>
                  <div className="mt-1.5 text-xs text-slate-600 font-mono tabular-nums truncate">
                    Buses: {stop.Services.join(' · ')}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onToggleFavorite(stop.BusStopCode)}
                    aria-label={starred ? 'Remove from favorites' : 'Add to favorites'}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:bg-slate-50 hover:text-amber-500 cursor-pointer"
                  >
                    <Star
                      className={`h-4 w-4 ${
                        starred ? 'fill-amber-400 text-amber-500' : ''
                      }`}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectStop(stop.BusStopCode)}
                    className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 text-xs font-semibold text-white hover:bg-slate-800 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>View Timings</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};
