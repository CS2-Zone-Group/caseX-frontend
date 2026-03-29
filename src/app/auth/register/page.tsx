'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useTranslations } from 'next-intl';
import { useSettingsStore } from '@/store/settingsStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export default function RegisterPage() {
  const router = useRouter();
  const t = useTranslations('RegisterPage');
  const { language } = useSettingsStore();

  const [tab, setTab] = useState<'email' | 'phone'>('email');
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '', acceptTerms: false });
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => { document.title = `${t('title')} - CaseX`; }, [t]);

  const validateEmail = () => {
    if (!form.email.includes('@')) return setError(t('errors.emailInvalid')), false;
    if (form.password.length < 8) return setError(t('errors.passwordTooShort')), false;
    if (!/[a-zA-Z]/.test(form.password) || !/\d/.test(form.password)) return setError(t('errors.passwordTooWeak')), false;
    if (form.password !== form.confirmPassword) return setError(t('errors.passwordMismatch')), false;
    if (!form.acceptTerms) return setError(t('errors.termsRequired')), false;
    return true;
  };

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validateEmail()) return;
    setLoading(true);
    try {
      await api.post('/auth/register', { email: form.email, password: form.password, locale: language });
      router.push(`/auth/verify-email?email=${encodeURIComponent(form.email)}`);
    } catch (err: any) {
      const code = err.response?.data?.message;
      if (code === 'EMAIL_ALREADY_EXISTS') setError(t('errors.emailExists'));
      else if (code === 'PASSWORD_TOO_WEAK') setError(t('errors.passwordTooWeak'));
      else setError(t('errors.registrationFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!/^\+[1-9]\d{7,14}$/.test(phoneNumber)) return setError(t('phone.invalid'));
    setLoading(true);
    try {
      await api.post('/auth/phone/request-otp', { phoneNumber });
      router.push(`/auth/phone?number=${encodeURIComponent(phoneNumber)}`);
    } catch (err: any) {
      const code = err.response?.data?.message;
      if (code === 'RESEND_TOO_SOON') setError(t('resendTooSoon'));
      else setError(err.response?.data?.message || t('errors.registrationFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleSteamLogin = () => { window.location.href = `${API_URL}/auth/steam`; };
  const handleGoogleLogin = () => { window.location.href = `${API_URL}/auth/google`; };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <Link href="/" className="fixed top-4 left-4 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {t('backToHome')}
      </Link>
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white">{t('title')}</h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {t('loginText')}{' '}
            <Link href="/auth/login" className="text-primary-600 hover:text-primary-500">{t('loginLink')}</Link>
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => { setTab('email'); setError(''); }}
            className={`flex-1 py-2 text-sm font-medium transition ${tab === 'email' ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
          >
            {t('emailTab')}
          </button>
          <button
            type="button"
            onClick={() => { setTab('phone'); setError(''); }}
            className={`flex-1 py-2 text-sm font-medium transition ${tab === 'phone' ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
          >
            {t('phoneTab')}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Email Tab */}
        {tab === 'email' && (
          <form className="space-y-4" onSubmit={handleEmailRegister}>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">{t('form.email')}</label>
              <input
                type="email" required value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                placeholder={t('form.emailPlaceholder')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">{t('form.password')}</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'} required value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                  placeholder={t('form.passwordPlaceholder')}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {showPass
                      ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      : <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
                    }
                  </svg>
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">{t('form.passwordHint')}</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">{t('form.confirmPassword')}</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'} required value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                  placeholder={t('form.passwordPlaceholder')}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {showConfirm
                      ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      : <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
                    }
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex items-start">
              <input
                id="terms" type="checkbox" checked={form.acceptTerms}
                onChange={(e) => setForm({ ...form, acceptTerms: e.target.checked })}
                className="mt-1 h-4 w-4 text-primary-600 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                {t('form.acceptTerms')}{' '}
                <Link href="/terms" className="text-primary-600 hover:text-primary-500">{t('form.termsLink')}</Link>{' '}
                {t('form.and')}{' '}
                <Link href="/privacy" className="text-primary-600 hover:text-primary-500">{t('form.privacyLink')}</Link>
                {t('form.termsAcceptSuffix')}
              </label>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
            >
              {loading ? t('form.registering') : t('form.register')}
            </button>
          </form>
        )}

        {/* Phone Tab */}
        {tab === 'phone' && (
          <form className="space-y-4" onSubmit={handlePhoneRequest}>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">{t('phone.label')}</label>
              <input
                type="tel" required value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                placeholder={t('phone.placeholder')}
              />
              <p className="mt-1 text-xs text-gray-500">{t('phone.hint')}</p>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
            >
              {loading ? t('phone.sending') : t('phone.sendOtp')}
            </button>
          </form>
        )}

        {/* Divider + OAuth */}
        <div>
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 dark:bg-gray-900 text-gray-500">{t('form.or')}</span>
            </div>
          </div>

          <div className="space-y-3 mt-3">
            <button
              type="button" onClick={handleGoogleLogin}
              className="w-full py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>{t('form.googleRegister')}</span>
            </button>

            <button
              type="button" onClick={handleSteamLogin}
              className="w-full py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.56 3.79 10.24 8.93 11.61l3.37-6.97C10.97 16.1 10 14.67 10 13c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4c-.21 0-.42-.02-.62-.05l-2.97 6.16C17.34 22.43 24 17.73 24 12 24 5.37 18.63 0 12 0z" />
              </svg>
              <span>{t('form.steamRegister')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
