'use client';

import { useState, useMemo } from 'react';
import { useSettingsStore } from '@/store/settingsStore';
import { useTranslations } from 'next-intl';
import { formatPrice, formatLocalAmount, getCurrencySymbol, usdToLocal, localToUsd } from '@/lib/currency';

const FEE_RATE = 0.03; // 3%

type SellTab = 'list' | 'instant';

interface SellModalProps {
  items: Array<{
    id: string;
    skin: {
      id: string;
      name: string;
      imageUrl: string;
      exterior: string;
      price?: number;
      steamPrice?: number;
      float?: number;
    };
    highestBid?: number | null;
  }>;
  onClose: () => void;
  onSell: (items: Array<{ inventoryId: string; price: number }>) => Promise<void>;
  onSellNow: (inventoryIds: string[]) => Promise<void>;
}

function getExteriorShort(exterior: string): string {
  const map: Record<string, string> = {
    'factory new': 'FN', 'minimal wear': 'MW', 'field-tested': 'FT',
    'well-worn': 'WW', 'battle-scarred': 'BS',
  };
  return map[exterior?.toLowerCase()] || exterior || '';
}

function getFloatColor(f: number): string {
  if (f < 0.07) return '#22c55e';
  if (f < 0.15) return '#84cc16';
  if (f < 0.38) return '#eab308';
  if (f < 0.45) return '#f97316';
  return '#ef4444';
}

