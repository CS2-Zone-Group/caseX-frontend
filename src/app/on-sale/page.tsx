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
import { getRarityStyle } from '@/lib/rarity';
import { useMusicPlayerStore } from '@/store/musicPlayerStore';

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
    audioUrl?: string;
  };
}

export default function OnSalePage() {
  const { user, hasHydrated } = useAuthStore();
  const { currency } = useSettingsStore();
  const t = useTranslations('OnSalePage');
  const { setTrack, currentTrack, isPlaying } = useMusicPlayerStore();
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800/80 rounded-lg border border-gray-200 dark:border-gray-700/50 overflow-hidden hover:border-primary-500/50 transition-all group"
              >
                <div className="relative aspect-square p-3 flex items-center justify-center" style={{ background: getRarityStyle(item.skin.rarity).gradient, backgroundColor: 'rgb(31 41 55 / 0.5)' }}>
                  <img
                    src={item.skin.imageUrl}
                    alt={item.skin.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-1.5 right-1.5 flex flex-col gap-1">
                    <button
                      onClick={() => setDetailsSkin(item.skin)}
                      className="w-6 h-6 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white/70 hover:text-white transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                    {item.skin.weaponType === 'Music Kit' && item.skin.audioUrl && (
                      <button
                        onClick={() => setTrack({ id: item.skin.id, name: item.skin.name, audioUrl: item.skin.audioUrl!, imageUrl: item.skin.imageUrl })}
                        className={`w-6 h-6 flex items-center justify-center rounded-full backdrop-blur-sm transition-colors ${
                          currentTrack?.id === item.skin.id && isPlaying
                            ? 'bg-cyan-500 text-white'
                            : 'bg-black/40 text-cyan-400 hover:bg-cyan-500 hover:text-white'
                        }`}
                      >
                        {currentTrack?.id === item.skin.id && isPlaying ? (
                          <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                            <rect x="6" y="4" width="4" height="16" rx="1" />
                            <rect x="14" y="4" width="4" height="16" rx="1" />
                          </svg>
                        ) : (
                          <svg className="w-2.5 h-2.5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7L8 5z" />
                          </svg>
                        )}
                      </button>
                    )}
                  </div>
                  <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-green-500/20 text-green-400 text-[9px] font-medium rounded backdrop-blur-sm">
                    {t('listed')}
                  </span>
                </div>
                <div className="p-2.5 space-y-1.5">
                  <h3 className="font-medium text-gray-900 dark:text-white text-xs truncate">{item.skin.name}</h3>
                  <p className="text-[10px] text-gray-500 truncate">{item.skin.exterior}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-green-500">
                      {formatPrice(item.listPrice, currency)}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelist(item.id)}
                    className="w-full py-1.5 text-[11px] font-medium text-red-400 bg-red-500/10 rounded hover:bg-red-500/20 transition"
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
