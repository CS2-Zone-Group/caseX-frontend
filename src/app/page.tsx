'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useSettingsStore } from '@/store/settingsStore';
import { translations } from '@/lib/translations';
import Navbar from '@/components/Navbar';

export default function Home() {
  const { language, setLanguage } = useSettingsStore();
  const t = translations[language];

  // Update document title
  useEffect(() => {
    const titles = {
      uz: 'CaseX - CS2 Skinlari Marketplace',
      ru: 'CaseX - Маркетплейс CS2 Скинов', 
      en: 'CaseX - CS2 Skins Marketplace'
    };
    document.title = titles[language];
  }, [language]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 rounded-full">
            <span className="text-primary-600 dark:text-primary-400 font-semibold">
              {language === 'uz' ? '🇺🇿 O\'zbekiston #1 CS2 Marketplace' : 
               language === 'ru' ? '🇺🇿 #1 CS2 Маркетплейс Узбекистана' : 
               '🇺🇿 Uzbekistan\'s #1 CS2 Marketplace'}
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-primary-600 to-blue-600 dark:from-white dark:via-primary-400 dark:to-blue-400 bg-clip-text text-transparent">
            {language === 'uz' ? 'CS2 Skinlarini Xarid Qiling' : 
             language === 'ru' ? 'Покупайте CS2 Скины' : 
             'Buy CS2 Skins'}
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            {language === 'uz' ? 'Eng yaxshi narxlarda, xavfsiz va tez. O\'zbekistondagi eng ishonchli CS2 skinlari marketplace.' : 
             language === 'ru' ? 'По лучшим ценам, безопасно и быстро. Самый надежный маркетплейс CS2 скинов в Узбекистане.' : 
             'Best prices, secure and fast. The most trusted CS2 skins marketplace in Uzbekistan.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link 
              href="/marketplace"
              className="px-8 py-4 bg-gradient-to-r from-primary-600 to-blue-600 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all text-lg font-semibold"
            >
              {language === 'uz' ? '🛍️ Marketplace\'ga O\'tish' : 
               language === 'ru' ? '🛍️ Перейти в Маркетплейс' : 
               '🛍️ Go to Marketplace'}
            </Link>
            <Link 
              href="/auth/register"
              className="px-8 py-4 border-2 border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all text-lg font-semibold"
            >
              {language === 'uz' ? 'Ro\'yxatdan O\'tish' : 
               language === 'ru' ? 'Регистрация' : 
               'Sign Up'}
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <div className="text-3xl font-bold text-primary-600 mb-2">1000+</div>
              <div className="text-gray-600 dark:text-gray-400">
                {language === 'uz' ? 'Skinlar' : language === 'ru' ? 'Скинов' : 'Skins'}
              </div>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <div className="text-3xl font-bold text-primary-600 mb-2">500+</div>
              <div className="text-gray-600 dark:text-gray-400">
                {language === 'uz' ? 'Foydalanuvchilar' : language === 'ru' ? 'Пользователей' : 'Users'}
              </div>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <div className="text-3xl font-bold text-primary-600 mb-2">24/7</div>
              <div className="text-gray-600 dark:text-gray-400">
                {language === 'uz' ? 'Qo\'llab-quvvatlash' : language === 'ru' ? 'Поддержка' : 'Support'}
              </div>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <div className="text-3xl font-bold text-primary-600 mb-2">100%</div>
              <div className="text-gray-600 dark:text-gray-400">
                {language === 'uz' ? 'Xavfsiz' : language === 'ru' ? 'Безопасно' : 'Secure'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Items Section */}
      <section className="py-20 px-4 bg-gray-900 text-white">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold mb-12">
            {language === 'uz' ? 'MASHHUR MAHSULOTLAR UCHUN ENG YAXSHI TAKLIFLAR' : 
             language === 'ru' ? 'ЛУЧШИЕ ПРЕДЛОЖЕНИЯ ДЛЯ ПОПУЛЯРНЫХ ТОВАРОВ' : 
             'EXPLORE BEST OFFERS FOR POPULAR ITEMS'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Gloves */}
            <div className="group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden border border-gray-700 hover:border-purple-500">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="text-5xl font-bold text-gray-700 mb-4 tracking-wider">GLOVES</div>
                <div className="flex items-center justify-center mb-6 h-40 relative bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl">
                  <div className="text-7xl group-hover:scale-110 transition-transform">🧤</div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">
                      {language === 'uz' ? '4.8K TAKLIFLAR' : language === 'ru' ? '4.8K ПРЕДЛОЖЕНИЙ' : '4.8K OFFERS'}
                    </div>
                    <div className="text-lg font-semibold">
                      {language === 'uz' ? 'BOSHLANG\'ICH' : language === 'ru' ? 'НАЧИНАЯ С' : 'START FROM'} $40.59
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-primary-600 transition">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* AWP */}
            <div className="group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden border border-gray-700 hover:border-blue-500">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 to-cyan-600/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="text-5xl font-bold text-gray-700 mb-4 tracking-wider">AWP</div>
                <div className="flex items-center justify-center mb-6 h-40 relative bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl">
                  <div className="text-7xl group-hover:scale-110 transition-transform">🎯</div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">
                      {language === 'uz' ? '16.3K TAKLIFLAR' : language === 'ru' ? '16.3K ПРЕДЛОЖЕНИЙ' : '16.3K OFFERS'}
                    </div>
                    <div className="text-lg font-semibold">
                      {language === 'uz' ? 'BOSHLANG\'ICH' : language === 'ru' ? 'НАЧИНАЯ С' : 'START FROM'} $0.19
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-primary-600 transition">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Knives */}
            <div className="group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden border border-gray-700 hover:border-pink-500">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-pink-600/20 to-rose-600/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="text-5xl font-bold text-gray-700 mb-4 tracking-wider">KNIVES</div>
                <div className="flex items-center justify-center mb-6 h-40 relative bg-gradient-to-br from-pink-500/10 to-rose-500/10 rounded-xl">
                  <div className="text-7xl group-hover:scale-110 group-hover:rotate-12 transition-all">🔪</div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">
                      {language === 'uz' ? '17.6K TAKLIFLAR' : language === 'ru' ? '17.6K ПРЕДЛОЖЕНИЙ' : '17.6K OFFERS'}
                    </div>
                    <div className="text-lg font-semibold">
                      {language === 'uz' ? 'BOSHLANG\'ICH' : language === 'ru' ? 'НАЧИНАЯ С' : 'START FROM'} $47.15
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-primary-600 transition">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* AK-47 */}
            <div className="group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden border border-gray-700 hover:border-orange-500">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-600/20 to-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="text-5xl font-bold text-gray-700 mb-4 tracking-wider">AK-47</div>
                <div className="flex items-center justify-center mb-6 h-40 relative bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl">
                  <div className="text-7xl group-hover:scale-110 transition-transform">⚔️</div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">
                      {language === 'uz' ? '24.5K TAKLIFLAR' : language === 'ru' ? '24.5K ПРЕДЛОЖЕНИЙ' : '24.5K OFFERS'}
                    </div>
                    <div className="text-lg font-semibold">
                      {language === 'uz' ? 'BOSHLANG\'ICH' : language === 'ru' ? 'НАЧИНАЯ С' : 'START FROM'} $0.21
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-primary-600 transition">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/marketplace"
              className="inline-block px-8 py-4 bg-gradient-to-r from-primary-600 to-blue-600 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all text-lg font-semibold"
            >
              {language === 'uz' ? 'Barcha Mahsulotlarni Ko\'rish →' : 
               language === 'ru' ? 'Посмотреть Все Товары →' : 
               'View All Items →'}
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white dark:bg-gray-800">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            {language === 'uz' ? 'NIMA UCHUN CASEX?' : 
             language === 'ru' ? 'ПОЧЕМУ CASEX?' : 
             'WHY CASEX?'}
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-gradient-to-br from-blue-50 to-primary-50 dark:from-gray-900 dark:to-gray-800 rounded-xl">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold mb-3">
                {language === 'uz' ? 'Eng Yaxshi Narxlar' : 
                 language === 'ru' ? 'Лучшие Цены' : 
                 'Best Prices'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {language === 'uz' ? 'Bozordagi eng arzon narxlarda CS2 skinlarini sotib oling' : 
                 language === 'ru' ? 'Покупайте CS2 скины по самым низким ценам на рынке' : 
                 'Buy CS2 skins at the lowest prices in the market'}
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 rounded-xl">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold mb-3">
                {language === 'uz' ? 'Xavfsiz To\'lovlar' : 
                 language === 'ru' ? 'Безопасные Платежи' : 
                 'Secure Payments'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {language === 'uz' ? 'Click, Payme va boshqa mahalliy to\'lov tizimlari orqali xavfsiz to\'lang' : 
                 language === 'ru' ? 'Безопасная оплата через Click, Payme и другие местные платежные системы' : 
                 'Secure payment via Click, Payme and other local payment systems'}
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 rounded-xl">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-3">
                {language === 'uz' ? 'Tezkor Yetkazib Berish' : 
                 language === 'ru' ? 'Быстрая Доставка' : 
                 'Fast Delivery'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {language === 'uz' ? 'Skinlaringizni bir necha daqiqada qo\'lingizga oling' : 
                 language === 'ru' ? 'Получите свои скины в течение нескольких минут' : 
                 'Get your skins within minutes'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Methods Section */}
      <section className="py-20 px-4 bg-gray-900 text-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              {language === 'uz' ? 'Xavfsiz To\'lov Usullari' : 
               language === 'ru' ? 'Безопасные Способы Оплаты' : 
               'Secure Payment Methods'}
            </h2>
          </div>

          {/* Payment Methods Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
            {/* O'zbek to'lov tizimlari */}
            <div className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition group">
              <div className="text-center mb-3">
                <div className="flex items-center justify-center mb-3 h-12">
                  <svg className="h-10 w-auto" viewBox="0 0 120 40" fill="none">
                    <rect width="120" height="40" rx="8" fill="#00B4D8"/>
                    <text x="60" y="26" fontFamily="Arial, sans-serif" fontSize="18" fontWeight="bold" fill="white" textAnchor="middle">Payme</text>
                  </svg>
                </div>
                <div className="font-bold text-sm text-gray-300">Payme</div>
              </div>
              <div className="text-xs text-gray-400 text-center mb-2">$1000 / Transaction</div>
              <div className="text-xs text-center px-2 py-1 bg-green-500/20 text-green-400 rounded">0% FEE</div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition group">
              <div className="text-center mb-3">
                <div className="flex items-center justify-center mb-3 h-12">
                  <svg className="h-10 w-auto" viewBox="0 0 120 40" fill="none">
                    <rect width="120" height="40" rx="8" fill="#8B5CF6"/>
                    <text x="60" y="26" fontFamily="Arial, sans-serif" fontSize="18" fontWeight="bold" fill="white" textAnchor="middle">CLICK</text>
                  </svg>
                </div>
                <div className="font-bold text-sm text-gray-300">Click</div>
              </div>
              <div className="text-xs text-gray-400 text-center mb-2">$1000 / Transaction</div>
              <div className="text-xs text-center px-2 py-1 bg-green-500/20 text-green-400 rounded">0% FEE</div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition group">
              <div className="text-center mb-3">
                <div className="flex items-center justify-center mb-3 h-12">
                  <svg className="h-10 w-auto" viewBox="0 0 120 40" fill="none">
                    <rect width="120" height="40" rx="8" fill="#7C3AED"/>
                    <text x="60" y="26" fontFamily="Arial, sans-serif" fontSize="18" fontWeight="bold" fill="white" textAnchor="middle">UZUM</text>
                  </svg>
                </div>
                <div className="font-bold text-sm text-gray-300">Uzum</div>
              </div>
              <div className="text-xs text-gray-400 text-center mb-2">$1000 / Transaction</div>
              <div className="text-xs text-center px-2 py-1 bg-green-500/20 text-green-400 rounded">0% FEE</div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition group">
              <div className="text-center mb-3">
                <div className="flex items-center justify-center mb-3 h-12">
                  <svg className="h-10 w-auto" viewBox="0 0 120 40" fill="none">
                    <rect width="120" height="40" rx="8" fill="#F59E0B"/>
                    <text x="60" y="26" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" fill="white" textAnchor="middle">PAYNET</text>
                  </svg>
                </div>
                <div className="font-bold text-sm text-gray-300">Paynet</div>
              </div>
              <div className="text-xs text-gray-400 text-center mb-2">$1000 / Transaction</div>
              <div className="text-xs text-center px-2 py-1 bg-green-500/20 text-green-400 rounded">0% FEE</div>
            </div>

            {/* International cards */}
            <div className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition group">
              <div className="text-center mb-3">
                <div className="flex items-center justify-center mb-3 h-12">
                  <svg className="h-8 w-auto" viewBox="0 0 120 40" fill="none">
                    <rect width="120" height="40" rx="4" fill="#1A1F71"/>
                    <text x="60" y="28" fontFamily="Arial, sans-serif" fontSize="20" fontWeight="bold" fill="#F7B600" textAnchor="middle">VISA</text>
                  </svg>
                </div>
                <div className="font-bold text-sm text-gray-300">VISA</div>
              </div>
              <div className="text-xs text-gray-400 text-center mb-2">$1500 / Transaction</div>
              <div className="text-xs text-center px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded">1.25% FEE</div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition group">
              <div className="text-center mb-3">
                <div className="flex items-center justify-center mb-3 h-12">
                  <svg className="h-8 w-auto" viewBox="0 0 120 40" fill="none">
                    <rect width="120" height="40" rx="4" fill="#EB001B"/>
                    <circle cx="45" cy="20" r="12" fill="#FF5F00" opacity="0.8"/>
                    <circle cx="75" cy="20" r="12" fill="#F79E1B" opacity="0.8"/>
                  </svg>
                </div>
                <div className="font-bold text-sm text-gray-300">Mastercard</div>
              </div>
              <div className="text-xs text-gray-400 text-center mb-2">$1500 / Transaction</div>
              <div className="text-xs text-center px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded">1.25% FEE</div>
            </div>

            {/* Crypto */}
            <div className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition group">
              <div className="text-center mb-3">
                <div className="flex items-center justify-center mb-3 h-12">
                  <svg className="h-12 w-12" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="16" fill="#F7931A"/>
                    <path d="M23.189 14.02c.314-2.096-1.283-3.223-3.465-3.975l.708-2.84-1.728-.43-.69 2.765c-.454-.113-.92-.22-1.385-.326l.695-2.783L15.596 6l-.708 2.839c-.376-.085-.746-.17-1.104-.26l.002-.009-2.384-.595-.46 1.846s1.283.294 1.256.312c.7.175.826.638.805 1.006l-.806 3.235c.048.012.11.03.18.057l-.183-.045-1.13 4.532c-.086.212-.303.531-.793.41.018.025-1.256-.313-1.256-.313l-.858 1.978 2.25.561c.418.105.828.215 1.231.318l-.715 2.872 1.727.43.708-2.84c.472.127.93.245 1.378.357l-.706 2.828 1.728.43.715-2.866c2.948.558 5.164.333 6.097-2.333.752-2.146-.037-3.385-1.588-4.192 1.13-.26 1.98-1.003 2.207-2.538zm-3.95 5.538c-.533 2.147-4.148.986-5.32.695l.95-3.805c1.172.293 4.929.872 4.37 3.11zm.535-5.569c-.487 1.953-3.495.96-4.47.717l.86-3.45c.975.243 4.118.696 3.61 2.733z" fill="white"/>
                  </svg>
                </div>
                <div className="font-bold text-sm text-gray-300">Bitcoin</div>
              </div>
              <div className="text-xs text-gray-400 text-center mb-2">$3500 / Transaction</div>
              <div className="text-xs text-center px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded">1.5% FEE</div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition group">
              <div className="text-center mb-3">
                <div className="flex items-center justify-center mb-3 h-12">
                  <svg className="h-12 w-12" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="16" fill="#627EEA"/>
                    <path d="M16.498 4v8.87l7.497 3.35z" fill="white" fillOpacity="0.6"/>
                    <path d="M16.498 4L9 16.22l7.498-3.35z" fill="white"/>
                    <path d="M16.498 21.968v6.027L24 17.616z" fill="white" fillOpacity="0.6"/>
                    <path d="M16.498 27.995v-6.028L9 17.616z" fill="white"/>
                    <path d="M16.498 20.573l7.497-4.353-7.497-3.348z" fill="white" fillOpacity="0.2"/>
                    <path d="M9 16.22l7.498 4.353v-7.701z" fill="white" fillOpacity="0.6"/>
                  </svg>
                </div>
                <div className="font-bold text-sm text-gray-300">Ethereum</div>
              </div>
              <div className="text-xs text-gray-400 text-center mb-2">$3500 / Transaction</div>
              <div className="text-xs text-center px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded">2% FEE</div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition group">
              <div className="text-center mb-3">
                <div className="flex items-center justify-center mb-3 h-12">
                  <svg className="h-12 w-12" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="16" fill="#26A17B"/>
                    <path d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.118 0 1.044 3.309 1.915 7.709 2.118v7.582h3.913v-7.584c4.393-.202 7.694-1.073 7.694-2.116 0-1.043-3.301-1.914-7.694-2.117" fill="white"/>
                  </svg>
                </div>
                <div className="font-bold text-sm text-gray-300">USDT</div>
              </div>
              <div className="text-xs text-gray-400 text-center mb-2">$3500 / Transaction</div>
              <div className="text-xs text-center px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded">1% FEE</div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition group">
              <div className="text-center mb-3">
                <div className="flex items-center justify-center mb-3 h-12">
                  <div className="text-5xl">💎</div>
                </div>
                <div className="font-bold text-sm text-gray-300">
                  {language === 'uz' ? 'Boshqalar' : language === 'ru' ? 'Другие' : 'More'}
                </div>
              </div>
              <div className="text-xs text-gray-400 text-center mb-2">
                {language === 'uz' ? 'Turli usullar' : language === 'ru' ? 'Различные методы' : 'Various methods'}
              </div>
              <div className="text-xs text-center px-2 py-1 bg-gray-700 text-gray-400 rounded">...</div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-gray-400 mb-6">
              {language === 'uz' ? 'Barcha to\'lovlar xavfsiz va shifrlangan. Biz sizning moliyaviy ma\'lumotlaringizni saqlamaymiz.' : 
               language === 'ru' ? 'Все платежи безопасны и зашифрованы. Мы не храним ваши финансовые данные.' : 
               'All payments are secure and encrypted. We do not store your financial information.'}
            </p>
            <div className="flex justify-center items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                SSL {language === 'uz' ? 'Shifrlangan' : language === 'ru' ? 'Зашифровано' : 'Encrypted'}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                PCI DSS {language === 'uz' ? 'Sertifikatlangan' : language === 'ru' ? 'Сертифицировано' : 'Certified'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">
            {language === 'uz' ? 'CaseX Haqida' : 
             language === 'ru' ? 'О CaseX' : 
             'About CaseX'}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            {language === 'uz' ? 'CaseX - O\'zbekistondagi birinchi va eng ishonchli CS2 skinlari marketplace. Biz o\'yinchilarga xavfsiz, tez va qulay tarzda skinlar sotib olish va sotish imkoniyatini taqdim etamiz.' : 
             language === 'ru' ? 'CaseX - первый и самый надежный маркетплейс CS2 скинов в Узбекистане. Мы предоставляем игрокам возможность безопасно, быстро и удобно покупать и продавать скины.' : 
             'CaseX - the first and most trusted CS2 skins marketplace in Uzbekistan. We provide gamers with a safe, fast and convenient way to buy and sell skins.'}
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => setLanguage('uz')}
              className={`px-4 py-2 rounded-lg transition ${language === 'uz' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
              🇺🇿 O'zbek
            </button>
            <button
              onClick={() => setLanguage('ru')}
              className={`px-4 py-2 rounded-lg transition ${language === 'ru' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
              🇷🇺 Русский
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-4 py-2 rounded-lg transition ${language === 'en' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
              🇬🇧 English
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">C</span>
            </div>
            <span className="text-xl font-bold">CaseX</span>
          </div>
          <p className="text-gray-400 mb-4">
            {language === 'uz' ? 'CS2 Skinlari uchun O\'zbekiston Marketplace' : 
             language === 'ru' ? 'Узбекский маркетплейс CS2 скинов' : 
             'Uzbekistan CS2 Skins Marketplace'}
          </p>
          <p className="text-gray-500 text-sm">
            © 2024 CaseX. {language === 'uz' ? 'Barcha huquqlar himoyalangan.' : 
                          language === 'ru' ? 'Все права защищены.' : 
                          'All rights reserved.'}
          </p>
        </div>
      </footer>
    </div>
  );
}
