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
      setTiers(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Yuklanmadi');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTiers(); }, [fetchTiers]);

  const resetForm = () => { setForm({ minPrice: '', maxPrice: '', rate: '' }); setEditingId(null); setAdding(false); };

  const startEdit = (tier: CommissionTier) => {
    setEditingId(tier.id);
    setAdding(false);
    setForm({ minPrice: String(tier.minPrice), maxPrice: tier.maxPrice !== null ? String(tier.maxPrice) : '', rate: String(tier.rate) });
  };

  const startAdd = () => {
    setAdding(true);
    setEditingId(null);
    const last = tiers[tiers.length - 1];
    setForm({ minPrice: last ? String(last.maxPrice || '') : '0', maxPrice: '', rate: '' });
  };

  const handleSave = async () => {
    const minPrice = parseFloat(form.minPrice);
    const maxPrice = form.maxPrice ? parseFloat(form.maxPrice) : null;
    const rate = parseFloat(form.rate);
    if (isNaN(minPrice) || isNaN(rate) || rate <= 0 || rate > 100) { toast.error('Noto\'g\'ri qiymat'); return; }
    setSaving(true);
    try {
      if (editingId) {
        await api.patch(`/admin/commission-tiers/${editingId}`, { minPrice, maxPrice, rate });
        toast.success('Yangilandi');
      } else {
        await api.post('/admin/commission-tiers', { minPrice, maxPrice, rate });
        toast.success('Qo\'shildi');
      }
      resetForm();
      await fetchTiers();
    } catch (err: any) { toast.error(err.response?.data?.message || 'Xatolik'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    try { await api.delete(`/admin/commission-tiers/${id}`); toast.success('O\'chirildi'); await fetchTiers(); }
    catch { toast.error('Xatolik'); }
  };

  const handleSeed = async () => {
    try { await api.post('/admin/commission-tiers/seed'); toast.success('Default tier\'lar yaratildi'); await fetchTiers(); }
    catch { toast.error('Xatolik'); }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader /></div>;

  // Inline edit row
  const EditRow = ({ isNew }: { isNew: boolean }) => (
    <tr className={`text-sm ${isNew ? 'bg-blue-900/10' : ''}`}>
      <td className="px-4 py-3">
        <input type="number" value={form.minPrice} onChange={(e) => setForm(f => ({ ...f, minPrice: e.target.value }))}
          className="w-20 px-2 py-1 rounded bg-gray-700 border border-gray-600 text-white text-sm" autoFocus />
      </td>
      <td className="px-4 py-3">
        <input type="number" value={form.maxPrice} onChange={(e) => setForm(f => ({ ...f, maxPrice: e.target.value }))}
          placeholder="—" className="w-20 px-2 py-1 rounded bg-gray-700 border border-gray-600 text-white text-sm" />
      </td>
      <td className="px-4 py-3">
        <input type="number" value={form.rate} onChange={(e) => setForm(f => ({ ...f, rate: e.target.value }))}
          placeholder="%" className="w-16 px-2 py-1 rounded bg-gray-700 border border-gray-600 text-white text-sm" />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <button onClick={handleSave} disabled={saving} className="p-1.5 text-green-400 hover:text-green-300 transition" title="Saqlash">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
          <button onClick={resetForm} className="p-1.5 text-gray-400 hover:text-gray-300 transition" title="Bekor">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">Narx diapazoniga qarab sotuvchidan ushlanadigan komissiya foizi</p>
        <div className="flex gap-2">
          {tiers.length === 0 && (
            <button onClick={handleSeed} className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
              Default yaratish
            </button>
          )}
          <button onClick={startAdd} className="px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tier qo&apos;shish
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        {tiers.length === 0 && !adding ? (
          <p className="text-center text-gray-500 py-16 text-sm">Tier&apos;lar yo&apos;q. &quot;Default yaratish&quot; tugmasini bosing.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-700/50 border-b border-gray-700">
                  <th className="text-left px-4 py-3 font-semibold text-gray-300">Min narx</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-300">Max narx</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-300">Komissiya</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-300">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {tiers.map((tier) => (
                  editingId === tier.id ? (
                    <EditRow key={tier.id} isNew={false} />
                  ) : (
                    <tr key={tier.id} className="hover:bg-gray-700/30 transition-colors">
                      <td className="px-4 py-3 text-white font-medium">${Number(tier.minPrice).toFixed(0)}</td>
                      <td className="px-4 py-3 text-white font-medium">
                        {tier.maxPrice !== null ? `$${Number(tier.maxPrice).toFixed(0)}` : <span className="text-gray-500">Cheksiz</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 bg-green-500/10 text-green-400 rounded text-xs font-bold">{Number(tier.rate)}%</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => startEdit(tier)} className="p-1.5 text-blue-400 hover:text-blue-300 transition" title="Tahrirlash">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          <button onClick={() => handleDelete(tier.id)} className="p-1.5 text-red-400 hover:text-red-300 transition" title="O'chirish">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                ))}
                {adding && <EditRow isNew={true} />}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
