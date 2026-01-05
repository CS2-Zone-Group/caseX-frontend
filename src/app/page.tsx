'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useSettingsStore } from '@/store/settingsStore';
import { translations } from '@/lib/translations';
import Navbar from '@/components/Navbar';
import PaymentMethods from '@/components/PaymentMethods';
import PopularItems from '@/components/PopularItems';

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
     <PopularItems/>

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
            {language === 'uz' ? 'CS2 skinlari uchun O\'zbekiston marketplace' : 
             language === 'ru' ? 'Узбекский маркетплейс CS2 скинов' : 
             'Uzbekistan CS2 skins marketplace'}
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
