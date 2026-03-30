'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { toast } from '@/store/toastStore';
import Loader from '@/components/Loader';

interface ReferralConfig {
  id: string;
  requiredFriendsCount: number;
  completionCondition: 'transaction' | 'email_verify';
  isActive: boolean;
}

interface ReferralCodeItem {
  id: string;
  code: string;
  type: 'user' | 'streamer';
  ownerId: string;
  owner?: { username: string };
  commissionRate: number | null;
  isActive: boolean;
  totalUses: number;
  createdAt: string;
}

interface AdminStats {
  totalReferrals: number;
  qualifiedReferrals: number;
  activeStreamerCodes: number;
  totalUserCodes: number;
  totalStreamerCommission: number;
  topReferrers: { userId: string; username: string; totalReferred: number; qualifiedCount: number }[];
}

interface RewardItem {
  id: string;
  skinId: string;
  skin?: { name: string; imageUrl: string };
  isActive: boolean;
  sortOrder: number;
}

interface SkinOption {
  id: string;
  name: string;
  imageUrl: string;
  rarity: string;
  exterior: string;
  price: number;
}

interface UserOption {
  id: string;
  username: string;
  email: string | null;
  steamId: string | null;
}

type Tab = 'settings' | 'streamers' | 'stats';

export default function AdminReferralPage() {
  const [tab, setTab] = useState<Tab>('stats');
  const [loading, setLoading] = useState(true);

  // Stats
  const [stats, setStats] = useState<AdminStats | null>(null);

  // Config
  const [config, setConfig] = useState<ReferralConfig | null>(null);
  const [configForm, setConfigForm] = useState({ requiredFriendsCount: 5, completionCondition: 'transaction' as string, isActive: true });
  const [savingConfig, setSavingConfig] = useState(false);

  // Reward items
  const [rewardItems, setRewardItems] = useState<RewardItem[]>([]);
  const [showSkinPicker, setShowSkinPicker] = useState(false);
  const [skinSearch, setSkinSearch] = useState('');
  const [skinResults, setSkinResults] = useState<SkinOption[]>([]);
  const [skinSearching, setSkinSearching] = useState(false);

  // Streamer codes
  const [codes, setCodes] = useState<ReferralCodeItem[]>([]);
  const [codesPage, setCodesPage] = useState(1);
  const [codesTotalPages, setCodesTotalPages] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({ code: '', userId: '', commissionRate: 2 });
  const [creating, setCreating] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [userResults, setUserResults] = useState<UserOption[]>([]);
  const [userSearching, setUserSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserOption | null>(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await api.get('/admin/referral/stats');
      setStats(data);
    } catch { /* ignore */ }
  }, []);

  const fetchConfig = useCallback(async () => {
    try {
      const { data } = await api.get('/admin/referral/config');
      setConfig(data);
      setConfigForm({
        requiredFriendsCount: data.requiredFriendsCount,
        completionCondition: data.completionCondition,
        isActive: data.isActive,
      });
    } catch { /* ignore */ }
  }, []);

  const fetchRewardItems = useCallback(async () => {
    try {
      const { data } = await api.get('/admin/referral/reward-items');
      setRewardItems(Array.isArray(data) ? data : []);
    } catch { /* ignore */ }
  }, []);

  const fetchCodes = useCallback(async () => {
    try {
      const { data } = await api.get('/admin/referral/codes', { params: { page: codesPage, type: 'streamer' } });
      setCodes(data.codes || []);
      setCodesTotalPages(data.totalPages || 1);
    } catch { /* ignore */ }
  }, [codesPage]);

  useEffect(() => {
    Promise.all([fetchStats(), fetchConfig(), fetchRewardItems(), fetchCodes()])
      .finally(() => setLoading(false));
  }, [fetchStats, fetchConfig, fetchRewardItems, fetchCodes]);

  const saveConfig = async () => {
    setSavingConfig(true);
    try {
      await api.patch('/admin/referral/config', configForm);
      toast.success('Sozlamalar saqlandi');
      fetchConfig();
    } catch { toast.error('Xatolik'); }
    finally { setSavingConfig(false); }
  };

  const searchSkins = async (query: string) => {
    setSkinSearch(query);
    if (query.length < 2) { setSkinResults([]); return; }
    setSkinSearching(true);
    try {
      const { data } = await api.get('/admin/skins', { params: { search: query, limit: 20 } });
      const skins = Array.isArray(data.skins) ? data.skins : Array.isArray(data) ? data : [];
      setSkinResults(skins);
    } catch { setSkinResults([]); }
    finally { setSkinSearching(false); }
  };

  const addRewardItem = async (skinId: string) => {
    try {
      await api.post('/admin/referral/reward-items', { skinId });
      toast.success('Sovg\'a qo\'shildi');
      setShowSkinPicker(false);
      setSkinSearch('');
      setSkinResults([]);
      fetchRewardItems();
    } catch { toast.error('Xatolik'); }
  };

  const searchUsers = async (query: string) => {
    setUserSearch(query);
    if (query.length < 2) { setUserResults([]); setShowUserDropdown(false); return; }
    setUserSearching(true);
    try {
      const { data } = await api.get('/admin/users', { params: { search: query, limit: 8 } });
      setUserResults(Array.isArray(data.users) ? data.users : []);
      setShowUserDropdown(true);
    } catch { setUserResults([]); }
    finally { setUserSearching(false); }
  };

  const selectUser = (user: UserOption) => {
    setSelectedUser(user);
    setCreateForm({ ...createForm, userId: user.id });
    setUserSearch(user.username);
    setShowUserDropdown(false);
  };

  const removeRewardItem = async (id: string) => {
    try {
      await api.delete(`/admin/referral/reward-items/${id}`);
      toast.success('Olib tashlandi');
      fetchRewardItems();
    } catch { toast.error('Xatolik'); }
  };

  const createStreamerCode = async () => {
    setCreating(true);
    try {
      await api.post('/admin/referral/codes/streamer', createForm);
      toast.success('Streamer kod yaratildi');
      setShowCreateModal(false);
      setCreateForm({ code: '', userId: '', commissionRate: 2 });
      fetchCodes();
    } catch (err: any) {
      const msg = err.response?.data?.message;
      if (msg === 'CODE_ALREADY_EXISTS') toast.error('Bu kod allaqachon mavjud');
      else toast.error('Xatolik');
    } finally { setCreating(false); }
  };

  const toggleCode = async (id: string, isActive: boolean) => {
    try {
      await api.patch(`/admin/referral/codes/${id}`, { isActive: !isActive });
      fetchCodes();
    } catch { toast.error('Xatolik'); }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader /></div>;

  return (
    <div className="p-6 max-w-6xl">
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(['stats', 'settings', 'streamers'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm rounded-lg transition ${tab === t ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
          >
            {t === 'stats' ? 'Statistika' : t === 'settings' ? 'Sozlamalar' : 'Streamer kodlar'}
          </button>
        ))}
      </div>

      {/* Stats Tab */}
      {tab === 'stats' && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Jami referrallar" value={stats.totalReferrals} />
            <StatCard label="Shart bajarganlari" value={stats.qualifiedReferrals} color="text-green-400" />
            <StatCard label="Streamer kodlar" value={stats.activeStreamerCodes} color="text-blue-400" />
            <StatCard label="Streamer komissiya" value={`$${stats.totalStreamerCommission.toFixed(2)}`} color="text-yellow-400" />
          </div>

          {/* Top Referrers */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-700">
              <h3 className="text-sm font-semibold text-white">Top Referrerlar</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase border-b border-gray-700">
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Username</th>
                  <th className="px-4 py-2">Jami</th>
                  <th className="px-4 py-2">Shart bajardi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {stats.topReferrers.map((r, i) => (
                  <tr key={r.userId} className="hover:bg-gray-700/50">
                    <td className="px-4 py-2 text-gray-400">{i + 1}</td>
                    <td className="px-4 py-2 text-white">{r.username}</td>
                    <td className="px-4 py-2 text-gray-300">{r.totalReferred}</td>
                    <td className="px-4 py-2 text-green-400">{r.qualifiedCount}</td>
                  </tr>
                ))}
                {stats.topReferrers.length === 0 && (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-500">Ma&apos;lumot yo&apos;q</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {tab === 'settings' && (
        <div className="space-y-6">
          {/* Config */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Referral sozlamalari</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Kerakli do&apos;stlar soni</label>
                <input
                  type="number" min={1} max={100}
                  value={configForm.requiredFriendsCount}
                  onChange={(e) => setConfigForm({ ...configForm, requiredFriendsCount: +e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Shart turi</label>
                <select
                  value={configForm.completionCondition}
                  onChange={(e) => setConfigForm({ ...configForm, completionCondition: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                >
                  <option value="transaction">Buy/Sell tranzaksiya</option>
                  <option value="email_verify">Email tasdiqlash</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Holat</label>
                <button
                  onClick={() => setConfigForm({ ...configForm, isActive: !configForm.isActive })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${configForm.isActive ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'}`}
                >
                  {configForm.isActive ? 'Aktiv' : 'O\'chirilgan'}
                </button>
              </div>
            </div>
            <button
              onClick={saveConfig}
              disabled={savingConfig}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition disabled:opacity-50"
            >
              {savingConfig ? 'Saqlanmoqda...' : 'Saqlash'}
            </button>
          </div>

          {/* Reward Items */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Sovg&apos;a itemlar</h3>
              <button onClick={() => setShowSkinPicker(true)} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition">
                + Skin qo&apos;shish
              </button>
            </div>
            <div className="space-y-2">
              {rewardItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2 px-3 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {item.skin?.imageUrl && (
                      <img src={item.skin.imageUrl} alt="" className="w-8 h-8 object-contain" />
                    )}
                    <span className="text-sm text-white">{item.skin?.name || item.skinId}</span>
                  </div>
                  <button
                    onClick={() => removeRewardItem(item.id)}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    O&apos;chirish
                  </button>
                </div>
              ))}
              {rewardItems.length === 0 && (
                <p className="text-center text-gray-500 py-4 text-sm">Hali sovg&apos;a qo&apos;shilmagan</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Streamers Tab */}
      {tab === 'streamers' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => { setShowCreateModal(true); setSelectedUser(null); setUserSearch(''); setUserResults([]); }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
            >
              + Streamer kod yaratish
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase border-b border-gray-700">
                  <th className="px-4 py-3">Kod</th>
                  <th className="px-4 py-3">Streamer</th>
                  <th className="px-4 py-3">Komissiya %</th>
                  <th className="px-4 py-3">Ishlatildi</th>
                  <th className="px-4 py-3">Holat</th>
                  <th className="px-4 py-3 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {codes.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-700/50">
                    <td className="px-4 py-3 text-white font-mono">{c.code}</td>
                    <td className="px-4 py-3 text-gray-300">{c.owner?.username || '—'}</td>
                    <td className="px-4 py-3 text-yellow-400">{c.commissionRate}%</td>
                    <td className="px-4 py-3 text-gray-300">{c.totalUses}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded ${c.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {c.isActive ? 'Aktiv' : 'O\'chirilgan'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => toggleCode(c.id, c.isActive)}
                        className={`text-xs px-3 py-1 rounded transition ${c.isActive ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30' : 'bg-green-600/20 text-green-400 hover:bg-green-600/30'}`}
                      >
                        {c.isActive ? 'O\'chirish' : 'Aktivlashtirish'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {codes.length === 0 && <p className="text-center py-12 text-gray-500">Hech qanday streamer kod yo&apos;q</p>}

            {codesTotalPages > 1 && (
              <div className="flex justify-center gap-2 p-4 border-t border-gray-700">
                <button onClick={() => setCodesPage(p => Math.max(1, p - 1))} disabled={codesPage === 1} className="px-3 py-1 text-sm bg-gray-700 rounded disabled:opacity-50 text-white">Oldingi</button>
                <span className="px-3 py-1 text-sm text-gray-400">{codesPage}/{codesTotalPages}</span>
                <button onClick={() => setCodesPage(p => Math.min(codesTotalPages, p + 1))} disabled={codesPage === codesTotalPages} className="px-3 py-1 text-sm bg-gray-700 rounded disabled:opacity-50 text-white">Keyingi</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Streamer Code Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowCreateModal(false)}>
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-white mb-4">Streamer kod yaratish</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Kod</label>
                <input
                  type="text"
                  value={createForm.code}
                  onChange={(e) => setCreateForm({ ...createForm, code: e.target.value.toUpperCase() })}
                  placeholder="SHROUD, S1MPLE..."
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                />
              </div>
              <div className="relative">
                <label className="block text-xs text-gray-400 mb-1">Foydalanuvchi</label>
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => searchUsers(e.target.value)}
                  onFocus={() => { if (userResults.length > 0) setShowUserDropdown(true); }}
                  placeholder="Username bo'yicha qidirish..."
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                />
                {selectedUser && (
                  <div className="mt-1 flex items-center gap-2 text-xs text-green-400">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    {selectedUser.username} tanlandi
                  </div>
                )}
                {showUserDropdown && userResults.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-gray-700 border border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {userResults.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => selectUser(u)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-600 transition flex items-center justify-between"
                      >
                        <div>
                          <p className="text-sm text-white">{u.username}</p>
                          <p className="text-xs text-gray-400">{u.email || u.steamId || u.id.slice(0, 8)}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {userSearching && <p className="text-xs text-gray-500 mt-1">Qidirilmoqda...</p>}
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Komissiya foizi (%)</label>
                <input
                  type="number" min={0.5} max={10} step={0.5}
                  value={createForm.commissionRate}
                  onChange={(e) => setCreateForm({ ...createForm, commissionRate: +e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-2 text-sm text-gray-400 hover:text-white transition"
              >
                Bekor qilish
              </button>
              <button
                onClick={createStreamerCode}
                disabled={creating || !createForm.code || !createForm.userId}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition disabled:opacity-50"
              >
                {creating ? 'Yaratilmoqda...' : 'Yaratish'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Skin Picker Modal */}
      {showSkinPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => { setShowSkinPicker(false); setSkinSearch(''); setSkinResults([]); }}>
          <div className="bg-gray-800 rounded-xl p-6 max-w-lg w-full mx-4 max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-white mb-4">Sovg&apos;a uchun skin tanlang</h3>
            <input
              type="text"
              value={skinSearch}
              onChange={(e) => searchSkins(e.target.value)}
              placeholder="Skin nomi bo'yicha qidirish..."
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm mb-4"
              autoFocus
            />
            <div className="flex-1 overflow-y-auto space-y-1 min-h-0">
              {skinSearching && <p className="text-center text-gray-500 py-4 text-sm">Qidirilmoqda...</p>}
              {!skinSearching && skinSearch.length >= 2 && skinResults.length === 0 && (
                <p className="text-center text-gray-500 py-4 text-sm">Natija topilmadi</p>
              )}
              {skinResults.map((skin) => (
                <button
                  key={skin.id}
                  onClick={() => addRewardItem(skin.id)}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-700 rounded-lg transition text-left"
                >
                  <div className="w-10 h-10 bg-gray-700 rounded flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {skin.imageUrl && <img src={skin.imageUrl} alt="" className="w-full h-full object-contain" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{skin.name}</p>
                    <p className="text-xs text-gray-500">{skin.exterior} &middot; ${Number(skin.price).toFixed(2)}</p>
                  </div>
                  <span className="text-xs text-gray-500">{skin.rarity}</span>
                </button>
              ))}
              {skinSearch.length < 2 && (
                <p className="text-center text-gray-500 py-8 text-sm">Kamida 2 ta harf kiriting</p>
              )}
            </div>
            <button
              onClick={() => { setShowSkinPicker(false); setSkinSearch(''); setSkinResults([]); }}
              className="w-full mt-4 py-2 text-sm text-gray-400 hover:text-white transition"
            >
              Yopish
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color = 'text-white' }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}
