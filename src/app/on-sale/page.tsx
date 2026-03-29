'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useAuthStore } from '@/store/authStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useTranslations } from 'next-intl';
import { formatPrice } from '@/lib/currency';
import SkinDetailsModal from '@/components/SkinDetailsModal';
import api from '@/lib/api';
import Link from 'next/link';
import { toast } from '@/store/toastStore';
import Loader from '@/components/Loader';

interface ListedItem {
  id: string;
  userId: string;
  skinId: string;
  isListed: boolean;
  listPrice: number;
  acquiredAt: string;
  updatedAt: string;
  skin: {
    id: string;
    name: string;
    weaponType: string;
    rarity: string;
    exterior: string;
    price: number;
    imageUrl: string;
  };
}

export default function OnSalePage() {
  const { user, hasHydrated } = useAuthStore();
  const { currency } = useSettingsStore();
  const t = useTranslations('OnSalePage');
  const [items, setItems] = useState<ListedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailsSkin, setDetailsSkin] = useState<any>(null);

  useEffect(() => {
    document.title = `${t('title')} - CaseX`;
  }, [t]);

  useEffect(() => {
    if (!hasHydrated || !user) return;

    const fetchListedItems = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/inventory/on-sale');
        setItems(Array.isArray(data) ? data : data.items || []);
      } catch (error) {
        console.error('Failed to fetch on-sale items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListedItems();
  }, [hasHydrated, user]);

  const handleDelist = async (itemId: string) => {
    try {
      await api.patch(`/inventory/${itemId}/unlist`);
      setItems(prev => prev.filter(item => item.id !== itemId));
      toast.success(t('delistSuccess'));
    } catch (error) {
      console.error('Failed to delist item:', error);
      toast.error(t('delistError'));
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity?.toLowerCase()) {
      case 'covert': return 'text-red-500';
      case 'classified': return 'text-pink-500';
      case 'restricted': return 'text-purple-500';
      case 'milspec': return 'text-blue-500';
      case 'industrial': return 'text-cyan-500';
      case 'contraband': return 'text-orange-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />

      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('title')}
            </h1>
            {items.length > 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {items.length} {t('items')}
              </p>
            )}
          </div>
        </div>

        {!hasHydrated || loading ? (
          <Loader />
        ) : !user ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔐</div>
            <Link href="/auth/login" className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition inline-block">
              Login
            </Link>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {t('empty')}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {t('emptyDescription')}
            </p>
            <Link href="/inventory" className="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition inline-block font-medium">
              {t('goToInventory')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:border-gray-300 dark:hover:border-gray-700 transition-all shadow-sm hover:shadow-md"
              >
                <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 p-4 flex items-center justify-center">
                  <img
                    src={item.skin.imageUrl}
                    alt={item.skin.name}
                    className="w-full h-full object-contain"
                  />
                  <button
                    onClick={() => setDetailsSkin(item.skin)}
                    className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">{item.skin.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs font-medium ${getRarityColor(item.skin.rarity)}`}>{item.skin.rarity}</span>
                      <span className="text-xs text-gray-400">|</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{item.skin.exterior}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-400">{t('listPrice')}</span>
                      <div className="text-lg font-bold text-green-500">
                        {formatPrice(item.listPrice, currency)}
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded">
                      {t('listed')}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDelist(item.id)}
                    className="w-full py-2 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition"
                  >
                    {t('delist')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <SkinDetailsModal
        isOpen={!!detailsSkin}
        onClose={() => setDetailsSkin(null)}
        skin={detailsSkin}
      />
    </div>
  );
}
