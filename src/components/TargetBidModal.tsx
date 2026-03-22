"use client";

import { useState, useEffect } from "react";
import { formatPrice, getCurrencySymbol, usdToLocal } from "@/lib/currency";
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
  float?: number;
  tradeLock?: boolean;
}

interface TargetBidModalProps {
  isOpen: boolean;
  onClose: () => void;
  skins: Skin[];
  currency: Currency;
  onSuccess: () => void;
}

// Float bar color segments
const FLOAT_SEGMENTS = [
  { max: 0.07, label: "FN", color: "bg-blue-500" },
  { max: 0.15, label: "MW", color: "bg-green-500" },
  { max: 0.38, label: "FT", color: "bg-yellow-500" },
  { max: 0.45, label: "WW", color: "bg-orange-500" },
  { max: 1.0, label: "BS", color: "bg-red-500" },
];

function FloatBar({ exterior }: { exterior: string }) {
  const extMap: Record<string, number> = {
    "Factory New": 0.035,
    "Minimal Wear": 0.11,
    "Field-Tested": 0.26,
    "Well-Worn": 0.42,
    "Battle-Scarred": 0.72,
  };
  const pos = extMap[exterior] ?? 0.5;

  return (
    <div className="relative mt-1.5">
      <div className="flex h-2 rounded-full overflow-hidden">
        {FLOAT_SEGMENTS.map((seg, i) => (
          <div
            key={i}
            className={`${seg.color} h-full`}
            style={{ width: `${(seg.max - (i === 0 ? 0 : FLOAT_SEGMENTS[i - 1].max)) * 100}%` }}
          />
        ))}
      </div>
      <div
        className="absolute -top-1 w-0 h-0 border-l-[5px] border-r-[5px] border-b-[6px] border-l-transparent border-r-transparent border-b-white"
        style={{ left: `${pos * 100}%`, transform: "translateX(-50%)" }}
      />
    </div>
  );
}

function getFloatRange(exterior: string): string {
  const ranges: Record<string, string> = {
    "Factory New": "0-0.07",
    "Minimal Wear": "0.07-0.15",
    "Field-Tested": "0.15-0.38",
    "Well-Worn": "0.38-0.45",
    "Battle-Scarred": "0.45-1.00",
  };
  return ranges[exterior] || "";
}

