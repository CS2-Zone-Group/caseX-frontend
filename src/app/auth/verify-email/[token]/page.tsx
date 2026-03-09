'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useTranslations } from 'next-intl';

export default function VerifyEmailPage() {
  const router = useRouter();
  const params = useParams();
  const { setAuth } = useAuthStore();
  const t = useTranslations('VerifyEmailPage');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    document.title = `${t('title')} - CaseX`;
  }, [t]);

  useEffect(() => {
    const verifyEmail = async () => {
      const token = params.token as string;

      if (!token) {
        setStatus('error');
        setMessage(t('errors.invalidToken'));
        return;
      }

      try {
        const { data } = await api.get(`/auth/verify-email/${token}`);

        if (data.access_token) {
          setAuth(data.user, data.access_token);
          setStatus('success');
          setMessage(t('success.message'));

          // Redirect to marketplace after 3 seconds
          setTimeout(() => {
            router.push('/marketplace');
          }, 3000);
        } else {
          setStatus('error');
          setMessage(t('errors.verificationFailed'));
        }
      } catch (error: any) {
        setStatus('error');
        const errorCode = error.response?.data?.message || 'VERIFICATION_FAILED';

        switch (errorCode) {
          case 'INVALID_TOKEN':
            setMessage(t('errors.invalidToken'));
            break;
          case 'TOKEN_EXPIRED':
            setMessage(t('errors.tokenExpired'));
            break;
          case 'TOKEN_ALREADY_USED':
            setMessage(t('errors.tokenAlreadyUsed'));
            break;
          default:
            setMessage(t('errors.verificationFailed'));
        }
      }
    };

    verifyEmail();
  }, [params.token, setAuth, router, t]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        {status === 'loading' && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-200 mb-2">
              {t('loading.title')}
            </h2>
            <p className="text-blue-700 dark:text-blue-300">
              {t('loading.message')}
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-2">
              {t('success.title')}
            </h2>
            <p className="text-green-700 dark:text-green-300 mb-4">
              {message}
            </p>
            <p className="text-sm text-green-600 dark:text-green-400">
              {t('success.redirecting')}
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">
              {t('error.title')}
            </h2>
            <p className="text-red-700 dark:text-red-300 mb-6">
              {message}
            </p>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/auth/login')}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                {t('error.backToLogin')}
              </button>
              <button
                onClick={() => router.push('/auth/register')}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                {t('error.registerAgain')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
