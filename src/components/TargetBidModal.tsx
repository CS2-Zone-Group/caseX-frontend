"use client";

import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/currency";
import type { Currency } from "@/lib/currency";
import { useTranslations } from "next-intl";
import { toast } from "@/store/toastStore";
import api from "@/lib/api";

interface Skin {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  exterior: string;
}

interface TargetBidModalProps {
  isOpen: boolean;
  onClose: () => void;
  skins: Skin[];
  currency: Currency;
  onSuccess: () => void;
}

export default function TargetBidModal({
  isOpen,
  onClose,
  skins,
  currency,
  onSuccess,
}: TargetBidModalProps) {
  const t = useTranslations("TargetBidModal");
  const [bidPrices, setBidPrices] = useState<Record<string, string>>({});
  const [useGlobalPrice, setUseGlobalPrice] = useState(true);
  const [globalPrice, setGlobalPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const dismissed = localStorage.getItem("target_warning_dismissed");
      if (!dismissed) {
        setShowWarning(true);
      }
    }
  }, [isOpen]);

  const handleAgree = () => {
    if (dontShowAgain) {
      localStorage.setItem("target_warning_dismissed", "true");
    }
    setShowWarning(false);
  };

  if (!isOpen || skins.length === 0) return null;

  if (showWarning) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <div className="relative w-full max-w-md bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5">
              <h3 className="text-sm font-bold text-green-400 tracking-wider uppercase">
                {t("warningTitle")}
              </h3>
              <button
                onClick={onClose}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="px-5 py-6 flex flex-col items-center text-center">
              {/* Shield icon */}
              <div className="w-20 h-20 mb-5">
                <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M40 8L12 22V38C12 55.6 24.2 71.8 40 76C55.8 71.8 68 55.6 68 38V22L40 8Z" fill="#D97706" />
                  <path d="M40 14L18 26V38C18 52.8 27.8 66.4 40 70C52.2 66.4 62 52.8 62 38V26L40 14Z" fill="#F59E0B" />
                  <path d="M36 44L30 38L27 41L36 50L54 32L51 29L36 44Z" fill="#92400E" />
                </svg>
              </div>

              <h4 className="text-lg font-bold text-white mb-3">
                {t("warningHeading")}
              </h4>

              <ul className="text-sm text-gray-400 space-y-2 text-left mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-gray-500 mt-0.5">•</span>
                  {t("warningPoint1")}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-500 mt-0.5">•</span>
                  {t("warningPoint2")}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-500 mt-0.5">•</span>
                  {t("warningPoint3")}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-500 mt-0.5">•</span>
                  {t("warningPoint4")}
                </li>
              </ul>

              {/* Don't show again */}
              <label className="flex items-center gap-2 cursor-pointer mb-5">
                <input
                  type="checkbox"
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-amber-500 focus:ring-amber-500"
                />
                <span className="text-sm text-gray-400">{t("dontShowAgain")}</span>
              </label>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 px-5 pb-5">
              <button
                onClick={onClose}
                className="flex-1 py-3 text-sm font-medium text-gray-300 bg-gray-700 rounded-xl hover:bg-gray-600 transition"
              >
                {t("cancel")}
              </button>
              <button
                onClick={handleAgree}
                className="flex-1 py-3 text-sm font-medium text-gray-900 bg-green-400 rounded-xl hover:bg-green-300 transition"
              >
                {t("agreeAndContinue")}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    setSubmitting(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const skin of skins) {
        const price = useGlobalPrice
          ? parseFloat(globalPrice)
          : parseFloat(bidPrices[skin.id] || "");

        if (!price || price <= 0) {
          errorCount++;
          continue;
        }

        try {
          await api.post("/orders/bids", {
            skinId: skin.id,
            price,
          });
          successCount++;
        } catch {
          errorCount++;
        }
      }

      if (successCount > 0) {
        toast.success(
          t("bidSuccess", { count: successCount })
        );
        onSuccess();
        onClose();
      }
      if (errorCount > 0) {
        toast.error(t("bidPartialError", { count: errorCount }));
      }
    } catch {
      toast.error(t("bidError"));
    } finally {
      setSubmitting(false);
    }
  };

  const totalBidPrice = skins.reduce((sum, skin) => {
    const price = useGlobalPrice
      ? parseFloat(globalPrice) || 0
      : parseFloat(bidPrices[skin.id] || "") || 0;
    return sum + price;
  }, 0);

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-center justify-center min-h-screen px-4">
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-amber-600 dark:text-amber-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {t("title")}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {skins.length} {t("items")}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
            {/* Price mode toggle */}
            {skins.length > 1 && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <button
                  onClick={() => setUseGlobalPrice(true)}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition ${
                    useGlobalPrice
                      ? "bg-amber-500 text-white"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {t("samePrice")}
                </button>
                <button
                  onClick={() => setUseGlobalPrice(false)}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition ${
                    !useGlobalPrice
                      ? "bg-amber-500 text-white"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {t("individualPrice")}
                </button>
              </div>
            )}

            {/* Global price input */}
            {useGlobalPrice && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  {t("bidPrice")}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={globalPrice}
                    onChange={(e) => setGlobalPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-7 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-sm"
                    autoFocus
                  />
                </div>
              </div>
            )}

            {/* Items list */}
            <div className="space-y-2">
              {skins.map((skin) => (
                <div
                  key={skin.id}
                  className="flex items-center gap-3 p-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
                >
                  <img
                    src={skin.imageUrl}
                    alt={skin.name}
                    className="w-12 h-12 object-contain rounded-lg bg-gray-100 dark:bg-gray-800"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {skin.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t("marketPrice")}: {formatPrice(skin.price, currency)}
                    </p>
                  </div>
                  {!useGlobalPrice && (
                    <div className="relative w-24">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                        $
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={bidPrices[skin.id] || ""}
                        onChange={(e) =>
                          setBidPrices((prev) => ({
                            ...prev,
                            [skin.id]: e.target.value,
                          }))
                        }
                        placeholder="0.00"
                        className="w-full pl-5 pr-2 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-gray-200 dark:border-gray-700 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                {t("totalBid")}
              </span>
              <span className="text-lg font-bold text-amber-500">
                {formatPrice(totalBidPrice, currency)}
              </span>
            </div>

            <p className="text-[11px] text-gray-400 dark:text-gray-500">
              {t("bidNote")}
            </p>

            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                {t("cancel")}
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting || totalBidPrice <= 0}
                className="flex-1 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg hover:from-amber-600 hover:to-orange-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
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
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                )}
                {t("placeBid")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