export default function TargetBidModal({
  isOpen,
  onClose,
  skins,
  currency,
  onSuccess,
}: TargetBidModalProps) {
  const t = useTranslations("TargetBidModal");
  const [currentStep, setCurrentStep] = useState(0);
  const [bidPrices, setBidPrices] = useState<Record<string, string>>({});
  const [savedBids, setSavedBids] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [infoDismissed, setInfoDismissed] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const hasLockedItems = skins.some((s) => s.tradeLock);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setBidPrices({});
      setSavedBids({});
      setSubmitting(false);
      setInfoDismissed(false);
      if (hasLockedItems) {
        const dismissed = localStorage.getItem("target_warning_dismissed");
        setShowWarning(!dismissed);
      } else {
        setShowWarning(false);
      }
    }
  }, [isOpen, hasLockedItems]);

  const handleAgree = () => {
    if (dontShowAgain) {
      localStorage.setItem("target_warning_dismissed", "true");
    }
    setShowWarning(false);
  };

  if (!isOpen || skins.length === 0) return null;

  // Warning screen — only for trade-locked items
  if (showWarning) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <div className="relative w-full max-w-md bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-5">
              <h3 className="text-sm font-bold text-green-400 tracking-wider uppercase">
                {t("warningTitle")}
              </h3>
              <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-5 py-6 flex flex-col items-center text-center">
              <div className="w-20 h-20 mb-5">
                <svg viewBox="0 0 80 80" fill="none">
                  <path d="M40 8L12 22V38C12 55.6 24.2 71.8 40 76C55.8 71.8 68 55.6 68 38V22L40 8Z" fill="#D97706" />
                  <path d="M40 14L18 26V38C18 52.8 27.8 66.4 40 70C52.2 66.4 62 52.8 62 38V26L40 14Z" fill="#F59E0B" />
                  <path d="M36 44L30 38L27 41L36 50L54 32L51 29L36 44Z" fill="#92400E" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-white mb-3">{t("warningHeading")}</h4>
              <ul className="text-sm text-gray-400 space-y-2 text-left mb-6">
                <li className="flex items-start gap-2"><span className="text-gray-500 mt-0.5">•</span>{t("warningPoint1")}</li>
                <li className="flex items-start gap-2"><span className="text-gray-500 mt-0.5">•</span>{t("warningPoint2")}</li>
                <li className="flex items-start gap-2"><span className="text-gray-500 mt-0.5">•</span>{t("warningPoint3")}</li>
                <li className="flex items-start gap-2"><span className="text-gray-500 mt-0.5">•</span>{t("warningPoint4")}</li>
              </ul>
              <label className="flex items-center gap-2 cursor-pointer mb-5">
                <input type="checkbox" checked={dontShowAgain} onChange={(e) => setDontShowAgain(e.target.checked)} className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-amber-500 focus:ring-amber-500" />
                <span className="text-sm text-gray-400">{t("dontShowAgain")}</span>
              </label>
            </div>
            <div className="flex gap-3 px-5 pb-5">
              <button onClick={onClose} className="flex-1 py-3 text-sm font-medium text-gray-300 bg-gray-700 rounded-xl hover:bg-gray-600 transition">{t("cancel")}</button>
              <button onClick={handleAgree} className="flex-1 py-3 text-sm font-medium text-gray-900 bg-green-400 rounded-xl hover:bg-green-300 transition">{t("agreeAndContinue")}</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Current skin
  const skin = skins[currentStep];
  const total = Object.values(savedBids).reduce((s, v) => s + v, 0);
  const currentPrice = bidPrices[skin.id] || "";
  const isLast = currentStep === skins.length - 1;
  const progress = ((currentStep + 1) / skins.length) * 100;

  const handleSave = () => {
    const price = parseFloat(currentPrice);
    if (!price || price <= 0) return;

    setSavedBids((prev) => ({ ...prev, [skin.id]: price }));

    if (isLast) {
      handleFinish({ ...savedBids, [skin.id]: price });
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleSkip = () => {
    if (isLast) {
      if (Object.keys(savedBids).length > 0) {
        handleFinish(savedBids);
      } else {
        onClose();
      }
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleRemove = () => {
    // Remove current skin from saved and skip
    setSavedBids((prev) => {
      const next = { ...prev };
      delete next[skin.id];
      return next;
    });
    setBidPrices((prev) => {
      const next = { ...prev };
      delete next[skin.id];
      return next;
    });
    handleSkip();
  };

  const handleFinish = async (bids: Record<string, number>) => {
    setSubmitting(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const [skinId, price] of Object.entries(bids)) {
        try {
          await api.post("/orders/bids", { skinId, price });
          successCount++;
        } catch {
          errorCount++;
        }
      }

      if (successCount > 0) {
        toast.success(t("bidSuccess", { count: successCount }));
        onSuccess();
      }
      if (errorCount > 0) {
        toast.error(t("bidPartialError", { count: errorCount }));
      }
      onClose();
    } catch {
      toast.error(t("bidError"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

        <div className="relative w-full max-w-lg bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header: TARGET X OF Y */}
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <h3 className="text-sm font-bold tracking-wider uppercase">
              <span className="text-amber-500">TARGET</span>
              <span className="text-white ml-2">{currentStep + 1} {t("of")} {skins.length}</span>
            </h3>
            <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-white transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-gray-800">
            <div
              className="h-full bg-amber-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Info banner (dismissible) */}
          {!infoDismissed && (
            <div className="mx-5 mt-4 p-3 bg-gray-800/80 rounded-lg relative">
              <button
                onClick={() => setInfoDismissed(true)}
                className="absolute top-2 right-2 text-gray-500 hover:text-white"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <p className="text-xs text-gray-400 pr-6">
                {t("infoBanner")}
              </p>
            </div>
          )}

          {/* Item card */}
          <div className="p-5">
            <div className="flex gap-5">
              {/* Image */}
              <div className="w-40 flex-shrink-0">
                <div className="relative bg-gray-800 rounded-xl p-3 aspect-square flex items-center justify-center">
                  <span className="absolute top-2 left-2 text-xs font-bold text-green-400">
                    {formatPrice(skin.price, currency)}
                  </span>
                  <img
                    src={skin.imageUrl}
                    alt={skin.name}
                    className="max-w-full max-h-full object-contain"
                  />
                  <span className="absolute bottom-2 left-2 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center text-[10px] font-bold text-gray-900">
                    {currentStep + 1}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0 space-y-3">
                {/* Name */}
                <h4 className="text-sm font-medium text-white truncate">
                  {skin.name}
                </h4>

                {/* Exterior */}
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Exterior</p>
                  <p className="text-sm font-medium text-white">{skin.exterior}</p>
                </div>

                {/* Float bar */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">Float</span>
                    <span className="text-xs text-gray-400">{getFloatRange(skin.exterior)}</span>
                  </div>
                  <FloatBar exterior={skin.exterior} />
                </div>

                {/* Price input */}
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">{t("youllPay")}</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step={currency === 'UZS' ? '1' : '0.01'}
                      min="0.01"
                      value={currentPrice}
                      onChange={(e) => setBidPrices((prev) => ({ ...prev, [skin.id]: e.target.value }))}
                      placeholder={currency === 'UZS' ? Math.round(usdToLocal(Number(skin.price || 0), currency)).toString() : usdToLocal(Number(skin.price || 0), currency).toFixed(2)}
                      className="w-full py-1 bg-transparent text-lg font-medium text-green-400 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      autoFocus
                    />
                    <span className="text-sm text-green-400 font-medium flex-shrink-0">{getCurrencySymbol(currency)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Remove button */}
            {skins.length > 1 && (
              <button
                onClick={handleRemove}
                className="absolute top-5 right-14 p-1.5 text-gray-600 hover:text-red-400 transition"
                title="Remove"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 pb-5 space-y-3">
            <p className="text-xs text-gray-500 text-center">
              {t("bidNote")}
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleSkip}
                className="flex-1 py-3 text-sm font-medium text-gray-300 bg-gray-700 rounded-xl hover:bg-gray-600 transition"
              >
                {t("skip")}
              </button>
              <button
                onClick={handleSave}
                disabled={submitting || !currentPrice || parseFloat(currentPrice) <= 0}
                className="flex-1 py-3 text-sm font-medium text-gray-900 bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl hover:from-green-300 hover:to-emerald-300 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
                ) : null}
                {isLast ? t("saveAndFinish") : t("saveAndNext")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
