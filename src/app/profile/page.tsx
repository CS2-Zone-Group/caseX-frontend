'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSettingsStore } from '@/store/settingsStore';
import { translations } from '@/lib/translations';
import { convertCurrency, formatPrice, getCurrencySymbol } from '@/lib/currency';
import Navbar from '@/components/Navbar';

export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language, currency, theme, setLanguage, setCurrency, setTheme } = useSettingsStore();
  const t = translations[language];
  
  const baseBalance = 1234.56; // USD base balance
  const [activeTab, setActiveTab] = useState<'settings' | 'balance' | 'history'>('settings');
  
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'balance' || tab === 'history') {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Initialize theme on component mount
  useEffect(() => {
    const store = useSettingsStore.getState();
    if (store.setTheme) {
      store.setTheme(store.theme);
    }
  }, []);

  // Convert balance when currency changes
  useEffect(() => {
    const convertBalance = async () => {
      try {
        const converted = await convertCurrency(baseBalance, 'USD', currency);
        setConvertedBalance(converted);
      } catch (error) {
        console.error('Currency conversion failed:', error);
        setConvertedBalance(baseBalance);
      }
    };
    
    convertBalance();
  }, [currency, baseBalance]);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [email, setEmail] = useState('diyorbekolimov2000@gmail.com');
  const [password, setPassword] = useState('');
  const [publicKey] = useState('0xA200bAf5f5e950eF307871d831...');

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [steamConnected, setSteamConnected] = useState(false);
  const [twitterConnected, setTwitterConnected] = useState(false);
  const [twitchConnected, setTwitchConnected] = useState(false);
  const [convertedBalance, setConvertedBalance] = useState(baseBalance);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <Navbar />

      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full lg:w-80 bg-white dark:bg-gray-800 rounded-xl p-4 lg:p-6 h-fit shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 lg:space-y-2 lg:grid-cols-none">
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center justify-center lg:justify-start gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg transition text-sm lg:text-base ${
                  activeTab === 'settings' ? 'bg-primary-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="hidden lg:inline">{t.profileSettings}</span>
                <span className="lg:hidden text-xs">{language === 'uz' ? 'Profil' : language === 'ru' ? 'Профиль' : 'Profile'}</span>
              </button>

              <button
                onClick={() => setActiveTab('balance')}
                className={`w-full flex items-center justify-center lg:justify-start gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg transition text-sm lg:text-base ${
                  activeTab === 'balance' ? 'bg-primary-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="hidden lg:inline">{t.languageAndCurrency}</span>
                <span className="lg:hidden text-xs">{language === 'uz' ? 'Til' : language === 'ru' ? 'Язык' : 'Lang'}</span>
              </button>

              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                {t.twoFA}
              </button>

              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                </svg>
                Steam account
              </button>

              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
                Twitter account
              </button>

              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6.857 4.714h1.715v5.143H6.857z"/>
                </svg>
                Twitch account
              </button>

              <div className="border-t border-gray-700 my-4"></div>

              <button
                onClick={() => setActiveTab('history')}
                className={`w-full flex items-center justify-center lg:justify-start gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg transition text-sm lg:text-base ${
                  activeTab === 'history' ? 'bg-primary-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="hidden lg:inline">{t.paymentHistory}</span>
                <span className="lg:hidden text-xs">{language === 'uz' ? 'Tarix' : language === 'ru' ? 'История' : 'History'}</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'settings' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="mb-6 lg:mb-8">
                  <h1 className="text-2xl lg:text-3xl font-bold text-green-600 dark:text-green-400">{t.profileSettings}</h1>
                </div>

                {/* Profile Image */}
                <div className="mb-8">
                  <label className="block text-gray-600 dark:text-gray-400 text-sm mb-4">{t.profileImage.toUpperCase()}</label>
                  <div className="flex flex-col sm:flex-row items-center gap-4 lg:gap-6">
                    <div className="w-24 h-24 lg:w-32 lg:h-32 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                      {profileImage ? (
                        <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <svg className="w-16 h-16 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                        {t.imageRecommendation}
                      </p>
                      <label className="px-6 py-3 bg-green-500 text-white rounded-lg cursor-pointer hover:bg-green-600 transition inline-block">
                        {t.uploadFile}
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="mb-8">
                  <label className="block text-gray-600 dark:text-gray-400 text-sm mb-2">{t.yourEmail.toUpperCase()}</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-600"
                    />
                    <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  </div>
                </div>

                {/* Password */}
                <div className="mb-8">
                  <label className="block text-gray-600 dark:text-gray-400 text-sm mb-2">{t.password.toUpperCase()}</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="password"
                      value={password}
                      placeholder={t.password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="flex-1 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-600"
                    />
                    <button className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium">
                      {t.setPassword}
                    </button>
                  </div>
                </div>

                {/* Public Key */}
                <div className="mb-8">
                  <label className="block text-gray-400 text-sm mb-2">{t.publicKey.toUpperCase()}</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={publicKey}
                      readOnly
                      className="flex-1 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none"
                    />
                    <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>


              </div>
            )}

            {activeTab === 'balance' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 lg:p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-6 lg:mb-8">{t.languageAndCurrency}</h1>
                
                {/* Balance Card */}
                <div className="bg-gradient-to-br from-primary-600 to-blue-600 rounded-xl p-6 mb-6">
                  <div className="text-white/80 text-sm mb-2">{t.availableBalance}</div>
                  <div className="text-4xl font-bold text-white mb-4">
                    {formatPrice(convertedBalance, currency)}
                  </div>
                  <div className="flex gap-3">
                    <button className="px-6 py-2 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition">
                      {t.deposit}
                    </button>
                    <button className="px-6 py-2 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition">
                      {t.withdraw}
                    </button>
                  </div>
                </div>

                {/* Settings */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-600 dark:text-gray-400 text-sm mb-2">{t.preferredCurrency}</label>
                    <select 
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value as any)}
                      className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-600"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="UZS">UZS - Uzbek Som</option>
                      <option value="RUB">RUB - Russian Ruble</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-600 dark:text-gray-400 text-sm mb-2">{t.language}</label>
                    <select 
                      value={language}
                      onChange={(e) => setLanguage(e.target.value as any)}
                      className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-600"
                    >
                      <option value="uz">🇺🇿 O'zbek</option>
                      <option value="ru">🇷🇺 Русский</option>
                      <option value="en">🇬🇧 English</option>
                    </select>
                  </div>



                  {/* Theme Toggle Buttons */}
                  <div>
                    <label className="block text-gray-600 dark:text-gray-400 text-sm mb-3">{t.quickThemeSwitch}</label>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setTheme('light')}
                        className={`flex-1 px-4 py-3 rounded-lg border-2 transition ${
                          theme === 'light' 
                            ? 'border-primary-600 bg-primary-600/20 text-primary-600 dark:text-primary-400' 
                            : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-xl">☀️</span>
                          <span>{t.light}</span>
                        </div>
                      </button>
                      
                      <button
                        onClick={() => setTheme('dark')}
                        className={`flex-1 px-4 py-3 rounded-lg border-2 transition ${
                          theme === 'dark' 
                            ? 'border-primary-600 bg-primary-600/20 text-primary-400' 
                            : 'border-gray-600 text-gray-400 hover:border-gray-500'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-xl">🌙</span>
                          <span>{t.dark}</span>
                        </div>
                      </button>
                      
                      <button
                        onClick={() => setTheme('system')}
                        className={`flex-1 px-4 py-3 rounded-lg border-2 transition ${
                          theme === 'system' 
                            ? 'border-primary-600 bg-primary-600/20 text-primary-400' 
                            : 'border-gray-600 text-gray-400 hover:border-gray-500'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-xl">🖥️</span>
                          <span>{t.auto}</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 lg:p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-6 lg:mb-8">{t.paymentHistory}</h1>
                
                {/* Filters */}
                <div className="flex flex-wrap gap-2 lg:gap-4 mb-4 lg:mb-6">
                  <button className="px-3 lg:px-4 py-2 bg-primary-600 text-white rounded-lg text-sm lg:text-base">{t.all}</button>
                  <button className="px-3 lg:px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 text-sm lg:text-base">{t.deposits}</button>
                  <button className="px-3 lg:px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 text-sm lg:text-base">{t.withdrawals}</button>
                  <button className="px-3 lg:px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 text-sm lg:text-base">{t.purchases}</button>
                </div>

                {/* Transaction List */}
                <div className="space-y-3">
                  {[
                    { type: 'deposit', amount: '+$100.00', method: 'Payme', date: '2024-12-09 14:30', status: 'completed' },
                    { type: 'purchase', amount: '-$45.99', method: 'Balance', date: '2024-12-08 18:15', status: 'completed' },
                    { type: 'withdrawal', amount: '-$50.00', method: 'Click', date: '2024-12-07 10:20', status: 'pending' },
                    { type: 'deposit', amount: '+$200.00', method: 'VISA', date: '2024-12-06 16:45', status: 'completed' },
                  ].map((transaction, index) => (
                    <div key={index} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 lg:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:bg-gray-200 dark:hover:bg-gray-650 transition border border-gray-200 dark:border-gray-600 gap-3 sm:gap-0">
                      <div className="flex items-center gap-3 lg:gap-4">
                        <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center ${
                          transaction.type === 'deposit' ? 'bg-green-500/20 text-green-600 dark:text-green-500' :
                          transaction.type === 'withdrawal' ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-500' :
                          'bg-blue-500/20 text-blue-600 dark:text-blue-500'
                        }`}>
                          {transaction.type === 'deposit' ? '↓' : transaction.type === 'withdrawal' ? '↑' : '🛒'}
                        </div>
                        <div>
                          <div className="text-gray-900 dark:text-white font-semibold text-sm lg:text-base">
                            {transaction.type === 'deposit' ? t.deposit : 
                             transaction.type === 'withdrawal' ? t.withdrawal : 
                             t.purchase}
                          </div>
                          <div className="text-gray-600 dark:text-gray-400 text-xs lg:text-sm">{transaction.method} • {transaction.date}</div>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <div className={`text-base lg:text-lg font-bold ${
                          transaction.amount.startsWith('+') ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'
                        }`}>
                          {transaction.amount}
                        </div>
                        <div className={`text-xs lg:text-sm ${
                          transaction.status === 'completed' ? 'text-green-600 dark:text-green-500' : 'text-yellow-600 dark:text-yellow-500'
                        }`}>
                          {transaction.status === 'completed' ? t.completed : t.pending}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
