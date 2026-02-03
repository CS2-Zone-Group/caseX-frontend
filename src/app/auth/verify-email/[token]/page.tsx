'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useLanguage } from '@/contexts/LanguageContext';

// Translation helper function
const getTranslations = (language: string) => {
  const translations = {
    en: {
      title: "Email Verification",
      loadingTitle: "Verifying Email...",
      loadingMessage: "Please wait while we verify your email address.",
      successTitle: "Email Verified Successfully!",
      successMessage: "Your email has been verified. You are now logged in.",
      redirecting: "Redirecting to marketplace...",
      errorTitle: "Verification Failed",
      backToLogin: "Back to Login",
      registerAgain: "Register Again",
      invalidToken: "Invalid verification token.",
      tokenExpired: "Verification token has expired.",
      tokenAlreadyUsed: "This verification token has already been used.",
      verificationFailed: "Email verification failed. Please try again."
    },
    uz: {
      title: "Email Tasdiqlash",
      loadingTitle: "Email Tasdiqlanmoqda...",
      loadingMessage: "Email manzilingizni tasdiqlashni kutib turing.",
      successTitle: "Email Muvaffaqiyatli Tasdiqlandi!",
      successMessage: "Emailingiz tasdiqlandi. Endi tizimga kirdingiz.",
      redirecting: "Marketplace'ga yo'naltirilmoqda...",
      errorTitle: "Tasdiqlash Muvaffaqiyatsiz",
      backToLogin: "Kirish sahifasiga qaytish",
      registerAgain: "Qayta ro'yxatdan o'tish",
      invalidToken: "Noto'g'ri tasdiqlash tokeni.",
      tokenExpired: "Tasdiqlash tokeni muddati tugagan.",
      tokenAlreadyUsed: "Bu tasdiqlash tokeni allaqachon ishlatilgan.",
      verificationFailed: "Email tasdiqlash muvaffaqiyatsiz. Qayta urinib ko'ring."
    },
    ru: {
      title: "Подтверждение Email",
      loadingTitle: "Подтверждение Email...",
      loadingMessage: "Пожалуйста, подождите, пока мы подтверждаем ваш email адрес.",
      successTitle: "Email Успешно Подтвержден!",
      successMessage: "Ваш email подтвержден. Вы вошли в систему.",
      redirecting: "Перенаправление на маркетплейс...",
      errorTitle: "Подтверждение Не Удалось",
      backToLogin: "Вернуться к входу",
      registerAgain: "Зарегистрироваться снова",
      invalidToken: "Неверный токен подтверждения.",
      tokenExpired: "Срок действия токена подтверждения истек.",
      tokenAlreadyUsed: "Этот токен подтверждения уже использован.",
      verificationFailed: "Подтверждение email не удалось. Попробуйте еще раз."
    }
  };
  return translations[language as keyof typeof translations] || translations.en;
};

export default function VerifyEmailPage() {
  const router = useRouter();
  const params = useParams();
  const { setAuth } = useAuthStore();
  const { language } = useLanguage();
  const t = getTranslations(language);
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    document.title = `${t.title} - CaseX`;
  }, [t.title]);

  useEffect(() => {
    const verifyEmail = async () => {
      const token = params.token as string;
      
      if (!token) {
        setStatus('error');
        setMessage(t.invalidToken);
        return;
      }

      try {
        const { data } = await api.get(`/auth/verify-email/${token}`);
        
        if (data.access_token) {
          setAuth(data.user, data.access_token);
          setStatus('success');
          setMessage(t.successMessage);
          
          // Redirect to marketplace after 3 seconds
          setTimeout(() => {
            router.push('/marketplace');
          }, 3000);
        } else {
          setStatus('error');
          setMessage(t.verificationFailed);
        }
      } catch (error: any) {
        setStatus('error');
        const errorCode = error.response?.data?.message || 'VERIFICATION_FAILED';
        
        switch (errorCode) {
          case 'INVALID_TOKEN':
            setMessage(t.invalidToken);
            break;
          case 'TOKEN_EXPIRED':
            setMessage(t.tokenExpired);
            break;
          case 'TOKEN_ALREADY_USED':
            setMessage(t.tokenAlreadyUsed);
            break;
          default:
            setMessage(t.verificationFailed);
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
              {t.loadingTitle}
            </h2>
            <p className="text-blue-700 dark:text-blue-300">
              {t.loadingMessage}
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
              {t.successTitle}
            </h2>
            <p className="text-green-700 dark:text-green-300 mb-4">
              {message}
            </p>
            <p className="text-sm text-green-600 dark:text-green-400">
              {t.redirecting}
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
              {t.errorTitle}
            </h2>
            <p className="text-red-700 dark:text-red-300 mb-6">
              {message}
            </p>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/auth/login')}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                {t.backToLogin}
              </button>
              <button
                onClick={() => router.push('/auth/register')}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                {t.registerAgain}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}