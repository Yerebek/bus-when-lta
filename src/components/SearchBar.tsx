import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, MapPin, Search, Star, X } from 'lucide-react';
import { searchBusStops } from '../services/busApi';
import { BusStop } from '../types/bus';

interface SearchBarProps {
  selectedStopCode: string;
  onSelectStop: (code: string) => void;
  isFavorite: (code: string) => boolean;
  onToggleFavorite: (code: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  selectedStopCode,
  onSelectStop,
  isFavorite,
  onToggleFavorite,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const matches = useMemo(() => {
    return searchBusStops(query).slice(0, 8);
  }, [query]);

  const trimmedQuery = query.trim();
  const isFiveDigitCode = /^\d{5}$/.test(trimmedQuery);
  const exactStopExists = matches.some((s) => s.BusStopCode === trimmedQuery);

  // Focus search input when pressing '/' outside inputs
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChooseStop = (code: string) => {
    setValidationMessage(null);
    onSelectStop(code);
    setQuery('');
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trimmedQuery) {
      setValidationMessage('Enter a 5-digit Singapore bus stop code (e.g. 09047) or stop name.');
      return;
    }

    if (isFiveDigitCode) {
      handleChooseStop(trimmedQuery);
      return;
    }

    if (matches.length > 0) {
      const target = matches[highlightedIndex] ?? matches[0];
      handleChooseStop(target.BusStopCode);
      return;
    }

    setValidationMessage(
      'No matching stop found in the local sample directory. Enter any 5-digit stop code (e.g. 09047) to preview.'
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setIsOpen(true);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (matches.length > 0 ? (prev + 1) % matches.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        matches.length > 0 ? (prev - 1 + matches.length) % matches.length : 0
      );
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const quickCodes: { code: string; label: string }[] = [
    { code: '09047', label: 'Orchard Stn' },
    { code: '01113', label: 'Bugis Stn' },
    { code: '03211', label: 'Marina Bay Sands' },
    { code: '75009', label: 'Tampines Int' },
    { code: '28009', label: 'Jurong East Int' },
  ];

  return (
    <div ref={containerRef} className="relative">
      <form onSubmit={handleSubmit} className="relative flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onFocus={() => setIsOpen(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setHighlightedIndex(0);
              setValidationMessage(null);
              setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Enter 5-digit bus stop code (e.g. 09047), road, MRT, or service no."
            aria-label="Search bus stop code, road name, or bus service"
            className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-20 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 shadow-xs transition-colors focus:border-[#C8102E] focus:outline-none focus:ring-2 focus:ring-[#C8102E]/15"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setValidationMessage(null);
                  inputRef.current?.focus();
                }}
                aria-label="Clear search"
                className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-flex h-6 items-center rounded border border-slate-200 bg-slate-50 px-1.5 font-mono text-[11px] font-medium text-slate-500">
              /
            </kbd>
          </div>
        </div>

        <button
          type="submit"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 text-sm font-semibold text-white transition-colors hover:bg-slate-800 active:scale-[0.98] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
        >
          <span>Check Stop</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      {/* Quick Jump Stop Links */}
      <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
        <span className="font-medium text-slate-600">Quick jump:</span>
        {quickCodes.map((item) => {
          const active = selectedStopCode === item.code;
          return (
            <button
              key={item.code}
              type="button"
              onClick={() => handleChooseStop(item.code)}
              className={`inline-flex items-center gap-1.5 py-0.5 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                active
                  ? 'font-semibold text-[#C8102E]'
                  : 'text-slate-600 hover:text-slate-900 hover:underline underline-offset-4'
              }`}
            >
              <span className="font-mono tabular-nums">{item.code}</span>
              <span aria-hidden="true">·</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {validationMessage && (
        <p className="mt-2 text-xs font-medium text-[#C8102E]" role="alert">
          {validationMessage}
        </p>
      )}

      {/* Autocomplete Dropdown */}
      {isOpen && (query.trim().length > 0 || matches.length > 0) && (
        <div
          className="absolute left-0 right-0 top-[54px] z-40 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
          role="listbox"
          aria-label="Matching Singapore bus stops"
        >
          {isFiveDigitCode && !exactStopExists && (
            <button
              type="button"
              onClick={() => handleChooseStop(trimmedQuery)}
              className="flex w-full items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3 text-left transition-colors hover:bg-slate-100 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-[#C8102E] shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    Load stop code <span className="font-mono tabular-nums">{trimmedQuery}</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Query arrival timings for custom 5-digit stop code
                  </div>
                </div>
              </div>
              <span className="text-xs font-semibold text-[#C8102E]">Open stop</span>
            </button>
          )}

          {matches.length > 0 ? (
            <ul className="max-h-80 divide-y divide-slate-100 overflow-y-auto">
              {matches.map((stop: BusStop, index: number) => {
                const starred = isFavorite(stop.BusStopCode);
                const highlighted = index === highlightedIndex;
                return (
                  <li
                    key={stop.BusStopCode}
                    className={`flex items-center justify-between gap-3 px-4 py-2.5 transition-colors ${
                      highlighted ? 'bg-slate-50' : 'hover:bg-slate-50'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleChooseStop(stop.BusStopCode)}
                      className="flex min-w-0 flex-1 items-center gap-3.5 text-left cursor-pointer"
                    >
                      <span className="w-14 shrink-0 font-mono text-sm font-semibold tabular-nums text-slate-900">
                        {stop.BusStopCode}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold text-slate-900">
                          {stop.Description}
                        </div>
                        <div className="flex items-center gap-1.5 truncate text-xs text-slate-500">
                          <span>{stop.RoadName}</span>
                          {stop.NearbyMRT && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span>{stop.NearbyMRT}</span>
                            </>
                          )}
                          <span aria-hidden="true">·</span>
                          <span>{stop.Services.length} buses</span>
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(stop.BusStopCode);
                      }}
                      aria-label={
                        starred
                          ? `Remove ${stop.BusStopCode} from favorites`
                          : `Save ${stop.BusStopCode} to favorites`
                      }
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-amber-500 cursor-pointer"
                    >
                      <Star
                        className={`h-4 w-4 ${
                          starred ? 'fill-amber-400 text-amber-500' : ''
                        }`}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="px-4 py-6 text-center text-sm text-slate-500">
              No bus stops match "{query}". Try a 5-digit code like{' '}
              <button
                type="button"
                onClick={() => handleChooseStop('09047')}
                className="font-mono font-semibold text-[#C8102E] underline underline-offset-2 cursor-pointer"
              >
                09047
              </button>{' '}
              or search a road name like Orchard or Victoria St.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
