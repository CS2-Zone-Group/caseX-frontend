'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

const RESEND_COOLDOWN = 60;

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();

  const email = searchParams.get('email') || '';
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const [resending, setResending] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    document.title = 'Email tasdiqlash - CaseX';
    if (!email) router.replace('/auth/register');
  }, [email, router]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleDigitChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);
    if (digit && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
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

  const handleSubmit = useCallback(async () => {
    if (code.length !== 6) return;
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/verify-email-code', { email, code });
      setAuth(data.user, data.access_token);
      router.push('/marketplace');
    } catch (err: any) {
      const msg = err.response?.data?.message;
      if (msg === 'INVALID_CODE') setError('Kod noto\'g\'ri. Qayta kiriting.');
      else if (msg === 'CODE_EXPIRED') setError('Kod muddati tugagan. Yangi kod so\'rang.');
      else if (msg === 'MAX_ATTEMPTS_EXCEEDED') setError('Urinishlar soni tugadi. Yangi kod so\'rang.');
      else if (msg === 'CODE_ALREADY_USED') setError('Bu kod allaqachon ishlatilgan.');
      else setError('Xatolik yuz berdi. Qayta urinib ko\'ring.');
    } finally {
      setLoading(false);
    }
  }, [code, email, router, setAuth]);

  useEffect(() => {
    if (code.length === 6) handleSubmit();
  }, [code, handleSubmit]);

  const handleResend = async () => {
    if (countdown > 0 || resending) return;
    setResending(true);
    setError('');
    try {
      await api.post('/auth/resend-verification', { email });
      setCountdown(RESEND_COOLDOWN);
      setDigits(['', '', '', '', '', '']);
      inputsRef.current[0]?.focus();
    } catch (err: any) {
      const msg = err.response?.data?.message;
      if (msg === 'RESEND_TOO_SOON') setError('Biroz kuting va qayta urinib ko\'ring.');
      else setError('Kod yuborishda xatolik.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Email tasdiqlash</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium text-gray-900 dark:text-white">{email}</span> manziliga 6 xonali kod yuborildi.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded text-sm text-center">
            {error}
          </div>
        )}

        {/* OTP inputs */}
        <div className="flex justify-center gap-3" onPaste={handlePaste}>
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
              className={`w-12 h-14 text-center text-xl font-bold border-2 rounded-lg focus:outline-none transition dark:bg-gray-800 dark:text-white ${
                digit
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-300 dark:border-gray-600'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            />
          ))}
        </div>

        {loading && (
          <p className="text-center text-sm text-gray-500">Tekshirilmoqda...</p>
        )}

        <div className="text-center space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">Kod kelmadimi?</p>
          <button
            type="button"
            onClick={handleResend}
            disabled={countdown > 0 || resending}
            className="text-sm font-medium text-primary-600 hover:text-primary-500 disabled:text-gray-400 disabled:cursor-not-allowed transition"
          >
            {resending
              ? 'Yuborilmoqda...'
              : countdown > 0
              ? `Qayta yuborish (${countdown}s)`
              : 'Qayta yuborish'}
          </button>
        </div>

        <div className="text-center">
          <Link href="/auth/register" className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            ← Ro'yxatdan o'tishga qaytish
          </Link>
        </div>
      </div>
    </div>
  );
}
