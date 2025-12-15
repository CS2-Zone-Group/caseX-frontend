'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSettingsStore } from '@/store/settingsStore';
import { useCartStore } from '@/store/cartStore';
import { translations } from '@/lib/translations';
import { convertCurrency, formatPrice } from '@/lib/currency';

export default function Navbar() {
  const { language, currency } = useSettingsStore();
  const { itemCount } = useCartStore();
  const t = translations[language];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [convertedBalance, setConvertedBalance] = useState(1234.56);
  
  // Mock user data - replace with actual auth state
  const isLoggedIn = true;
  const baseBalance = 1234.56; // USD base balance
  const user = {
    name: 'Diyorbek',
    email: 'diyorbekolimov2000@gmail.com',
    avatar: null,
    balance: convertedBalance
  };

  // Convert balance when currency changes
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
    
    convertBalance();
  }, [currency, baseBalance]);

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
            <a href="#features" className="hover:text-primary-600 transition">
              {language === 'uz' ? 'Xususiyatlar' : language === 'ru' ? 'Особенности' : 'Features'}
            </a>
            <a href="#about" className="hover:text-primary-600 transition">
              {language === 'uz' ? 'Biz haqimizda' : language === 'ru' ? 'О нас' : 'About'}
            </a>
            <Link href="/marketplace" className="hover:text-primary-600 transition">
              {t.marketplace}
            </Link>
            
            {isLoggedIn && (
              <>
                <Link href="/inventory" className="hover:text-primary-600 transition">
                  {language === 'uz' ? 'Inventar' : language === 'ru' ? 'Инвентарь' : 'Inventory'}
                </Link>
                
                <Link href="/cart" className="relative p-2 hover:text-primary-600 transition">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {/* Cart badge */}
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {itemCount > 99 ? '99+' : itemCount}
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
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-blue-600 rounded-full flex items-center justify-center">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span className="text-white font-bold text-sm">{user.name[0]}</span>
                    )}
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold">{user.name}</div>
                    <div className="text-xs text-gray-500">{formatPrice(user.balance, currency)}</div>
                  </div>
                  <svg className={`w-4 h-4 transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="font-semibold text-sm">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                    
                    <div className="py-2">
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>{language === 'uz' ? 'Profil' : language === 'ru' ? 'Профиль' : 'Profile'}</span>
                      </Link>

                      <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

                      <Link
                        href="/profile?tab=balance"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="flex-1">
                          <div className="text-sm">{language === 'uz' ? 'Balans' : language === 'ru' ? 'Баланс' : 'Balance'}</div>
                          <div className="text-xs text-primary-600 font-semibold">{formatPrice(user.balance, currency)}</div>
                        </div>
                        <button 
                          className="w-6 h-6 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Add deposit logic here
                            console.log('Deposit clicked');
                          }}
                          title={language === 'uz' ? 'Balansni to\'ldirish' : language === 'ru' ? 'Пополнить баланс' : 'Add funds'}
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </Link>

                      <Link
                        href="/profile?tab=history"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span>{language === 'uz' ? 'To\'lov tarixi' : language === 'ru' ? 'История платежей' : 'Payment History'}</span>
                      </Link>

                      <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

                      <button
                        className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 transition w-full"
                        onClick={() => {
                          setProfileMenuOpen(false);
                          // Add logout logic here
                        }}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>{language === 'uz' ? 'Chiqish' : language === 'ru' ? 'Выйти' : 'Logout'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                href="/auth/login"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
              >
                {t.login}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2">
            <a href="#features" className="block py-2 hover:text-primary-600">
              {language === 'uz' ? 'Xususiyatlar' : language === 'ru' ? 'Особенности' : 'Features'}
            </a>
            <a href="#about" className="block py-2 hover:text-primary-600">
              {language === 'uz' ? 'Biz haqimizda' : language === 'ru' ? 'О нас' : 'About'}
            </a>
            <Link href="/marketplace" className="block py-2 hover:text-primary-600">
              {t.marketplace}
            </Link>
            
            {isLoggedIn ? (
              <>
                <Link href="/inventory" className="block py-2 hover:text-primary-600">
                  {language === 'uz' ? 'Inventar' : language === 'ru' ? 'Инвентарь' : 'Inventory'}
                </Link>
                <Link href="/cart" className="block py-2 hover:text-primary-600">
                  {language === 'uz' ? 'Savat' : language === 'ru' ? 'Корзина' : 'Cart'}
                </Link>
                <Link href="/profile" className="block py-2 hover:text-primary-600">
                  {language === 'uz' ? 'Profil' : language === 'ru' ? 'Профиль' : 'Profile'}
                </Link>
              </>
            ) : (
              <Link 
                href="/auth/login"
                className="block px-4 py-2 bg-primary-600 text-white rounded-lg text-center"
              >
                {t.login}
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
