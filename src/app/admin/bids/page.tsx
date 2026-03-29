'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { toast } from '@/store/toastStore';
import { formatPrice } from '@/lib/currency';
import { useSettingsStore } from '@/store/settingsStore';
import Loader from '@/components/Loader';

interface Bid {
  id: string;
  price: number;
  status: string;
  createdAt: string;
  user: { id: string; username: string };
  skin: { id: string; name: string; imageUrl: string };
}

const statusColors: Record<string, string> = {
  active: 'bg-green-500/20 text-green-400',
  fulfilled: 'bg-blue-500/20 text-blue-400',
  cancelled: 'bg-gray-500/20 text-gray-400',
};

export default function AdminBidsPage() {
  const [bids, setBids] = useState<Bid[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const { currency } = useSettingsStore();

  const fetchBids = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/bids', { params: { page, status: filter || undefined } });
      setBids(Array.isArray(data.bids) ? data.bids : []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch { toast.error('Yuklanmadi'); } finally { setLoading(false); }
  }, [page, filter]);

  useEffect(() => { fetchBids(); }, [fetchBids]);

  const handleCancel = async (id: string) => {
    try {
      await api.patch(`/admin/bids/${id}/cancel`);
      toast.success('Bid bekor qilindi');
      fetchBids();
    } catch { toast.error('Xatolik'); }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-400">{total} ta bid</p>
        <div className="flex gap-2">
          {['', 'active', 'fulfilled', 'cancelled'].map((s) => (
            <button key={s} onClick={() => { setFilter(s); setPage(1); }}
              className={`px-3 py-1.5 text-xs rounded-lg transition ${filter === s ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
              {s === '' ? 'Barchasi' : s === 'active' ? 'Aktiv' : s === 'fulfilled' ? 'Bajarilgan' : 'Bekor'}
            </button>
          ))}
        </div>
      </div>

      {loading ? <div className="flex justify-center py-20"><Loader /></div> : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3">Skin</th>
                <th className="px-4 py-3">Bidder</th>
                <th className="px-4 py-3">Narx</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Sana</th>
                <th className="px-4 py-3 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {bids.map((bid) => (
                <tr key={bid.id} className="text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden flex-shrink-0">
                        <img src={bid.skin?.imageUrl} alt="" className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      </div>
                      <span className="text-white truncate max-w-[200px]">{bid.skin?.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-300">{bid.user?.username}</td>
                  <td className="px-4 py-3 text-green-400 font-medium">{formatPrice(Number(bid.price), currency)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[bid.status] || 'bg-gray-500/20 text-gray-400'}`}>
                      {bid.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{new Date(bid.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    {bid.status === 'active' && (
                      <button onClick={() => handleCancel(bid.id)} className="px-3 py-1 text-xs bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded transition">
                        Bekor qilish
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {bids.length === 0 && <p className="text-center py-12 text-gray-500">Hech qanday bid yo'q</p>}

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
