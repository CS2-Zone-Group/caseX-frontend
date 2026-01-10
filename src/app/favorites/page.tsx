'use client'
import React, { useEffect, useState } from 'react';
import FavoriteButton from '@/components/FavoriteButton';
import { formatPrice } from '@/lib/currency';
import { translations } from '@/lib/translations';
import { useSettingsStore } from '@/store/settingsStore';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { useFavouritesStore } from '@/store/favouritesStore';

interface Skin {
  id: string;
  name: string;
  weaponType: string;
  rarity: string;
  exterior: string;
  price: number;
  imageUrl: string;
}

export default function FavoritesPage() {
  const { addToCart } = useCartStore();
  const { language, currency } = useSettingsStore();
  const t = translations[language];
  const [items, setItems] = useState<Skin[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, hasHydrated } = useAuthStore();
  const { favouriteIds } = useFavouritesStore();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const { data } = await api.get('/favorites');
        const actualData = Array.isArray(data) ? data : (data.items || data.favorites || []);
        setItems(actualData);
      } catch (error) {
        console.error(error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const displayItems = items.filter(skin => favouriteIds.includes(skin.id));

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

  if (loading) return <div className="container mx-auto py-20 px-4 dark:text-white">{t.loading}</div>;

  return (
    <div className="container mx-auto py-20 px-4">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">
        {t.favorites} ({Array.isArray(displayItems) ? displayItems.length : 0})
      </h1>
      
      {!Array.isArray(displayItems) || displayItems.length === 0 ? (
        <p className="dark:text-gray-400">{t.notFavoritesNow}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {displayItems.map((skin: Skin) => (
             <div
             key={skin.id}
             className="bg-white dark:bg-gray-900 rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200 shadow-sm hover:shadow-md"
           >
             <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg mb-3 overflow-hidden">
               <img
                 src={skin.imageUrl}
                 alt={skin.name}
                 className="w-full h-full object-contain p-2"
               />
             </div>
             
             <div className="space-y-2">
               <h3 className="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm truncate" title={skin.name}>
                 {skin.name}
               </h3>
               
               <div className="flex items-center justify-center">
                 <span className={`px-2 py-1 rounded text-xs font-medium truncate ${
                   skin.rarity?.toLowerCase() === 'covert' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400' :
                   skin.rarity?.toLowerCase() === 'classified' ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-400' :
                   skin.rarity?.toLowerCase() === 'restricted' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400' :
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
                    <button
                      onClick={() => handleAddToCart(skin.id)}
                      className="flex-1 p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition flex items-center justify-center"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </button>
                    <FavoriteButton skinId={skin.id} className="w-10 h-10" />
                 </div>
               </div>
             </div>
           </div>
          ))}
        </div>
      )}
    </div>
  );
}