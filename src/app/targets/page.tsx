'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useAuthStore } from '@/store/authStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useTranslations } from 'next-intl';
import { formatPrice } from '@/lib/currency';
import api from '@/lib/api';
import Link from 'next/link';

interface Target {
  id: string;
  skinId: string;
  name: string;
  weaponType: string;
  rarity: string;
  exterior: string;
  targetPrice: number;
  currentPrice: number;
  imageUrl: string;
  status: 'active' | 'fulfilled' | 'expired';
  createdAt: string;
}

export default function TargetsPage() {
  const { user, hasHydrated } = useAuthStore();
  const { currency } = useSettingsStore();
  const t = useTranslations('TargetsPage');
  const [targets, setTargets] = useState<Target[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'fulfilled' | 'expired'>('all');

  useEffect(() => {
    document.title = `${t('title')} - CaseX`;
  }, [t]);

  useEffect(() => {
    if (!hasHydrated || !user) return;

    const fetchTargets = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/targets');
        setTargets(Array.isArray(data) ? data : data.items || []);
      } catch (error) {
        console.error('Failed to fetch targets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTargets();
  }, [hasHydrated, user]);

  const handleRemoveTarget = async (targetId: string) => {
    try {
      await api.delete(`/targets/${targetId}`);
      setTargets(prev => prev.filter(t => t.id !== targetId));
    } catch (error) {
      console.error('Failed to remove target:', error);
    }
  };

  const filteredTargets = filter === 'all' ? targets : targets.filter(t => t.status === filter);

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded">{t('active')}</span>;
      case 'fulfilled':
        return <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded">{t('fulfilled')}</span>;
      case 'expired':
        return <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-medium rounded">{t('expired')}</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />

      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('title')}
            </h1>
            {targets.length > 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {filteredTargets.length} {t('items')}
              </p>
            )}
          </div>

          {targets.length > 0 && (
            <div className="flex gap-2">
              {(['all', 'active', 'fulfilled', 'expired'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${
                    filter === f
                      ? 'bg-primary-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {f === 'all' ? 'All' : t(f)}
                </button>
              ))}
            </div>
          )}
        </div>

        {!hasHydrated || loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">{t('loading')}</p>
            </div>
          </div>
        ) : !user ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔐</div>
            <Link href="/auth/login" className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition inline-block">
              Login
            </Link>
          </div>
        ) : filteredTargets.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {t('empty')}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {t('emptyDescription')}
            </p>
            <Link href="/marketplace" className="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition inline-block font-medium">
              {t('goToMarketplace')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTargets.map((target) => (
              <div
                key={target.id}
                className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:border-gray-300 dark:hover:border-gray-700 transition-all shadow-sm hover:shadow-md"
              >
                <div className="aspect-square bg-gray-100 dark:bg-gray-800 p-4 flex items-center justify-center relative">
                  <img
                    src={target.imageUrl}
                    alt={target.name}
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute top-2 right-2">
                    {getStatusBadge(target.status)}
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">{target.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs font-medium ${getRarityColor(target.rarity)}`}>{target.rarity}</span>
                      <span className="text-xs text-gray-400">|</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{target.exterior}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">{t('targetPrice')}</span>
                      <span className="text-sm font-bold text-orange-500">
                        {formatPrice(target.targetPrice, currency)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">{t('currentPrice')}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {formatPrice(target.currentPrice, currency)}
                      </span>
                    </div>
                  </div>

                  {target.status === 'active' && (
                    <button
                      onClick={() => handleRemoveTarget(target.id)}
                      className="w-full py-2 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition"
                    >
                      {t('removeTarget')}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
