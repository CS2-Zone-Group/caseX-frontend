'use client'
import React, { useEffect, useState, useMemo } from 'react';
import FavoriteButton from '@/components/FavoriteButton';
import FilterPanel from '@/components/FilterPanel';
import SkinDetailsModal from '@/components/SkinDetailsModal';
import { formatPrice } from '@/lib/currency';
import { useTranslations } from 'next-intl';
import { useSettingsStore } from '@/store/settingsStore';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useFavouritesStore } from '@/store/favouritesStore';
import { useFilterStore } from '@/store/filterStore';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import AuthGuard from '@/components/AuthGuard';
import { getRarityStyle } from '@/lib/rarity';
import { toast } from '@/store/toastStore';

export default function FavoritesPage() {
  const { addToCart } = useCartStore();
  const { currency } = useSettingsStore();
  const t = useTranslations('FavoritesPage');
  const tCommon = useTranslations('Common');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSkin, setSelectedSkin] = useState<any>(null);
  const [filtersVisible, setFiltersVisible] = useState(true);

  const { user, hasHydrated } = useAuthStore();
  const { favouriteIds, fetchFavouriteIds } = useFavouritesStore();
  const {
    searchQuery,
    sortBy,
    rarity,
    weaponType,
    condition,
    priceRange,
    resetFilters,
    setSortBy,
  } = useFilterStore();

  useEffect(() => {
    document.title = `${t('title')} - CaseX`;
  }, [t]);

  useEffect(() => {
    resetFilters();
  }, []);

  // Favorites IDs o'zgarganida itemlarni yangilash
  useEffect(() => {
    if (favouriteIds.length === 0) {
      setItems([]);
      return;
    }

    setItems(prevItems => {
      const filteredItems = prevItems.filter(item => favouriteIds.includes(item.id));
      return filteredItems;
    });
  }, [favouriteIds]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!hasHydrated || !user) {
        setLoading(false);
        return;
      }

      try {
        await fetchFavouriteIds();
        const { data } = await api.get('/favorites');

        let favoritesData = [];
        if (Array.isArray(data)) {
          favoritesData = data;
        } else if (data.favorites && Array.isArray(data.favorites)) {
          favoritesData = data.favorites;
        } else if (data.data && Array.isArray(data.data)) {
          favoritesData = data.data;
        } else if (data.items && Array.isArray(data.items)) {
          favoritesData = data.items;
        }

        setItems(favoritesData);
      } catch (error) {
        console.error('Favorites fetch error:', error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [hasHydrated, user, fetchFavouriteIds]);

  // Client-side filtering
  const filteredItems = useMemo(() => {
    let result = items.filter(item => favouriteIds.includes(item.id));

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(item =>
        item.name?.toLowerCase().includes(lowerQuery)
      );
    }

    if (rarity) {
      result = result.filter(item =>
        item.rarity?.toLowerCase() === rarity.toLowerCase()
      );
    }

    if (weaponType) {
      result = result.filter(item =>
        item.weaponType?.toLowerCase() === weaponType.toLowerCase()
      );
    }

    if (condition) {
      result = result.filter(item =>
        item.exterior?.toLowerCase() === condition.toLowerCase()
      );
    }

    if (priceRange.min > 0 || priceRange.max > 0) {
      result = result.filter(item => {
        const price = Number(item.price) || 0;
        const minOk = priceRange.min > 0 ? price >= priceRange.min : true;
        const maxOk = priceRange.max > 0 ? price <= priceRange.max : true;
        return minOk && maxOk;
      });
    }

    if (sortBy && sortBy !== 'default') {
      const [field, order] = sortBy.includes('-') ? sortBy.split('-') : [sortBy, 'DESC'];
      result.sort((a, b) => {
        let valA: any = 0;
        let valB: any = 0;
        if (field === 'price') {
          valA = Number(a.price) || 0;
          valB = Number(b.price) || 0;
        } else if (field === 'name') {
          valA = a.name || '';
          valB = b.name || '';
        }
        if (valA < valB) return order === 'ASC' ? -1 : 1;
        if (valA > valB) return order === 'ASC' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [items, favouriteIds, searchQuery, sortBy, rarity, weaponType, condition, priceRange]);

  const handleAddToCart = async (skinId: string) => {
    if (!hasHydrated || !user) {
      toast.info(t('pleaseLogin'));
      return;
    }

    try {
      await addToCart(skinId);
      toast.success(t('addedToCart'));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <Navbar />
          <div className="container mx-auto px-4 py-8 pt-32 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-600 border-t-transparent mx-auto mb-3"></div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{tCommon('loading')}</p>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Navbar />

        <div className="max-w-[1600px] mx-auto py-4 pt-20 px-2 sm:px-3 lg:px-4">
          <div className="flex flex-col lg:flex-row gap-3 lg:gap-4">

            {/* Filter Panel */}
            <FilterPanel
              isVisible={filtersVisible}
              onToggle={() => setFiltersVisible(false)}
            />

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-center justify-between mb-4 gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFiltersVisible(!filtersVisible)}
                    className={`p-2 rounded-lg border transition-colors ${
                      filtersVisible
                        ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-700 text-primary-600'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                  </button>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold text-gray-900 dark:text-white">{t('title')}</span>
                    {' '}({filteredItems.length}{t('count')})
                  </span>
                </div>

                <select
                  value={sortBy === 'default' ? 'createdAt-DESC' : sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm appearance-none bg-no-repeat bg-[length:16px] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQgNkw4IDEwTDEyIDYiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cg==')] bg-[position:right_0.5rem_center] pr-8"
                >
                  <option value="createdAt-DESC">{tCommon('sortNewest')}</option>
                  <option value="price-DESC">{tCommon('priceHighToLow')}</option>
                  <option value="price-ASC">{tCommon('priceLowToHigh')}</option>
                  <option value="name-ASC">{tCommon('nameAtoZ')}</option>
                </select>
              </div>

              {filteredItems.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {t('noFavorites')}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mx-auto">
                    {t('noFavoritesDescription')}
                  </p>
                </div>
              ) : (
                <div className={`grid gap-2 ${
                  filtersVisible
                    ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5'
                    : 'grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7'
                }`}>
                  {filteredItems.map((skin: any) => {
                    const lockDate = skin.tradeLockUntil ? new Date(skin.tradeLockUntil) : null;
                    const isLocked = lockDate ? lockDate > new Date() : false;
                    const lockDays = isLocked && lockDate ? Math.ceil((lockDate.getTime() - Date.now()) / 86400000) : 0;
                    return (
                    <div
                      key={skin.id}
                      className="group bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700/50 hover:border-primary-300 dark:hover:border-primary-600/50 transition-all duration-200 hover:shadow-lg overflow-hidden"
                    >
                      <div
                        className="relative aspect-square overflow-hidden"
                        style={{ background: getRarityStyle(skin.rarity).gradient, backgroundColor: 'rgb(31 41 55 / 0.5)' }}
                      >
                        <img
                          src={skin.imageUrl}
                          alt={skin.name}
                          className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                        />
                        {isLocked ? (
                          <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-500/90 backdrop-blur-sm text-white text-[10px] font-medium">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 018 0v4" /></svg>
                            <span>{lockDays}d</span>
                          </div>
                        ) : (
                          <div className="absolute top-2 left-2 flex items-center gap-1 p-1 rounded bg-green-500/80 backdrop-blur-sm text-white">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 018 0" /></svg>
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 px-2 py-1 bg-gradient-to-t from-black/60 to-transparent">
                          <div className="flex items-center gap-1.5">
                            <div className="flex-1 h-1 rounded-full bg-gray-600 overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${(skin.float || 0) * 100}%`, background: (skin.float || 0) < 0.07 ? '#22c55e' : (skin.float || 0) < 0.15 ? '#84cc16' : (skin.float || 0) < 0.38 ? '#eab308' : (skin.float || 0) < 0.45 ? '#f97316' : '#ef4444' }} />
                            </div>
                            <span className="text-[9px] font-mono text-white/80">{skin.float ? parseFloat(String(skin.float)).toFixed(4) : ''}</span>
                          </div>
                        </div>
                        <div className="absolute top-2 right-2 flex flex-col gap-1">
                          <button
                            onClick={() => setSelectedSkin(skin)}
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </button>
                          <FavoriteButton skinId={skin.id} className="w-7 h-7 text-base bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm" />
                        </div>
                      </div>

                      <div className="p-3 space-y-1.5">
                        <h3
                          className="font-medium text-gray-900 dark:text-white text-xs leading-tight line-clamp-2 min-h-[2rem]"
                        >
                          {skin.name}
                        </h3>

                        <p className="text-[10px] text-gray-400/80 dark:text-gray-500/80 truncate">
                          {skin.exterior}
                        </p>

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                            {formatPrice(Number(skin.price), currency)}
                          </span>
                          <button
                            onClick={() => handleAddToCart(skin.id)}
                            className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                            title={t('addToCart')}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <SkinDetailsModal
          isOpen={!!selectedSkin}
          onClose={() => setSelectedSkin(null)}
          skin={selectedSkin}
        />
      </div>
    </AuthGuard>
  );
}
