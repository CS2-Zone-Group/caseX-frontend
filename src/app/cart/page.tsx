'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import AuthGuard from '@/components/AuthGuard';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useTranslations } from 'next-intl';
import { formatPrice } from '@/lib/currency';
import { getRarityStyle } from '@/lib/rarity';
import { toast } from '@/store/toastStore';
import Loader from '@/components/Loader';
import api from '@/lib/api';

export default function CartPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { items, total, loading, fetchCart, removeFromCart, clearCart } = useCartStore();
  const { currency } = useSettingsStore();
  const t = useTranslations('CartPage');
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => { document.title = `${t('title')} - CaseX`; }, [t]);
  useEffect(() => { setIsHydrated(true); }, []);

  useEffect(() => {
    if (!isHydrated || !user) return;
    fetchCart().catch(() => {});
  }, [user?.id, isHydrated]);

  // Select all by default when items load
  useEffect(() => {
    if (items.length > 0 && selectedIds.size === 0) {
      setSelectedIds(new Set(items.map(i => i.id)));
    }
  }, [items]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === items.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map(i => i.id)));
    }
  };

  const selectedItems = items.filter(i => selectedIds.has(i.id));
  const selectedTotal = selectedItems.reduce((sum, i) => sum + Number(i.skin.price), 0);

  const handleRemove = async (id: string) => {
    setRemovingId(id);
    try {
      await removeFromCart(id);
      setSelectedIds(prev => { const n = new Set(prev); n.delete(id); return n; });
    } catch { /* ignore */ }
    finally { setRemovingId(null); }
  };

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      await api.post('/orders/checkout');
      const { fetchUserBalance } = useAuthStore.getState();
      await fetchUserBalance();
      toast.success(t('checkoutSuccess'));
      await fetchCart();
      setShowCheckoutModal(false);
      router.push('/inventory');
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('checkoutError'));
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (!isHydrated || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Navbar />
        <div className="flex justify-center py-32"><Loader /></div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Navbar />
        <main className="container mx-auto px-4 py-8 pt-20 max-w-6xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('title')} {items.length > 0 && <span className="text-gray-500 text-lg font-normal">({items.length})</span>}
            </h1>
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-sm text-red-400 hover:text-red-300 transition"
              >
                {t('clearAll')}
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t('emptyCart')}</h3>
              <p className="text-gray-500 mb-4">{t('emptyCartDescription')}</p>
              <button
                onClick={() => router.push('/marketplace')}
                className="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
              >
                {t('goToMarketplace')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Items */}
              <div className="lg:col-span-2 space-y-3">
                {/* Select all */}
                <div className="flex items-center gap-3 px-4 py-2">
                  <button onClick={toggleAll} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${selectedIds.size === items.length ? 'bg-primary-600 border-primary-600' : 'border-gray-600'}`}>
                      {selectedIds.size === items.length && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    {selectedIds.size === items.length ? t('deselectAll') : t('selectAll')}
                  </button>
                  {selectedIds.size > 0 && selectedIds.size < items.length && (
                    <span className="text-xs text-gray-500">{selectedIds.size} / {items.length} {t('selected')}</span>
                  )}
                </div>

                {items.map((item) => {
                  const isSelected = selectedIds.has(item.id);
                  const rarityStyle = getRarityStyle(item.skin.rarity);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleSelect(item.id)}
                      className={`flex items-center gap-4 p-3 bg-white dark:bg-gray-800/80 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-primary-500/50 bg-primary-50 dark:bg-primary-900/10'
                          : 'border-gray-200 dark:border-gray-700/50 opacity-60'
                      }`}
                    >
                      {/* Checkbox */}
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition ${isSelected ? 'bg-primary-600 border-primary-600' : 'border-gray-500'}`}>
                        {isSelected && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                      </div>

                      {/* Image */}
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0" style={{ background: rarityStyle.gradient, backgroundColor: 'rgb(31 41 55 / 0.5)' }}>
                        <img src={item.skin.imageUrl} alt={item.skin.name} className="w-full h-full object-contain p-1.5" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 dark:text-white text-sm truncate">{item.skin.name}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-medium" style={{ color: rarityStyle.color }}>{item.skin.rarity}</span>
                          {item.skin.exterior && (
                            <>
                              <span className="text-[10px] text-gray-500">|</span>
                              <span className="text-[10px] text-gray-500">{item.skin.exterior}</span>
                            </>
                          )}
                        </div>
                        {item.skin.float != null && Number(item.skin.float) > 0 && (
                          <span className="text-[9px] font-mono text-gray-500">Float: {Number(item.skin.float).toFixed(4)}</span>
                        )}
                      </div>

                      {/* Price + remove */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-green-500">
                          {formatPrice(Number(item.skin.price), currency)}
                        </p>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleRemove(item.id); }}
                          disabled={removingId === item.id}
                          className="text-[10px] text-red-400 hover:text-red-300 mt-1 transition"
                        >
                          {removingId === item.id ? <Loader size="sm" /> : t('remove')}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 sticky top-24">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t('orderSummary')}</h2>

                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between text-gray-500">
                      <span>{t('selectedItems')}</span>
                      <span>{selectedItems.length} ta</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>{t('itemsTotal')}</span>
                      <span>{formatPrice(selectedTotal, currency)}</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mb-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-gray-900 dark:text-white">{t('total')}:</span>
                      <span className="text-green-500">{formatPrice(selectedTotal, currency)}</span>
                    </div>
                  </div>

                  {user && (
                    <div className="flex justify-between text-xs text-gray-500 mb-4">
                      <span>{t('yourBalance')}</span>
                      <span className={Number(user.balance || 0) >= selectedTotal ? 'text-green-400' : 'text-red-400'}>
                        {formatPrice(Number(user.balance || 0), currency)}
                      </span>
                    </div>
                  )}

                  <button
                    onClick={() => setShowCheckoutModal(true)}
                    disabled={selectedItems.length === 0}
                    className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('checkout')} ({selectedItems.length})
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Checkout Confirmation Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => !checkoutLoading && setShowCheckoutModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{t('confirmCheckout')}</h3>
            <p className="text-sm text-gray-500 mb-4">{t('confirmDescription')}</p>

            {/* Selected items preview */}
            <div className="max-h-48 overflow-y-auto space-y-2 mb-4">
              {selectedItems.map(item => (
                <div key={item.id} className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded overflow-hidden flex-shrink-0" style={{ background: getRarityStyle(item.skin.rarity).gradient, backgroundColor: 'rgb(31 41 55 / 0.5)' }}>
                    <img src={item.skin.imageUrl} alt="" className="w-full h-full object-contain p-0.5" />
                  </div>
                  <span className="flex-1 truncate text-gray-900 dark:text-white">{item.skin.name}</span>
                  <span className="text-green-500 font-medium">{formatPrice(Number(item.skin.price), currency)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-gray-500 text-sm">{t('yourBalance')}</span>
                <span className="text-sm text-gray-300">{formatPrice(Number(user?.balance || 0), currency)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span className="text-gray-900 dark:text-white">{t('total')}</span>
                <span className="text-green-500">{formatPrice(selectedTotal, currency)}</span>
              </div>
              {Number(user?.balance || 0) < selectedTotal && (
                <p className="text-xs text-red-400 mt-1">{t('insufficientBalance')}</p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCheckoutModal(false)}
                disabled={checkoutLoading}
                className="flex-1 py-2.5 text-sm text-gray-400 hover:text-white border border-gray-600 rounded-lg transition"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleCheckout}
                disabled={checkoutLoading || Number(user?.balance || 0) < selectedTotal}
                className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {checkoutLoading ? <><Loader size="sm" /> {t('processing')}</> : t('confirmPay')}
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthGuard>
  );
}
