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
  const [activeTab, setActiveTab] = useState<"details" | "sales">("details");
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
      
      // To'g'ridan-to'g'ri skin ID yordamida link yaratish
      const host = window.location.host;
      const protocol = window.location.protocol;
      const shareUrl = `${protocol}//${host}/marketplace?openSkin=${skin.id}`;
      
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
        if (event.shiftKey && activeTab === "sales") {
          event.preventDefault();
          setActiveTab("details");
        } else if (!event.shiftKey && activeTab === "details") {
          event.preventDefault();
          setActiveTab("sales");
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
                      className="flex-1 px-4 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                      onClick={() => {
                        const steamUrl = `https://steamcommunity.com/market/listings/730/${encodeURIComponent(
                          skin.marketHashName || skin.name
                        )}`;
                        window.open(steamUrl, "_blank");
                      }}
                    >
                      {t("viewAtSteam")}
                    </button>
                    <button
                      className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 text-sm font-medium"
                      onClick={() => {
                        toast.info("Inspect in game functionality would open CS2 with this item");
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
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {t("salesHistory")}
                    </h3>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded">
                        7D
                      </button>
                      <button className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded">
                        1M
                      </button>
                      <button className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded">
                        6M
                      </button>
                      <button className="px-3 py-1 text-sm bg-green-600 text-white rounded">
                        1Y
                      </button>
                    </div>
                  </div>

                  <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                    <div className="text-gray-400 dark:text-gray-500">
                      <svg
                        className="w-16 h-16 mx-auto mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                      <p>{t("salesChartPlaceholder")}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {t("recentSales")}
                    </h3>
                    <button className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-white">
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
                          d="M4 6h16M4 10h16M4 14h16M4 18h16"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-4 text-gray-600 dark:text-gray-400 text-sm font-medium pb-2 border-b border-gray-200 dark:border-gray-700">
                      <span>{t("sellingPrice")}</span>
                      <span>{t("operation")}</span>
                      <span>{t("dateTime")}</span>
                    </div>

                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <p>{t("noSalesHistory")}</p>
                    </div>
                  </div>
                </div>
              </div>
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
