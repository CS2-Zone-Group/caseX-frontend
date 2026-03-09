'use client'
import React, { useEffect, useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useTranslations } from 'next-intl';
import { useSettingsStore } from '@/store/settingsStore';
import { formatPrice } from '@/lib/currency';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const router = useRouter(); 
  const { items, fetchCart, removeFromCart, loading, clearCart } = useCartStore();
  const { currency } = useSettingsStore();
  const t = useTranslations('CheckoutPage');
  
  type PaymentMethod = "click" | "payme" | "visa" | null;
  
  const [isHydrated, setIsHydrated] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    setIsHydrated(true);
    if (items.length === 0) {
      fetchCart();
    }
  }, [fetchCart, items.length]);

  const price = items.map((item) => Number(item.skin.price));
  const totalAmount = price.reduce((acc, item) => acc + item, 0);
  const tax = totalAmount * 0.05;
  const finalTotal = totalAmount + tax;

  const handlePayment = async () => {
    setError(null);
    
    if (!paymentMethod) {
      setError(t('paymentMethodError'));
      return;
    }

    setIsProcessing(true);
    
    setTimeout(() => {
      clearCart();
      setIsProcessing(false);
      
      const randomNum = Math.floor(100000 + Math.random() * 900000);
      const mockTrxId = `#TRX-${randomNum}`;
      router.push(`/checkout/success?transactionId=${mockTrxId}`);
    }, 2000);
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
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-300">
               <h2 className="text-xl font-semibold mb-4">{t('selectPaymentMethod')}</h2>
               
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                 
                 <div 
                   onClick={() => setPaymentMethod('click')}
                   className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all 
                     ${paymentMethod === 'click' 
                       ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 ring-2 ring-blue-500/20' 
                       : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                 >
                   <span className="font-bold text-xl text-blue-600 dark:text-white">CLICK</span>
                 </div>

                 <div 
                   onClick={() => setPaymentMethod('payme')}
                   className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all 
                     ${paymentMethod === 'payme' 
                       ? 'border-teal-500 bg-teal-50 dark:bg-teal-500/10 ring-2 ring-teal-500/20' 
                       : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                 >
                   <span className="font-bold text-xl text-teal-600 dark:text-teal-400">Payme</span>
                 </div>

                 <div 
                   onClick={() => setPaymentMethod('visa')}
                   className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all 
                     ${paymentMethod === 'visa' 
                       ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-500/10 ring-2 ring-yellow-500/20' 
                       : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                 >
                   <span className="font-bold text-xl text-yellow-600 dark:text-yellow-500">VISA</span>
                 </div>
               </div>

               {error && (
                 <p className="text-red-500 text-sm mt-3 animate-pulse">⚠️ {t('paymentMethodError')}</p>
               )}
            </div>

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
                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                  <span>{t('commission')} (5%):</span>
                  <span>{formatPrice(Number(tax), currency)} </span>
                </div>
                <div className="h-px bg-gray-200 dark:bg-gray-700 my-4"></div>
                <div className="flex justify-between text-xl font-bold">
                  <span className="text-gray-900 dark:text-white">{t('checkTotal')}:</span>
                  <span className="text-green-600 dark:text-green-400">{formatPrice(Number(finalTotal), currency)}</span>
                </div>
              </div>

              <button 
                onClick={handlePayment} 
                disabled={isProcessing}
                className={`w-full font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2
                  ${isProcessing 
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
                   t('paymentToDo')
                )}
              </button>
              
              <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-4">
                {t('clickingAgree')}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}