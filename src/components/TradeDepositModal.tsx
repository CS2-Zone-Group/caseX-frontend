'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import api from '@/lib/api';

interface TradeDepositModalProps {
  inventoryId: string;
  tradeOfferStatus: string;
  tradeOfferId: string | null;
  botUsername: string;
  skinName: string;
  skinImageUrl: string;
  createdAt: string;
  onClose: () => void;
  onSuccess: () => void;
}

const TRADE_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const POLL_INTERVAL_MS = 10 * 1000; // 10 seconds

export default function TradeDepositModal({
  inventoryId,
  tradeOfferStatus: initialStatus,
  tradeOfferId,
  botUsername,
  skinName,
  skinImageUrl,
  createdAt,
  onClose,
  onSuccess,
}: TradeDepositModalProps) {
  const t = useTranslations('TradeDepositModal');

  const [status, setStatus] = useState(initialStatus);
  const [timeLeft, setTimeLeft] = useState(TRADE_TIMEOUT_MS);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showTimeout, setShowTimeout] = useState(false);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const closedRef = useRef(false);

  // Calculate remaining time based on createdAt
  useEffect(() => {
    const created = new Date(createdAt).getTime();
    const now = Date.now();
    const elapsed = now - created;
    const remaining = Math.max(0, TRADE_TIMEOUT_MS - elapsed);
    setTimeLeft(remaining);

    if (remaining <= 0) {
      setShowTimeout(true);
    }
  }, [createdAt]);

  // Countdown timer
  useEffect(() => {
    if (showSuccess || showError || showTimeout) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1000;
        if (next <= 0) {
          setShowTimeout(true);
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [showSuccess, showError, showTimeout]);

  // Poll trade status
  const pollStatus = useCallback(async () => {
    if (closedRef.current) return;
    try {
      const { data } = await api.get(`/inventory/trade-status/${inventoryId}`);
      const newStatus = data.tradeOfferStatus;
      setStatus(newStatus);

      if (newStatus === 'accepted') {
        setShowSuccess(true);
        if (pollRef.current) clearInterval(pollRef.current);
        if (timerRef.current) clearInterval(timerRef.current);
        // Auto-close after 3 seconds on success
        setTimeout(() => {
          if (!closedRef.current) {
            onSuccess();
          }
        }, 3000);
      } else if (newStatus === 'failed') {
        setShowError(true);
        if (pollRef.current) clearInterval(pollRef.current);
        if (timerRef.current) clearInterval(timerRef.current);
      }
    } catch {
      // Silently continue polling on error
    }
  }, [inventoryId, onSuccess]);

  useEffect(() => {
    if (showSuccess || showError || showTimeout) return;

    pollRef.current = setInterval(pollStatus, POLL_INTERVAL_MS);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [pollStatus, showSuccess, showError, showTimeout]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      closedRef.current = true;
      if (pollRef.current) clearInterval(pollRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleClose = () => {
    closedRef.current = true;
    if (pollRef.current) clearInterval(pollRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    onClose();
  };

  const formatTime = (ms: number): string => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  // Determine which step is active
  const getStepState = (step: number): 'done' | 'active' | 'pending' => {
    if (showSuccess) return 'done';
    if (step === 1) return 'done';
    if (step === 2) return status === 'sent' || status === 'pending' ? 'active' : 'done';
    if (step === 3) return showSuccess ? 'done' : 'pending';
    return 'pending';
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[70] flex items-start justify-center overflow-y-auto">
      <div className="bg-gray-900 w-full max-w-lg min-h-screen sm:min-h-0 sm:my-8 sm:rounded-2xl shadow-2xl border border-gray-700/50 flex flex-col">
        {/* Header with close button */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700/50">
          <h2 className="text-lg font-bold text-white">{t('title')}</h2>
          <button
            onClick={handleClose}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 3-step progress bar */}
        <div className="px-6 pt-5 pb-3">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => {
              const state = getStepState(step);
              const stepLabels = [t('step1'), t('step2'), t('step3')];
              return (
                <div key={step} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                        state === 'done'
                          ? 'bg-green-500 text-white'
                          : state === 'active'
                            ? 'bg-green-500/20 border-2 border-green-500 text-green-400'
                            : 'bg-gray-700 text-gray-400'
                      }`}
                    >
                      {state === 'done' ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        step
                      )}
                    </div>
                    <span className={`text-[10px] mt-1.5 text-center leading-tight ${
                      state === 'active' ? 'text-green-400 font-medium' : state === 'done' ? 'text-green-400' : 'text-gray-500'
                    }`}>
                      {stepLabels[step - 1]}
                    </span>
                  </div>
                  {step < 3 && (
                    <div className={`h-0.5 flex-1 mx-1 mt-[-16px] ${
                      state === 'done' ? 'bg-green-500' : 'bg-gray-700'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {/* Success State */}
          {showSuccess && (
            <div className="text-center py-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-green-400 mb-2">{t('successTitle')}</h3>
              <p className="text-gray-400 text-sm">{t('successDescription')}</p>
            </div>
          )}

          {/* Error State */}
          {showError && (
            <div className="text-center py-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-red-400 mb-2">{t('errorTitle')}</h3>
              <p className="text-gray-400 text-sm">{t('errorDescription')}</p>
            </div>
          )}

          {/* Timeout State */}
          {showTimeout && !showSuccess && !showError && (
            <div className="text-center py-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-yellow-400 mb-2">{t('timeoutTitle')}</h3>
              <p className="text-gray-400 text-sm">{t('timeoutDescription')}</p>
            </div>
          )}

          {/* Active trade flow */}
          {!showSuccess && !showError && !showTimeout && (
            <>
              {/* Countdown timer */}
              <div className="text-center">
                <div className="text-3xl font-mono font-bold text-green-400">
                  {formatTime(timeLeft)}
                </div>
                <p className="text-xs text-gray-500 mt-1">{t('timeRemaining')}</p>
              </div>

              {/* Item preview */}
              <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl border border-gray-700/50">
                <div className="w-16 h-16 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={skinImageUrl}
                    alt={skinName}
                    className="w-full h-full object-contain p-1"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-white font-medium text-sm truncate">{skinName}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {t('statusLabel')}: <span className={
                      status === 'sent' ? 'text-yellow-400' : status === 'pending' ? 'text-gray-400' : 'text-green-400'
                    }>
                      {status === 'sent' ? t('statusSent') : status === 'pending' ? t('statusPending') : status}
                    </span>
                  </p>
                </div>
              </div>

              {/* Instructions */}
              <p className="text-sm text-gray-300 leading-relaxed">
                {t('instructions')}
              </p>

              {/* Warning info box */}
              <div className="bg-blue-900/30 border border-blue-500/30 rounded-xl p-4">
                <h4 className="text-blue-400 font-bold text-xs uppercase mb-3">{t('warningTitle')}</h4>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-400 font-bold text-xs mt-0.5">1.</span>
                    <p className="text-blue-200 text-xs">{t('warningStep1')}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-400 font-bold text-xs mt-0.5">2.</span>
                    <p className="text-blue-200 text-xs">{t('warningStep2')}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-400 font-bold text-xs mt-0.5">3.</span>
                    <p className="text-blue-200 text-xs">{t('warningStep3')}</p>
                  </div>
                </div>
              </div>

              {/* Bot info */}
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">CaseX Bot</p>
                    <p className="text-gray-400 text-xs">{botUsername}</p>
                  </div>
                </div>
                {tradeOfferId && (
                  <p className="text-[10px] text-gray-500 mb-3">
                    Trade ID: {tradeOfferId}
                  </p>
                )}
                <a
                  href="https://steamcommunity.com/my/tradeoffers/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-green-600 hover:bg-green-500 text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  {t('confirmOnSteam')}
                </a>
              </div>

              {/* Polling indicator */}
              <div className="flex items-center justify-center gap-2 text-gray-500 text-xs">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                {t('autoChecking')}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-700/50">
          <button
            onClick={handleClose}
            className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-xl transition-colors"
          >
            {showSuccess ? t('done') : t('close')}
          </button>
        </div>
      </div>
    </div>
  );
}
