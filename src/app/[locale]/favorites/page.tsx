'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FavoriteButton from '@/components/FavoriteButton';
import { formatPrice } from '@/lib/currency';
import { translations } from '@/lib/translations';
import { useSettingsStore } from '@/store/settingsStore';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';

export default function FavoritesPage() {
    const { addToCart } = useCartStore();
  const { language, currency } = useSettingsStore();
  const t = translations[language];
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSkin, setSelectedSkin] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, hasHydrated } = useAuthStore();


  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const { data } = await axios.get('/api/favorites');
        setItems(data); 
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);


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
    const steamItem = {
      market_hash_name: skin.name,
      market_name: skin.name,
      name: skin.name,
      icon_url: skin.imageUrl.replace('https://community.cloudflare.steamstatic.com/economy/image/', '').replace('/330x192', ''),
      tags: [
        { category: 'Weapon', localized_tag_name: skin.weaponType },
        { category: 'Rarity', localized_tag_name: skin.rarity },
        { category: 'Exterior', localized_tag_name: skin.exterior }
      ]
    };
    setSelectedSkin(steamItem);
    setIsModalOpen(true);
  };
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

  if (loading) return <div>{t.loading}</div>;

  return (
    <div className="container mx-auto py-20 px-4">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">{t.favorites} ({items.length})</h1>
      
      {items.length === 0 ? (
        <p>{t.notFavoritesNow}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {items.map((skin: any) => (
             
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
                 <div className='flex'>

                 <button
                   onClick={() => handleAddToCart(skin.id)}
                   className="w-36 p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition flex items-center justify-center"
                   title={language === 'uz' ? 'Savatga qo\'shish' : language === 'ru' ? 'Добавить в корзину' : 'Add to cart'}
                 >
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                   </svg>
                 </button>
                 <FavoriteButton  skinId={skin.id} className="w-10 h-10 text-2xl" // Kichikroq o'lcham
                />
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