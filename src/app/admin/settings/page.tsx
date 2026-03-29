'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { toast } from '@/store/toastStore';
import Loader from '@/components/Loader';

interface CommissionTier {
  id: string;
  minPrice: number;
  maxPrice: number | null;
  rate: number;
}

export default function AdminSettingsPage() {
  const [tiers, setTiers] = useState<CommissionTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ minPrice: '', maxPrice: '', rate: '' });
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchTiers = useCallback(async () => {
    try {
      const { data } = await api.get('/admin/commission-tiers');
      setTiers(data);
    } catch {
      toast.error('Failed to load commission tiers');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTiers(); }, [fetchTiers]);

  const resetForm = () => {
    setForm({ minPrice: '', maxPrice: '', rate: '' });
    setEditingId(null);
    setAdding(false);
  };

  const startEdit = (tier: CommissionTier) => {
    setEditingId(tier.id);
    setAdding(false);
    setForm({
      minPrice: String(tier.minPrice),
      maxPrice: tier.maxPrice !== null ? String(tier.maxPrice) : '',
      rate: String(tier.rate),
    });
  };

  const startAdd = () => {
    setAdding(true);
    setEditingId(null);
    const lastTier = tiers[tiers.length - 1];
    setForm({
      minPrice: lastTier ? String(lastTier.maxPrice || '') : '0',
      maxPrice: '',
      rate: '',
    });
  };

  const handleSave = async () => {
    const minPrice = parseFloat(form.minPrice);
    const maxPrice = form.maxPrice ? parseFloat(form.maxPrice) : null;
    const rate = parseFloat(form.rate);

    if (isNaN(minPrice) || isNaN(rate) || rate <= 0 || rate > 100) {
      toast.error('Min narx va foiz to\'g\'ri kiriting (1-100%)');
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await api.patch(`/admin/commission-tiers/${editingId}`, { minPrice, maxPrice, rate });
        toast.success('Tier yangilandi');
      } else {
        await api.post('/admin/commission-tiers', { minPrice, maxPrice, rate });
        toast.success('Tier qo\'shildi');
      }
      resetForm();
      await fetchTiers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Xatolik');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu tier\'ni o\'chirmoqchimisiz?')) return;
    try {
      await api.delete(`/admin/commission-tiers/${id}`);
      toast.success('Tier o\'chirildi');
      await fetchTiers();
    } catch {
      toast.error('O\'chirishda xatolik');
    }
  };

  const handleSeed = async () => {
    try {
      await api.post('/admin/commission-tiers/seed');
      toast.success('Default tier\'lar yaratildi');
      await fetchTiers();
    } catch {
      toast.error('Seed xatolik');
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader /></div>;

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Sozlamalar</h1>

      {/* Commission Tiers */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Komissiya tier'lari</h2>
            <p className="text-sm text-gray-500 mt-1">Narx diapazoniga qarab sotuvchidan ushlanadigan komissiya foizi</p>
          </div>
          <div className="flex gap-2">
            {tiers.length === 0 && (
              <button
                onClick={handleSeed}
                className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                Default yaratish
              </button>
            )}
            <button
              onClick={startAdd}
              className="px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Qo'shish
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 dark:text-gray-400 uppercase border-b border-gray-200 dark:border-gray-700">
                <th className="pb-3 pr-4">Min narx ($)</th>
                <th className="pb-3 pr-4">Max narx ($)</th>
                <th className="pb-3 pr-4">Komissiya (%)</th>
                <th className="pb-3 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {tiers.map((tier) => (
                <tr key={tier.id} className="text-sm">
                  {editingId === tier.id ? (
                    <>
                      <td className="py-3 pr-4">
                        <input type="number" value={form.minPrice} onChange={(e) => setForm(f => ({ ...f, minPrice: e.target.value }))}
                          className="w-24 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
                      </td>
                      <td className="py-3 pr-4">
                        <input type="number" value={form.maxPrice} onChange={(e) => setForm(f => ({ ...f, maxPrice: e.target.value }))}
                          placeholder="Cheksiz" className="w-24 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
                      </td>
                      <td className="py-3 pr-4">
                        <input type="number" value={form.rate} onChange={(e) => setForm(f => ({ ...f, rate: e.target.value }))}
                          className="w-20 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={handleSave} disabled={saving} className="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded transition">
                            {saving ? '...' : 'Saqlash'}
                          </button>
                          <button onClick={resetForm} className="px-3 py-1 text-xs bg-gray-600 hover:bg-gray-700 text-white rounded transition">Bekor</button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-3 pr-4 text-gray-900 dark:text-white font-medium">${Number(tier.minPrice).toFixed(0)}</td>
                      <td className="py-3 pr-4 text-gray-900 dark:text-white font-medium">
                        {tier.maxPrice !== null ? `$${Number(tier.maxPrice).toFixed(0)}` : <span className="text-gray-400">Cheksiz</span>}
                      </td>
                      <td className="py-3 pr-4">
                        <span className="px-2 py-0.5 bg-green-500/10 text-green-500 rounded text-xs font-bold">{Number(tier.rate)}%</span>
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => startEdit(tier)} className="p-1 text-gray-400 hover:text-blue-500 transition">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          <button onClick={() => handleDelete(tier.id)} className="p-1 text-gray-400 hover:text-red-500 transition">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}

              {/* Add row */}
              {adding && (
                <tr className="text-sm bg-green-500/5">
                  <td className="py-3 pr-4">
                    <input type="number" value={form.minPrice} onChange={(e) => setForm(f => ({ ...f, minPrice: e.target.value }))}
                      className="w-24 px-2 py-1 rounded border border-green-500/30 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm" autoFocus />
                  </td>
                  <td className="py-3 pr-4">
                    <input type="number" value={form.maxPrice} onChange={(e) => setForm(f => ({ ...f, maxPrice: e.target.value }))}
                      placeholder="Cheksiz" className="w-24 px-2 py-1 rounded border border-green-500/30 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
                  </td>
                  <td className="py-3 pr-4">
                    <input type="number" value={form.rate} onChange={(e) => setForm(f => ({ ...f, rate: e.target.value }))}
                      placeholder="%" className="w-20 px-2 py-1 rounded border border-green-500/30 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={handleSave} disabled={saving} className="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded transition">
                        {saving ? '...' : 'Qo\'shish'}
                      </button>
                      <button onClick={resetForm} className="px-3 py-1 text-xs bg-gray-600 hover:bg-gray-700 text-white rounded transition">Bekor</button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {tiers.length === 0 && !adding && (
          <p className="text-center text-gray-400 py-8 text-sm">Tier'lar yo'q. "Default yaratish" tugmasini bosing.</p>
        )}
      </div>
    </div>
  );
}
