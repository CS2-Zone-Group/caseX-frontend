'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import MarketplaceFilters from '@/components/MarketplaceFilters';
import { formatPrice } from '@/lib/currency';
import { useAuthStore } from '@/store/authStore';
import { useSettingsStore } from '@/store/settingsStore';
import { translations } from '@/lib/translations';
import api from '@/lib/api';

interface InventoryItemType {
  id: string;
  isListed: boolean;
  listPrice: number | null;
  skin: {
    id: string;
    name: string;
    imageUrl: string;
    rarity: string;
    exterior: string;
  };
}

export default function InventoryPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { language, currency } = useSettingsStore();
  const t = translations[language];
  const [items, setItems] = useState<InventoryItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('deliveries');
  const [isHydrated, setIsHydrated] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    rarity: '',
    weaponType: '',
    exterior: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'createdAt',
    sortOrder: 'DESC',
  });

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    
    if (!user) {
      router.push('/auth/login');
      return;
    }
    fetchInventory();
  }, [user, router, isHydrated]);

  const fetchInventory = async () => {
    try {
      const { data } = await api.get('/inventory');
      setItems(data);
    } catch (error) {
      console.error('Inventory fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const handleWithdraw = () => {
    console.log('Withdraw items:', selectedItems);
  };

  const handleSellNow = () => {
    console.log('Sell items:', selectedItems);
  };

  const handleSell = () => {
    console.log('List items for sale:', selectedItems);
  };

  const handleDonate = () => {
    console.log('Donate items:', selectedItems);
  };

  const totalValue = items
    .filter(item => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + (item.listPrice || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center text-gray-900 dark:text-white">
          {language === 'uz' ? 'Yuklanmoqda...' : language === 'ru' ? 'Загрузка...' : 'Loading...'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />
      
      <main className="container mx-auto px-2 sm:px-4 py-8 pt-20">
        <div className="flex flex-col lg:flex-row gap-3 lg:gap-4">
          {/* Filters Sidebar */}
          <div className="lg:hidden mb-4">
            {filtersVisible && (
              <MarketplaceFilters 
                filters={filters} 
                onFilterChange={setFilters} 
              />
            )}
          </div>
          {filtersVisible && (
            <div className="hidden lg:block">
              <MarketplaceFilters 
                filters={filters} 
                onFilterChange={setFilters} 
              />
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 lg:mb-6 gap-4 sm:gap-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setFiltersVisible(!filtersVisible)}
                    className="p-2 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 shadow-sm"
                    title={language === 'uz' ? 'Filtrlar' : language === 'ru' ? 'Фильтры' : 'Filters'}
                  >
                    {filtersVisible ? (
                      <svg className="w-4 h-4 lg:w-5 lg:h-5 text-gray-700 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 lg:w-5 lg:h-5 text-gray-700 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                      </svg>
                    )}
                  </button>
                  <button 
                    className="p-2 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 shadow-sm"
                    title={language === 'uz' ? 'Yangilash' : language === 'ru' ? 'Обновить' : 'Refresh'}
                    onClick={() => fetchInventory()}
                  >
                    <svg className="w-4 h-4 lg:w-5 lg:h-5 text-gray-700 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
                
                <div className="text-gray-900 dark:text-white text-sm lg:text-base">
                  <span className="text-gray-600 dark:text-gray-400">
                    {language === 'uz' ? 'Inventar narxi' : language === 'ru' ? 'Цена инвентаря для' : 'Inventory price for'}
                  </span>
                  <span className="font-bold ml-1 lg:ml-2">
                    {items.length} {language === 'uz' ? 'ta element' : language === 'ru' ? 'предметов' : 'items'}
                  </span>
                  <span className="text-green-600 dark:text-green-400 ml-1 lg:ml-2">≈ ${totalValue.toFixed(2)}</span>
                </div>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 lg:px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-600 text-sm lg:text-base shadow-sm"
              >
                <option value="deliveries">
                  {language === 'uz' ? 'Saralash: Yetkazib berish' : language === 'ru' ? 'Сортировка: Доставки' : 'Sort: Deliveries'}
                </option>
                <option value="price-high">
                  {language === 'uz' ? 'Narx: Yuqoridan pastga' : language === 'ru' ? 'Цена: По убыванию' : 'Price: High to Low'}
                </option>
                <option value="price-low">
                  {language === 'uz' ? 'Narx: Pastdan yuqoriga' : language === 'ru' ? 'Цена: По возрастанию' : 'Price: Low to High'}
                </option>
                <option value="name">
                  {language === 'uz' ? 'Nom: A-Z' : language === 'ru' ? 'Имя: A-Z' : 'Name: A-Z'}
                </option>
              </select>
            </div>

            {/* Items Grid */}
            {items.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {language === 'uz' ? 'Inventoringiz bo\'sh' : language === 'ru' ? 'Ваш инвентарь пуст' : 'Your inventory is empty'}
                </p>
                <button
                  onClick={() => router.push('/marketplace')}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  {language === 'uz' ? 'Marketplace\'ga o\'tish' : language === 'ru' ? 'Перейти в маркетплейс' : 'Go to marketplace'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`bg-white dark:bg-gray-900 rounded-xl p-3 sm:p-4 border transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md ${
                      selectedItems.includes(item.id) 
                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20' 
                        : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                    }`}
                    onClick={() => handleSelectItem(item.id)}
                  >
                    <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg mb-3 overflow-hidden relative">
                      <img
                        src={item.skin.imageUrl}
                        alt={item.skin.name}
                        className="w-full h-full object-contain p-2"
                      />
                      {selectedItems.includes(item.id) && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm truncate" title={item.skin.name}>
                        {item.skin.name}
                      </h3>
                      
                      <div className="flex items-center justify-center">
                        <span className={`px-2 py-1 rounded text-xs font-medium truncate max-w-full ${
                          item.skin.rarity === 'covert' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400' :
                          item.skin.rarity === 'classified' ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-400' :
                          item.skin.rarity === 'restricted' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400' :
                          item.skin.rarity === 'milspec' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400' :
                          item.skin.rarity === 'industrial' ? 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-400' :
                          'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                        }`}>
                          {item.skin.rarity}
                        </span>
                      </div>
                      
                      <p className="text-xs text-gray-600 dark:text-gray-400 text-center truncate">
                        {item.skin.exterior}
                      </p>
                      
                      <div className="text-center pt-2">
                        <span className="text-sm sm:text-base font-bold text-green-600 dark:text-green-400">
                          {formatPrice(Number(item.listPrice || 0), currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            {selectedItems.length > 0 && (
              <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-3 lg:p-4 shadow-lg">
                <div className="container mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                  <div className="text-gray-900 dark:text-white text-sm lg:text-base">
                    <span className="text-gray-600 dark:text-gray-400">
                      {language === 'uz' ? 'Tanlangan elementlar:' : language === 'ru' ? 'Выбранные предметы:' : 'Selected items:'}
                    </span>
                    <span className="font-bold ml-1 lg:ml-2">{selectedItems.length}</span>
                    <span className="text-green-600 dark:text-green-400 ml-2 lg:ml-4">
                      {language === 'uz' ? 'Jami:' : language === 'ru' ? 'Итого:' : 'Total:'} ${totalValue.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 lg:gap-3">
                    <button
                      onClick={handleWithdraw}
                      className="px-3 lg:px-6 py-2 lg:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-1 lg:gap-2 text-sm lg:text-base"
                    >
                      <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span className="hidden sm:inline">
                        {language === 'uz' ? 'Chiqarish' : language === 'ru' ? 'Вывести' : 'Withdraw'}
                      </span>
                      <span className="sm:hidden">
                        {language === 'uz' ? 'Chiq' : language === 'ru' ? 'Выв' : 'Out'}
                      </span>
                    </button>
                    
                    <button
                      onClick={handleSellNow}
                      className="px-3 lg:px-6 py-2 lg:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-1 lg:gap-2 text-sm lg:text-base"
                    >
                      <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="hidden sm:inline">
                        {language === 'uz' ? 'Hozir sotish' : language === 'ru' ? 'Продать сейчас' : 'Sell now'}
                      </span>
                      <span className="sm:hidden">
                        {language === 'uz' ? 'Hozir' : language === 'ru' ? 'Сейчас' : 'Now'}
                      </span>
                    </button>
                    
                    <button
                      onClick={handleSell}
                      className="px-3 lg:px-6 py-2 lg:py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition flex items-center gap-1 lg:gap-2 text-sm lg:text-base"
                    >
                      <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {language === 'uz' ? 'Sotish' : language === 'ru' ? 'Продать' : 'Sell'}
                    </button>
                    
                    <button
                      onClick={handleDonate}
                      className="px-3 lg:px-6 py-2 lg:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-1 lg:gap-2 text-sm lg:text-base"
                    >
                      <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                      </svg>
                      <span className="hidden sm:inline">
                        {language === 'uz' ? 'Sovg\'a qilish' : language === 'ru' ? 'Подарить' : 'Donate'}
                      </span>
                      <span className="sm:hidden">
                        {language === 'uz' ? 'Sovg\'a' : language === 'ru' ? 'Подарок' : 'Gift'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
