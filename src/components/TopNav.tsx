import React from 'react';
import { RefreshCw } from 'lucide-react';

export type AppView = 'arrivals' | 'directory' | 'favorites';

interface TopNavProps {
  activeView: AppView;
  onSelectView: (view: AppView) => void;
  onOpenApiModal: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeView,
  onSelectView,
  onOpenApiModal,
  onRefresh,
  isRefreshing,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => onSelectView('arrivals')}
          className="font-display text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8102E] rounded-md px-1 -ml-1 cursor-pointer"
        >
          SG BusTiming
        </button>

        {/* Zone 2: 4 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            type="button"
            onClick={() => onSelectView('arrivals')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
              activeView === 'arrivals'
                ? 'border-[#C8102E] text-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            Live Arrivals
          </button>
          <button
            type="button"
            onClick={() => onSelectView('favorites')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
              activeView === 'favorites'
                ? 'border-[#C8102E] text-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            Favorites
          </button>
          <button
            type="button"
            onClick={() => onSelectView('directory')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
              activeView === 'directory'
                ? 'border-[#C8102E] text-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            Stops Directory
          </button>
          <button
            type="button"
            onClick={onOpenApiModal}
            className="py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 border-transparent hover:text-slate-900 hover:border-slate-300"
          >
            API Adapter
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 rounded-lg bg-[#C8102E] px-4 py-2 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-[#A60D26] active:scale-[0.98] disabled:opacity-70 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8102E] focus-visible:ring-offset-2"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh Timings</span>
          </button>
        </div>
      </div>
    </header>
  );
};
