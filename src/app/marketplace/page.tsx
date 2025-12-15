'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import MarketplaceFilters from '@/components/MarketplaceFilters';
import api from '@/lib/api';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useSettingsStore } from '@/store/settingsStore';
import { translations } from '@/lib/translations';
import { formatPrice } from '@/lib/currency';

interface Skin {
  id: string;
  name: string;
  weaponType: string;
  rarity: string;
  exterior: string;
  price: number;
  imageUrl: string;
}

export default function MarketplacePage() {
  const { user } = useAuthStore();
  const { addToCart } = useCartStore();
  const { language, currency } = useSettingsStore();
  const t = translations[language];
  const [skins, setSkins] = useState<Skin[]>([]);
  const [loading, setLoading] = useState(true);
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
    fetchSkins();
  }, [filters]);

  const fetchSkins = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('page', '1');
      params.append('limit', '20');
      
      if (filters.search) params.append('search', filters.search);
      if (filters.rarity) params.append('rarity', filters.rarity);
      if (filters.weaponType) params.append('weaponType', filters.weaponType);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      params.append('sortBy', filters.sortBy);
      params.append('sortOrder', filters.sortOrder);

      const { data } = await api.get(`/skins?${params.toString()}`);
      setSkins(data.items);
    } catch (error) {
      console.error('Fetch skins error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (skinId: string) => {
    if (!user) {
      const message = language === 'uz' ? 'Iltimos, avval tizimga kiring' : 
                     language === 'ru' ? 'Пожалуйста, сначала войдите в систему' : 
                     'Please login first';
      alert(message);
      return;
    }
    
    try {
      await addToCart(skinId);
      const message = language === 'uz' ? 'Cartga qo\'shildi!' : 
                     language === 'ru' ? 'Добавлено в корзину!' : 
                     'Added to cart!';
      alert(message);
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Filters Sidebar */}
          <div className="lg:hidden">
            {filtersVisible && (
              <MarketplaceFilters 
                filters={filters} 
                onFilterChange={setFilters} 
              />
            )}
          </div>
          <div className="hidden lg:block">
            <MarketplaceFilters 
              filters={filters} 
              onFilterChange={setFilters} 
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 lg:mb-6 gap-4 sm:gap-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setFiltersVisible(!filtersVisible)}
                    className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 lg:hidden"
                  >
                    <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                  <button className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700">
                    <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                  <button className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700">
                    <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
                
                <div className="text-white text-sm lg:text-base">
                  <span className="text-gray-400">
                    {language === 'uz' ? 'Marketplace narxi' : 
                     language === 'ru' ? 'Цена маркетплейса для' : 
                     'Marketplace price for'}
                  </span>
                  <span className="font-bold ml-1 lg:ml-2">
                    {skins.length} {language === 'uz' ? 'ta skin' : language === 'ru' ? 'скинов' : 'items'}
                  </span>
                  <span className="text-green-400 ml-1 lg:ml-2">
                    ≈ {formatPrice(skins.reduce((sum, skin) => sum + Number(skin.price), 0), currency)}
                  </span>
                </div>
              </div>

              <select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-');
                  setFilters({ ...filters, sortBy, sortOrder });
                }}
                className="px-3 lg:px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 text-sm lg:text-base"
              >
                <option value="createdAt-DESC">
                  {language === 'uz' ? 'Saralash: Yangi' : language === 'ru' ? 'Сортировка: Новые' : 'Sort: Newest'}
                </option>
                <option value="price-DESC">
                  {language === 'uz' ? 'Narx: Yuqoridan pastga' : language === 'ru' ? 'Цена: По убыванию' : 'Price: High to Low'}
                </option>
                <option value="price-ASC">
                  {language === 'uz' ? 'Narx: Pastdan yuqoriga' : language === 'ru' ? 'Цена: По возрастанию' : 'Price: Low to High'}
                </option>
                <option value="name-ASC">
                  {language === 'uz' ? 'Nom: A-Z' : language === 'ru' ? 'Имя: A-Z' : 'Name: A-Z'}
                </option>
              </select>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12 lg:py-20">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                  <p className="text-gray-400">{t.loading}</p>
                </div>
              </div>
            ) : skins.length === 0 ? (
              <div className="text-center py-12 lg:py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {t.noSkinsFound}
                </h3>
                <p className="text-gray-400">
                  {language === 'uz' ? 'Boshqa filtrlarni sinab ko\'ring' : 
                   language === 'ru' ? 'Попробуйте другие фильтры' : 
                   'Try different filters'}
                </p>
              </div>
            ) : (
              <>
                {/* Skins Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {skins.map((skin) => (
                    <div
                      key={skin.id}
                      className="bg-gray-900 rounded-xl p-4 border border-gray-800 hover:border-gray-700 transition-all duration-200"
                    >
                      <div className="aspect-square bg-gray-800 rounded-lg mb-3 overflow-hidden">
                        <img
                          src={skin.imageUrl}
                          alt={skin.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-semibold text-white text-sm truncate">
                          {skin.name}
                        </h3>
                        
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            skin.rarity === 'covert' ? 'bg-red-900/30 text-red-400' :
                            skin.rarity === 'classified' ? 'bg-pink-900/30 text-pink-400' :
                            skin.rarity === 'restricted' ? 'bg-purple-900/30 text-purple-400' :
                            skin.rarity === 'milspec' ? 'bg-blue-900/30 text-blue-400' :
                            skin.rarity === 'industrial' ? 'bg-cyan-900/30 text-cyan-400' :
                            'bg-gray-700 text-gray-300'
                          }`}>
                            {skin.rarity}
                          </span>
                        </div>
                        
                        <p className="text-xs text-gray-400">
                          {skin.exterior}
                        </p>
                        
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-lg font-bold text-primary-400">
                            {formatPrice(Number(skin.price), currency)}
                          </span>
                          <button
                            onClick={() => handleAddToCart(skin.id)}
                            className="px-3 py-2 bg-primary-600 text-white text-xs rounded-lg hover:bg-primary-700 transition font-medium"
                          >
                            {language === 'uz' ? 'Cartga' : language === 'ru' ? 'В корзину' : 'Add'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
