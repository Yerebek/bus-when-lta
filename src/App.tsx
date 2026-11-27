import { useCallback, useEffect, useMemo, useState } from 'react';
import { ApiSchemaModal } from './components/ApiSchemaModal';
import { ArrivalBoard } from './components/ArrivalBoard';
import { FavoritesSidebar } from './components/FavoritesSidebar';
import { SearchBar } from './components/SearchBar';
import { StopsDirectoryView } from './components/StopsDirectoryView';
import { AppView, TopNav } from './components/TopNav';
import { useFavorites } from './hooks/useFavorites';
import { fetchBusArrivals, getBusStopByCode } from './services/busApi';
import { BusArrivalResponse } from './types/bus';

const AUTO_REFRESH_INTERVAL_SEC = 30;

export default function App() {
  const [activeView, setActiveView] = useState<AppView>('arrivals');
  const [selectedStopCode, setSelectedStopCode] = useState<string>('09047');
  const [arrivals, setArrivals] = useState<BusArrivalResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [nowMs, setNowMs] = useState<number>(() => Date.now());
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [secondsToRefresh, setSecondsToRefresh] = useState<number>(AUTO_REFRESH_INTERVAL_SEC);
  const [isApiModalOpen, setIsApiModalOpen] = useState<boolean>(false);

  const {
    favorites,
    recentCodes,
    isFavorite,
    getFavorite,
    toggleFavorite,
    updateNickname,
    togglePinnedService,
    recordRecent,
  } = useFavorites();

  const loadStopArrivals = useCallback(async (code: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchBusArrivals(code);
      setArrivals(data);
      setNowMs(Date.now());
      setSecondsToRefresh(AUTO_REFRESH_INTERVAL_SEC);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load bus arrival timings.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load initial stop and whenever selectedStopCode changes
  useEffect(() => {
    loadStopArrivals(selectedStopCode);
  }, [selectedStopCode, loadStopArrivals]);

  // 1-second clock tick for live minute countdowns + auto-refresh countdown
  useEffect(() => {
    const timer = window.setInterval(() => {
      setNowMs(Date.now());
      if (autoRefresh) {
        setSecondsToRefresh((prev) => {
          if (prev <= 1) {
            loadStopArrivals(selectedStopCode);
            return AUTO_REFRESH_INTERVAL_SEC;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => window.clearInterval(timer);
  }, [autoRefresh, selectedStopCode, loadStopArrivals]);

  const handleSelectStop = useCallback(
    (code: string) => {
      setSelectedStopCode(code);
      recordRecent(code);
      setActiveView('arrivals');
    },
    [recordRecent]
  );

  const handleManualRefresh = useCallback(() => {
    loadStopArrivals(selectedStopCode);
  }, [loadStopArrivals, selectedStopCode]);

  const selectedStopMeta = useMemo(
    () => getBusStopByCode(selectedStopCode),
    [selectedStopCode]
  );

  const favoriteForSelected = getFavorite(selectedStopCode);

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F7F8] text-slate-900">
      <TopNav
        activeView={activeView}
        onSelectView={setActiveView}
        onOpenApiModal={() => setIsApiModalOpen(true)}
        onRefresh={handleManualRefresh}
        isRefreshing={isLoading}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        {/* Search & Quick Bus Stop Code Bar */}
        <section aria-label="Search Singapore bus stops" className="mb-6">
          <SearchBar
            selectedStopCode={selectedStopCode}
            onSelectStop={handleSelectStop}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
          />
        </section>

        {/* Mobile View Switcher (kept non-sticky to preserve viewport space) */}
        <div className="mb-5 flex md:hidden items-center gap-1 rounded-lg bg-slate-200/70 p-1">
          <button
            type="button"
            onClick={() => setActiveView('arrivals')}
            className={`flex-1 rounded-md py-2 text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
              activeView === 'arrivals'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600'
            }`}
          >
            Live Arrivals
          </button>
          <button
            type="button"
            onClick={() => setActiveView('favorites')}
            className={`flex-1 rounded-md py-2 text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
              activeView === 'favorites'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600'
            }`}
          >
            Favorites ({favorites.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveView('directory')}
            className={`flex-1 rounded-md py-2 text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
              activeView === 'directory'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600'
            }`}
          >
            Directory
          </button>
        </div>

        {/* Main Workspace */}
        {activeView === 'directory' ? (
          <StopsDirectoryView
            selectedStopCode={selectedStopCode}
            onSelectStop={handleSelectStop}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
          />
        ) : activeView === 'favorites' ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
            <div className="lg:col-span-5">
              <FavoritesSidebar
                favorites={favorites}
                recentCodes={recentCodes}
                selectedStopCode={selectedStopCode}
                onSelectStop={handleSelectStop}
                onToggleFavorite={toggleFavorite}
                onUpdateNickname={updateNickname}
              />
            </div>
            <div className="hidden lg:block lg:col-span-7">
              <ArrivalBoard
                stop={selectedStopMeta}
                stopCode={selectedStopCode}
                arrivals={arrivals}
                nowMs={nowMs}
                isLoading={isLoading}
                error={error}
                isFavorite={isFavorite(selectedStopCode)}
                favoriteData={favoriteForSelected}
                autoRefresh={autoRefresh}
                secondsToRefresh={secondsToRefresh}
                onToggleAutoRefresh={() => setAutoRefresh((v) => !v)}
                onRefresh={handleManualRefresh}
                onToggleFavorite={() => toggleFavorite(selectedStopCode)}
                onTogglePinnedService={(svc) =>
                  togglePinnedService(selectedStopCode, svc)
                }
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
            <div className="hidden lg:block lg:col-span-4 xl:col-span-3">
              <FavoritesSidebar
                favorites={favorites}
                recentCodes={recentCodes}
                selectedStopCode={selectedStopCode}
                onSelectStop={handleSelectStop}
                onToggleFavorite={toggleFavorite}
                onUpdateNickname={updateNickname}
              />
            </div>

            <div className="lg:col-span-8 xl:col-span-9">
              <ArrivalBoard
                stop={selectedStopMeta}
                stopCode={selectedStopCode}
                arrivals={arrivals}
                nowMs={nowMs}
                isLoading={isLoading}
                error={error}
                isFavorite={isFavorite(selectedStopCode)}
                favoriteData={favoriteForSelected}
                autoRefresh={autoRefresh}
                secondsToRefresh={secondsToRefresh}
                onToggleAutoRefresh={() => setAutoRefresh((v) => !v)}
                onRefresh={handleManualRefresh}
                onToggleFavorite={() => toggleFavorite(selectedStopCode)}
                onTogglePinnedService={(svc) =>
                  togglePinnedService(selectedStopCode, svc)
                }
              />
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <span>
            SG BusTiming · Frontend preview using simulated Singapore LTA DataMall arrival timings
          </span>
          <button
            type="button"
            onClick={() => setIsApiModalOpen(true)}
            className="text-left font-medium text-slate-700 hover:text-[#C8102E] hover:underline underline-offset-4 cursor-pointer"
          >
            View LTA DataMall API adapter guide
          </button>
        </div>
      </footer>

      <ApiSchemaModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
      />
    </div>
  );
}
