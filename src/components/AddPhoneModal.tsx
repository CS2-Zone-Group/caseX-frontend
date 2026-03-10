'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

interface AddPhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (phoneNumber: string) => void;
}

const RESEND_COOLDOWN = 60;

export default function AddPhoneModal({ isOpen, onClose, onSuccess }: AddPhoneModalProps) {
  const t = useTranslations('PhonePage');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [resending, setResending] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!isOpen) {
      setStep('phone');
      setPhoneNumber('');
      setDigits(['', '', '', '', '', '']);
      setError('');
      setLoading(false);
      setCountdown(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown(c => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!/^\+[1-9]\d{7,14}$/.test(phoneNumber)) {
      return setError(t('errors.phoneFormat'));
    }
    setLoading(true);
    try {
      await api.post('/auth/phone/request-otp', { phoneNumber });
      setStep('otp');
      setCountdown(RESEND_COOLDOWN);
      setTimeout(() => inputsRef.current[0]?.focus(), 100);
    } catch (err: any) {
      const msg = err.response?.data?.message;
      if (msg === 'RESEND_TOO_SOON') setError(t('errors.resendTooSoon'));
      else setError(err.response?.data?.message || t('errors.sendError'));
    } finally {
      setLoading(false);
    }
  };

  const handleDigitChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);
    if (digit && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setDigits(pasted.split(''));
      inputsRef.current[5]?.focus();
    }
  };

  const code = digits.join('');

  useEffect(() => {
    if (code.length === 6 && step === 'otp') {
      handleVerify();
    }
  }, [code]);

  const handleVerify = async () => {
    if (code.length !== 6 || loading) return;
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/phone/link', { phoneNumber, code });
      // Refresh user data in auth store
      const { fetchUserBalance } = useAuthStore.getState();
      await fetchUserBalance();
      onSuccess(phoneNumber);
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message;
      if (msg === 'INVALID_OTP') setError(t('errors.invalidOtp'));
      else if (msg === 'OTP_EXPIRED') setError(t('errors.otpExpired'));
      else if (msg === 'MAX_ATTEMPTS_EXCEEDED') setError(t('errors.maxAttempts'));
      else if (msg === 'PHONE_ALREADY_LINKED') setError('Bu raqam boshqa akkauntga biriktirilgan');
      else setError(t('errors.generalError'));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || resending) return;
    setResending(true);
    setError('');
    try {
      await api.post('/auth/phone/request-otp', { phoneNumber });
      setCountdown(RESEND_COOLDOWN);
      setDigits(['', '', '', '', '', '']);
      inputsRef.current[0]?.focus();
    } catch (err: any) {
      const msg = err.response?.data?.message;
      if (msg === 'RESEND_TOO_SOON') setError(t('errors.resendTooSoon'));
      else setError(t('errors.sendError'));
    } finally {
      setResending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Phone step */}
          {step === 'phone' && (
            <div className="space-y-5">
              <div className="text-center">
                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('phoneLabel')}</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('subtitle')}</p>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-3 py-2 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white text-lg"
                    placeholder="+998901234567"
                    autoFocus
                  />
                  <p className="mt-1 text-xs text-gray-500">{t('phoneHint')}</p>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium"
                >
                  {loading ? t('sending') : t('sendCode')}
                </button>
              </form>
            </div>
          )}

          {/* OTP step */}
          {step === 'otp' && (
            <div className="space-y-5">
              <div className="text-center">
                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-7 h-7 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('telegramCode')}</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-gray-900 dark:text-white">{phoneNumber}</span>{' '}
                  {t('codeSentTo')}
                </p>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-3 py-2 rounded-lg text-sm text-center">
                  {error}
                </div>
              )}

              <div className="flex justify-center gap-2.5" onPaste={handlePaste}>
                {digits.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputsRef.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className={`w-11 h-13 text-center text-xl font-bold border-2 rounded-lg focus:outline-none transition dark:bg-gray-800 dark:text-white ${
                      digit ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'
                    } ${loading ? 'opacity-50' : ''}`}
                    disabled={loading}
                  />
                ))}
              </div>

              {loading && <p className="text-center text-sm text-gray-500">{t('verifying')}</p>}

              <div className="text-center space-y-2">
                <p className="text-sm text-gray-500">{t('codeNotReceived')}</p>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={countdown > 0 || resending}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  {resending ? t('resending') : countdown > 0 ? t('resendIn', { seconds: countdown }) : t('resend')}
                </button>
              </div>

              <button
                type="button"
                onClick={() => { setStep('phone'); setDigits(['', '', '', '', '', '']); setError(''); }}
                className="w-full text-center text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                {t('changeNumber')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
