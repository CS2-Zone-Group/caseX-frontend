'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import FavoriteButton from '@/components/FavoriteButton';
import { useSettingsStore } from '@/store/settingsStore';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { formatPrice } from '@/lib/currency';
import { getRarityStyle } from '@/lib/rarity';
import { useTranslations } from 'next-intl';
import { toast } from '@/store/toastStore';
import Link from 'next/link';
import Spinner from '@/components/Spinner';
import SkinInspectViewer from '@/components/SkinInspectViewer';

interface Skin {
  id: string;
  name: string;
  weaponType: string;
  rarity: string;
  exterior: string;
  price: number;
  imageUrl: string;
  marketHashName?: string;
  steamIconUrl?: string;
  steamPrice?: string;
  steamVolume?: string;
  description?: string;
  collection?: string;
  float?: number;
  isAvailable?: boolean;
}

export default function SkinPageClient({ skin }: { skin: Skin }) {
  const router = useRouter();
  const { currency } = useSettingsStore();
  const { addToCart } = useCartStore();
  const { user, hasHydrated, fetchUserBalance } = useAuthStore();
  const t = useTranslations('SkinPage');
  const [copied, setCopied] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [buyLoading, setBuyLoading] = useState(false);
  const [inspectOpen, setInspectOpen] = useState(false);
  const [inspectData, setInspectData] = useState<{
    screenshotUrl: string | null;
    floatValue?: number | null;
    paintSeed?: number | null;
    paintIndex?: number | null;
  } | null>(null);
  const [inspectLoading, setInspectLoading] = useState(false);

  const rarityStyle = getRarityStyle(skin.rarity);

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success(t('linkCopied'));
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddToCart = async () => {
    if (!hasHydrated || !user) {
      toast.info(t('loginRequired'));
      router.push('/auth/login');
      return;
    }
    setCartLoading(true);
    try {
      await addToCart(skin.id);
      toast.success(t('addedToCart'));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setCartLoading(false);
    }
  };

  const handleQuickBuy = async () => {
    if (!hasHydrated || !user) {
      toast.info(t('loginRequired'));
      router.push('/auth/login');
      return;
    }
    setBuyLoading(true);
    try {
      const { default: api } = await import('@/lib/api');
      await api.post('/orders/quick-buy', { skinId: skin.id });
      await fetchUserBalance();
      toast.success(t('purchaseSuccess'));
      router.push('/inventory');
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('purchaseError'));
    } finally {
      setBuyLoading(false);
    }
  };

  const handleInspect = async () => {
    setInspectLoading(true);
    try {
      const { default: api } = await import('@/lib/api');
      const res = await api.get(`/skins/${skin.id}/screenshot`);
      const data = res.data;
      if (data.available && data.screenshotUrl) {
        setInspectData({
          screenshotUrl: data.screenshotUrl,
          floatValue: data.floatValue ?? skin.float ?? null,
          paintSeed: data.paintSeed ?? null,
          paintIndex: data.paintIndex ?? null,
        });
        setInspectOpen(true);
      } else {
        setInspectData({ screenshotUrl: null });
        setInspectOpen(true);
      }
    } catch {
      if (skin.marketHashName) {
        const inspectLink = `steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20M%20${skin.marketHashName}`;
        setInspectData({
          screenshotUrl: `https://s.csfloat.com/preview?url=${encodeURIComponent(inspectLink)}`,
          floatValue: skin.float ?? null,
        });
        setInspectOpen(true);
      } else {
        setInspectData({ screenshotUrl: null });
        setInspectOpen(true);
      }
    } finally {
      setInspectLoading(false);
    }
  };

  const getFloatColor = (f: number) => {
    if (f < 0.07) return '#22c55e';
    if (f < 0.15) return '#84cc16';
    if (f < 0.38) return '#eab308';
    if (f < 0.45) return '#f97316';
    return '#ef4444';
  };

  const getFloatLabel = (f: number) => {
    if (f < 0.07) return 'Factory New';
    if (f < 0.15) return 'Minimal Wear';
    if (f < 0.38) return 'Field-Tested';
    if (f < 0.45) return 'Well-Worn';
    return 'Battle-Scarred';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <Link href="/" className="hover:text-primary-600 transition-colors">
            {t('home')}
          </Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link href="/marketplace" className="hover:text-primary-600 transition-colors">
            {t('marketplace')}
          </Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-900 dark:text-white font-medium truncate max-w-[200px]">
            {skin.name}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Image */}
          <div className="space-y-4">
            <div
              className="relative rounded-2xl overflow-hidden shadow-lg"
              style={{ background: rarityStyle.gradient, backgroundColor: 'rgb(31 41 55 / 0.5)' }}
            >
              {/* Rarity badge */}
              <div className="absolute top-4 left-4 z-10">
                <span
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-white backdrop-blur-sm"
                  style={{ backgroundColor: rarityStyle.color + 'CC' }}
                >
                  {skin.rarity}
                </span>
              </div>

              {/* Share & Favorite buttons */}
              <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                <button
                  onClick={handleCopyLink}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  title={t('copyLink')}
                >
                  {copied ? (
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  )}
                </button>
                <FavoriteButton skinId={skin.id} className="w-10 h-10 text-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm" />
              </div>

              <div className="w-full aspect-square flex items-center justify-center p-8 sm:p-12">
                <img
                  src={skin.imageUrl}
                  alt={skin.name}
                  className="w-full h-full object-contain drop-shadow-2xl"
                />
              </div>

              {/* Float bar at bottom of image */}
              {skin.float !== undefined && skin.float !== null && (
                <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-black/70 to-transparent">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-gray-600/50 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${(skin.float || 0) * 100}%`,
                          background: getFloatColor(skin.float || 0),
                        }}
                      />
                    </div>
                    <span className="text-xs font-mono text-white/90">
                      {parseFloat(String(skin.float)).toFixed(4)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Steam actions */}
            <div className="flex gap-2">
              <button
                className="flex-1 px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium text-white"
                style={{ backgroundColor: '#171a21' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a475e'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#171a21'}
                onClick={() => {
                  window.open(
                    `https://steamcommunity.com/market/listings/730/${encodeURIComponent(skin.marketHashName || skin.name)}`,
                    '_blank'
                  );
                }}
              >
                <svg className="w-4 h-4" viewBox="0 0 256 259" fill="currentColor">
                  <path d="M127.779 0C60.4 0 5.24 52.368 0 119.104l68.7 28.396c5.83-3.99 12.856-6.326 20.427-6.326.681 0 1.355.022 2.027.058l30.55-44.245v-.622c0-27.982 22.773-50.755 50.755-50.755 27.982 0 50.755 22.773 50.755 50.755 0 27.983-22.773 50.756-50.755 50.756h-1.173l-43.52 31.073c0 .538.029 1.076.029 1.606 0 20.972-17.044 38.01-38.01 38.01-18.478 0-33.904-13.267-37.328-30.795L3.582 162.891C19.886 217.78 69.603 258.47 127.779 258.47c70.537 0 127.735-57.198 127.735-127.735C255.514 57.198 198.316 0 127.779 0zM80.392 216.528l-15.588-6.441c3.468 7.218 9.623 13.204 17.803 16.452 17.689 7.024 37.742-1.59 44.766-19.28a33.82 33.82 0 0 0 1.803-20.475 33.834 33.834 0 0 0-11.082-18.292l16.194 6.698c14.694 6.064 21.686 22.83 15.59 37.42-6.075 14.587-22.833 21.578-37.45 15.556-6.868-2.837-12.267-7.917-15.587-13.948l-16.45-6.803v9.113zm122.542-69.868c0-18.654-15.18-33.835-33.835-33.835-18.655 0-33.836 15.181-33.836 33.835 0 18.655 15.181 33.836 33.836 33.836 18.655 0 33.835-15.181 33.835-33.836zm-59.245-.083c0-14.138 11.44-25.627 25.576-25.627 14.136 0 25.627 11.49 25.627 25.627 0 14.137-11.491 25.627-25.627 25.627-14.137 0-25.576-11.49-25.576-25.627z" />
                </svg>
                <span>{t('viewOnSteam')}</span>
              </button>
              <button
                className="flex-1 px-4 py-2.5 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium disabled:opacity-50"
                onClick={handleInspect}
                disabled={inspectLoading}
              >
                {inspectLoading ? (
                  <Spinner size={16} color="white" />
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
                <span>{t('inspectSkin')}</span>
              </button>
            </div>
          </div>

          {/* Right: Details */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <p className="text-sm font-medium mb-1" style={{ color: rarityStyle.color }}>
                {skin.weaponType}
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {skin.name}
              </h1>
            </div>

            {/* Price Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-end justify-between mb-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">{t('price')}</span>
                <span className="text-3xl font-bold text-green-500">
                  {formatPrice(Number(skin.price) || 0, currency)}
                </span>
              </div>
              {skin.steamPrice && (
                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {t('steamPrice')}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatPrice(Number(skin.steamPrice) || 0, currency)}
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 mt-5">
                <button
                  onClick={handleAddToCart}
                  disabled={cartLoading}
                  className="flex-1 px-5 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>{cartLoading ? '...' : t('addToCart')}</span>
                </button>
                <button
                  onClick={handleQuickBuy}
                  disabled={buyLoading}
                  className="flex-1 px-5 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {buyLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  )}
                  <span>{t('buyNow')}</span>
                </button>
              </div>
            </div>

            {/* Properties */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
              <div className="flex items-center justify-between px-5 py-3.5">
                <span className="text-sm text-gray-500 dark:text-gray-400">{t('itemType')}</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{skin.weaponType}</span>
              </div>
              <div className="flex items-center justify-between px-5 py-3.5">
                <span className="text-sm text-gray-500 dark:text-gray-400">{t('exterior')}</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{skin.exterior}</span>
              </div>
              <div className="flex items-center justify-between px-5 py-3.5">
                <span className="text-sm text-gray-500 dark:text-gray-400">{t('rarity')}</span>
                <span className="text-sm font-semibold" style={{ color: rarityStyle.color }}>
                  {skin.rarity}
                </span>
              </div>
              {skin.collection && (
                <div className="flex items-center justify-between px-5 py-3.5">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{t('collection')}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{skin.collection}</span>
                </div>
              )}
            </div>

            {/* Float Value */}
            {skin.float !== undefined && skin.float !== null && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('floatValue')}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: getFloatColor(skin.float || 0) + '20', color: getFloatColor(skin.float || 0) }}>
                      {getFloatLabel(skin.float || 0)}
                    </span>
                    <span className="text-sm font-mono font-bold text-gray-900 dark:text-white">
                      {parseFloat(String(skin.float)).toFixed(8)}
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <div className="w-full h-2.5 rounded-full overflow-hidden bg-gradient-to-r from-green-500 via-yellow-500 to-red-500" />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white border-2 border-gray-800 dark:border-white rounded-full shadow-md"
                    style={{
                      left: `${(skin.float || 0) * 100}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 font-mono">
                  <span>0.00</span>
                  <span>0.07</span>
                  <span>0.15</span>
                  <span>0.38</span>
                  <span>0.45</span>
                  <span>1.00</span>
                </div>
              </div>
            )}

            {/* Description */}
            {skin.description && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-500 dark:text-gray-400 block mb-2">{t('description')}</span>
                <p className="text-sm text-gray-900 dark:text-white leading-relaxed">{skin.description}</p>
              </div>
            )}

            {/* Share Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-3">{t('shareThisSkin')}</span>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-300 font-mono truncate border border-gray-200 dark:border-gray-600">
                  {typeof window !== 'undefined' ? window.location.href : `https://casex.uz/skin/${skin.id}`}
                </div>
                <button
                  onClick={handleCopyLink}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                    copied
                      ? 'bg-green-500 text-white'
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                >
                  {copied ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {t('copied')}
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      {t('copyLink')}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Go to marketplace CTA */}
            <Link
              href={`/marketplace?openSkin=${skin.id}`}
              className="block w-full text-center px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 transition-all shadow-sm"
            >
              {t('viewInMarketplace')}
            </Link>
          </div>
        </div>
      </div>

      {/* Skin Inspect Viewer */}
      <SkinInspectViewer
        isOpen={inspectOpen}
        onClose={() => setInspectOpen(false)}
        skinName={skin.name}
        screenshotUrl={inspectData?.screenshotUrl ?? null}
        floatValue={inspectData?.floatValue ?? skin.float ?? null}
        exterior={skin.exterior}
        paintSeed={inspectData?.paintSeed}
        paintIndex={inspectData?.paintIndex}
      />
    </div>
  );
}
