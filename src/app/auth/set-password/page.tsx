'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export default function SetPasswordPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    document.title = 'Parol o\'rnatish - CaseX';
  }, []);

  // If not logged in, redirect to login
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) router.push('/auth/login');
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      return setError('Parol kamida 8 ta belgidan iborat bo\'lishi kerak');
    }
    if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
      return setError('Parol harf va raqamlardan iborat bo\'lishi kerak');
    }
    if (password !== confirm) {
      return setError('Parollar mos kelmadi');
    }

    setLoading(true);
    try {
      await api.post('/auth/phone/set-password', { password });
      setSuccess(true);
      setTimeout(() => router.push('/marketplace'), 1500);
    } catch (err: any) {
      const msg = err.response?.data?.message;
      if (msg === 'PASSWORD_TOO_WEAK') setError('Parol zaif. Harf va raqamlardan foydalaning.');
      else setError('Xatolik yuz berdi. Qayta urinib ko\'ring.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Parol o'rnatish</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Keyinchalik telefon raqam va parol orqali kirishingiz mumkin bo'ladi
          </p>
        </div>

        {success ? (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded text-sm text-center">
            Parol muvaffaqiyatli o'rnatildi! Bosh sahifaga yo'naltirilmoqda...
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">
                  Yangi parol
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  placeholder="Kamida 8 ta belgi (harf + raqam)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">
                  Parolni tasdiqlang
                </label>
                <input
                  type="password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  placeholder="Parolni qayta kiriting"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50 font-medium"
              >
                {loading ? 'Saqlanmoqda...' : 'Parolni saqlash'}
              </button>
            </form>

            <div className="text-center">
              <Link href="/marketplace" className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                O'tkazib yuborish →
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
