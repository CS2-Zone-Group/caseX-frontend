'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';

export default function CartPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { items, total, loading, fetchCart, removeFromCart, clearCart } = useCartStore();

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    fetchCart();
  }, [user, router, fetchCart]);

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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Savat</h1>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-700"
            >
              Hammasini o'chirish
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Savat bo'sh</p>
            <button
              onClick={() => router.push('/marketplace')}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Marketplace'ga o'tish
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-800 rounded-lg"
                >
                  <img
                    src={item.skin.imageUrl}
                    alt={item.skin.name}
                    className="w-24 h-24 object-contain"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.skin.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.skin.rarity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary-600">
                      {item.skin.price.toFixed(2)} so'm
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-sm text-red-600 hover:text-red-700 mt-2"
                    >
                      O'chirish
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 sticky top-4">
                <h2 className="text-xl font-bold mb-4">Jami</h2>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Mahsulotlar ({items.length})</span>
                    <span>{total.toFixed(2)} so'm</span>
                  </div>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mb-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Jami:</span>
                    <span className="text-primary-600">{total.toFixed(2)} so'm</span>
                  </div>
                </div>
                <button className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition">
                  To'lovga o'tish
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
