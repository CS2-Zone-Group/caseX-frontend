'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Link } from "@/i18n/routing";
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export default function VerifyEmailPage() {
  const router = useRouter();
  const params = useParams();
  const { setAuth } = useAuthStore();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = params.token as string;
        const { data } = await api.get(`/auth/verify-email/${token}`);
        
        if (data.access_token) {
          setAuth(data.user, data.access_token);
          setStatus('success');
          setMessage('Email muvaffaqiyatli tasdiqlandi!');
          
          setTimeout(() => {
            router.push('/marketplace');
          }, 2000);
        }
      } catch (error: any) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Email tasdiqlanmadi');
      }
    };

    if (params.token) {
      verifyEmail();
    }
  }, [params.token, setAuth, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-lg">Email tasdiqlanmoqda...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-green-600 dark:text-green-400">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold">{message}</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Marketplace'ga yo'naltirilmoqda...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-red-600 dark:text-red-400">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">Xatolik</h2>
            <p className="text-gray-600 dark:text-gray-400">{message}</p>
            <Link
              href="/auth/login"
              className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Login sahifasiga qaytish
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
