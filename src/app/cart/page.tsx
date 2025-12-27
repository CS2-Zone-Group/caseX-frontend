'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import AuthGuard from '@/components/AuthGuard';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useSettingsStore } from '@/store/settingsStore';
import { translations } from '@/lib/translations';
import { formatPrice } from '@/lib/currency';

export default function CartPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { items, total, loading, fetchCart, removeFromCart, clearCart } = useCartStore();
  const { language, currency } = useSettingsStore();
  const t = translations[language];
  const [isHydrated, setIsHydrated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update document title
  useEffect(() => {
    document.title = `${t.cart} - CaseX`;
  }, [language, t.cart]);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    
    if (!user) {
      router.push('/auth/login');
      return;
    }
    
    const loadCart = async () => {
      try {
        setError(null);
        await fetchCart();
      } catch (error: any) {
        console.error('Failed to load cart:', error);
        setError(error.message || 'Failed to load cart');
      }
    };
    
    loadCart();
  }, [user?.id, isHydrated]); // Only depend on user.id, not fetchCart function

  if (!isHydrated || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-8 pt-20 text-center">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mr-4"></div>
            <span className="text-gray-600 dark:text-gray-400">
              {language === 'uz' ? 'Yuklanmoqda...' : language === 'ru' ? 'Загрузка...' : 'Loading...'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Navbar />
      <main className="container mx-auto px-4 py-8 pt-20">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{t.cartTitle}</h1>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-700"
            >
              {t.clearAll}
            </button>
          )}
        </div>

        {error ? (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg font-semibold mb-2">
                {language === 'uz' ? 'Xatolik yuz berdi' : language === 'ru' ? 'Произошла ошибка' : 'An error occurred'}
              </p>
              <p className="text-sm">{error}</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 mr-4"
            >
              {language === 'uz' ? 'Qayta yuklash' : language === 'ru' ? 'Перезагрузить' : 'Reload'}
            </button>
            <button
              onClick={() => router.push('/marketplace')}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              {t.goToMarketplace}
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-lg font-semibold mb-2">{t.emptyCart}</p>
              <p className="text-sm">
                {language === 'uz' ? 'Savatingiz bo\'sh. Skinlar qo\'shish uchun bozorga o\'ting.' : 
                 language === 'ru' ? 'Ваша корзина пуста. Перейдите на рынок, чтобы добавить скины.' : 
                 'Your cart is empty. Go to marketplace to add skins.'}
              </p>
            </div>
            <button
              onClick={() => router.push('/marketplace')}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              {t.goToMarketplace}
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
                  <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
                    <img
                      src={item.skin.imageUrl}
                      alt={item.skin.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = '<div class="text-gray-400 text-xs">No Image</div>';
                        }
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.skin.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.skin.rarity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary-600">
                      {formatPrice(Number(item.skin.price), currency)}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-sm text-red-600 hover:text-red-700 mt-2"
                    >
                      {t.remove}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 sticky top-4">
                <h2 className="text-xl font-bold mb-4">{t.total}</h2>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>{t.items} ({items.length})</span>
                    <span>{formatPrice(Number(total), currency)}</span>
                  </div>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mb-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>{t.total}:</span>
                    <span className="text-primary-600">{formatPrice(Number(total), currency)}</span>
                  </div>
                </div>
                <button className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition">
                  {t.checkout}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      </div>
    </AuthGuard>
  );
}
