'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { formatPrice } from '@/lib/currency';
import { useSettingsStore } from '@/store/settingsStore';
import { toast } from '@/store/toastStore';
import Loader from '@/components/Loader';

interface Transaction {
  id: string;
  type: 'purchase' | 'sale';
  amount: number;
  createdAt: string;
  userId: string;
  skinId: string;
  metadata: Record<string, any> | null;
  user?: { id: string; username: string; email: string | null };
  skin?: { id: string; name: string; weaponType: string };
}

interface PaginatedResponse {
  transactions: Transaction[];
  data?: Transaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

type FilterType = 'all' | 'purchase' | 'sale';

export default function AdminOrdersPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(20);
  const [filterType, setFilterType] = useState<FilterType>('all');
  const { currency } = useSettingsStore();

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const params: Record<string, any> = { page, limit };
      if (filterType !== 'all') params.type = filterType;
      const response = await api.get<PaginatedResponse>('/admin/transactions', { params });
      setTransactions(response.data.transactions || response.data.data || []);
      setTotal(response.data.total || 0);
      setTotalPages(response.data.totalPages || Math.ceil((response.data.total || 0) / limit));
    } catch (err: any) {
      console.error('Failed to fetch transactions:', err);
      toast.error(err.response?.data?.message || 'Yuklanmadi');
    } finally {
      setLoading(false);
    }
  }, [page, limit, filterType]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setPage(1);
  }, [filterType]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tranzaksiyalar</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {total} ta tranzaksiya
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400 mr-2">Filtr:</span>
          {(['all', 'purchase', 'sale'] as FilterType[]).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterType === type
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {type === 'all' ? 'Barchasi' : type === 'purchase' ? 'Sotib olishlar' : 'Sotishlar'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <Loader />
        ) : transactions.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-500 dark:text-gray-400">Tranzaksiya topilmadi</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Sana</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Foydalanuvchi</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Turi</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Skin</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Summa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    {/* Date */}
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      {formatDate(tx.createdAt)}
                    </td>

                    {/* User */}
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {tx.user?.username || 'Unknown User'}
                        </p>
                        {tx.user?.email && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">{tx.user.email}</p>
                        )}
                      </div>
                    </td>

                    {/* Type badge */}
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        tx.type === 'purchase'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                          : 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400'
                      }`}>
                        {tx.type === 'purchase' ? (
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        ) : (
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V7m0 1v8m0 0v1" />
                          </svg>
                        )}
                        {tx.type === 'purchase' ? 'Sotib olish' : 'Sotish'}
                      </span>
                    </td>

                    {/* Skin */}
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {tx.skin?.name || 'Unknown Skin'}
                        </p>
                        {tx.skin?.weaponType && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">{tx.skin.weaponType}</p>
                        )}
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="px-4 py-3">
                      <span className={`font-bold ${
                        tx.type === 'purchase'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-orange-600 dark:text-orange-400'
                      }`}>
                        {formatPrice(tx.amount, currency)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {page}/{totalPages} sahifa ({total} ta)
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Oldingi
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      page === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Keyingi
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
