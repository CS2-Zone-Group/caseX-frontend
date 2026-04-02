'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import FilterPanel from '@/components/FilterPanel';
import SkinDetailsModal from '@/components/SkinDetailsModal';
import api from '@/lib/api';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useTranslations } from 'next-intl';
import { formatPrice } from '@/lib/currency';
import { useFilterStore } from '@/store/filterStore';
import { useSearchParams } from 'next/navigation';
import FavoriteButton from '@/components/FavoriteButton';
import TargetBidModal from '@/components/TargetBidModal';
import { toast } from '@/store/toastStore';
import Loader from '@/components/Loader';
import { getRarityStyle } from '@/lib/rarity';
import { useMarketplaceSocket, ItemListedPayload, ItemSoldPayload, ItemUnlistedPayload } from '@/lib/socket';

interface Skin {
  id: string;
  name: string;
  weaponType: string;
  rarity: string;
  exterior: string;
  price: number;
  imageUrl: string;
  float?: number;
  tradeLockUntil?: string | null;
  isUserListing?: boolean;
  inventoryId?: string;
  sellerId?: string;
  sellerName?: string;
}

function MarketplaceContent() {
  const searchParams = useSearchParams();
  const { user, hasHydrated } = useAuthStore();
  const { addToCart } = useCartStore();
  const { currency } = useSettingsStore();
  const t = useTranslations('MarketplacePage');

  const [skins, setSkins] = useState<Skin[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [selectedSkin, setSelectedSkin] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [bidModalOpen, setBidModalOpen] = useState(false);

  const category = searchParams.get('category');

  const {
    searchQuery,
    sortBy,
    rarity,
    weaponType,
    subCategory,
    collection,
    condition,
    priceRange,
    paintSeed,
    sticker,
    setSortBy,
    resetFilters
  } = useFilterStore();

  useEffect(() => {
    document.title = `${t('marketplace')} - CaseX`;
  }, [t]);

  const fetchMarketItems = useCallback(async () => {
    setLoading(true);
    try {
      let sortField = 'createdAt';
      let sortOrder = 'DESC';

      if (sortBy && sortBy !== 'default') {
        if (sortBy.includes('-')) {
          const parts = sortBy.split('-');
          sortField = parts[0];
          sortOrder = parts[1];
        } else {
           sortField = sortBy;
        }
      }

      const params: Record<string, any> = {
        sortBy: sortField,
        sortOrder: sortOrder,
        page: 1,
        limit: 50,
      };

      if (searchQuery) params.search = searchQuery;
      if (rarity) params.rarity = rarity;
      if (weaponType) params.weaponType = weaponType;
      if (subCategory) params.subCategory = subCategory;
      if (collection) params.collection = collection;
      if (condition) params.exterior = condition;
      if (priceRange.min > 0) params.minPrice = priceRange.min;
      if (priceRange.max > 0) params.maxPrice = priceRange.max;
      if (paintSeed) params.paintSeed = paintSeed;
      if (sticker) params.sticker = sticker;

      const { data } = await api.get('/skins', { params });
      let fetchedSkins: Skin[] = [];

      if (Array.isArray(data)) {
        fetchedSkins = data;
      } else if (data.items && Array.isArray(data.items)) {
         fetchedSkins = data.items;
      } else if (data.data && Array.isArray(data.data)) {
         fetchedSkins = data.data;
      }

      if(category){
        fetchedSkins = fetchedSkins.filter(skin => {
          const searchCat = category.toLowerCase();
          const type = skin.weaponType?.toLowerCase() || "";
          const name = skin.name?.toLowerCase() || "";
          return type.includes(searchCat) || name.includes(searchCat);
        });
      }

      setSkins(fetchedSkins);

    } catch (error) {
      console.error('Marketplace fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, sortBy, rarity, weaponType, subCategory, collection, condition, priceRange, paintSeed, sticker, category]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMarketItems();
    }, 500);

    return () => clearTimeout(timer);
  }, [fetchMarketItems]);

  useEffect(() => {
    const openSkinId = searchParams.get('openSkin');
    if (openSkinId && skins.length > 0) {
      const skinToOpen = skins.find(skin => skin.id === openSkinId);
      if (skinToOpen) {
        openSkinDetails(skinToOpen);
      }
    }
  }, [searchParams, skins]);

  // Real-time marketplace updates via WebSocket
  useMarketplaceSocket({
    'item:listed': (payload: ItemListedPayload) => {
      setSkins((prev) => {
        // Avoid duplicates
        if (prev.some((s) => s.id === payload.skinId)) return prev;
        const newSkin: Skin = {
          id: payload.skinId,
          name: payload.name,
          price: payload.price,
          imageUrl: payload.imageUrl,
          weaponType: payload.weaponType || '',
          rarity: payload.rarity || '',
          exterior: payload.exterior || '',
          float: payload.float,
          isUserListing: true,
          inventoryId: payload.inventoryId,
          sellerName: payload.seller,
        };
        return [newSkin, ...prev];
      });
    },
    'item:sold': (payload: ItemSoldPayload) => {
      setSkins((prev) =>
        prev.filter((s) => {
          if (payload.inventoryId && s.inventoryId === payload.inventoryId) return false;
          if (s.id === payload.skinId) return false;
          return true;
        }),
      );
      // Also remove from selection if selected
      setSelectedItems((prev) => {
        const next = new Set(prev);
        if (payload.inventoryId) next.delete(payload.inventoryId);
        next.delete(payload.skinId);
        return next;
      });
    },
    'item:unlisted': (payload: ItemUnlistedPayload) => {
      setSkins((prev) =>
        prev.filter((s) => {
          if (payload.inventoryId && s.inventoryId === payload.inventoryId) return false;
          if (s.id === payload.skinId && s.isUserListing) return false;
          return true;
        }),
      );
      setSelectedItems((prev) => {
        const next = new Set(prev);
        if (payload.inventoryId) next.delete(payload.inventoryId);
        next.delete(payload.skinId);
        return next;
      });
    },
  });

  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  const handleAddToCart = async (skinId: string) => {
    if (!hasHydrated || !user) {
      toast.info(t('pleaseLogin'));
      return;
    }

    setAddingToCart(skinId);
    try {
      await addToCart(skinId);
      toast.success(t('addedToCart'));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setAddingToCart(null);
    }
  };

  const handleBuyListing = async (inventoryId: string) => {
    if (!hasHydrated || !user) {
      toast.info(t('pleaseLogin'));
      return;
    }
    try {
      await api.post(`/orders/buy-listing/${inventoryId}`);
      const { fetchUserBalance } = useAuthStore.getState();
      await fetchUserBalance();
      toast.success(t('purchaseSuccess'));
      fetchMarketItems();
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('purchaseError'));
    }
  };

  const openSkinDetails = (skin: Skin) => {
    setSelectedSkin(skin);
    setIsModalOpen(true);
  };

  const closeSkinDetails = () => {
    setIsModalOpen(false);
    setSelectedSkin(null);
  };

  const getItemKey = (skin: Skin) => skin.inventoryId || skin.id;

  const toggleSelectItem = (skin: Skin) => {
    const key = getItemKey(skin);
    setSelectedItems(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const clearSelection = () => setSelectedItems(new Set());

  const selectedSkins = skins.filter(s => selectedItems.has(getItemKey(s)));
  const selectedTotal = selectedSkins.reduce((sum, s) => sum + Number(s.price), 0);

  const handleAddSelectedToCart = async () => {
    if (!hasHydrated || !user) {
      toast.info(t('pleaseLogin'));
      return;
    }
    try {
      for (const skin of selectedSkins) {
        await addToCart(skin.id);
      }
      toast.success(t('addedAllToCart'));
      clearSelection();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />

      <div className="max-w-[1600px] mx-auto px-2 sm:px-3 lg:px-4 py-4 pt-20">
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
                  title={t('filters')}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </button>
                <button
                  className="p-2 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
                  title={t('refresh')}
                  onClick={() => fetchMarketItems()}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold text-gray-900 dark:text-white">{skins.length}</span> {t('itemsCount')}
                </span>
              </div>

              <select
                value={sortBy === 'default' ? 'createdAt-DESC' : sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm appearance-none bg-no-repeat bg-[length:16px] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQgNkw4IDEwTDEyIDYiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cg==')] bg-[position:right_0.5rem_center] pr-8"
              >
                <option value="createdAt-DESC">{t('sortNewest')}</option>
                <option value="price-DESC">{t('priceHighToLow')}</option>
                <option value="price-ASC">{t('priceLowToHigh')}</option>
                <option value="name-ASC">{t('nameAtoZ')}</option>
              </select>
            </div>

            {loading ? (
              <Loader />
            ) : skins.length === 0 ? (
              <div className="text-center py-20">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {t('noSkinsFound')}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  {t('tryDifferentFilters')}
                </p>
                <button onClick={resetFilters} className="text-sm text-primary-600 hover:underline">
                  {t('clearFilters')}
                </button>
              </div>
            ) : (
              <div className={`grid gap-2 ${
                filtersVisible
                  ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5'
                  : 'grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7'
              }`}>
                {skins.map((skin) => {
                  const lockDate = skin.tradeLockUntil ? new Date(skin.tradeLockUntil) : null;
                  const isLocked = lockDate ? lockDate > new Date() : false;
                  const lockDays = isLocked && lockDate ? Math.ceil((lockDate.getTime() - Date.now()) / 86400000) : 0;
                  const itemKey = getItemKey(skin);
                  const isSelected = selectedItems.has(itemKey);
                  return (
                  <div
                    key={itemKey}
                    onClick={() => toggleSelectItem(skin)}
                    className={`group bg-white dark:bg-gray-900 rounded-lg transition-all duration-200 hover:shadow-lg overflow-hidden cursor-pointer ${
                      isSelected
                        ? 'ring-2 ring-primary-500/30'
                        : ''
                    }`}
                    style={{ border: `1px solid ${isSelected ? 'rgb(var(--color-primary-500))' : getRarityStyle(skin.rarity).color + '30'}` }}
                  >
                    <div
                      className="relative aspect-square overflow-hidden"
                      style={{ background: getRarityStyle(skin.rarity).gradient, backgroundColor: 'rgb(31 41 55 / 0.5)' }}
                    >
                      <img
                        src={skin.imageUrl}
                        alt={skin.name}
                        className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
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
                      {isSelected && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-10">
                          <span className="text-white font-semibold text-sm">{t('selected')}</span>
                        </div>
                      )}
                      <div className="absolute top-2 right-2 flex flex-col gap-1 z-20">
                        <button
                          onClick={(e) => { e.stopPropagation(); openSkinDetails(skin); }}
                          className="w-7 h-7 flex items-center justify-center rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </button>
                        <div onClick={(e) => e.stopPropagation()}>
                          <FavoriteButton skinId={skin.id} className="w-7 h-7 text-base bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm" />
                        </div>
                      </div>
                    </div>

                    <div className="p-2 space-y-1">
                      <h3
                        className="font-medium text-gray-900 dark:text-white text-[11px] leading-tight line-clamp-1"
                        title={skin.name}
                      >
                        {skin.name}
                      </h3>

                      <p className="text-[9px] truncate" style={{ color: getRarityStyle(skin.rarity).color + '99' }}>
                        {skin.exterior}
                      </p>

                      {skin.isUserListing && skin.sellerName && (
                        <div className="flex items-center gap-1">
                          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="text-[9px] text-gray-400 truncate">{skin.sellerName}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-primary-600 dark:text-primary-400">
                          {formatPrice(Number(skin.price), currency)}
                        </span>
                        {skin.isUserListing && skin.sellerId === user?.id ? (
                          <span className="text-[9px] text-gray-400 px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">
                            {t('yourListing')}
                          </span>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(skin.id);
                            }}
                            disabled={addingToCart === skin.id}
                            className="p-1.5 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition disabled:opacity-70"
                            title={t('addToCart')}
                          >
                            {addingToCart === skin.id ? (
                              <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                            ) : (
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                            )}
                          </button>
                        )}
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

      {/* Bottom Action Bar */}
      {selectedItems.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-2xl">
          <div className="max-w-[1600px] mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatPrice(selectedTotal, currency)}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ({selectedItems.size})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setBidModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-all text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <div className="text-left">
                  <div className="leading-tight">{t('targetBid')}</div>
                  <div className="text-[10px] opacity-80">{selectedItems.size} {t('items')}</div>
                </div>
              </button>

              <button
                onClick={handleAddSelectedToCart}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-teal-600 transition-all text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <div className="text-left">
                  <div className="leading-tight">{t('addSelectedToCart')}</div>
                  <div className="text-[10px] opacity-80">{formatPrice(selectedTotal, currency)}</div>
                </div>
              </button>

              <button
                onClick={clearSelection}
                className="flex items-center justify-center w-10 h-10 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition"
                title={t('removeAll')}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <SkinDetailsModal
        isOpen={isModalOpen}
        onClose={closeSkinDetails}
        skin={selectedSkin}
      />

      <TargetBidModal
        isOpen={bidModalOpen}
        onClose={() => setBidModalOpen(false)}
        skins={selectedSkins}
        currency={currency}
        onSuccess={clearSelection}
      />
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={<Loader fullScreen />}>
      <MarketplaceContent />
    </Suspense>
  );
}
