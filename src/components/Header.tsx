'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useSettingsStore } from '@/store/settingsStore';
import { translations } from '@/lib/translations';
import { formatPrice } from '@/lib/currency';
import SettingsModal from './SettingsModal';

export default function Header() {
  const { user, logout } = useAuthStore();
  const { itemCount, fetchCart } = useCartStore();
  const { language, currency } = useSettingsStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const t = translations[language];

  useEffect(() => {
    if (user?.id) {
      const { fetchCart } = useCartStore.getState();
      fetchCart();
    }
  }, [user?.id]); // Only depend on user.id, not the whole user object or fetchCart

  return (
    <>
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            CaseX
          </Link>

          <nav className="flex items-center gap-6">
            <Link href="/marketplace" className="hover:text-primary-600">
              {t.marketplace}
            </Link>
            
            {user ? (
              <>
                <Link href="/inventory" className="hover:text-primary-600">
                  {t.inventory}
                </Link>
                <Link href="/cart" className="hover:text-primary-600 relative">
                  {t.cart}
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Link>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">
                    {typeof user.balance === 'number' 
                      ? formatPrice(user.balance, currency)
                      : formatPrice(0, currency)}
                  </span>
                  <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                    title={language === 'uz' ? 'Sozlamalar' : language === 'ru' ? 'Настройки' : 'Settings'}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                  <button
                    onClick={logout}
                    className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    {t.logout}
                  </button>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                  title={language === 'uz' ? 'Sozlamalar' : language === 'ru' ? 'Настройки' : 'Settings'}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                <Link
                  href="/auth/login"
                  className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
                >
                  {t.login}
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
}
