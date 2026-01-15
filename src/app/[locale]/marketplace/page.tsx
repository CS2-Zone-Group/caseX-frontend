'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import MarketplaceFilters from '@/components/MarketplaceFilters';
import SkinDetailsModal from '@/components/SkinDetailsModal';
import api from '@/lib/api';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useSettingsStore } from '@/store/settingsStore';
import { translations } from '@/lib/translations';
import { formatPrice } from '@/lib/currency';
import { useFilterStore } from '@/store/filterStore';
import { useRouter, useSearchParams } from 'next/navigation';
import FavoriteButton from '@/components/FavoriteButton';
import { useParams } from 'next/navigation';

interface Skin {
  id: string;
  name: string;
  weaponType: string;
  rarity: string;
  exterior: string;
  price: number;
  imageUrl: string;
}

function MarketplaceContent() {
  const params = useParams();
  const router=useRouter()
  const searchParams = useSearchParams();
  const { user, hasHydrated } = useAuthStore();
  const { addToCart } = useCartStore();
  const { language, currency } = useSettingsStore();
  const t = translations[language];
  
  const [skins, setSkins] = useState<Skin[]>([]); 
  const [loading, setLoading] = useState(true);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [selectedSkin, setSelectedSkin] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // URL dan openSkin parametrini olish
  const openSkinId = searchParams.get('openSkin');

  const category = searchParams.get('category');

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

  useEffect(() => {
    document.title = `${t.marketplace} - CaseX`;
  }, [language, t.marketplace]);

  useEffect(() => {
    resetFilters();
  }, [resetFilters]); 

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
      
      const params = {
        search: searchQuery,
        sortBy: sortField,    
        sortOrder: sortOrder, 
        rarity: rarity,
        weaponType: weaponType,
        exterior: condition,
        minPrice: priceRange.min,
        maxPrice: priceRange.max,
        page: 1,
        limit: 50,
      };

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
  }, [searchQuery, sortBy, rarity, weaponType, condition, priceRange, category]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMarketItems();
    }, 500); 

    return () => clearTimeout(timer);
  }, [fetchMarketItems]); 

  const handleAddToCart = async (skinId: string) => {
    if (!hasHydrated || !user) {
      const message = language === 'uz' ? 'Iltimos, avval tizimga kiring' : 
                      language === 'ru' ? 'Пожалуйста, сначала войдите в систему' : 
                      'Please login first';
      alert(message);
      return;
    }
    
    try {
      await addToCart(skinId);
      const message = language === 'uz' ? 'Savatga qo\'shildi!' : 
                      language === 'ru' ? 'Добавлено в корзину!' : 
                      'Added to cart!';
      alert(message);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const openSkinDetails = useCallback((skin: Skin) => {
    const steamItem = {
      market_hash_name: skin.name,
      market_name: skin.name,
      name: skin.name,
      icon_url: skin.imageUrl.replace('https://community.cloudflare.steamstatic.com/economy/image/', '').replace('/330x192', ''),
      tags: [
        { 
          category: 'Weapon', 
          internal_name: skin.weaponType,
          localized_tag_name: skin.weaponType 
        },
        { 
          category: 'Rarity', 
          internal_name: skin.rarity,
          localized_tag_name: skin.rarity 
        },
        { 
          category: 'Exterior', 
          internal_name: skin.exterior,
          localized_tag_name: skin.exterior 
        }
      ]
    };
    setSelectedSkin(steamItem);
    setIsModalOpen(true);
  }, []);
  

  useEffect(() => {
    const checkAndOpenSharedSkin = async () => {
      if (!openSkinId || isModalOpen) return;
  
      const existingSkin = skins.find(s => String(s.id) === String(openSkinId));
      
      if (existingSkin) {
        openSkinDetails(existingSkin);
      } else if (!loading && skins.length > 0) { 
        try {
          const cleanId = openSkinId.replace('share-', ''); 
          const { data } = await api.get(`/skins/${cleanId}`);
          
          const sharedSkin = data.data || data;
          
          if (sharedSkin) {
            openSkinDetails(sharedSkin);
          }
        } catch (err) {
          console.error("Skin yuklashda xatolik yuz berdi:", err);
        }
      }
    };
  
    checkAndOpenSharedSkin();
  }, [openSkinId, skins, loading, openSkinDetails, isModalOpen]);

  const closeSkinDetails = () => {
    setIsModalOpen(false);
    setSelectedSkin(null);
    const params = new URLSearchParams(searchParams.toString());
    params.delete('openSkin');
    
    // URLni yangilash (scrollni joyida saqlab qolgan holda)
    router.replace(`${window.location.pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-2 sm:px-4 py-8 pt-20">
        <div className="flex flex-col lg:flex-row gap-3 lg:gap-4">
          
          <div className="lg:hidden mb-4">
            {filtersVisible && (
              <MarketplaceFilters filters={filtersVisible} />
            )}
          </div>
          
          <div className="hidden lg:block w-80 flex-shrink-0">
              <MarketplaceFilters filters={filtersVisible}/>
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 lg:mb-6 gap-4 sm:gap-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setFiltersVisible(!filtersVisible)}
                    className="p-2 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 shadow-sm lg:hidden"
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
                    onClick={() => fetchMarketItems()}
                  >
                    <svg className="w-4 h-4 lg:w-5 lg:h-5 text-gray-700 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
                
                <div className="text-gray-900 dark:text-white text-sm lg:text-base">
                  <span className="font-bold">
                    {skins.length} {language === 'uz' ? 'ta skin' : language === 'ru' ? 'скинов' : 'items'}
                  </span>
                </div>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-600 text-sm shadow-sm h-8 min-w-0 appearance-none bg-no-repeat bg-[length:16px] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQgNkw4IDEwTDEyIDYiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cg==')] bg-[position:right_0.75rem_center] pr-10"
              >
                <option value="createdAt-DESC">{t.sortNewest}</option>
                <option value="price-DESC">{t.priceHighToLow}</option>
                <option value="price-ASC">{t.priceLowToHigh}</option>
                <option value="name-ASC">{t.nameAtoZ}</option>
              </select>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12 lg:py-20">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">{t.loading}</p>
                </div>
              </div>
            ) : skins.length === 0 ? (
              <div className="text-center py-12 lg:py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {t.noSkinsFound}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t.tryDifferentFilters}
                </p>
                <button onClick={resetFilters} className="mt-4 text-primary-600 hover:underline">
                  {language === 'uz' ? 'Filtrlarni tozalash' : 'Clear filters'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4">
                {skins.map((skin) => (
                  <div
                    key={skin.id}
                    className="bg-white dark:bg-gray-900 rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <div 
                      className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg mb-3 overflow-hidden cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => openSkinDetails(skin)}
                    >
                      <img
                        src={skin.imageUrl}
                        alt={skin.name}
                        className="w-full h-full object-contain p-2"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 
                        className="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm truncate cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 transition-colors" 
                        title={skin.name}
                        onClick={() => openSkinDetails(skin)}
                      >
                        {skin.name}
                      </h3>
                      
                      <div className="flex items-center justify-center">
                        <span className={`px-2 py-1 rounded text-xs font-medium truncate max-w-full ${
                          skin.rarity?.toLowerCase() === 'covert' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400' :
                          skin.rarity?.toLowerCase() === 'classified' ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-400' :
                          skin.rarity?.toLowerCase() === 'restricted' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400' :
                          skin.rarity?.toLowerCase() === 'milspec' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400' :
                          skin.rarity?.toLowerCase() === 'industrial' ? 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-400' :
                          'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                        }`}>
                          {skin.rarity}
                        </span>
                      </div>
                      
                      <p className="text-xs text-gray-600 dark:text-gray-400 text-center truncate">
                        {skin.exterior}
                      </p>
                      
                      <div className="flex flex-col gap-2 pt-2">
                        <div className="text-center">
                          <span className="text-sm sm:text-base font-bold text-primary-600 dark:text-primary-400">
                            {formatPrice(Number(skin.price), currency)}
                          </span>
                        </div>
                        
                        <div className='flex gap-2 justify-center'>
                            <div className="flex items-center justify-center">
                              <FavoriteButton skinId={skin.id} className="w-10 h-10 text-2xl" />
                            </div>
                            
                            <button
                              onClick={() => handleAddToCart(skin.id)}
                              className="flex-1 p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition flex items-center justify-center"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                            </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <SkinDetailsModal
        isOpen={isModalOpen}
        onClose={closeSkinDetails}
        skin={selectedSkin}
      />
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    }>
      <MarketplaceContent />
    </Suspense>
  );
}