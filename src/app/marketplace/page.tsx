'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import api from '@/lib/api';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';

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
  const [skins, setSkins] = useState<Skin[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    rarity: '',
    weaponType: '',
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
      alert('Iltimos, avval tizimga kiring');
      return;
    }
    
    try {
      await addToCart(skinId);
      alert('Cartga qo\'shildi!');
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Marketplace</h1>

        {/* Filters */}
        <div className="mb-8 p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <input
              type="text"
              placeholder="Qidirish..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded dark:bg-gray-800"
            />

            <select
              value={filters.rarity}
              onChange={(e) => setFilters({ ...filters, rarity: e.target.value })}
              className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded dark:bg-gray-800"
            >
              <option value="">Barcha raritylar</option>
              <option value="consumer">Consumer</option>
              <option value="industrial">Industrial</option>
              <option value="mil-spec">Mil-Spec</option>
              <option value="restricted">Restricted</option>
              <option value="classified">Classified</option>
              <option value="covert">Covert</option>
            </select>

            <input
              type="number"
              placeholder="Min narx"
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded dark:bg-gray-800"
            />

            <input
              type="number"
              placeholder="Max narx"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded dark:bg-gray-800"
            />

            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                setFilters({ ...filters, sortBy, sortOrder });
              }}
              className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded dark:bg-gray-800"
            >
              <option value="createdAt-DESC">Yangi</option>
              <option value="price-ASC">Arzon</option>
              <option value="price-DESC">Qimmat</option>
              <option value="name-ASC">Nom (A-Z)</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Yuklanmoqda...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {skins.map((skin) => (
              <div
                key={skin.id}
                className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:shadow-lg transition"
              >
                <img
                  src={skin.imageUrl}
                  alt={skin.name}
                  className="w-full h-48 object-contain mb-4"
                />
                <h3 className="font-semibold mb-2">{skin.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {skin.exterior}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-primary-600">
                    {skin.price.toFixed(2)} so'm
                  </span>
                  <button
                    onClick={() => handleAddToCart(skin.id)}
                    className="px-4 py-2 bg-primary-600 text-white text-sm rounded hover:bg-primary-700"
                  >
                    Cartga
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && skins.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Skinlar topilmadi
          </div>
        )}
      </main>
    </>
  );
}
