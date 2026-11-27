import React, { useState } from 'react';
import { Check, Clock, Pencil, Star, Trash2, X } from 'lucide-react';
import { getBusStopByCode } from '../services/busApi';
import { FavoriteStop } from '../types/bus';

interface FavoritesSidebarProps {
  favorites: FavoriteStop[];
  recentCodes: string[];
  selectedStopCode: string;
  onSelectStop: (code: string) => void;
  onToggleFavorite: (code: string) => void;
  onUpdateNickname: (code: string, nickname: string) => void;
}

export const FavoritesSidebar: React.FC<FavoritesSidebarProps> = ({
  favorites,
  recentCodes,
  selectedStopCode,
  onSelectStop,
  onToggleFavorite,
  onUpdateNickname,
}) => {
  const [editingCode, setEditingCode] = useState<string | null>(null);
  const [draftName, setDraftName] = useState('');

  const startEdit = (fav: FavoriteStop, fallbackName: string) => {
    setEditingCode(fav.BusStopCode);
    setDraftName(fav.nickname ?? fallbackName);
  };

  const commitEdit = (code: string) => {
    onUpdateNickname(code, draftName);
    setEditingCode(null);
  };

  return (
    <aside className="rounded-xl border border-slate-200 bg-white">
      {/* Favorites Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="font-display text-base font-semibold text-slate-900">
            Saved Stops
          </h2>
          <p className="text-xs text-slate-500">
            {favorites.length === 0
              ? 'Star any stop for one-tap access'
              : `${favorites.length} favorite ${favorites.length === 1 ? 'stop' : 'stops'}`}
          </p>
        </div>
        <Star className="h-4 w-4 text-amber-500 fill-amber-400" aria-hidden="true" />
      </div>

      {/* Favorites List or Empty State */}
      {favorites.length === 0 ? (
        <div className="px-5 py-8 text-center">
          <p className="text-sm font-medium text-slate-700">No saved stops yet</p>
          <p className="mt-1 text-xs text-slate-500">
            Use the star button on any bus stop to save your daily commute stops here.
          </p>
          <button
            type="button"
            onClick={() => onToggleFavorite('09047')}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <Star className="h-3.5 w-3.5 text-amber-500" />
            <span>Save 09047 · Orchard Stn</span>
          </button>
        </div>
      ) : (
        <ul className="divide-y divide-slate-100">
          {favorites.map((fav) => {
            const stop = getBusStopByCode(fav.BusStopCode);
            const active = selectedStopCode === fav.BusStopCode;
            const isEditing = editingCode === fav.BusStopCode;
            const displayTitle =
              fav.nickname || stop?.Description || `Bus Stop ${fav.BusStopCode}`;

            return (
              <li
                key={fav.BusStopCode}
                className={`transition-colors ${
                  active ? 'bg-slate-50' : 'hover:bg-slate-50/70'
                }`}
              >
                {isEditing ? (
                  <div className="px-4 py-3">
                    <label
                      htmlFor={`edit-fav-${fav.BusStopCode}`}
                      className="block text-[11px] font-medium text-slate-500 mb-1"
                    >
                      Custom label for {fav.BusStopCode}
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        id={`edit-fav-${fav.BusStopCode}`}
                        type="text"
                        value={draftName}
                        onChange={(e) => setDraftName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') commitEdit(fav.BusStopCode);
                          if (e.key === 'Escape') setEditingCode(null);
                        }}
                        autoFocus
                        className="h-9 flex-1 rounded-lg border border-slate-300 bg-white px-2.5 text-sm text-slate-900 focus:border-[#C8102E] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => commitEdit(fav.BusStopCode)}
                        aria-label="Save label"
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white hover:bg-slate-800 cursor-pointer"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingCode(null)}
                        aria-label="Cancel edit"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 cursor-pointer"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-2 px-4 py-3.5">
                    <button
                      type="button"
                      onClick={() => onSelectStop(fav.BusStopCode)}
                      className="min-w-0 flex-1 text-left cursor-pointer focus-visible:outline-none"
                    >
                      <div className="flex items-baseline gap-2">
                        <span
                          className={`font-mono text-xs font-semibold tabular-nums ${
                            active ? 'text-[#C8102E]' : 'text-slate-500'
                          }`}
                        >
                          {fav.BusStopCode}
                        </span>
                        <span className="truncate text-sm font-semibold text-slate-900">
                          {displayTitle}
                        </span>
                      </div>

                      <div className="mt-0.5 truncate text-xs text-slate-500">
                        {stop ? `${stop.Description} · ${stop.RoadName}` : 'Custom Stop Code'}
                      </div>

                      {fav.pinnedServices.length > 0 && (
                        <div className="mt-1.5 text-xs text-slate-600 font-mono tabular-nums truncate">
                          Pinned: {fav.pinnedServices.join(' · ')}
                        </div>
                      )}
                    </button>

                    <div className="flex items-center shrink-0">
                      <button
                        type="button"
                        onClick={() => startEdit(fav, stop?.Description ?? '')}
                        aria-label={`Rename stop ${fav.BusStopCode}`}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleFavorite(fav.BusStopCode)}
                        aria-label={`Remove ${fav.BusStopCode} from favorites`}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {/* Recent Stops */}
      {recentCodes.length > 0 && (
        <div className="border-t border-slate-200 px-5 py-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-2.5">
            <Clock className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
            <span>Recent Stops</span>
          </div>
          <div className="space-y-1">
            {recentCodes.map((code) => {
              const stop = getBusStopByCode(code);
              const active = selectedStopCode === code;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => onSelectStop(code)}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs transition-colors cursor-pointer ${
                    active
                      ? 'bg-slate-100 font-semibold text-slate-900'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className="font-mono font-semibold tabular-nums text-slate-700">
                    {code}
                  </span>
                  <span className="truncate">
                    {stop?.Description ?? `Stop ${code}`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
};
