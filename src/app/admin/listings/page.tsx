'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { toast } from '@/store/toastStore';
import { formatPrice } from '@/lib/currency';
import { useSettingsStore } from '@/store/settingsStore';
import Loader from '@/components/Loader';

interface Listing {
  id: string;
  listPrice: number;
  isListed: boolean;
  updatedAt: string;
  user: { id: string; username: string; steamId?: string };
  skin: { id: string; name: string; imageUrl: string; rarity: string; exterior: string };
}

export default function AdminListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { currency } = useSettingsStore();

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/listings', { params: { page, search: search || undefined } });
      setListings(data.listings);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch { toast.error('Yuklanmadi'); } finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { fetchListings(); }, [fetchListings]);

  const handleDelist = async (id: string) => {
    try {
      await api.delete(`/admin/listings/${id}`);
      toast.success('Listing olib tashlandi');
      fetchListings();
    } catch { toast.error('Xatolik'); }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Active Listings</h1>
          <p className="text-sm text-gray-500">{total} ta listing</p>
        </div>
        <input
          type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Skin nomi bo'yicha qidirish..."
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm w-64"
        />
      </div>

      {loading ? <div className="flex justify-center py-20"><Loader /></div> : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3">Skin</th>
                <th className="px-4 py-3">Sotuvchi</th>
                <th className="px-4 py-3">Narx</th>
                <th className="px-4 py-3">Sana</th>
                <th className="px-4 py-3 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {listings.map((item) => (
                <tr key={item.id} className="text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden flex-shrink-0">
                        <img src={item.skin?.imageUrl} alt="" className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      </div>
                      <div>
                        <p className="text-white font-medium truncate max-w-[200px]">{item.skin?.name}</p>
                        <p className="text-xs text-gray-500">{item.skin?.exterior}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-300">{item.user?.username}</td>
                  <td className="px-4 py-3 text-green-400 font-medium">{formatPrice(Number(item.listPrice), currency)}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{new Date(item.updatedAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleDelist(item.id)} className="px-3 py-1 text-xs bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded transition">
                      Delist
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {listings.length === 0 && <p className="text-center py-12 text-gray-500">Hech qanday listing yo'q</p>}

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 p-4 border-t border-gray-700">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 text-sm bg-gray-700 rounded disabled:opacity-50 text-white">Oldingi</button>
              <span className="px-3 py-1 text-sm text-gray-400">{page}/{totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 text-sm bg-gray-700 rounded disabled:opacity-50 text-white">Keyingi</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
