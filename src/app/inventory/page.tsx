'use client';

import { useCallback, useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import AuthGuard from '@/components/AuthGuard';
import FilterPanel from '@/components/FilterPanel';
import SellModal from '@/components/SellModal';
import SkinDetailsModal from '@/components/SkinDetailsModal';
import { formatPrice } from '@/lib/currency';
import { useAuthStore } from '@/store/authStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useTranslations } from 'next-intl';
import api from '@/lib/api';
import { useFilterStore } from '@/store/filterStore';
import { useRouter } from 'next/navigation';

interface InventoryItemType {
  id: string;
  isListed: boolean;
  listPrice: number | null;
  isSteamItem?: boolean;
  highestBid?: number | null;
  bidCount?: number;
  skin: {
    id: string;
    name: string;
    imageUrl: string;
    rarity: string;
    exterior: string;
    weaponType?: string;
    marketHashName?: string;
    price?: number;
    steamPrice?: number;
    float?: number;
  };
}

/** Medals, graffiti, badges, charms, and patches cannot be listed for sale */
function isNonListable(item: InventoryItemType): boolean {
  const name = (item.skin?.name || '').toLowerCase();
  return (
    name.includes('graffiti') ||
    name.includes('medal') ||
    name.includes('badge') ||
    name.includes('charm') ||
    name.includes('patch')
  );
}

export default function InventoryPage() {
  const router = useRouter();
  const { user, fetchUserBalance } = useAuthStore();
  const { currency } = useSettingsStore();
  const t = useTranslations('InventoryPage');

  const {
    searchQuery,
    sortBy,
    rarity,
    weaponType,
    condition,
    priceRange,
    setSortBy,
    resetFilters
  } = useFilterStore();

  const [allItems, setAllItems] = useState<InventoryItemType[]>([]);
  const [filteredItems, setFilteredItems] = useState<InventoryItemType[]>([]);

  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [steamStatus, setSteamStatus] = useState<string>('');
  const [sellLoading, setSellLoading] = useState(false);
  const [sellError, setSellError] = useState<string | null>(null);
  const [sellModalOpen, setSellModalOpen] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [detailsSkin, setDetailsSkin] = useState<any>(null);

  useEffect(() => {
    document.title = `${t('title')} - CaseX`;
  }, [t]);

  useEffect(() => {
    resetFilters();
  }, []);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const fetchInventoryItems = useCallback(async () => {
    if (!user?.id || !isHydrated) return;

    setLoading(true);
    try {
      const params = { userId: user.id };
      const { data } = await api.get('/inventory', { params });

      let rawItems: InventoryItemType[] = [];
      let status = '';

      if (Array.isArray(data)) {
        rawItems = data;
      } else if (data.items && Array.isArray(data.items)) {
        rawItems = data.items;
        status = data.steamStatus || '';
      } else if (data.data && Array.isArray(data.data)) {
        rawItems = data.data;
      }

      setAllItems(rawItems);
      setFilteredItems(rawItems);
      setSteamStatus(status);

    } catch (error) {
      console.error('Inventory fetch error:', error);
      setAllItems([]);
      setFilteredItems([]);
      setSteamStatus('');
    } finally {
      setLoading(false);
    }
  }, [user?.id, isHydrated]);

  useEffect(() => {
    if (!isHydrated || !user?.id) return;
    fetchInventoryItems();
  }, [fetchInventoryItems]);

  // Client-side filtering
  useEffect(() => {
    let result = [...allItems];

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(item =>
        item.skin?.name?.toLowerCase().includes(lowerQuery)
      );
    }

    if (rarity) {
      result = result.filter(item =>
        item.skin?.rarity?.toLowerCase() === rarity.toLowerCase()
      );
    }

    if (weaponType) {
      result = result.filter(item =>
        item.skin?.weaponType?.toLowerCase() === weaponType.toLowerCase()
      );
    }

    if (condition) {
      result = result.filter(item =>
        item.skin?.exterior?.toLowerCase() === condition.toLowerCase()
      );
    }

    if (priceRange.min > 0 || priceRange.max > 0) {
      result = result.filter(item => {
        const price = item.listPrice || item.skin?.price || 0;
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
          valA = a.listPrice || a.skin?.price || 0;
          valB = b.listPrice || b.skin?.price || 0;
        } else if (field === 'name') {
          valA = a.skin?.name || '';
          valB = b.skin?.name || '';
        } else {
          valA = a.id;
          valB = b.id;
        }

        if (valA < valB) return order === 'ASC' ? -1 : 1;
        if (valA > valB) return order === 'ASC' ? 1 : -1;
        return 0;
      });
    }

    // Listed items go to the top
    result.sort((a, b) => {
      if (a.isListed && !b.isListed) return -1;
      if (!a.isListed && b.isListed) return 1;
      return 0;
    });

    setFilteredItems(result);

  }, [allItems, searchQuery, sortBy, rarity, weaponType, condition, priceRange]);


  const handleSelectItem = (id: string) => {
    const item = allItems.find(i => i.id === id);
    if (!item) return;
    if (isNonListable(item) || item.isListed) return;
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const selectedItemsWithBids = allItems.filter(
    (item) => selectedItems.includes(item.id) && !item.isSteamItem && item.highestBid && item.highestBid > 0
  );

  const selectedBidValue = selectedItemsWithBids.reduce(
    (sum, item) => sum + Number(item.highestBid || 0), 0
  );

  const handleSell = async () => {
    if (selectedItemsWithBids.length === 0) return;
    setSellLoading(true);
    setSellError(null);

    try {
      for (const item of selectedItemsWithBids) {
        await api.post(`/orders/sell/${item.id}`);
      }
      await fetchUserBalance();
      setSelectedItems([]);
      await fetchInventoryItems();
    } catch (err: any) {
      setSellError(err.response?.data?.message || t('sellError'));
    } finally {
      setSellLoading(false);
    }
  };

  const handleSellFromModal = async (items: Array<{ inventoryId: string; price: number }>) => {
    for (const { inventoryId, price } of items) {
      if (inventoryId.startsWith('steam_')) {
        const steamItem = allItems.find(i => i.id === inventoryId);
        if (steamItem) {
          await api.post('/inventory/list-steam-item', {
            price,
            skinData: {
              name: steamItem.skin.name,
              imageUrl: steamItem.skin.imageUrl,
              marketHashName: steamItem.skin.marketHashName || steamItem.skin.name,
              rarity: steamItem.skin.rarity,
              exterior: steamItem.skin.exterior,
              weaponType: steamItem.skin.weaponType || 'Unknown',
              float: steamItem.skin.float || 0,
            },
          });
        }
      } else {
        await api.post(`/inventory/${inventoryId}/list`, { price });
      }
    }
    await fetchUserBalance();
    setSelectedItems([]);
    setSellModalOpen(false);
    await fetchInventoryItems();
  };

  const handleSellNowFromModal = async (inventoryIds: string[]) => {
    for (const id of inventoryIds) {
      await api.post(`/orders/sell/${id}`);
    }
    await fetchUserBalance();
    setSelectedItems([]);
    setSellModalOpen(false);
    await fetchInventoryItems();
  };

  const handleWithdraw = async () => {
    if (selectedItems.length === 0) return;
    setWithdrawLoading(true);
    setSellError(null);

    try {
      // TODO: Implement Steam trade withdraw via steam-bot
      // For now show a message
      setSellError(t('withdrawComingSoon'));
    } finally {
      setWithdrawLoading(false);
    }
  };

  const hasListableItems = selectedItems.some(id => {
    const item = allItems.find(i => i.id === id);
    return item && !isNonListable(item);
  });

  const listedCount = filteredItems.filter(item => item.isListed).length;

  const totalInventoryValue = filteredItems.reduce((sum, item) => {
    const price = item.listPrice || item.skin?.price || 0;
    return sum + Number(price);
  }, 0);

  const selectedValue = allItems
    .filter(item => selectedItems.includes(item.id))
    .reduce((sum, item) => {
      const price = item.listPrice || item.skin?.price || 0;
      return sum + Number(price);
    }, 0);

  const handleLinkSteam = () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
    window.location.href = `${backendUrl}/auth/steam/link?token=${token}`;
  };

  const hasSteam = !!user?.steamId;

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Navbar />

        <main className="max-w-[1600px] mx-auto px-2 sm:px-3 lg:px-4 py-4 pt-20">
          {!hasSteam && (
            <div className="mb-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-5 sm:p-6 text-white flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-shrink-0">
                <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg font-bold">{t('linkSteamTitle')}</h3>
                <p className="text-blue-100 text-sm mt-1">{t('linkSteamDescription')}</p>
              </div>
              <button
                onClick={handleLinkSteam}
                className="px-6 py-2.5 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap"
              >
                {t('linkSteamButton')}
              </button>
            </div>
          )}

          {(steamStatus === 'private' || steamStatus === 'rate_limited') && (
            <div className="mb-4 flex items-center gap-3 px-4 py-3 bg-yellow-50 dark:bg-gray-800/60 border border-yellow-200 dark:border-gray-700 rounded-lg text-sm">
              <svg className="w-4 h-4 text-yellow-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300 flex-1">
                {steamStatus === 'private' ? t('steamInventoryPrivateDescription') : t('steamRateLimitedDescription')}
              </span>
              {steamStatus === 'private' ? (
                <a
                  href="https://steamcommunity.com/my/edit/settings"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-yellow-600 dark:text-yellow-500 hover:text-yellow-700 font-medium whitespace-nowrap transition-colors"
                >
                  {t('openSteamSettings')}
                </a>
              ) : (
                <button
                  onClick={() => fetchInventoryItems()}
                  className="text-yellow-600 dark:text-yellow-500 hover:text-yellow-700 font-medium whitespace-nowrap transition-colors"
                >
                  {t('retry')}
                </button>
              )}
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-3 lg:gap-4">

            {/* Filter Panel */}
            <FilterPanel
              isVisible={filtersVisible}
              onToggle={() => setFiltersVisible(false)}
            />

            <div className="flex-1 min-w-0">
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
                  <button
                    className="p-2 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
                    onClick={() => fetchInventoryItems()}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  </button>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t('items')}: <span className="font-semibold text-gray-900 dark:text-white">{filteredItems.length}</span>
                  </span>
                  {listedCount > 0 && (
                    <button
                      onClick={() => router.push('/on-sale')}
                      className="text-sm text-green-600 dark:text-green-400 font-medium hover:underline transition-colors"
                    >
                      {t('onSale')}: {listedCount}
                    </button>
                  )}
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                    {t('total')}: {formatPrice(totalInventoryValue, currency)}
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
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-600 border-t-transparent mx-auto mb-3"></div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('loading')}</p>
                  </div>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <p className="text-gray-500 dark:text-gray-400 mb-3">{t('noFiltersMatch')}</p>
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
                  {filteredItems.map((item) => {
                    const nonListable = isNonListable(item);
                    const listed = item.isListed;
                    return (
                    <div
                      key={item.id}
                      onClick={() => handleSelectItem(item.id)}
                      className={`group bg-white dark:bg-gray-900 rounded-xl border-2 transition-all duration-200 overflow-hidden ${
                        listed
                          ? 'border-green-500/70 dark:border-green-500/50 cursor-default'
                          : nonListable
                            ? 'opacity-50 cursor-not-allowed border-transparent'
                            : selectedItems.includes(item.id)
                              ? 'border-primary-500 ring-1 ring-primary-500 cursor-pointer hover:shadow-lg'
                              : 'border-gray-200 dark:border-gray-700/50 hover:border-primary-300 dark:hover:border-primary-600/50 cursor-pointer hover:shadow-lg'
                      }`}
                      title={nonListable ? t('nonListableItem') : listed ? t('onSale') : undefined}
                    >
                      <div className="relative aspect-square bg-gray-100 dark:bg-gray-800/50 overflow-hidden">
                        <img
                          src={item.skin?.imageUrl}
                          alt={item.skin?.name}
                          className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                             const target = e.currentTarget as HTMLImageElement;
                             if (target.src.includes('/330x192')) {
                                target.src = target.src.replace('/330x192', '');
                             } else {
                                target.style.display = 'none';
                                if (target.nextElementSibling) {
                                  (target.nextElementSibling as HTMLElement).style.display = 'flex';
                                }
                             }
                          }}
                        />
                        <div style={{display: 'none'}} className="flex items-center justify-center h-full text-xs text-gray-400">
                          No Image
                        </div>
                        <div className="absolute top-2 left-2 flex items-center gap-1">
                          {listed ? (
                            <div className="px-2 py-0.5 bg-green-500/90 backdrop-blur-sm text-white text-[10px] font-bold rounded">
                              {t('onSale')}
                            </div>
                          ) : (
                            <div className="p-1 rounded bg-green-500/80 backdrop-blur-sm text-white">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 018 0" /></svg>
                            </div>
                          )}
                          {item.isSteamItem && (
                            <div className="px-2 py-0.5 bg-blue-600/90 backdrop-blur-sm text-white text-[10px] font-medium rounded-full">Steam</div>
                          )}
                        </div>
                        {item.skin?.float != null && (
                          <div className="absolute bottom-0 left-0 right-0 px-2 py-1 bg-gradient-to-t from-black/60 to-transparent">
                            <div className="flex items-center gap-1.5">
                              <div className="flex-1 h-1 rounded-full bg-gray-600 overflow-hidden">
                                <div className="h-full rounded-full" style={{ width: `${(item.skin.float || 0) * 100}%`, background: (item.skin.float || 0) < 0.07 ? '#22c55e' : (item.skin.float || 0) < 0.15 ? '#84cc16' : (item.skin.float || 0) < 0.38 ? '#eab308' : (item.skin.float || 0) < 0.45 ? '#f97316' : '#ef4444' }} />
                              </div>
                              <span className="text-[9px] font-mono text-white/80">{item.skin.float ? parseFloat(String(item.skin.float)).toFixed(4) : ''}</span>
                            </div>
                          </div>
                        )}
                        <div className="absolute top-2 right-2 flex flex-col gap-1">
                          <button
                            onClick={(e) => { e.stopPropagation(); setDetailsSkin(item.skin); }}
                            className="w-6 h-6 flex items-center justify-center rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </button>
                          {selectedItems.includes(item.id) && (
                            <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="p-3 space-y-1.5">
                        <h3 className="font-medium text-gray-900 dark:text-white text-xs leading-tight line-clamp-2 min-h-[2rem]" title={item.skin?.name}>
                          {item.skin?.name}
                        </h3>

                        <p className="text-[10px] text-gray-400/80 dark:text-gray-500/80 truncate">{item.skin?.exterior}</p>

                        <div className="text-center pt-1">
                          {listed ? (
                            <span className="text-sm font-bold text-green-500">
                              {formatPrice(Number(item.listPrice || 0), currency)}
                            </span>
                          ) : (
                            <span className="text-sm font-bold text-green-600 dark:text-green-400">
                              {formatPrice(Number(item.listPrice || item.skin?.price || 0), currency)}
                            </span>
                          )}
                          {!item.isSteamItem && !listed && item.highestBid && item.highestBid > 0 && (
                            <div className="mt-0.5">
                              <span className="text-[10px] font-medium text-orange-500 dark:text-orange-400">
                                {t('bidLabel')}: {formatPrice(item.highestBid, currency)}
                                {item.bidCount && item.bidCount > 1 && (
                                  <span className="text-gray-400"> ({item.bidCount})</span>
                                )}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    );
                  })}
                </div>
              )}

              {selectedItems.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-2xl z-50">
                  <div className="max-w-[1600px] mx-auto px-3 lg:px-4 py-3">
                    {sellError && (
                      <p className="text-red-500 text-sm mb-2 text-center">{sellError}</p>
                    )}
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setSelectedItems([])}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition flex-shrink-0"
                        title={t('clearSelection')}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>

                      {/* Withdraw — disabled */}
                      <div className="relative group/withdraw">
                        <button
                          disabled
                          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600/50 text-white/60 text-sm font-semibold rounded-lg cursor-not-allowed"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          <span className="hidden sm:inline">{t('withdraw')}</span>
                        </button>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover/withdraw:opacity-100 transition-opacity pointer-events-none">
                          {t('withdrawComingSoon')}
                        </div>
                      </div>

                      {/* Sotuvga qo'yish — opens sell modal on list tab */}
                      {hasListableItems && (
                        <button
                          onClick={() => setSellModalOpen(true)}
                          className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="hidden sm:inline">{t('sellAsk')}</span>
                          <span className="text-xs opacity-75">{formatPrice(selectedValue, currency)}</span>
                        </button>
                      )}

                      {/* Hoziroq sotish — always visible, disabled if no bids */}
                      <button
                        onClick={handleSell}
                        disabled={sellLoading || selectedItemsWithBids.length === 0}
                        className={`flex items-center gap-2 px-4 py-2.5 text-white text-sm font-semibold rounded-lg transition disabled:cursor-not-allowed ${
                          selectedItemsWithBids.length > 0
                            ? 'bg-orange-600 hover:bg-orange-700 disabled:opacity-50'
                            : 'bg-orange-600/40'
                        }`}
                      >
                        {sellLoading ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        )}
                        <span className="hidden sm:inline">{t('sellNow')}</span>
                        {selectedItemsWithBids.length > 0 ? (
                          <span className="text-xs opacity-75">{formatPrice(selectedBidValue, currency)}</span>
                        ) : (
                          <span className="text-xs opacity-75">{t('noBid')}</span>
                        )}
                      </button>

                      {/* Selected info */}
                      <div className="flex items-center gap-2 text-sm text-gray-400 ml-auto">
                        <span className="font-semibold text-white">{selectedItems.length}</span>
                        <span>{t('selected')}</span>
                        <span className="text-green-400 font-semibold">{formatPrice(selectedValue, currency)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sell Modal */}
              {sellModalOpen && (
                <SellModal
                  items={allItems
                    .filter(item => selectedItems.includes(item.id) && !isNonListable(item))
                    .map(item => ({
                      id: item.id,
                      skin: item.skin,
                      highestBid: item.isSteamItem ? null : item.highestBid,
                    }))
                  }
                  onClose={() => setSellModalOpen(false)}
                  onSell={handleSellFromModal}
                  onSellNow={handleSellNowFromModal}
                />
              )}
            </div>
          </div>
        </main>

        <SkinDetailsModal
          isOpen={!!detailsSkin}
          onClose={() => setDetailsSkin(null)}
          skin={detailsSkin}
        />
      </div>
    </AuthGuard>
  );
}
