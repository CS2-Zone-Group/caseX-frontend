'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSettingsStore } from '@/store/settingsStore';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { translations } from '@/lib/translations';
import { convertCurrency, formatPrice } from '@/lib/currency';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useFavouritesStore } from '@/store/favouritesStore';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useChatStore } from '@/store/useChatStore';

export default function Navbar() {
  const openChat = useChatStore((state) => state.openChat);
  const isChatOpen = useChatStore((state) => state.isChatOpen);
  const { count, fetchFavouriteIds } = useFavouritesStore();
  const router = useRouter();
  const { language, currency } = useSettingsStore();
  const { itemCount } = useCartStore();
  const { user, token, logout, checkTokenValidity, fetchUserBalance, hasHydrated } = useAuthStore();
  const t = translations[language];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [convertedBalance, setConvertedBalance] = useState(0);

  const isLoggedIn = hasHydrated && !!user && !!token;
  const baseBalance = user?.balance || 0;

  useEffect(() => {
    if (isLoggedIn) {
      fetchFavouriteIds();
    }
  }, [isLoggedIn, fetchFavouriteIds]);

  useEffect(() => {
    if (isLoggedIn) {
      const initializeUser = async () => {
        const isValid = await checkTokenValidity();
        if (isValid) {
          await fetchUserBalance();
        }
      };

      initializeUser();

      const interval = setInterval(async () => {
        const isValid = await checkTokenValidity();
        if (isValid) {
          await fetchUserBalance();
        }
      }, 5 * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [isLoggedIn, checkTokenValidity, fetchUserBalance]);

  useEffect(() => {
    const convertBalance = async () => {
      try {
        const converted = await convertCurrency(baseBalance, 'USD', currency);
        setConvertedBalance(converted);
      } catch (error) {
        console.error('Currency conversion failed in Navbar:', error);
        setConvertedBalance(baseBalance);
      }
    };

    if (baseBalance > 0) {
      convertBalance();
    }
  }, [currency, baseBalance]);

  const handleLogout = () => {
    logout();
    setProfileMenuOpen(false);
    router.push('/auth/login');
  };

  return (
    <nav className="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-50 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
              CaseX
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/marketplace" className="hover:text-primary-600 transition">
              {t.marketplace}
            </Link>

            {isLoggedIn && (
              <>
                <Link href="/inventory" className="hover:text-primary-600 transition">
                  {language === 'uz' ? 'Inventar' : language === 'ru' ? 'Инвентарь' : 'Inventory'}
                </Link>

                {/* Chat Button */}
                <button
                  onClick={openChat}
                  className={`${isChatOpen ? 'text-blue-600' : 'text-gray-600 dark:text-gray-300'} p-2 hover:text-blue-500 transition-colors`}
                >
                  <ChatBubbleOutlineIcon />
                </button>

                <Link href="/cart" className="relative p-2 hover:text-primary-600 transition">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {itemCount > 99 ? '99+' : itemCount}
                    </span>
                  )}
                </Link>

                <Link href="/favorites" className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors">
                  <FavoriteBorderIcon />
                  {count > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
                      {count}
                    </span>
                  )}
                </Link>
              </>
            )}

            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-3 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-blue-600 rounded-full flex items-center justify-center overflow-hidden">
                    {(user as any).steamAvatar ? (
                      <img src={(user as any).steamAvatar} alt={user.username} className="w-full h-full object-cover" />
                    ) : user.avatar ? (
                      <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white font-bold text-sm">{user.username[0].toUpperCase()}</span>
                    )}
                  </div>
                  <div className="text-left">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold">{user.username}</span>
                    </div>
                    <div className="text-xs text-gray-500">{formatPrice(convertedBalance, currency)}</div>
                  </div>
                  <svg className={`w-4 h-4 transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="font-semibold text-sm">{user.username}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                    <div className="py-2">
                      <Link href="/profile" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition" onClick={() => setProfileMenuOpen(false)}>
                        <span>{language === 'uz' ? 'Profil' : language === 'ru' ? 'Профиль' : 'Profile'}</span>
                      </Link>
                      <button className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 transition w-full" onClick={handleLogout}>
                        <span>{language === 'uz' ? 'Chiqish' : language === 'ru' ? 'Выйти' : 'Logout'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/login" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition">
                {t.login}
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}