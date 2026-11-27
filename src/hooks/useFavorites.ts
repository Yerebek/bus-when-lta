import { useCallback, useEffect, useState } from 'react';
import { FavoriteStop } from '../types/bus';

const FAVORITES_KEY = 'sg_bustiming_favorites_v1';
const RECENTS_KEY = 'sg_bustiming_recents_v1';

const DEFAULT_FAVORITES: FavoriteStop[] = [
  {
    BusStopCode: '09047',
    nickname: 'Orchard Commute',
    pinnedServices: ['14', '106', '190'],
    addedAt: 1730000000000,
  },
  {
    BusStopCode: '01113',
    nickname: 'Bugis Transfer',
    pinnedServices: ['7', '175'],
    addedAt: 1730000001000,
  },
  {
    BusStopCode: '14141',
    nickname: 'HarbourFront',
    pinnedServices: ['65', '97'],
    addedAt: 1730000002000,
  },
];

function readStoredFavorites(): FavoriteStop[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (raw === null) {
      return DEFAULT_FAVORITES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_FAVORITES;
  } catch {
    return DEFAULT_FAVORITES;
  }
}

function readStoredRecents(): string[] {
  try {
    const raw = localStorage.getItem(RECENTS_KEY);
    if (!raw) return ['09047', '03211', '75009'];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : ['09047', '03211', '75009'];
  } catch {
    return ['09047', '03211', '75009'];
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteStop[]>(readStoredFavorites);
  const [recentCodes, setRecentCodes] = useState<string[]>(readStoredRecents);

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch {
      // Ignore storage quota errors
    }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem(RECENTS_KEY, JSON.stringify(recentCodes));
    } catch {
      // Ignore storage quota errors
    }
  }, [recentCodes]);

  const isFavorite = useCallback(
    (code: string) => favorites.some((f) => f.BusStopCode === code),
    [favorites]
  );

  const getFavorite = useCallback(
    (code: string) => favorites.find((f) => f.BusStopCode === code),
    [favorites]
  );

  const toggleFavorite = useCallback((code: string) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.BusStopCode === code);
      if (exists) {
        return prev.filter((f) => f.BusStopCode !== code);
      }
      return [
        {
          BusStopCode: code,
          pinnedServices: [],
          addedAt: Date.now(),
        },
        ...prev,
      ];
    });
  }, []);

  const updateNickname = useCallback((code: string, nickname: string) => {
    const trimmed = nickname.trim();
    setFavorites((prev) =>
      prev.map((f) =>
        f.BusStopCode === code
          ? { ...f, nickname: trimmed || undefined }
          : f
      )
    );
  }, []);

  const togglePinnedService = useCallback((stopCode: string, serviceNo: string) => {
    setFavorites((prev) => {
      const exists = prev.find((f) => f.BusStopCode === stopCode);
      if (!exists) {
        // Automatically save stop to favorites when pinning a bus service there
        return [
          {
            BusStopCode: stopCode,
            pinnedServices: [serviceNo],
            addedAt: Date.now(),
          },
          ...prev,
        ];
      }
      return prev.map((f) => {
        if (f.BusStopCode !== stopCode) return f;
        const alreadyPinned = f.pinnedServices.includes(serviceNo);
        return {
          ...f,
          pinnedServices: alreadyPinned
            ? f.pinnedServices.filter((s) => s !== serviceNo)
            : [...f.pinnedServices, serviceNo],
        };
      });
    });
  }, []);

  const recordRecent = useCallback((code: string) => {
    setRecentCodes((prev) => {
      const filtered = prev.filter((c) => c !== code);
      return [code, ...filtered].slice(0, 6);
    });
  }, []);

  return {
    favorites,
    recentCodes,
    isFavorite,
    getFavorite,
    toggleFavorite,
    updateNickname,
    togglePinnedService,
    recordRecent,
  };
}
