'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { useAuthStore } from '@/store/authStore';
import { useSettingsStore } from '@/store/settingsStore';
import { translations } from '@/lib/translations';
import { formatPrice } from '@/lib/currency';
import api from '@/lib/api';

interface InventoryItem {
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
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [listingId, setListingId] = useState<string | null>(null);
  const [listPrice, setListPrice] = useState('');
  const [isHydrated, setIsHydrated] = useState(false);

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

  const handleListForSale = async (itemId: string) => {
    try {
      await api.post(`/inventory/${itemId}/list`, { price: Number(listPrice) });
      setListingId(null);
      setListPrice('');
      fetchInventory();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Xatolik yuz berdi');
    }
  };

  const handleUnlist = async (itemId: string) => {
    try {
      await api.patch(`/inventory/${itemId}/unlist`);
      fetchInventory();
    } catch (error) {
      console.error('Unlist error:', error);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          Yuklanmoqda...
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Mening Inventorim</h1>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Inventoringiz bo'sh</p>
            <button
              onClick={() => router.push('/marketplace')}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Marketplace'ga o'tish
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 dark:border-gray-800 rounded-lg p-4"
              >
                <img
                  src={item.skin.imageUrl}
                  alt={item.skin.name}
                  className="w-full h-48 object-contain mb-4"
                />
                <h3 className="font-semibold mb-2">{item.skin.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {item.skin.exterior}
                </p>

                {item.isListed ? (
                  <div className="space-y-2">
                    <p className="text-sm text-green-600">
                      Sotuvda: {item.listPrice?.toFixed(2)} so'm
                    </p>
                    <button
                      onClick={() => handleUnlist(item.id)}
                      className="w-full px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                    >
                      Sotuvdan olib tashlash
                    </button>
                  </div>
                ) : listingId === item.id ? (
                  <div className="space-y-2">
                    <input
                      type="number"
                      placeholder="Narx (so'm)"
                      value={listPrice}
                      onChange={(e) => setListPrice(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm dark:bg-gray-800"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleListForSale(item.id)}
                        className="flex-1 px-4 py-2 bg-primary-600 text-white text-sm rounded hover:bg-primary-700"
                      >
                        Tasdiqlash
                      </button>
                      <button
                        onClick={() => {
                          setListingId(null);
                          setListPrice('');
                        }}
                        className="flex-1 px-4 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                      >
                        Bekor qilish
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setListingId(item.id)}
                    className="w-full px-4 py-2 bg-primary-600 text-white text-sm rounded hover:bg-primary-700"
                  >
                    Sotuvga qo'yish
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
