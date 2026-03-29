'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from '@/components/Navbar';
import { useAuthStore } from '@/store/authStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useTranslations } from 'next-intl';
import { formatPrice, getCurrencySymbol, usdToLocal, localToUsd } from '@/lib/currency';
import { toast } from '@/store/toastStore';
import api from '@/lib/api';
import Link from 'next/link';

type BidStatus = 'active' | 'inactive' | 'fulfilled' | 'cancelled';
type FilterTab = 'all' | BidStatus;

interface BidSkin {
  id: string;
  name: string;
  weaponType: string;
  rarity: string;
  exterior: string;
  price: number;
  imageUrl: string;
  marketHashName?: string;
}

interface Bid {
  id: string;
  skinId: string;
  price: number;
  status: BidStatus;
  skin: BidSkin;
}

export default function TargetsPage() {
  const { user, hasHydrated } = useAuthStore();
  const { currency } = useSettingsStore();
  const t = useTranslations('TargetsPage');

  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterTab>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [actionLoading, setActionLoading] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);

  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.title = `${t('title')} - CaseX`;
  }, [t]);

  const fetchBids = useCallback(async () => {
    if (!hasHydrated || !user) return;
    setLoading(true);
    try {
      const { data } = await api.get('/orders/bids/my');
      const items: Bid[] = Array.isArray(data) ? data : data.items || [];
      setBids(items);
    } catch (error) {
      console.error('Failed to fetch bids:', error);
    } finally {
      setLoading(false);
    }
  }, [hasHydrated, user]);

  useEffect(() => {
    fetchBids();
  }, [fetchBids]);

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  // Filtered list
  const filteredBids = filter === 'all' ? bids : bids.filter((b) => b.status === filter);

  // Only active/inactive bids can be selected for bulk actions
  const selectableBids = filteredBids.filter(
    (b) => b.status === 'active' || b.status === 'inactive'
  );

  const allSelectableSelected =
    selectableBids.length > 0 && selectableBids.every((b) => selectedIds.has(b.id));

  // Counts per tab
  const counts: Record<FilterTab, number> = {
    all: bids.length,
    active: bids.filter((b) => b.status === 'active').length,
    inactive: bids.filter((b) => b.status === 'inactive').length,
    fulfilled: bids.filter((b) => b.status === 'fulfilled').length,
    cancelled: bids.filter((b) => b.status === 'cancelled').length,
  };

  // --- Helpers ---
  const setActionLoadingFor = (id: string, on: boolean) => {
    setActionLoading((prev) => {
      const next = new Set(prev);
      on ? next.add(id) : next.delete(id);
      return next;
    });
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (allSelectableSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(selectableBids.map((b) => b.id)));
    }
  };

  const clearSelection = () => setSelectedIds(new Set());

  // --- Single actions ---
  const handleToggleStatus = async (bid: Bid) => {
    const newStatus = bid.status === 'active' ? 'inactive' : 'active';
    setActionLoadingFor(bid.id, true);
    try {
      await api.patch(`/orders/bids/${bid.id}/status`, { status: newStatus });
      setBids((prev) => prev.map((b) => (b.id === bid.id ? { ...b, status: newStatus } : b)));
      toast.success(t('statusUpdated'));
    } catch {
      toast.error('Failed to update status');
    } finally {
      setActionLoadingFor(bid.id, false);
    }
  };

  const handleStartEdit = (bid: Bid) => {
    setEditingId(bid.id);
    const localPrice = usdToLocal(Number(bid.price), currency);
    setEditPrice(currency === 'UZS' ? Math.round(localPrice).toString() : localPrice.toFixed(2));
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditPrice('');
  };

  const handleSavePrice = async (bidId: string) => {
    const localPrice = parseFloat(editPrice);
    if (isNaN(localPrice) || localPrice <= 0) return;
    const usdPrice = localToUsd(localPrice, currency);
    setActionLoadingFor(bidId, true);
    try {
      await api.patch(`/orders/bids/${bidId}/price`, { price: usdPrice });
      setBids((prev) => prev.map((b) => (b.id === bidId ? { ...b, price: usdPrice } : b)));
      toast.success(t('priceUpdated'));
      handleCancelEdit();
    } catch {
      toast.error('Failed to update price');
    } finally {
      setActionLoadingFor(bidId, false);
    }
  };

  const handleDelete = async (bidId: string) => {
    if (!window.confirm(t('confirmDelete'))) return;
    setActionLoadingFor(bidId, true);
    try {
      await api.delete(`/orders/bids/${bidId}`);
      setBids((prev) => prev.filter((b) => b.id !== bidId));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(bidId);
        return next;
      });
    } catch {
      toast.error('Failed to delete');
    } finally {
      setActionLoadingFor(bidId, false);
    }
  };

  // --- Bulk actions ---
  const handleBulkAction = async (action: 'activate' | 'deactivate' | 'delete') => {
    const bidIds = Array.from(selectedIds);
    if (bidIds.length === 0) return;
    setBulkLoading(true);
    try {
      await api.post('/orders/bids/bulk', { bidIds, action });
      if (action === 'delete') {
        setBids((prev) => prev.filter((b) => !selectedIds.has(b.id)));
      } else {
        const newStatus: BidStatus = action === 'activate' ? 'active' : 'inactive';
        setBids((prev) =>
          prev.map((b) => (selectedIds.has(b.id) ? { ...b, status: newStatus } : b))
        );
      }
      setSelectedIds(new Set());
      toast.success(t('bulkSuccess'));
    } catch {
      toast.error('Bulk operation failed');
    } finally {
      setBulkLoading(false);
    }
  };

  // --- Status helpers ---
  const getStatusDot = (status: BidStatus) => {
    const colors: Record<BidStatus, string> = {
      active: 'bg-green-500',
      inactive: 'bg-red-500',
      fulfilled: 'bg-blue-500',
      cancelled: 'bg-gray-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  const getStatusLabel = (status: BidStatus) => {
    const map: Record<BidStatus, string> = {
      active: t('active'),
      inactive: t('inactive'),
      fulfilled: t('fulfilled'),
      cancelled: t('cancelled'),
    };
    return map[status] || status;
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity?.toLowerCase()) {
      case 'covert':
        return 'text-red-500';
      case 'classified':
        return 'text-pink-500';
      case 'restricted':
        return 'text-purple-500';
      case 'milspec':
        return 'text-blue-500';
      case 'industrial':
        return 'text-cyan-500';
      case 'contraband':
        return 'text-orange-500';
      default:
        return 'text-gray-500';
    }
  };

  const isSelectable = (bid: Bid) => bid.status === 'active' || bid.status === 'inactive';

  const filterTabs: FilterTab[] = ['all', 'active', 'inactive', 'fulfilled', 'cancelled'];

  // --- Skeleton ---
  const renderSkeleton = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse"
        >
          <div className="aspect-square bg-gray-200 dark:bg-gray-700" />
          <div className="p-3 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mt-2" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />

      <div className="container mx-auto px-4 py-8 pt-20 pb-28">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
            {bids.length > 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {filteredBids.length} {t('items')}
              </p>
            )}
          </div>

          {/* Select all toggle (only when there are selectable items) */}
          {selectableBids.length > 0 && (
            <button
              onClick={toggleSelectAll}
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium"
            >
              {allSelectableSelected ? t('clearSelection') : t('selectAll')}
            </button>
          )}
        </div>

        {/* Filter tabs */}
        {bids.length > 0 && (
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setFilter(tab);
                  clearSelection();
                }}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
                  filter === tab
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {tab === 'all' ? t('all') : getStatusLabel(tab)}
                <span
                  className={`text-xs ${
                    filter === tab
                      ? 'text-white/70'
                      : 'text-gray-400 dark:text-gray-500'
                  }`}
                >
                  {counts[tab]}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        {!hasHydrated || loading ? (
          renderSkeleton()
        ) : !user ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
            </div>
            <Link
              href="/auth/login"
              className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition inline-block"
            >
              Login
            </Link>
          </div>
        ) : filteredBids.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {filter === 'all' ? t('empty') : t('noTargetsFound')}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">{t('emptyDescription')}</p>
            <Link
              href="/marketplace"
              className="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition inline-block font-medium"
            >
              {t('goToMarketplace')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredBids.map((bid) => {
              const selected = selectedIds.has(bid.id);
              const isEditing = editingId === bid.id;
              const isLoading = actionLoading.has(bid.id);
              const canAct = bid.status === 'active' || bid.status === 'inactive';

              return (
                <div
                  key={bid.id}
                  className={`relative bg-white dark:bg-gray-800 rounded-xl border overflow-hidden transition-all shadow-sm hover:shadow-md group ${
                    selected
                      ? 'border-primary-500 ring-1 ring-primary-500/30'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  {/* Checkbox (only for active/inactive) */}
                  {isSelectable(bid) && (
                    <button
                      onClick={() => toggleSelect(bid.id)}
                      className={`absolute top-2 left-2 z-10 w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                        selected
                          ? 'bg-primary-600 border-primary-600'
                          : 'border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm opacity-0 group-hover:opacity-100'
                      } ${selected ? 'opacity-100' : ''}`}
                    >
                      {selected && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  )}

                  {/* Status dot */}
                  <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-full px-2 py-0.5">
                    <span className={`w-2 h-2 rounded-full ${getStatusDot(bid.status)}`} />
                    <span className="text-[10px] font-medium text-gray-600 dark:text-gray-300">
                      {getStatusLabel(bid.status)}
                    </span>
                  </div>

                  {/* Image */}
                  <div className="aspect-square bg-gray-100 dark:bg-gray-700/50 p-3 flex items-center justify-center">
                    <img
                      src={bid.skin.imageUrl}
                      alt={bid.skin.name}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-3 space-y-2">
                    {/* Name + exterior */}
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm truncate">
                        {bid.skin.name}
                      </h3>
                      <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                        {bid.skin.exterior}
                      </span>
                    </div>

                    {/* Target price (editable) */}
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase">{t('targetPrice')}</span>
                      {isEditing ? (
                        <div className="flex items-center gap-1 mt-0.5">
                          <input
                            ref={editInputRef}
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSavePrice(bid.id);
                              if (e.key === 'Escape') handleCancelEdit();
                            }}
                            placeholder={t('enterNewPrice')}
                            className="w-full px-2 py-1 text-sm bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                            disabled={isLoading}
                          />
                          <button
                            onClick={() => handleSavePrice(bid.id)}
                            disabled={isLoading}
                            className="p-1 text-green-500 hover:text-green-400 disabled:opacity-50"
                            title={t('save')}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="p-1 text-gray-400 hover:text-gray-300"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <div className="text-sm font-bold text-green-500">
                          {formatPrice(bid.price, currency)}
                        </div>
                      )}
                    </div>

                    {/* Market price */}
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase">{t('currentPrice')}</span>
                      <div className="text-xs text-gray-600 dark:text-gray-300">
                        {formatPrice(bid.skin.price, currency)}
                      </div>
                    </div>

                    {/* Action buttons */}
                    {canAct && !isEditing && (
                      <div className="flex items-center gap-1 pt-1">
                        {/* Toggle status */}
                        <button
                          onClick={() => handleToggleStatus(bid)}
                          disabled={isLoading}
                          className={`flex-1 py-1.5 text-[10px] sm:text-xs font-medium rounded-lg transition disabled:opacity-50 ${
                            bid.status === 'active'
                              ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30'
                              : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30'
                          }`}
                          title={bid.status === 'active' ? t('deactivate') : t('activate')}
                        >
                          {bid.status === 'active' ? t('deactivate') : t('activate')}
                        </button>

                        {/* Edit price */}
                        <button
                          onClick={() => handleStartEdit(bid)}
                          disabled={isLoading}
                          className="p-1.5 text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition disabled:opacity-50"
                          title={t('editPrice')}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(bid.id)}
                          disabled={isLoading}
                          className="p-1.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition disabled:opacity-50"
                          title={t('delete')}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Sticky bulk actions bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-2xl">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            {/* Left: count + clear */}
            <div className="flex items-center gap-3">
              <button
                onClick={clearSelection}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-500 dark:text-gray-400"
                title={t('clearSelection')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {selectedIds.size} {t('selected')}
              </span>
            </div>

            {/* Right: bulk action buttons */}
            <div className="flex items-center gap-2">
              {(() => {
                const selectedBids = bids.filter(b => selectedIds.has(b.id));
                const allActive = selectedBids.every(b => b.status === 'active');
                const allInactive = selectedBids.every(b => b.status === 'inactive');
                return (
                  <>
                    <button
                      onClick={() => handleBulkAction('activate')}
                      disabled={bulkLoading || allActive}
                      className="px-4 py-2 text-sm font-medium bg-green-600 hover:bg-green-700 text-white rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      {t('activate')}
                    </button>
                    <button
                      onClick={() => handleBulkAction('deactivate')}
                      disabled={bulkLoading || allInactive}
                      className="px-4 py-2 text-sm font-medium bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      {t('deactivate')}
                    </button>
                  </>
                );
              })()}
              <button
                onClick={() => handleBulkAction('delete')}
                disabled={bulkLoading}
                className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 border border-red-300 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition disabled:opacity-50"
              >
                {t('delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
