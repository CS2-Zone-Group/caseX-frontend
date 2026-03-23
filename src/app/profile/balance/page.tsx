"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSettingsStore } from "@/store/settingsStore";
import { useAuthStore } from "@/store/authStore";
import { useTranslations } from 'next-intl';
import { formatPrice, getExchangeRates } from "@/lib/currency";
import Navbar from "@/components/Navbar";
import ProfileSidebar from "@/components/ProfileSidebar";
import api from "@/lib/api";
import Loader from "@/components/Loader";

interface Transaction {
  id: string;
  type: 'purchase' | 'sale';
  amount: number;
  skinId: string | null;
  skin: {
    name: string;
    imageUrl: string;
  } | null;
  metadata: {
    skinName?: string;
    skinPrice?: number;
    source?: string;
  } | null;
  createdAt: string;
}

type FilterType = 'all' | 'purchase' | 'sale';

function BalanceAndPaymentsContent() {
  const { currency } = useSettingsStore();
  const { user, fetchUserBalance } = useAuthStore();
  const t = useTranslations('ProfilePage');

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [exchangeRates, setExchangeRates] = useState<{
    USD: number;
    UZS: number;
    RUB: number;
  } | null>(null);
  const [ratesLoading, setRatesLoading] = useState(false);

  useEffect(() => {
    document.title = `${t('balanceAndPayments')} - CaseX`;
  }, [t]);

  // Fetch user balance
  useEffect(() => {
    if (user?.id) {
      fetchUserBalance();
    }
  }, [user?.id, fetchUserBalance]);

  // Fetch exchange rates
  useEffect(() => {
    const fetchRates = async () => {
      setRatesLoading(true);
      try {
        const rates = await getExchangeRates();
        setExchangeRates(rates);
      } catch (error) {
        console.error("Failed to fetch exchange rates:", error);
      } finally {
        setRatesLoading(false);
      }
    };

    fetchRates();
    const interval = setInterval(fetchRates, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch transactions
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/orders/transactions', {
        params: { page, limit: 20 },
      });
      setTransactions(data.transactions || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const filteredTransactions = filter === 'all'
    ? transactions
    : transactions.filter((tx) => tx.type === filter);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const baseBalance = user?.balance || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />

      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="flex flex-col lg:flex-row gap-6">
          <ProfileSidebar activeTab="balance" />

          <div className="flex-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 lg:p-8 shadow-lg border border-gray-200 dark:border-gray-700">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-6 lg:mb-8">
                {t('balanceAndPayments')}
              </h1>

              {/* Balance + Exchange Rates Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Balance Card */}
                <div className="bg-gradient-to-br from-primary-600 to-blue-600 rounded-xl p-6">
                  <div className="text-white/80 text-sm mb-2">{t('availableBalance')}</div>
                  <div className="text-4xl font-bold text-white mb-4">
                    {formatPrice(baseBalance, currency)}
                  </div>
                  <div className="flex gap-3">
                    <button className="px-6 py-2 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition">
                      {t('deposit')}
                    </button>
                    <button className="px-6 py-2 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition">
                      {t('withdraw')}
                    </button>
                  </div>
                </div>

                {/* Exchange Rates Card */}
                <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {t('centralBankRates')}
                    </h3>
                    {ratesLoading && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {exchangeRates ? (
                      <>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">🇺🇸</span>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">USD</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">US Dollar</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-900 dark:text-white">
                              {exchangeRates.UZS.toLocaleString("uz-UZ")} so'm
                            </div>
                            <div className="text-xs text-green-600 dark:text-green-400">
                              {t('centralBank')}
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">🇷🇺</span>
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white">RUB</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Russian Ruble</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-gray-900 dark:text-white">
                                {exchangeRates.RUB.toLocaleString("uz-UZ")} so'm
                              </div>
                              <div className="text-xs text-green-600 dark:text-green-400">
                                {t('centralBank')}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                            {t('ratesUpdateInfo')}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-gray-500 dark:text-gray-400 text-sm">
                          {t('loadingRates')}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Transaction History Section */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {t('transactionHistory')}
                </h2>

                {/* Filters */}
                <div className="flex flex-wrap gap-2 lg:gap-4 mb-4 lg:mb-6">
                  {(['all', 'purchase', 'sale'] as FilterType[]).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-3 lg:px-4 py-2 rounded-lg text-sm lg:text-base transition-colors ${
                        filter === f
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {f === 'all' ? t('all') : f === 'purchase' ? t('purchases') : t('sales')}
                    </button>
                  ))}
                </div>

                {/* Transaction List */}
                <div className="space-y-3 lg:space-y-4">
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-600 border-t-transparent"></div>
                    </div>
                  ) : filteredTransactions.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                      {t('noTransactions')}
                    </div>
                  ) : (
                    filteredTransactions.map((tx) => (
                      <div
                        key={tx.id}
                        className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 lg:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:bg-gray-200 dark:hover:bg-gray-650 transition border border-gray-200 dark:border-gray-600 gap-3 sm:gap-0"
                      >
                        <div className="flex items-center gap-3 lg:gap-4">
                          <div
                            className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                              tx.type === 'sale'
                                ? 'bg-green-500/20 text-green-600 dark:text-green-500'
                                : 'bg-blue-500/20 text-blue-600 dark:text-blue-500'
                            }`}
                          >
                            {tx.type === 'sale' ? '↑' : '↓'}
                          </div>
                          <div className="min-w-0">
                            <div className="text-gray-900 dark:text-white font-semibold text-sm lg:text-base">
                              {tx.type === 'purchase' ? t('purchase') : t('sale')}
                            </div>
                            <div className="text-gray-600 dark:text-gray-400 text-xs lg:text-sm truncate">
                              {tx.metadata?.skinName || tx.skin?.name || '—'} • {formatDate(tx.createdAt)}
                            </div>
                          </div>
                        </div>
                        <div className="text-left sm:text-right flex-shrink-0">
                          <div
                            className={`text-base lg:text-lg font-bold ${
                              tx.type === 'sale'
                                ? 'text-green-600 dark:text-green-500'
                                : 'text-red-600 dark:text-red-500'
                            }`}
                          >
                            {tx.type === 'sale' ? '+' : '-'}{formatPrice(Number(tx.amount), currency)}
                          </div>
                          <div className="text-xs lg:text-sm text-green-600 dark:text-green-500">
                            {t('completed')}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-6">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 text-sm"
                    >
                      &larr;
                    </button>
                    <span className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                      {page} / {totalPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 text-sm"
                    >
                      &rarr;
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BalanceAndPaymentsPage() {
  return (
    <Suspense fallback={<Loader fullScreen />}>
      <BalanceAndPaymentsContent />
    </Suspense>
  );
}
