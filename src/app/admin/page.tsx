'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface DashboardStats {
  totalSkins: number;
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: any[];
  popularSkins: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Simple English translations for now
  const t = {
    title: 'Admin Dashboard',
    totalSkins: 'Total Skins',
    totalUsers: 'Total Users',
    totalOrders: 'Total Orders',
    totalRevenue: 'Total Revenue',
    recentOrders: 'Recent Orders',
    popularSkins: 'Popular Skins',
    viewAll: 'View All',
    steamImport: 'Steam Import',
    importDescription: 'Import skins from Steam Market',
    manageUsers: 'Manage Users',
    usersDescription: 'View and manage user accounts',
    manageSkins: 'Manage Skins',
    skinsDescription: 'Add, edit, and remove skins',
    viewOrders: 'View Orders',
    ordersDescription: 'Manage customer orders',
    loading: 'Loading...',
    noData: 'No data available',
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      // For now, we'll use mock data since we don't have admin endpoints yet
      const mockStats: DashboardStats = {
        totalSkins: 150,
        totalUsers: 1250,
        totalOrders: 89,
        totalRevenue: 15420.50,
        recentOrders: [
          { id: '1', user: 'John Doe', skin: 'AK-47 | Redline', amount: 45.99, date: '2024-01-15' },
          { id: '2', user: 'Jane Smith', skin: 'AWP | Dragon Lore', amount: 2500.00, date: '2024-01-14' },
          { id: '3', user: 'Mike Johnson', skin: 'M4A4 | Howl', amount: 1200.00, date: '2024-01-14' },
        ],
        popularSkins: [
          { id: '1', name: 'AK-47 | Redline', sales: 45, revenue: 2070.55 },
          { id: '2', name: 'AWP | Dragon Lore', sales: 12, revenue: 30000.00 },
          { id: '3', name: 'M4A4 | Howl', sales: 23, revenue: 27600.00 },
        ],
      };
      setStats(mockStats);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600 dark:text-gray-400">{t.loading}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        {t.title}
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <span className="text-2xl">🎯</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t.totalSkins}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalSkins || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t.totalUsers}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalUsers || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
              <span className="text-2xl">📦</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t.totalOrders}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalOrders || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t.totalRevenue}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${stats?.totalRevenue?.toFixed(2) || '0.00'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link
          href="/admin/steam-import"
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="text-center">
            <div className="text-4xl mb-4">⬇️</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {t.steamImport}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t.importDescription}
            </p>
          </div>
        </Link>

        <Link
          href="/admin/users"
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="text-center">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {t.manageUsers}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t.usersDescription}
            </p>
          </div>
        </Link>

        <Link
          href="/admin/skins"
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {t.manageSkins}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t.skinsDescription}
            </p>
          </div>
        </Link>

        <Link
          href="/admin/orders"
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="text-center">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {t.viewOrders}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t.ordersDescription}
            </p>
          </div>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t.recentOrders}
            </h2>
            <Link
              href="/admin/orders"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              {t.viewAll}
            </Link>
          </div>

          <div className="space-y-4">
            {stats?.recentOrders?.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{order.user}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{order.skin}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900 dark:text-white">${order.amount}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{order.date}</p>
                </div>
              </div>
            )) || (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">{t.noData}</p>
            )}
          </div>
        </div>

        {/* Popular Skins */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t.popularSkins}
            </h2>
            <Link
              href="/admin/skins"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              {t.viewAll}
            </Link>
          </div>

          <div className="space-y-4">
            {stats?.popularSkins?.map((skin) => (
              <div key={skin.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{skin.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{skin.sales} sales</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900 dark:text-white">${skin.revenue.toFixed(2)}</p>
                </div>
              </div>
            )) || (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">{t.noData}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}