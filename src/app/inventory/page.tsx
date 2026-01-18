'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import AuthGuard from '@/components/AuthGuard';
import MarketplaceFilters from '@/components/MarketplaceFilters';
import { formatPrice } from '@/lib/currency';
import { useAuthStore } from '@/store/authStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useTranslations } from 'next-intl';
import api from '@/lib/api';
import { useFilterStore } from '@/store/filterStore';

interface InventoryItemType {
  id: string;
  isListed: boolean;
  listPrice: number | null;
  isSteamItem?: boolean;
  skin: {
    id: string;
    name: string;
    imageUrl: string;
    rarity: string;
    exterior: string;
    weaponType?: string;
    price?: number;
  };
}

export default function InventoryPage() {
  const router = useRouter();
  const { user } = useAuthStore();
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
  const [filtersVisible, setFiltersVisible] = useState(false);

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
    if (!user || !isHydrated) return;

    setLoading(true);
    try {
      const params = {
        userId: user.id,
      };

      const { data } = await api.get('/inventory', { params });
      
      let rawItems: InventoryItemType[] = [];

      if (Array.isArray(data)) {
        rawItems = data;
      } else if (data.items && Array.isArray(data.items)) {
        rawItems = data.items;
      } else if (data.data && Array.isArray(data.data)) {
        rawItems = data.data;
      }

      setAllItems(rawItems);
      setFilteredItems(rawItems); 

    } catch (error) {
      console.error('Inventory fetch error:', error);
      setAllItems([]);
      setFilteredItems([]);
    } finally {
      setLoading(false);
    }
  }, [user, isHydrated]);

  useEffect(() => {
    if (!isHydrated || !user) return;
    fetchInventoryItems();
  }, [fetchInventoryItems, isHydrated, user]);


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
        const minOk = priceRange.min ? price >= priceRange.min : true;
        const maxOk = priceRange.max ? price <= priceRange.max : true;
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

    setFilteredItems(result);

  }, [allItems, searchQuery, sortBy, rarity, weaponType, condition, priceRange]);


  const handleSelectItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const handleSell = () => console.log('Sell:', selectedItems);

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

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Navbar />

        <main className="container mx-auto px-2 sm:px-4 py-8 pt-20">
          <div className="flex flex-col lg:flex-row gap-3 lg:gap-4">
            
            <div className="lg:hidden mb-4">
              {filtersVisible && <MarketplaceFilters filters={filtersVisible} />}
            </div>
            <div className="hidden lg:block w-80 flex-shrink-0">
               <MarketplaceFilters filters={filtersVisible} />
            </div>

            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 lg:mb-6 gap-4 sm:gap-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setFiltersVisible(!filtersVisible)}
                      className="p-2 bg-white dark:bg-gray-800 rounded-lg lg:hidden border border-gray-200 dark:border-gray-700"
                    >
                       Filter
                    </button>
                    <button
                      className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                      onClick={() => fetchInventoryItems()}
                    >
                      <svg className="w-5 h-5 text-gray-700 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    </button>
                  </div>
                  
                  <div className="text-gray-900 dark:text-white text-sm lg:text-base">
                    <span className="text-gray-600 dark:text-gray-400">Items: {filteredItems.length}</span>
                    <span className="font-bold ml-2 text-green-600 dark:text-green-400">
                      Total: {formatPrice(totalInventoryValue, currency)}
                    </span>
                  </div>
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-600 text-sm shadow-sm h-8 min-w-0 appearance-none bg-no-repeat bg-[length:16px] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQgNkw4IDEwTDEyIDYiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cg==')] bg-[position:right_0.75rem_center] pr-10"
                >
                  <option value="createdAt-DESC">{t('sortNewest')}</option>
                  <option value="price-DESC">{t('priceHighToLow')}</option>
                  <option value="price-ASC">{t('priceLowToHigh')}</option>
                  <option value="name-ASC">{t('nameAtoZ')}</option>
                </select>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
                  <p className="text-gray-600 dark:text-gray-400">Loading...</p>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                  <p className="text-gray-500 mb-4">No items found matching your filters</p>
                  <button onClick={resetFilters} className="text-primary-600 hover:underline">
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleSelectItem(item.id)}
                      className={`bg-white dark:bg-gray-900 rounded-xl p-3 sm:p-4 border transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md ${
                        selectedItems.includes(item.id)
                          ? 'border-primary-600 ring-1 ring-primary-600'
                          : 'border-gray-200 dark:border-gray-800'
                      }`}
                    >
                      <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg mb-3 overflow-hidden relative">
                        <img
                          src={item.skin?.imageUrl}
                          alt={item.skin?.name}
                          className="w-full h-full object-contain p-2"
                          onError={(e) => {
                             const target = e.target as HTMLImageElement;
                             if (target.src.includes('/330x192')) {
                                target.src = target.src.replace('/330x192', '');
                             } else {
                                target.style.display = 'none';
                                target.parentElement!.innerHTML = '<div class="flex items-center justify-center h-full text-xs text-gray-400">No Image</div>';
                             }
                          }}
                        />
                        {selectedItems.includes(item.id) && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs">✓</div>
                        )}
                        {item.isSteamItem && (
                          <div className="absolute top-2 left-2 px-2 py-0.5 bg-blue-600 text-white text-[10px] rounded-full">Steam</div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm truncate" title={item.skin?.name}>
                          {item.skin?.name}
                        </h3>
                        
                        <div className="flex justify-center">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 truncate">
                            {item.skin?.rarity}
                          </span>
                        </div>
                        
                        <p className="text-[10px] text-gray-500 text-center truncate">{item.skin?.exterior}</p>
                        
                        <div className="text-center pt-1">
                           <span className="text-sm font-bold text-green-600 dark:text-green-400">
                            {formatPrice(Number(item.listPrice || item.skin?.price || 0), currency)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedItems.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 shadow-lg z-50">
                  <div className="container mx-auto flex justify-between items-center">
                    <span className="dark:text-white font-medium">
                        {selectedItems.length} selected 
                        <span className="ml-2 text-green-500">
                            ({formatPrice(selectedValue, currency)})
                        </span>
                    </span>
                    <button onClick={handleSell} className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">Sell</button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}