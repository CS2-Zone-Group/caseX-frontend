'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { formatPrice } from '@/lib/currency';
import { useSettingsStore } from '@/store/settingsStore';
import { toast } from '@/store/toastStore';
import Loader from '@/components/Loader';

interface User {
  id: string;
  username: string;
  email: string | null;
  steamId: string | null;
  steamAvatar: string | null;
  avatar: string | null;
  balance: number;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt: string;
}

interface PaginatedResponse {
  users: User[];
  data?: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(20);
  const [editingBalance, setEditingBalance] = useState<string | null>(null);
  const [balanceValue, setBalanceValue] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { currency } = useSettingsStore();

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params: Record<string, any> = { page, limit };
      if (search.trim()) params.search = search.trim();
      const response = await api.get<PaginatedResponse>('/admin/users', { params });
      const d = response.data as any;
      setUsers(Array.isArray(d.users) ? d.users : Array.isArray(d.data) ? d.data : Array.isArray(d) ? d : []);
      setTotal(response.data.total || 0);
      setTotalPages(response.data.totalPages || Math.ceil((response.data.total || 0) / limit));
    } catch (err: any) {
      console.error('Failed to fetch users:', err);
      toast.error(err.response?.data?.message || 'Yuklanmadi');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Debounced search: reset to page 1 when search changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleUpdateRole = async (userId: string, newRole: 'user' | 'admin') => {
    try {
      setActionLoading(userId);
      await api.patch(`/admin/users/${userId}`, { role: newRole });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      toast.success('Rol yangilandi');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Rol yangilanmadi');
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleActive = async (userId: string, currentActive: boolean) => {
    try {
      setActionLoading(userId);
      if (currentActive) {
        // Ban: soft delete
        await api.delete(`/admin/users/${userId}`);
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, isActive: false } : u));
        toast.success('Foydalanuvchi bloklandi');
      } else {
        // Unban: restore
        await api.patch(`/admin/users/${userId}`, { isActive: true });
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, isActive: true } : u));
        toast.success('Blokdan chiqarildi');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Holat yangilanmadi');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSaveBalance = async (userId: string) => {
    const newBalance = parseFloat(balanceValue);
    if (isNaN(newBalance) || newBalance < 0) {
      toast.error('Noto\'g\'ri balans qiymati');
      return;
    }
    try {
      setActionLoading(userId);
      await api.patch(`/admin/users/${userId}`, { balance: newBalance });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, balance: newBalance } : u));
      setEditingBalance(null);
      setBalanceValue('');
      toast.success('Balans yangilandi');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Balans yangilanmadi');
    } finally {
      setActionLoading(null);
    }
  };

  const startEditBalance = (user: User) => {
    setEditingBalance(user.id);
    setBalanceValue(String(user.balance));
  };

  const cancelEditBalance = () => {
    setEditingBalance(null);
    setBalanceValue('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">{total} ta foydalanuvchi</p>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Username yoki email bo'yicha qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <Loader />
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197" />
            </svg>
            <p className="text-gray-500 dark:text-gray-400">Foydalanuvchi topilmadi</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Foydalanuvchi</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Email</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Steam ID</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Balans</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Rol</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Holat</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    {/* Avatar + Username */}
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                          {user.steamAvatar || user.avatar ? (
                            <img
                              src={user.steamAvatar || user.avatar || ''}
                              alt={user.username}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-white font-bold text-xs">
                              {user.username?.charAt(0).toUpperCase() || '?'}
                            </span>
                          )}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white whitespace-nowrap">
                          {user.username}
                        </span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {user.email || <span className="text-gray-400 italic">--</span>}
                    </td>

                    {/* Steam ID */}
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 font-mono text-xs">
                      {user.steamId || <span className="text-gray-400 italic">--</span>}
                    </td>

                    {/* Balance */}
                    <td className="px-4 py-3">
                      {editingBalance === user.id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={balanceValue}
                            onChange={(e) => setBalanceValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveBalance(user.id);
                              if (e.key === 'Escape') cancelEditBalance();
                            }}
                            className="w-24 px-2 py-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveBalance(user.id)}
                            disabled={actionLoading === user.id}
                            className="p-1 text-green-600 hover:text-green-700 disabled:opacity-50"
                            title="Saqlash"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button
                            onClick={cancelEditBalance}
                            className="p-1 text-red-600 hover:text-red-700"
                            title="Bekor qilish"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEditBalance(user)}
                          className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          title="Balansni o'zgartirish"
                        >
                          {formatPrice(user.balance, currency)}
                        </button>
                      )}
                    </td>

                    {/* Role */}
                    <td className="px-4 py-3">
                      <select
                        value={user.role}
                        onChange={(e) => handleUpdateRole(user.id, e.target.value as 'user' | 'admin')}
                        disabled={actionLoading === user.id}
                        className={`px-2 py-1 rounded-lg text-xs font-medium border-0 cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50 ${
                          user.role === 'admin'
                            ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400'
                            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400'
                        }`}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.isActive
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          user.isActive ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        {user.isActive ? 'Aktiv' : 'Bloklangan'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleActive(user.id, user.isActive)}
                        disabled={actionLoading === user.id}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 ${
                          user.isActive
                            ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/40'
                            : 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/40'
                        }`}
                      >
                        {actionLoading === user.id ? (
                          <span className="flex items-center space-x-1">
                            <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            <span>...</span>
                          </span>
                        ) : user.isActive ? 'Bloklash' : 'Blokdan chiqarish'}
                      </button>
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
              {/* Page number buttons */}
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
