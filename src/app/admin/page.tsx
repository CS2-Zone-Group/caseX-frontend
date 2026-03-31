'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import api from '@/lib/api';
import { formatPrice } from '@/lib/currency';
import { useSettingsStore } from '@/store/settingsStore';
import Loader from '@/components/Loader';

interface RecentTransaction {
  id: string;
  type: 'purchase' | 'sale';
  amount: number;
  createdAt: string;
  user?: { id: string; username: string };
  skin?: { id: string; name: string; imageUrl?: string };
  metadata?: {
    source?: string;
    commission?: number;
    commissionRate?: number;
    skinName?: string;
    sellerId?: string;
    buyerId?: string;
  };
}

interface DashboardStats {
  totalSkins: number;
  totalUsers: number;
  totalTransactions: number;
  totalRevenue: number;
  totalTurnover: number;
  activeListings: number;
  recentTransactions: RecentTransaction[];
}

interface FinancialReport {
  totalRevenue: number;
  todayRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
  totalTurnover: number;
}

/* Simple bar chart component */
function MiniBarChart({ data, color }: { data: { label: string; value: number }[]; color: string }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex items-end gap-1 h-24">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className={`w-full rounded-t ${color} transition-all duration-500`}
            style={{ height: `${Math.max((d.value / max) * 100, 4)}%`, minHeight: 3 }}
            title={`${d.label}: ${d.value}`}
          />
          <span className="text-[9px] text-gray-500">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

interface DailyRevenue {
  date: string;
  revenue: number;
}

function DailyRevenueChart({ data, currency }: { data: DailyRevenue[]; currency: any }) {
  const maxRevenue = Math.max(...data.map(d => d.revenue), 0.01);

  return (
    <div className="space-y-2">
      {/* Chart */}
      <div className="flex items-end gap-1 h-32">
        {data.map((d, i) => {
          const height = maxRevenue > 0 ? (d.revenue / maxRevenue) * 100 : 0;
          const isToday = i === data.length - 1;
          return (
            <div key={d.date} className="flex-1 flex flex-col items-center justify-end h-full group relative">
              <div
                className={`w-full rounded-t transition-all ${isToday ? 'bg-green-500' : 'bg-blue-500/70'} hover:bg-blue-400 min-h-[2px]`}
                style={{ height: `${Math.max(height, 2)}%` }}
              />
              {/* Tooltip */}
              <div className="absolute bottom-full mb-1 hidden group-hover:block z-10">
                <div className="bg-gray-900 border border-gray-700 rounded px-2 py-1 text-[9px] text-white whitespace-nowrap shadow-lg">
                  <div>{d.date.slice(5)}</div>
                  <div className="text-green-400 font-bold">{formatPrice(d.revenue, currency)}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Date labels - show every 5th */}
      <div className="flex gap-1">
        {data.map((d, i) => (
          <div key={d.date} className="flex-1 text-center">
            {(i % 5 === 0 || i === data.length - 1) && (
              <span className="text-[8px] text-gray-500">{d.date.slice(5)}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [finance, setFinance] = useState<FinancialReport | null>(null);
  const [dailyRevenue, setDailyRevenue] = useState<DailyRevenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currency } = useSettingsStore();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsRes, financeRes, dailyRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/financial-report').catch(() => ({ data: null })),
        api.get('/admin/daily-revenue?days=20').catch(() => ({ data: [] })),
      ]);
      setStats(statsRes.data);
      setFinance(financeRes.data);
      setDailyRevenue(Array.isArray(dailyRes.data) ? dailyRes.data : []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Yuklanmadi');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullScreen />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-red-900/20 border border-red-800 rounded-xl p-6 max-w-md text-center">
          <p className="text-red-300 font-medium mb-3">{error}</p>
          <button onClick={fetchData} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm">
            Qayta urinish
          </button>
        </div>
      </div>
    );
  }

  // Revenue chart data
  const revenueData = finance ? [
    { label: 'Bugun', value: finance.todayRevenue },
    { label: 'Hafta', value: finance.weekRevenue },
    { label: 'Oy', value: finance.monthRevenue },
    { label: 'Jami', value: finance.totalRevenue },
  ] : [];

  // Stats array for grid
  const statCards = [
    { label: 'Jami skinlar', value: String(stats?.totalSkins ?? 0), icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z', gradient: 'from-blue-500 to-blue-600' },
    { label: 'Foydalanuvchilar', value: String(stats?.totalUsers ?? 0), icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197', gradient: 'from-green-500 to-green-600' },
    { label: 'Tranzaksiyalar', value: String(stats?.totalTransactions ?? 0), icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', gradient: 'from-yellow-500 to-yellow-600' },
    { label: 'Daromad (komissiya)', value: formatPrice(stats?.totalRevenue ?? 0, currency), icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', gradient: 'from-purple-500 to-purple-600' },
    { label: 'Aktiv listinglar', value: String(stats?.activeListings ?? 0), icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', gradient: 'from-cyan-500 to-cyan-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {statCards.map((card) => (
          <div key={card.label} className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-all group">
            <div className="flex items-center justify-between mb-2">
              <div className={`w-9 h-9 bg-gradient-to-br ${card.gradient} rounded-lg flex items-center justify-center shadow group-hover:scale-110 transition-transform`}>
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
                </svg>
              </div>
            </div>
            <p className="text-xl font-bold text-white">{card.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Revenue (Commission) + Turnover Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Daily Revenue Chart */}
        <div className="lg:col-span-2 bg-gray-800 rounded-xl p-5 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Kunlik daromad (komissiya)</h3>
            <div className="flex items-center gap-2">
              <div className="grid grid-cols-4 gap-1.5">
                {finance && [
                  { label: 'Bugun', value: finance.todayRevenue, color: 'text-green-400' },
                  { label: 'Hafta', value: finance.weekRevenue, color: 'text-blue-400' },
                  { label: 'Oy', value: finance.monthRevenue, color: 'text-purple-400' },
                  { label: 'Jami', value: finance.totalRevenue, color: 'text-white' },
                ].map((item) => (
                  <div key={item.label} className="text-center px-2">
                    <p className={`text-[10px] font-bold ${item.color}`}>{formatPrice(item.value, currency)}</p>
                    <p className="text-[8px] text-gray-500">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {dailyRevenue.length > 0 ? (
            <DailyRevenueChart data={dailyRevenue} currency={currency} />
          ) : (
            <p className="text-gray-500 text-sm text-center py-8">Ma&apos;lumot yo&apos;q</p>
          )}
        </div>

        {/* Turnover Card */}
        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
          <h3 className="text-sm font-semibold text-white mb-4">Aylanma summa</h3>
          <div className="space-y-4">
            <div className="text-center py-2">
              <p className="text-2xl font-bold text-blue-400">{formatPrice(finance?.totalTurnover ?? stats?.totalTurnover ?? 0, currency)}</p>
              <p className="text-[10px] text-gray-500 mt-1">Jami oldi-sotdi summasi</p>
            </div>
            <div className="border-t border-gray-700 pt-3">
              <div className="text-center">
                <p className="text-xl font-bold text-green-400">{formatPrice(finance?.totalRevenue ?? stats?.totalRevenue ?? 0, currency)}</p>
                <p className="text-[10px] text-gray-500 mt-1">Platforma daromadi</p>
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Link href="/admin/settings" className="text-center p-2 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition text-xs text-gray-300">
              Tier&apos;larni sozlash
            </Link>
            <Link href="/admin/orders" className="text-center p-2 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition text-xs text-gray-300">
              Tranzaksiyalar
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-700">
          <h3 className="text-sm font-semibold text-white">So&apos;nggi faoliyat</h3>
          <Link href="/admin/orders" className="text-xs text-blue-400 hover:text-blue-300">
            Barchasini ko&apos;rish
          </Link>
        </div>

        {stats?.recentTransactions && stats.recentTransactions.length > 0 ? (
          <div className="divide-y divide-gray-700/50">
            {stats.recentTransactions.map((tx) => {
              const sourceLabels: Record<string, string> = {
                checkout: 'Savat',
                quick_buy: 'Tezkor xarid',
                buy_listing: 'Listing xarid',
                listing_sold: 'Listing sotildi',
                sell_to_bid: 'Bidga sotish',
                bid_purchase: 'Bid xaridi',
                steam_sell: 'Steam sotish',
                admin_auto_buy: 'Admin auto-buy',
              };
              const source = tx.metadata?.source || '';
              const commission = tx.metadata?.commission;
              const time = new Date(tx.createdAt);
              const timeStr = time.toLocaleString('uz-UZ', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit', second: '2-digit',
              });

              return (
                <div key={tx.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-700/30 transition-colors">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${
                    tx.type === 'purchase' ? 'bg-green-600' : 'bg-orange-600'
                  }`}>
                    {tx.type === 'purchase' ? 'B' : 'S'}
                  </div>
                  {tx.skin?.imageUrl && (
                    <div className="w-10 h-10 bg-gray-700 rounded overflow-hidden flex-shrink-0">
                      <img src={tx.skin.imageUrl} alt="" className="w-full h-full object-contain p-0.5" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{tx.user?.username || '—'}</p>
                    <p className="text-xs text-gray-500 truncate">{tx.skin?.name || tx.metadata?.skinName || '—'}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {source && <span className="text-[9px] px-1.5 py-0.5 bg-gray-700 text-gray-400 rounded">{sourceLabels[source] || source}</span>}
                      {commission != null && commission > 0 && (
                        <span className="text-[9px] px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 rounded">
                          Fee: ${Number(commission).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`text-sm font-semibold ${tx.type === 'purchase' ? 'text-green-400' : 'text-orange-400'}`}>
                      {formatPrice(tx.amount, currency)}
                    </p>
                    <p className="text-[9px] text-gray-500 whitespace-nowrap">{timeStr}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center py-10 text-gray-500 text-sm">Hozircha faoliyat yo&apos;q</p>
        )}
      </div>
    </div>
  );
}
