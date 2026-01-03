'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useSettingsStore } from '@/store/settingsStore';
import { translations } from '@/lib/translations';
import Navbar from '@/components/Navbar';
import PaymentMethods from '@/components/PaymentMethods';

export default function Home() {
  const { language, setLanguage } = useSettingsStore();
  const t = translations[language];
  const currentYear = new Date().getFullYear();

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
              {language === 'uz' ? 'O\'zbekiston #1 CS2 Marketplace' : 
               language === 'ru' ? '#1 CS2 Маркетплейс Узбекистана' : 
               'Uzbekistan\'s #1 CS2 Marketplace'}
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
      <PaymentMethods/>

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
      <footer className="py-12 px-4 bg-white dark:bg-gray-900 dark:text-white">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">C</span>
            </div>
            <span className="text-xl font-bold">CaseX</span>
          </div>
          <p className="dark:text-gray-300 text-gray-700 mb-4">
            {language === 'uz' ? 'CS2 Skinlari uchun O\'zbekiston marketplace' : 
             language === 'ru' ? 'Узбекский маркетплейс CS2 скинов' : 
             'Uzbekistan CS2 Skins Marketplace'}
          </p>
          <p className="dark:text-gray-400 text-gray-600  text-sm">
            © {currentYear} CaseX. {language === 'uz' ? 'Barcha huquqlar himoyalangan.' : 
                          language === 'ru' ? 'Все права защищены.' : 
                          'All rights reserved.'}
          </p>
        </div>
      </footer>
    </div>
  );
}
