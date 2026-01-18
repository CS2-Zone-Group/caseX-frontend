'use client'
import React, { useEffect, useState } from 'react';
import FavoriteButton from '@/components/FavoriteButton';
import { formatPrice } from '@/lib/currency';
import { useTranslations } from 'next-intl';
import { useSettingsStore } from '@/store/settingsStore';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useFavouritesStore } from '@/store/favouritesStore';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import AuthGuard from '@/components/AuthGuard';

export default function FavoritesPage() {
  const { addToCart } = useCartStore();
  const { currency } = useSettingsStore();
  const t = useTranslations('FavoritesPage');
  const tCommon = useTranslations('Common');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { user, hasHydrated } = useAuthStore();
  const { favouriteIds, fetchFavouriteIds } = useFavouritesStore();

  useEffect(() => {
    document.title = `${t('title')} - CaseX`;
  }, [t]);

  // Favorites IDs o'zgarganida itemlarni yangilash
  useEffect(() => {
    // Agar favouriteIds bo'sh bo'lsa, itemlarni ham tozalash
    if (favouriteIds.length === 0) {
      setItems([]);
      return;
    }
    
    // Hozirgi itemlarni favorites IDs bilan filtrlash
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
        // Avval favorites IDs ni olish
        await fetchFavouriteIds();
        
        // Keyin favorites ma'lumotlarini olish
        const { data } = await api.get('/favorites');
        
        // Data structure ni to'g'ri handle qilish
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


  interface Skin {
    id: string;
    name: string;
    weaponType: string;
    rarity: string;
    exterior: string;
    price: number;
    imageUrl: string;
  }



  const openSkinDetails = (skin: Skin) => {
    // TODO: Implement skin details modal
    console.log('Opening skin details for:', skin.name);
  };
  const handleAddToCart = async (skinId: string) => {
    if (!hasHydrated || !user) {
      alert(t('pleaseLogin'));
      return;
    }
    
    try {
      await addToCart(skinId);
      alert(t('addedToCart'));
    } catch (error: any) {
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <Navbar />
          <div className="container mx-auto px-4 py-8 pt-32 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
            <p className="text-gray-600 dark:text-gray-400">{tCommon('loading')}</p>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Navbar />
        
        <div className="container mx-auto py-8 pt-20 px-4">
          <h1 className="text-3xl font-bold mb-8 dark:text-white">
            {t('title')} ({favouriteIds.length}{t('count')})
          </h1>
          
          {!Array.isArray(items) || items.length === 0 || favouriteIds.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="text-6xl mb-4">💔</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {t('noFavorites')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('noFavoritesDescription')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {items.filter(item => favouriteIds.includes(item.id)).map((skin: any) => (
             
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
                     title={t('addToCart')}
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
    </AuthGuard>
  );
}