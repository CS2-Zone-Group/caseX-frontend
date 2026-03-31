"use client";

import { useSettingsStore } from "@/store/settingsStore";
import { formatPrice } from "@/lib/currency";
import FavoriteButton from "@/components/FavoriteButton";
import { useState, useEffect } from "react";
import ShareIcon from "@mui/icons-material/Share";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslations } from "next-intl";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { toast } from "@/store/toastStore";
import SalesInfoTab from "@/components/SalesInfoTab";
import PriceHistoryTab from "@/components/PriceHistoryTab";

interface SkinDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  skin: {
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
    sellerId?: string;
  } | null;
}

export default function SkinDetailsModal({
  isOpen,
  onClose,
  skin,
}: SkinDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<"details" | "sales" | "priceHistory">("details");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState("");
  const { language, currency } = useSettingsStore();
  const t = useTranslations("SkinDetailsModal");
  const { addToCart } = useCartStore();
  const { user, hasHydrated, fetchUserBalance } = useAuthStore();
  const [cartLoading, setCartLoading] = useState(false);
  const [buyLoading, setBuyLoading] = useState(false);

  const handleAddToCart = async () => {
    if (!skin) return;
    if (!hasHydrated || !user) {
      toast.info(t("loginRequired"));
      return;
    }
    setCartLoading(true);
    try {
      await addToCart(skin.id);
      toast.success(t("addedToCart"));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setCartLoading(false);
    }
  };

  const handleQuickBuy = async () => {
    if (!skin) return;
    if (!hasHydrated || !user) {
      toast.info(t("loginRequired"));
      return;
    }
    setBuyLoading(true);
    try {
      const { default: api } = await import("@/lib/api");
      await api.post("/orders/quick-buy", { skinId: skin.id });
      await fetchUserBalance();
      toast.success(t("purchaseSuccess"));
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || t("purchaseError"));
    } finally {
      setBuyLoading(false);
    }
  };

  const handleGenerateLink = async () => {
    setLoading(true);
    try {
      // Skin ID mavjudligini tekshirish
      if (!skin?.id) {
        console.error("Skin ID not found:", skin);
        return;
      }
      
      // SEO-friendly skin sahifasi URL
      const host = window.location.host;
      const protocol = window.location.protocol;
      const shareUrl = `${protocol}//${host}/skin/${skin.id}`;
      
      setUrl(shareUrl);
    } catch (error) {
      console.error("Link error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopied = () => {
    if (url) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "Tab") {
        const tabs: typeof activeTab[] = ["details", "sales", "priceHistory"];
        const currentIdx = tabs.indexOf(activeTab);
        if (event.shiftKey) {
          if (currentIdx > 0) {
            event.preventDefault();
            setActiveTab(tabs[currentIdx - 1]);
          }
        } else {
          if (currentIdx < tabs.length - 1) {
            event.preventDefault();
            setActiveTab(tabs[currentIdx + 1]);
          }
        }
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, activeTab]);

  if (!isOpen || !skin) return null;

  const getFloatCondition = (floatValue: number) => {
    if (floatValue < 0.07) return t("skinConditions.factoryNew");
    if (floatValue < 0.15) return t("skinConditions.minimalWear");
    if (floatValue < 0.38) return t("skinConditions.fieldTested");
    if (floatValue < 0.45) return t("skinConditions.wellWorn");
    return t("skinConditions.battleScarred");
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-black bg-opacity-75"
          onClick={onClose}
          aria-hidden="true"
        />

        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-900 shadow-xl rounded-2xl">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab("details")}
                className={`pb-2 text-lg font-medium transition-colors border-b-2 ${
                  activeTab === "details"
                    ? "text-gray-900 dark:text-white border-green-500"
                    : "text-gray-400 dark:text-gray-500 border-transparent hover:text-gray-600 dark:hover:text-gray-300"
                }`}
              >
                {t("itemDetails")}
              </button>
              <button
                onClick={() => setActiveTab("sales")}
                className={`pb-2 text-lg font-medium transition-colors border-b-2 ${
                  activeTab === "sales"
                    ? "text-gray-900 dark:text-white border-green-500"
                    : "text-gray-400 dark:text-gray-500 border-transparent hover:text-gray-600 dark:hover:text-gray-300"
                }`}
              >
                {t("salesInfo")}
              </button>
              <button
                onClick={() => setActiveTab("priceHistory")}
                className={`pb-2 text-lg font-medium transition-colors border-b-2 ${
                  activeTab === "priceHistory"
                    ? "text-gray-900 dark:text-white border-green-500"
                    : "text-gray-400 dark:text-gray-500 border-transparent hover:text-gray-600 dark:hover:text-gray-300"
                }`}
              >
                {t("priceHistoryTab")}
              </button>
            </div>

            <div className="flex items-center gap-2">
              {!url ? (
                <button
                  onClick={handleGenerateLink}
                  className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  title={t("share")}
                >
                  {loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <ShareIcon className="w-5 h-5" />
                  )}
                </button>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex items-center gap-2">
                  <div className="bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg text-sm text-gray-600 dark:text-gray-300 font-mono truncate border border-gray-200 dark:border-gray-700 max-w-[200px]">
                    {url}
                  </div>

                  <button
                    onClick={handleCopied}
                    className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all ${
                      copied
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {copied ? (
                      <CheckIcon className="w-5 h-5" />
                    ) : (
                      <ContentCopyIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              )}

              <FavoriteButton skinId={skin.id} className="w-9 h-9 text-xl" />

              <button
                onClick={onClose}
                className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === "details" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column: Image + Price */}
                <div className="space-y-4">
                  <div className="relative bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-850 rounded-2xl overflow-hidden">
                    <div className="w-full aspect-[4/3] flex items-center justify-center p-6">
                      {skin.imageUrl ? (
                        <>
                          <img
                            src={skin.imageUrl}
                            alt={skin.name}
                            className="w-full h-full object-contain drop-shadow-xl"
                            onError={(e) => {
                              const target = e.currentTarget as HTMLImageElement;
                              target.style.display = "none";
                              if (target.nextElementSibling) {
                                (target.nextElementSibling as HTMLElement).style.display = "flex";
                              }
                            }}
                          />
                          <div style={{display: 'none'}} className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">
                            {t("noImageAvailable")}
                          </div>
                        </>
                      ) : (
                        <div className="text-gray-400 dark:text-gray-500">
                          {t("noImageAvailable")}
                        </div>
                      )}
                    </div>

                    {/* Rarity badge overlay */}
                    <div className="absolute top-3 left-3">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                        skin.rarity?.toLowerCase() === 'covert' ? 'bg-red-500/90 text-white' :
                        skin.rarity?.toLowerCase() === 'classified' ? 'bg-pink-500/90 text-white' :
                        skin.rarity?.toLowerCase() === 'restricted' ? 'bg-purple-500/90 text-white' :
                        skin.rarity?.toLowerCase() === 'milspec' ? 'bg-blue-500/90 text-white' :
                        skin.rarity?.toLowerCase() === 'industrial' ? 'bg-cyan-500/90 text-white' :
                        'bg-gray-500/90 text-white'
                      }`}>
                        {skin.rarity}
                      </span>
                    </div>
                  </div>

                  {/* Price Card */}
                  <div className="bg-gray-50 dark:bg-gray-800/80 rounded-xl p-4 space-y-3">
                    <div className="flex items-end justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">{t("price")}</span>
                      <span className="text-2xl font-bold text-green-500">
                        {formatPrice(Number(skin.price) || 0, currency)}
                      </span>
                    </div>
                    {skin.steamPrice && (
                      <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          {t("referencePrice")}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatPrice(Number(skin.steamPrice) || 0, currency)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      className="flex-1 px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium text-white"
                      style={{ backgroundColor: '#171a21' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a475e'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#171a21'}
                      onClick={() => {
                        const steamUrl = `https://steamcommunity.com/market/listings/730/${encodeURIComponent(
                          skin.marketHashName || skin.name
                        )}`;
                        window.open(steamUrl, "_blank");
                      }}
                    >
                      <svg className="w-4 h-4" viewBox="0 0 256 259" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M127.779 0C60.4 0 5.24 52.368 0 119.104l68.7 28.396c5.83-3.99 12.856-6.326 20.427-6.326.681 0 1.355.022 2.027.058l30.55-44.245v-.622c0-27.982 22.773-50.755 50.755-50.755 27.982 0 50.755 22.773 50.755 50.755 0 27.983-22.773 50.756-50.755 50.756h-1.173l-43.52 31.073c0 .538.029 1.076.029 1.606 0 20.972-17.044 38.01-38.01 38.01-18.478 0-33.904-13.267-37.328-30.795L3.582 162.891C19.886 217.78 69.603 258.47 127.779 258.47c70.537 0 127.735-57.198 127.735-127.735C255.514 57.198 198.316 0 127.779 0zM80.392 216.528l-15.588-6.441c3.468 7.218 9.623 13.204 17.803 16.452 17.689 7.024 37.742-1.59 44.766-19.28a33.82 33.82 0 0 0 1.803-20.475 33.834 33.834 0 0 0-11.082-18.292l16.194 6.698c14.694 6.064 21.686 22.83 15.59 37.42-6.075 14.587-22.833 21.578-37.45 15.556-6.868-2.837-12.267-7.917-15.587-13.948l-16.45-6.803v9.113zm122.542-69.868c0-18.654-15.18-33.835-33.835-33.835-18.655 0-33.836 15.181-33.836 33.835 0 18.655 15.181 33.836 33.836 33.836 18.655 0 33.835-15.181 33.835-33.836zm-59.245-.083c0-14.138 11.44-25.627 25.576-25.627 14.136 0 25.627 11.49 25.627 25.627 0 14.137-11.491 25.627-25.627 25.627-14.137 0-25.576-11.49-25.576-25.627z"/>
                      </svg>
                      <span>{t("viewAtSteam")}</span>
                    </button>
                    <button
                      className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 text-sm font-medium"
                      onClick={() => {
                        const inspectUrl = `steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20M%20${encodeURIComponent(skin.marketHashName || skin.name)}`;
                        window.location.href = inspectUrl;
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>{t("inspectInGame")}</span>
                    </button>
                  </div>
                </div>

                {/* Right Column: Info */}
                <div className="space-y-4">
                  <h2 id="modal-title" className="text-xl font-bold text-gray-900 dark:text-white">
                    {skin.name}
                  </h2>

                  {/* Properties Grid */}
                  <div className="bg-gray-50 dark:bg-gray-800/80 rounded-xl divide-y divide-gray-200 dark:divide-gray-700/50">
                    <div className="flex items-center justify-between px-4 py-3">
                      <span className="text-sm text-gray-500 dark:text-gray-400">{t("itemType")}</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{skin.weaponType}</span>
                    </div>
                    <div className="flex items-center justify-between px-4 py-3">
                      <span className="text-sm text-gray-500 dark:text-gray-400">{t("exterior")}</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{skin.exterior}</span>
                    </div>
                    <div className="flex items-center justify-between px-4 py-3">
                      <span className="text-sm text-gray-500 dark:text-gray-400">{t("rarity")}</span>
                      <span className={`text-sm font-medium ${
                        skin.rarity?.toLowerCase() === 'covert' ? 'text-red-500' :
                        skin.rarity?.toLowerCase() === 'classified' ? 'text-pink-500' :
                        skin.rarity?.toLowerCase() === 'restricted' ? 'text-purple-500' :
                        skin.rarity?.toLowerCase() === 'milspec' ? 'text-blue-500' :
                        skin.rarity?.toLowerCase() === 'industrial' ? 'text-cyan-500' :
                        'text-gray-900 dark:text-white'
                      }`}>{skin.rarity}</span>
                    </div>
                    {skin.collection && (
                      <div className="flex items-center justify-between px-4 py-3">
                        <span className="text-sm text-gray-500 dark:text-gray-400">{t("collection")}</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{skin.collection}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between px-4 py-3">
                      <span className="text-sm text-gray-500 dark:text-gray-400">{t("tradeLock")}</span>
                      <span className="text-sm font-medium text-green-500">{t("noTradeLock")}</span>
                    </div>
                    <div className="flex items-center justify-between px-4 py-3">
                      <span className="text-sm text-gray-500 dark:text-gray-400">{t("itemLocation")}</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{t("steam")}</span>
                    </div>
                  </div>

                  {/* Float Value */}
                  {skin.float !== undefined && (
                    <div className="bg-gray-50 dark:bg-gray-800/80 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("floatValue")}</span>
                        <span className="text-sm font-mono font-bold text-gray-900 dark:text-white">
                          {typeof skin.float === "number"
                            ? skin.float.toFixed(8)
                            : typeof skin.float === "string"
                            ? parseFloat(skin.float).toFixed(8)
                            : "0.00000000"}
                        </span>
                      </div>
                      <div className="relative">
                        <div className="w-full h-2 rounded-full overflow-hidden bg-gradient-to-r from-green-500 via-yellow-500 to-red-500">
                        </div>
                        <div
                          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-gray-800 dark:border-white rounded-full shadow-md"
                          style={{
                            left: `${
                              typeof skin.float === "number"
                                ? skin.float * 100
                                : typeof skin.float === "string"
                                ? parseFloat(skin.float) * 100
                                : 0
                            }%`,
                            transform: "translate(-50%, -50%)",
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

                  {/* Trade Protection */}
                  <div className="flex items-center gap-2.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/40 rounded-xl px-4 py-3">
                    <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <div>
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-400">{t("tradeProtection")}</span>
                      <p className="text-xs text-blue-600 dark:text-blue-300/70 mt-0.5">{t("tradeProtectionText")}</p>
                    </div>
                  </div>

                  {skin.description && (
                    <div className="bg-gray-50 dark:bg-gray-800/80 rounded-xl p-4">
                      <span className="text-sm text-gray-500 dark:text-gray-400 block mb-1">{t("description")}</span>
                      <p className="text-sm text-gray-900 dark:text-white">{skin.description}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "sales" && (
              <SalesInfoTab skinId={skin.id} currency={currency} t={t} />
            )}

            {activeTab === "priceHistory" && (
              <PriceHistoryTab skinId={skin.id} currency={currency} t={t} />
            )}
          </div>

          <div className="flex space-x-4 p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleAddToCart}
              disabled={cartLoading}
              className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                />
              </svg>
              <span>{cartLoading ? "..." : t("addToCart")}</span>
            </button>
            <button
              onClick={handleQuickBuy}
              disabled={buyLoading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {buyLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              )}
              <span>{t("buyNow")}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
