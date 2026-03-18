'use client'
import React, { useEffect, useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useTranslations } from 'next-intl';
import { useSettingsStore } from '@/store/settingsStore';
import { formatPrice } from '@/lib/currency';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, fetchCart, removeFromCart, loading } = useCartStore();
  const { fetchUserBalance } = useAuthStore();
  const { currency } = useSettingsStore();
  const t = useTranslations('CheckoutPage');

  const [isHydrated, setIsHydrated] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsHydrated(true);
    if (items.length === 0) {
      fetchCart();
    }
  }, [fetchCart, items.length]);

  const totalAmount = items.reduce((acc, item) => acc + Number(item.skin.price), 0);

  const handleCheckout = async () => {
    setError(null);
    setIsProcessing(true);

    try {
      await api.post('/orders/checkout');
      await fetchUserBalance();
      await fetchCart();
      router.push('/checkout/success');
    } catch (err: any) {
      setError(err.response?.data?.message || t('checkoutError'));
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isHydrated || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white pt-24 pb-12 px-4 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">{t('title')}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-6">

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-300">
              <h2 className="text-xl font-semibold mb-4">{t('cartTitle')} ({items.length} {t('ta')} {t('skin')})</h2>
              
              {items.map((item) => (
                <div key={item.id} className="flex items-center mb-4 justify-between rounded-lg px-4 py-4 border border-gray-200 dark:border-gray-700 last:border-0 last:mb-0 bg-gray-50 dark:bg-transparent">
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-16 bg-white dark:bg-gray-700 rounded-lg overflow-hidden relative flex items-center justify-center border border-gray-200 dark:border-gray-600">
                      <img
                        src={item.skin.imageUrl}
                        alt={item.skin.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">{item.skin.name}</h3>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600 dark:text-green-400"> 
                      {formatPrice(Number(item.skin.price), currency)} 
                    </p>
                    <button 
                      onClick={() => removeFromCart(item.id)} 
                      className="text-sm text-red-500 hover:text-red-600 dark:hover:text-red-400 mt-1 transition-colors"
                    >
                      {t('remove')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 sticky top-24 shadow-sm transition-colors duration-300">
              <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">{t('paymentDetails')}</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                  <span>{t('skinsPrice')}:</span>
                  <span>{formatPrice(Number(totalAmount), currency)}</span>
                </div>
                <div className="h-px bg-gray-200 dark:bg-gray-700 my-4"></div>
                <div className="flex justify-between text-xl font-bold">
                  <span className="text-gray-900 dark:text-white">{t('checkTotal')}:</span>
                  <span className="text-green-600 dark:text-green-400">{formatPrice(Number(totalAmount), currency)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isProcessing || items.length === 0}
                className={`w-full font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2
                  ${isProcessing || items.length === 0
                    ? 'bg-gray-200 dark:bg-gray-700 cursor-not-allowed text-gray-400 dark:text-gray-500'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 active:scale-95'
                  }`}
              >
                {isProcessing ? (
                   <>
                     <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                     {t('processing')}
                   </>
                ) : (
                   t('payFromBalance')
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}