export default function SellModal({ items: rawItems, onClose, onSell, onSellNow }: SellModalProps) {
  const t = useTranslations('SellModal');
  const { currency } = useSettingsStore();

  const [activeTab, setActiveTab] = useState<SellTab>('list');
  const [itemPrices, setItemPrices] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    for (const item of rawItems) {
      const localPrice = usdToLocal(Number(item.skin.price || 0), currency);
      map[item.id] = currency === 'UZS' ? String(Math.round(localPrice)) : String(localPrice.toFixed(2));
    }
    return map;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [removedItems, setRemovedItems] = useState<Set<string>>(new Set());

  const sellItems = rawItems.filter(item => !removedItems.has(item.id));

  const removeItem = (id: string) => {
    setRemovedItems(prev => new Set(prev).add(id));
    if (sellItems.length <= 1) onClose();
  };

  const updateItemPrice = (id: string, price: string) => {
    setItemPrices(prev => ({ ...prev, [id]: price }));
  };

  // Returns local currency value from input (for display)
  const getLocalPrice = (id: string, fallbackUsd: number): number => {
    const v = parseFloat(itemPrices[id] || '');
    return v > 0 ? v : usdToLocal(fallbackUsd, currency);
  };

  // Returns selling price in USD (for API submission)
  const getSellingPriceUsd = (id: string, fallbackUsd: number): number => {
    const v = parseFloat(itemPrices[id] || '');
    if (v > 0) return localToUsd(v, currency);
    return fallbackUsd;
  };

  // "Sotuvga qo'yish" tab totals (in local currency)
  const listTotals = useMemo(() => {
    let totalSelling = 0;
    let totalYouGet = 0;
    for (const item of sellItems) {
      const localPrice = getLocalPrice(item.id, Number(item.skin.price || 0));
      totalSelling += localPrice;
      totalYouGet += localPrice * (1 - FEE_RATE);
    }
    return { totalSelling: Math.round(totalSelling * 100) / 100, totalYouGet: Math.round(totalYouGet * 100) / 100 };
  }, [sellItems, itemPrices]);

  // "Hoziroq sotish" tab — items with bids
  const itemsWithBids = sellItems.filter(item => item.highestBid && item.highestBid > 0);
  const instantTotal = itemsWithBids.reduce((sum, item) => sum + Number(item.highestBid || 0), 0);

  const handleListForSale = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = sellItems.map(item => ({
        inventoryId: item.id,
        price: getSellingPriceUsd(item.id, Number(item.skin.price || 0)),
      }));
      await onSell(payload);
    } catch (err: any) {
      setError(err.message || t('sellError'));
    } finally {
      setLoading(false);
    }
  };

  const handleSellNow = async () => {
    if (itemsWithBids.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      await onSellNow(itemsWithBids.map(item => item.id));
    } catch (err: any) {
      setError(err.message || t('sellError'));
    } finally {
      setLoading(false);
    }
  };

  // headerTotal: list tab = local currency, instant tab = USD (from bids)
  const headerTotalFormatted = activeTab === 'list'
    ? formatLocalAmount(listTotals.totalYouGet, currency)
    : formatPrice(instantTotal, currency);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-start justify-center overflow-y-auto">
      <div className="bg-gray-900 w-full max-w-3xl min-h-screen sm:min-h-0 sm:my-8 sm:rounded-2xl shadow-2xl border border-gray-700/50 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700/50 flex-shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-green-400 tracking-wide">{t('title')}</h2>
            <div className="flex bg-gray-800 rounded-lg p-0.5">
              <button
                onClick={() => setActiveTab('list')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  activeTab === 'list'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {t('tabList')}
              </button>
              <button
                onClick={() => setActiveTab('instant')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  activeTab === 'instant'
                    ? 'bg-orange-600 text-white'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {t('tabInstant')}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white font-semibold">{headerTotalFormatted}</span>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* =================== TAB: SOTUVGA QO'YISH =================== */}
        {activeTab === 'list' && (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {sellItems.map((item) => {
                const localPrice = getLocalPrice(item.id, Number(item.skin.price || 0));
                const localYouGet = localPrice * (1 - FEE_RATE);
                const recommendedPrice = Number(item.skin.price || 0);

                return (
                  <div key={item.id} className="bg-gray-800/50 rounded-xl border border-gray-700/50">
                    <div className="flex gap-4 p-4">
                      {/* Item preview */}
                      <div className="w-32 h-24 flex-shrink-0 bg-gray-800 rounded-lg overflow-hidden relative">
                        {item.highestBid && item.highestBid > 0 && (
                          <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-orange-500/90 text-white text-[10px] font-bold rounded z-10">
                            BID {formatPrice(item.highestBid, currency)}
                          </div>
                        )}
                        <img
                          src={item.skin.imageUrl}
                          alt={item.skin.name}
                          className="w-full h-full object-contain p-2"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                        />
                        <div className="absolute bottom-1 left-1">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] font-bold text-gray-300">{getExteriorShort(item.skin.exterior)}</span>
                            {item.skin.float != null && (
                              <div className="flex items-center gap-1">
                                <div className="w-10 h-0.5 rounded-full bg-gray-600 overflow-hidden">
                                  <div className="h-full rounded-full" style={{ width: `${Number(item.skin.float || 0) * 100}%`, background: getFloatColor(Number(item.skin.float || 0)) }} />
                                </div>
                                <span className="text-[8px] font-mono text-gray-400">{Number(item.skin.float).toFixed(7)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Item info + pricing */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <h4 className="text-white font-medium text-sm truncate">{item.skin.name} ({item.skin.exterior})</h4>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1 text-gray-500 hover:text-red-400 transition-colors flex-shrink-0"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>

                        {/* Recommended price + editable input */}
                        <div className="mb-3">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <span className="text-xs text-gray-400">{t('recommendedPrice')}:</span>
                            <span className="text-xs text-green-400 font-medium">{formatPrice(recommendedPrice, currency)}</span>
                            <div className="relative group">
                              <div className="w-3.5 h-3.5 rounded-full border border-gray-500 flex items-center justify-center text-gray-400 text-[9px] cursor-help">?</div>
                              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 w-52 p-2.5 bg-gray-800 border border-gray-600 rounded-lg text-[11px] text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[70] shadow-xl">
                                {t('recommendedPriceHint')}
                              </div>
                            </div>
                          </div>
                          <div className="relative">
                            {currency === 'USD' && (
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
                            )}
                            <input
                              type="number"
                              step={currency === 'UZS' ? '1' : '0.01'}
                              min="0.01"
                              value={itemPrices[item.id] || ''}
                              onChange={(e) => updateItemPrice(item.id, e.target.value)}
                              className={`w-full py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-1 focus:ring-green-500 text-sm font-semibold ${currency === 'USD' ? 'pl-7 pr-3' : 'pl-3 pr-16'}`}
                            />
                            {currency !== 'USD' && (
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">{getCurrencySymbol(currency)}</span>
                            )}
                          </div>
                        </div>

                        {/* Price breakdown */}
                        <div className="grid grid-cols-3 gap-2">
                          <div className="bg-gray-700/50 rounded-lg px-3 py-2">
                            <div className="text-[10px] text-gray-400">{t('sellingPrice')}</div>
                            <div className="text-sm font-semibold text-green-400">{formatLocalAmount(localPrice, currency)}</div>
                          </div>
                          <div className="bg-gray-700/50 rounded-lg px-3 py-2">
                            <div className="text-[10px] text-gray-400">{t('fee')}</div>
                            <div className="text-sm font-semibold text-white">{(FEE_RATE * 100).toFixed(0)}%</div>
                          </div>
                          <div className="bg-gray-700/50 rounded-lg px-3 py-2">
                            <div className="text-[10px] text-gray-400">{t('youGet')}</div>
                            <div className="text-sm font-semibold text-white">{formatLocalAmount(localYouGet, currency)}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Footer — List */}
            <div className="px-6 py-4 border-t border-gray-700/50 flex-shrink-0">
              {error && <p className="text-red-400 text-sm mb-3 text-center">{error}</p>}
              <div className="text-center mb-4 space-y-1">
                <p className="text-sm text-gray-400">
                  {t('putOnSaleFor')} <span className="text-green-400 font-semibold">{formatLocalAmount(listTotals.totalSelling, currency)}</span>
                </p>
                <p className="text-sm text-gray-400">
                  {t('ifSuccessYouGet')} <span className="text-white font-bold text-base">{formatLocalAmount(listTotals.totalYouGet, currency)}</span>
                </p>
              </div>
              <button
                onClick={handleListForSale}
                disabled={loading || sellItems.length === 0}
                className="w-full py-3.5 bg-green-500/80 hover:bg-green-500 text-white text-base font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                {t('tabList')} ({sellItems.length})
              </button>
            </div>
          </>
        )}

        {/* =================== TAB: HOZIROQ SOTISH =================== */}
        {activeTab === 'instant' && (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {itemsWithBids.length === 0 ? (
                <div className="text-center py-16">
                  <svg className="w-14 h-14 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-400 text-sm">{t('noBidsAvailable')}</p>
                  <p className="text-gray-500 text-xs mt-1">{t('noBidsHint')}</p>
                </div>
              ) : (
                itemsWithBids.map((item) => (
                  <div key={item.id} className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
                    <div className="flex gap-4 p-4">
                      <div className="w-32 h-24 flex-shrink-0 bg-gray-800 rounded-lg overflow-hidden relative">
                        <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-orange-500/90 text-white text-[10px] font-bold rounded z-10">
                          BID {formatPrice(item.highestBid, currency)}
                        </div>
                        <img
                          src={item.skin.imageUrl}
                          alt={item.skin.name}
                          className="w-full h-full object-contain p-2"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                        />
                        <div className="absolute bottom-1 left-1">
                          <span className="text-[10px] font-bold text-gray-300">{getExteriorShort(item.skin.exterior)}</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium text-sm truncate mb-2">{item.skin.name} ({item.skin.exterior})</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-gray-700/50 rounded-lg px-3 py-2">
                            <div className="text-[10px] text-gray-400">{t('platformPrice')}</div>
                            <div className="text-sm text-gray-300">{formatPrice(item.skin.price, currency)}</div>
                          </div>
                          <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg px-3 py-2">
                            <div className="text-[10px] text-orange-400">{t('bidPrice')}</div>
                            <div className="text-sm font-bold text-orange-400">{formatPrice(item.highestBid, currency)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* Items without bids */}
              {sellItems.filter(item => !item.highestBid || item.highestBid <= 0).length > 0 && itemsWithBids.length > 0 && (
                <div className="pt-2 border-t border-gray-700/30">
                  <p className="text-xs text-gray-500 mb-2">{t('noBidsForThese')}:</p>
                  <div className="space-y-2">
                    {sellItems.filter(item => !item.highestBid || item.highestBid <= 0).map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-2 bg-gray-800/30 rounded-lg opacity-50">
                        <div className="w-10 h-10 bg-gray-800 rounded overflow-hidden flex-shrink-0">
                          <img src={item.skin.imageUrl} alt={item.skin.name} className="w-full h-full object-contain" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                        </div>
                        <span className="text-xs text-gray-400 truncate">{item.skin.name}</span>
                        <span className="text-xs text-gray-500 ml-auto">{t('noBid')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer — Instant */}
            <div className="px-6 py-4 border-t border-gray-700/50 flex-shrink-0">
              {error && <p className="text-red-400 text-sm mb-3 text-center">{error}</p>}
              {itemsWithBids.length > 0 && (
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-400">
                    {t('instantYouGet')} <span className="text-orange-400 font-bold text-base">{formatPrice(instantTotal, currency)}</span>
                  </p>
                </div>
              )}
              <button
                onClick={handleSellNow}
                disabled={loading || itemsWithBids.length === 0}
                className="w-full py-3.5 bg-orange-500/80 hover:bg-orange-500 text-white text-base font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                {t('tabInstant')} ({itemsWithBids.length})
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
