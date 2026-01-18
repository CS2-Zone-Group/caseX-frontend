"use client";

import { useFavouritesStore } from "@/store/favouritesStore";
import { useSettingsStore } from "@/store/settingsStore";
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareIcon from "@mui/icons-material/Share";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslations } from "next-intl";

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
  const { count } = useFavouritesStore();
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState("");
  const { language } = useSettingsStore();
  const t = useTranslations("SkinDetailsModal");

  const handleGenerateLink = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/sharing", {
        items: [skin],
        title: `Check out this ${skin?.name}`,
      });
      if (data.url) {
        setUrl(data.url);
      }
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

              <Link
                href="/favorites"
                className="relative p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 transition-colors"
              >
                <FavoriteBorderIcon className="w-6 h-6" />
                {count > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
                    {count}
                  </span>
                )}
              </Link>

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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="text-center">
                    <h2
                      id="modal-title"
                      className="text-2xl font-bold text-gray-900 dark:text-white mb-4"
                    >
                      {skin.name}
                    </h2>

                    <div className="w-64 h-48 mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
                      {skin.imageUrl ? (
                        <img
                          src={skin.imageUrl}
                          alt={skin.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `<div class="text-gray-400 dark:text-gray-500">${t(
                                "noImageAvailable"
                              )}</div>`;
                            }
                          }}
                        />
                      ) : (
                        <div className="text-gray-400 dark:text-gray-500">
                          {t("noImageAvailable")}
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-3 mt-4">
                      <button
                        className="flex-1 px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
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
                        className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                        onClick={() => {
                          alert(
                            "Inspect in game functionality would open CS2 with this item"
                          );
                        }}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        <span>{t("inspectInGame")}</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-500/30 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <svg
                        className="w-5 h-5 text-blue-600 dark:text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                      <span className="text-blue-600 dark:text-blue-400 font-medium">
                        {t("tradeProtection")}
                      </span>
                    </div>
                    <p className="text-blue-700 dark:text-blue-300 text-sm">
                      {t("tradeProtectionText")}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        {t("price")}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-green-500">💎</span>
                        <span className="text-green-500 font-bold text-xl">
                          $
                          {typeof skin.price === "number"
                            ? skin.price.toFixed(2)
                            : typeof skin.price === "string"
                            ? parseFloat(skin.price).toFixed(2)
                            : "0.00"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400 block mb-1">
                        {t("tradeLock")}:
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {t("noTradeLock")}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-600 dark:text-gray-400 block mb-1">
                        {t("itemLocation")}:
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {t("steam")}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-600 dark:text-gray-400 block mb-1">
                        {t("itemType")}:
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {skin.weaponType}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-600 dark:text-gray-400 block mb-1">
                        {t("exterior")}:
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {skin.exterior}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-600 dark:text-gray-400 block mb-1">
                        {t("rarity")}:
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {skin.rarity}
                      </span>
                    </div>

                    {skin.float !== undefined && (
                      <div>
                        <span className="text-gray-600 dark:text-gray-400 block mb-2">
                          {t("floatValue")}:
                        </span>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-900 dark:text-white font-mono">
                              {typeof skin.float === "number"
                                ? skin.float.toFixed(4)
                                : typeof skin.float === "string"
                                ? parseFloat(skin.float).toFixed(4)
                                : "0.0000"}
                            </span>
                            <span className="text-gray-600 dark:text-gray-400 text-sm">
                              {typeof skin.float === "number"
                                ? getFloatCondition(skin.float)
                                : typeof skin.float === "string"
                                ? getFloatCondition(parseFloat(skin.float))
                                : "Unknown"}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 h-2 rounded-full relative"
                              style={{ width: "100%" }}
                            >
                              <div
                                className="absolute top-0 w-1 h-2 bg-white rounded-full shadow-lg"
                                style={{
                                  left: `${
                                    typeof skin.float === "number"
                                      ? skin.float * 100
                                      : typeof skin.float === "string"
                                      ? parseFloat(skin.float) * 100
                                      : 0
                                  }%`,
                                  transform: "translateX(-50%)",
                                }}
                              />
                            </div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span>0.0</span>
                            <span>1.0</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {skin.collection && (
                      <div>
                        <span className="text-gray-600 dark:text-gray-400 block mb-1">
                          {t("collection")}:
                        </span>
                        <span className="text-gray-900 dark:text-white">
                          {skin.collection}
                        </span>
                      </div>
                    )}

                    {skin.description && (
                      <div>
                        <span className="text-gray-600 dark:text-gray-400 block mb-1">
                          {t("description")}:
                        </span>
                        <span className="text-gray-900 dark:text-white">
                          {skin.description}
                        </span>
                      </div>
                    )}
                  </div>
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
            <button className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all flex items-center justify-center space-x-2">
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
              <span>{t("addToCart")}</span>
            </button>
            <button className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center space-x-2">
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
              <span>{t("buyNow")}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
