'use client';

import { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Loader from '@/components/Loader';
import { useAuthStore } from '@/store/authStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useTranslations } from 'next-intl';
import { formatPrice } from '@/lib/currency';
import api from '@/lib/api';
import Link from 'next/link';

type TransactionType = 'purchase' | 'sale';
type FilterTab = 'all' | TransactionType;

interface TransactionSkin {
  id: string;
  name: string;
  imageUrl: string;
  exterior: string;
}

interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  skinId: string;
  skin: TransactionSkin;
  metadata: Record<string, any>;
  createdAt: string;
}

export default function TransactionsPage() {
  const { user, hasHydrated } = useAuthStore();
  const { currency } = useSettingsStore();
  const t = useTranslations('TransactionsPage');

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterTab>('all');

  useEffect(() => {
    document.title = `${t('title')} - CaseX`;
  }, [t]);

  const fetchTransactions = useCallback(async () => {
    if (!hasHydrated || !user) return;
    setLoading(true);
    try {
      const { data } = await api.get('/orders/transactions');
      const items: Transaction[] = Array.isArray(data) ? data : data.items || [];
      // Sort by date newest first
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setTransactions(items);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  }, [hasHydrated, user]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const filteredTransactions =
    filter === 'all' ? transactions : transactions.filter((tx) => tx.type === filter);

  const counts: Record<FilterTab, number> = {
    all: transactions.length,
    purchase: transactions.filter((tx) => tx.type === 'purchase').length,
    sale: transactions.filter((tx) => tx.type === 'sale').length,
  };

  const filterTabs: FilterTab[] = ['all', 'purchase', 'sale'];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />

      <div className="container mx-auto px-4 py-8 pt-20 pb-28">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
            {transactions.length > 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {filteredTransactions.length} {filteredTransactions.length === 1 ? 'transaction' : 'transactions'}
              </p>
            )}
          </div>
        </div>

        {/* Filter tabs */}
        {transactions.length > 0 && (
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
                  filter === tab
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {tab === 'all'
                  ? t('all')
                  : tab === 'purchase'
                  ? t('purchases')
                  : t('sales')}
                <span
                  className={`text-xs ${
                    filter === tab ? 'text-white/70' : 'text-gray-400 dark:text-gray-500'
                  }`}
                >
                  {counts[tab]}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        {!hasHydrated || loading ? (
          <Loader />
        ) : !user ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
            </div>
            <Link
              href="/auth/login"
              className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition inline-block"
            >
              Login
            </Link>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {t('noTransactions')}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {t('noTransactionsDesc')}
            </p>
            <Link
              href="/marketplace"
              className="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition inline-block font-medium"
            >
              {t('goToMarketplace')}
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop table view */}
            <div className="hidden md:block bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('amount')}
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('date')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                  {filteredTransactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {tx.skin?.imageUrl ? (
                              <img
                                src={tx.skin.imageUrl}
                                alt={tx.skin.name}
                                className="w-full h-full object-contain p-0.5"
                              />
                            ) : (
                              <svg
                                className="w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {tx.skin?.name || 'Unknown Item'}
                            </p>
                            {tx.skin?.exterior && (
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {tx.skin.exterior}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            tx.type === 'purchase'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                              : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                          }`}
                        >
                          {tx.type === 'purchase' ? t('purchase') : t('sale')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`text-sm font-semibold ${
                            tx.type === 'purchase'
                              ? 'text-red-500 dark:text-red-400'
                              : 'text-green-500 dark:text-green-400'
                          }`}
                        >
                          {tx.type === 'purchase' ? '-' : '+'}
                          {formatPrice(tx.amount, currency)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {formatDate(tx.createdAt)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTime(tx.createdAt)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card view */}
            <div className="md:hidden space-y-3">
              {filteredTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {tx.skin?.imageUrl ? (
                        <img
                          src={tx.skin.imageUrl}
                          alt={tx.skin.name}
                          className="w-full h-full object-contain p-0.5"
                        />
                      ) : (
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {tx.skin?.name || 'Unknown Item'}
                      </p>
                      {tx.skin?.exterior && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {tx.skin.exterior}
                        </p>
                      )}
                    </div>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        tx.type === 'purchase'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                      }`}
                    >
                      {tx.type === 'purchase' ? t('purchase') : t('sale')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/50">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(tx.createdAt)} {formatTime(tx.createdAt)}
                    </div>
                    <span
                      className={`text-sm font-semibold ${
                        tx.type === 'purchase'
                          ? 'text-red-500 dark:text-red-400'
                          : 'text-green-500 dark:text-green-400'
                      }`}
                    >
                      {tx.type === 'purchase' ? '-' : '+'}
                      {formatPrice(tx.amount, currency)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
