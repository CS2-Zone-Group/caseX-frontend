'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { formatPrice } from '@/lib/currency';
import { useSettingsStore } from '@/store/settingsStore';
import { toast } from '@/store/toastStore';
import Loader from '@/components/Loader';

interface Skin {
  id: string;
  name: string;
  weaponType: string;
  rarity: string;
  exterior: string;
  price: number;
  float: number | null;
  imageUrl: string | null;
  marketHashName: string | null;
  steamPrice: number | null;
  isAvailable: boolean;
}

interface PaginatedResponse {
  skins: Skin[];
  data?: Skin[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const RARITY_COLORS: Record<string, string> = {
  'Consumer Grade': 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200',
  'Industrial Grade': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400',
  'Mil-Spec': 'bg-blue-200 dark:bg-blue-900/50 text-blue-900 dark:text-blue-300',
  'Restricted': 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400',
  'Classified': 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-400',
  'Covert': 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400',
  'Contraband': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400',
};

const EMPTY_FORM = {
  name: '',
  weaponType: '',
  rarity: '',
  exterior: '',
  price: '',
  imageUrl: '',
  float: '',
  marketHashName: '',
};

export default function AdminSkinsPage() {
  const [skins, setSkins] = useState<Skin[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(20);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { currency } = useSettingsStore();

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingSkin, setEditingSkin] = useState<Skin | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formLoading, setFormLoading] = useState(false);

  // Inline price edit
  const [editingPrice, setEditingPrice] = useState<string | null>(null);
  const [priceValue, setPriceValue] = useState('');

  const fetchSkins = useCallback(async () => {
    try {
      setLoading(true);
      const params: Record<string, any> = { page, limit };
      if (search.trim()) params.search = search.trim();
      const response = await api.get<PaginatedResponse>('/admin/skins', { params });
      setSkins(response.data.skins || response.data.data || []);
      setTotal(response.data.total || 0);
      setTotalPages(response.data.totalPages || Math.ceil((response.data.total || 0) / limit));
    } catch (err: any) {
      console.error('Failed to fetch skins:', err);
      toast.error(err.response?.data?.message || 'Xatolik: skinlarni yuklashda muammo');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    fetchSkins();
  }, [fetchSkins]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleToggleAvailability = async (skinId: string, currentAvailable: boolean) => {
    try {
      setActionLoading(skinId);
      await api.patch(`/admin/skins/${skinId}`, { isAvailable: !currentAvailable });
      setSkins(prev => prev.map(s => s.id === skinId ? { ...s, isAvailable: !currentAvailable } : s));
      toast.success(`Skin ${!currentAvailable ? 'yoqildi' : 'o\'chirildi'}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Xatolik: skinni yangilashda muammo');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteSkin = async (skinId: string) => {
    if (!confirm('Bu skinni o\'chirmoqchimisiz?')) return;
    try {
      setActionLoading(skinId);
      await api.delete(`/admin/skins/${skinId}`);
      setSkins(prev => prev.filter(s => s.id !== skinId));
      setTotal(prev => prev - 1);
      toast.success('Skin o\'chirildi');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Xatolik: skinni o\'chirishda muammo');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSavePrice = async (skinId: string) => {
    const newPrice = parseFloat(priceValue);
    if (isNaN(newPrice) || newPrice < 0) {
      toast.error('Noto\'g\'ri narx qiymati');
      return;
    }
    try {
      setActionLoading(skinId);
      await api.patch(`/admin/skins/${skinId}`, { price: newPrice });
      setSkins(prev => prev.map(s => s.id === skinId ? { ...s, price: newPrice } : s));
      setEditingPrice(null);
      setPriceValue('');
      toast.success('Narx yangilandi');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Xatolik: narxni yangilashda muammo');
    } finally {
      setActionLoading(null);
    }
  };

  const openCreateModal = () => {
    setEditingSkin(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEditModal = (skin: Skin) => {
    setEditingSkin(skin);
    setForm({
      name: skin.name,
      weaponType: skin.weaponType || '',
      rarity: skin.rarity || '',
      exterior: skin.exterior || '',
      price: String(skin.price),
      imageUrl: skin.imageUrl || '',
      float: skin.float != null ? String(skin.float) : '',
      marketHashName: skin.marketHashName || '',
    });
    setShowModal(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.price) {
      toast.error('Nomi va narx majburiy');
      return;
    }

    const payload: Record<string, any> = {
      name: form.name.trim(),
      weaponType: form.weaponType.trim() || undefined,
      rarity: form.rarity.trim() || undefined,
      exterior: form.exterior.trim() || undefined,
      price: parseFloat(form.price),
      imageUrl: form.imageUrl.trim() || undefined,
      float: form.float ? parseFloat(form.float) : undefined,
      marketHashName: form.marketHashName.trim() || undefined,
    };

    try {
      setFormLoading(true);
      if (editingSkin) {
        const response = await api.patch(`/admin/skins/${editingSkin.id}`, payload);
        setSkins(prev => prev.map(s => s.id === editingSkin.id ? { ...s, ...response.data } : s));
        toast.success('Skin yangilandi');
      } else {
        const response = await api.post('/admin/skins', payload);
        setSkins(prev => [response.data, ...prev]);
        setTotal(prev => prev + 1);
        toast.success('Skin yaratildi');
      }
      setShowModal(false);
      setForm(EMPTY_FORM);
      setEditingSkin(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Xatolik: skinni saqlashda muammo');
    } finally {
      setFormLoading(false);
    }
  };

  const getRarityClass = (rarity: string) => {
    return RARITY_COLORS[rarity] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Skinlar</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {total} total skins
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition-colors shadow-md hover:shadow-lg"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Skin qo'shish
        </button>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Skin nomi bo'yicha qidirish..."
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
        ) : skins.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <p className="text-gray-500 dark:text-gray-400">Skin topilmadi</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Skin</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Qurol</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Kamyoblik</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Holat</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Narx</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Float</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Mavjud</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {skins.map((skin) => (
                  <tr key={skin.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    {/* Skin name + image */}
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                          {skin.imageUrl ? (
                            <img
                              src={skin.imageUrl}
                              alt={skin.name}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          )}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white max-w-[200px] truncate">
                          {skin.name}
                        </span>
                      </div>
                    </td>

                    {/* Weapon Type */}
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      {skin.weaponType || '--'}
                    </td>

                    {/* Rarity */}
                    <td className="px-4 py-3">
                      {skin.rarity ? (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getRarityClass(skin.rarity)}`}>
                          {skin.rarity}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">--</span>
                      )}
                    </td>

                    {/* Exterior */}
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      {skin.exterior || '--'}
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3">
                      {editingPrice === skin.id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={priceValue}
                            onChange={(e) => setPriceValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSavePrice(skin.id);
                              if (e.key === 'Escape') { setEditingPrice(null); setPriceValue(''); }
                            }}
                            className="w-24 px-2 py-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSavePrice(skin.id)}
                            disabled={actionLoading === skin.id}
                            className="p-1 text-green-600 hover:text-green-700 disabled:opacity-50"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => { setEditingPrice(null); setPriceValue(''); }}
                            className="p-1 text-red-600 hover:text-red-700"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setEditingPrice(skin.id); setPriceValue(String(skin.price)); }}
                          className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          title="Click to edit price"
                        >
                          {formatPrice(skin.price, currency)}
                        </button>
                      )}
                    </td>

                    {/* Float */}
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 font-mono text-xs">
                      {skin.float != null ? skin.float.toFixed(6) : '--'}
                    </td>

                    {/* Available toggle */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleAvailability(skin.id, skin.isAvailable)}
                        disabled={actionLoading === skin.id}
                        className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                        style={{ backgroundColor: skin.isAvailable ? '#22c55e' : '#d1d5db' }}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                            skin.isAvailable ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openEditModal(skin)}
                          className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Edit skin"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteSkin(skin.id)}
                          disabled={actionLoading === skin.id}
                          className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete skin"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
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
              Page {page} of {totalPages} ({total} skins)
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

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { setShowModal(false); setEditingSkin(null); }} />
          <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {editingSkin ? 'Skinni tahrirlash' : 'Yangi skin qo\'shish'}
              </h2>
              <button
                onClick={() => { setShowModal(false); setEditingSkin(null); }}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-5 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nomi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="masalan: AK-47 | Redline"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              {/* Weapon Type + Rarity */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Qurol turi</label>
                  <input
                    type="text"
                    value={form.weaponType}
                    onChange={(e) => setForm(f => ({ ...f, weaponType: e.target.value }))}
                    placeholder="masalan: AK-47"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kamyoblik</label>
                  <select
                    value={form.rarity}
                    onChange={(e) => setForm(f => ({ ...f, rarity: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="">Kamyoblikni tanlang</option>
                    <option value="Consumer Grade">Consumer Grade</option>
                    <option value="Industrial Grade">Industrial Grade</option>
                    <option value="Mil-Spec">Mil-Spec</option>
                    <option value="Restricted">Restricted</option>
                    <option value="Classified">Classified</option>
                    <option value="Covert">Covert</option>
                    <option value="Contraband">Contraband</option>
                  </select>
                </div>
              </div>

              {/* Exterior + Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Holat</label>
                  <select
                    value={form.exterior}
                    onChange={(e) => setForm(f => ({ ...f, exterior: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="">Holatni tanlang</option>
                    <option value="Factory New">Factory New</option>
                    <option value="Minimal Wear">Minimal Wear</option>
                    <option value="Field-Tested">Field-Tested</option>
                    <option value="Well-Worn">Well-Worn</option>
                    <option value="Battle-Scarred">Battle-Scarred</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Narx (USD) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={(e) => setForm(f => ({ ...f, price: e.target.value }))}
                    placeholder="0.00"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
              </div>

              {/* Float + Market Hash Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Float qiymati</label>
                  <input
                    type="number"
                    step="0.000001"
                    min="0"
                    max="1"
                    value={form.float}
                    onChange={(e) => setForm(f => ({ ...f, float: e.target.value }))}
                    placeholder="0.150000"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Market Hash Name</label>
                  <input
                    type="text"
                    value={form.marketHashName}
                    onChange={(e) => setForm(f => ({ ...f, marketHashName: e.target.value }))}
                    placeholder="AK-47 | Redline (Field-Tested)"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rasm URL</label>
                <input
                  type="text"
                  value={form.imageUrl}
                  onChange={(e) => setForm(f => ({ ...f, imageUrl: e.target.value }))}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setEditingSkin(null); }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  {formLoading && (
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  )}
                  <span>{editingSkin ? 'Yangilash' : 'Yaratish'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
