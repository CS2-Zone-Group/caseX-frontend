"use client";

import { useState, useEffect, Suspense } from "react";
import { useSettingsStore } from "@/store/settingsStore";
import { useAuthStore } from "@/store/authStore";
import { useTranslations } from 'next-intl';
import { convertCurrency, formatPrice, getExchangeRates } from "@/lib/currency";
import Navbar from "@/components/Navbar";
import ProfileSidebar from "@/components/ProfileSidebar";
import { changeLanguage, getCurrentLanguage } from "@/lib/language";

function ProfileBalanceContent() {
  const [currentLanguage, setCurrentLanguage] = useState(getCurrentLanguage());
  const { currency, theme, setCurrency, setTheme } = useSettingsStore();
  const { user, fetchUserBalance } = useAuthStore();
  const t = useTranslations('ProfilePage');

  const baseBalance = user?.balance || 0;
  const [convertedBalance, setConvertedBalance] = useState(baseBalance);
  const [exchangeRates, setExchangeRates] = useState<{
    USD: number;
    UZS: number;
    RUB: number;
  } | null>(null);
  const [ratesLoading, setRatesLoading] = useState(false);

  useEffect(() => {
    document.title = `${t('languageAndCurrency')} - CaseX`;
  }, [t]);

  // Fetch user balance when component mounts
  useEffect(() => {
    if (user?.id) {
      const { fetchUserBalance } = useAuthStore.getState();
      fetchUserBalance();
    }
  }, [user?.id]);

  // Convert balance when currency changes
  useEffect(() => {
    const convertBalance = async () => {
      try {
        const converted = await convertCurrency(baseBalance, "USD", currency);
        setConvertedBalance(converted);
      } catch (error) {
        console.error("Currency conversion failed:", error);
        setConvertedBalance(baseBalance);
      }
    };

    convertBalance();
  }, [currency, baseBalance]);

  // Fetch exchange rates when component mounts
  useEffect(() => {
    const fetchRates = async () => {
      setRatesLoading(true);
      try {
        const rates = await getExchangeRates();
        setExchangeRates(rates);
      } catch (error) {
        console.error("Failed to fetch exchange rates:", error);
      } finally {
        setRatesLoading(false);
      }
    };

    fetchRates();

    // Refresh rates every 5 minutes
    const interval = setInterval(fetchRates, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />

      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="flex flex-col lg:flex-row gap-6">
          <ProfileSidebar activeTab="balance" />

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 lg:p-8 shadow-lg border border-gray-200 dark:border-gray-700">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-6 lg:mb-8">
                {t('languageAndCurrency')}
              </h1>

              {/* Balance and Exchange Rates Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Balance Card */}
                <div className="bg-gradient-to-br from-primary-600 to-blue-600 rounded-xl p-6">
                  <div className="text-white/80 text-sm mb-2">{t('availableBalance')}</div>
                  <div className="text-4xl font-bold text-white mb-4">
                    {formatPrice(convertedBalance, currency)}
                  </div>
                  <div className="flex gap-3">
                    <button className="px-6 py-2 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition">
                      {t('deposit')}
                    </button>
                    <button className="px-6 py-2 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition">
                      {t('withdraw')}
                    </button>
                  </div>
                </div>

                {/* Exchange Rates Card */}
                <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {t('centralBankRates')}
                    </h3>
                    {ratesLoading && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {exchangeRates ? (
                      <>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">🇺🇸</span>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">USD</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">US Dollar</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-900 dark:text-white">
                              {exchangeRates.UZS.toLocaleString("uz-UZ")} so'm
                            </div>
                            <div className="text-xs text-green-600 dark:text-green-400">
                              {t('centralBank')}
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">🇷🇺</span>
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white">RUB</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Russian Ruble</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-gray-900 dark:text-white">
                                {exchangeRates.RUB.toLocaleString("uz-UZ")} so'm
                              </div>
                              <div className="text-xs text-green-600 dark:text-green-400">
                                {t('centralBank')}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                            {t('ratesUpdateInfo')}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-gray-500 dark:text-gray-400 text-sm">
                          {t('loadingRates')}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Settings */}
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-600 dark:text-gray-400 text-sm mb-2">
                    {t('preferredCurrency')}
                  </label>
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
                  <label className="block text-gray-600 dark:text-gray-400 text-sm mb-2">
                    {t('language')}
                  </label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        changeLanguage('uz');
                        setCurrentLanguage('uz');
                      }}
                      className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg border transition ${
                        currentLanguage === 'uz'
                          ? "border-primary-600 bg-primary-600/20 text-primary-600 dark:text-primary-400"
                          : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500"
                      }`}
                    >
                      <span>🇺🇿 O'zbek</span>
                      {currentLanguage === 'uz' && <span className="ml-2">✓</span>}
                    </button>
                    <button
                      onClick={() => {
                        changeLanguage('ru');
                        setCurrentLanguage('ru');
                      }}
                      className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg border transition ${
                        currentLanguage === 'ru'
                          ? "border-primary-600 bg-primary-600/20 text-primary-600 dark:text-primary-400"
                          : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500"
                      }`}
                    >
                      <span>🇷🇺 Русский</span>
                      {currentLanguage === 'ru' && <span className="ml-2">✓</span>}
                    </button>
                    <button
                      onClick={() => {
                        changeLanguage('en');
                        setCurrentLanguage('en');
                      }}
                      className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg border transition ${
                        currentLanguage === 'en'
                          ? "border-primary-600 bg-primary-600/20 text-primary-600 dark:text-primary-400"
                          : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500"
                      }`}
                    >
                      <span>🇬🇧 English</span>
                      {currentLanguage === 'en' && <span className="ml-2">✓</span>}
                    </button>
                  </div>
                </div>

                {/* Theme Toggle Buttons */}
                <div>
                  <label className="block text-gray-600 dark:text-gray-400 text-sm mb-3">
                    {t('quickThemeSwitch')}
                  </label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setTheme("light")}
                      className={`flex-1 px-4 py-3 rounded-lg border-2 transition ${
                        theme === "light"
                          ? "border-primary-600 bg-primary-600/20 text-primary-600 dark:text-primary-400"
                          : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500"
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-xl">☀️</span>
                        <span>{t('light')}</span>
                      </div>
                    </button>

                    <button
                      onClick={() => setTheme("dark")}
                      className={`flex-1 px-4 py-3 rounded-lg border-2 transition ${
                        theme === "dark"
                          ? "border-primary-600 bg-primary-600/20 text-primary-400"
                          : "border-gray-600 text-gray-400 hover:border-gray-500"
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-xl">🌙</span>
                        <span>{t('dark')}</span>
                      </div>
                    </button>

                    <button
                      onClick={() => setTheme("system")}
                      className={`flex-1 px-4 py-3 rounded-lg border-2 transition ${
                        theme === "system"
                          ? "border-primary-600 bg-primary-600/20 text-primary-400"
                          : "border-gray-600 text-gray-400 hover:border-gray-500"
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-xl">🖥️</span>
                        <span>{t('auto')}</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfileBalancePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <ProfileBalanceContent />
    </Suspense>
  );
}