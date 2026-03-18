"use client";

import { useState, useEffect, Suspense } from "react";
import { useSettingsStore } from "@/store/settingsStore";
import { useTranslations } from 'next-intl';
import Navbar from "@/components/Navbar";
import ProfileSidebar from "@/components/ProfileSidebar";
import { changeLanguage, getCurrentLanguage } from "@/lib/language";

function SystemSettingsContent() {
  const [currentLanguage, setCurrentLanguage] = useState(getCurrentLanguage());
  const { currency, theme, setCurrency, setTheme } = useSettingsStore();
  const t = useTranslations('ProfilePage');
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => {
    document.title = `${t('systemSettings')} - CaseX`;
  }, [t]);

  const showSaved = (key: string) => {
    setSaved(key);
    setTimeout(() => setSaved(null), 1500);
  };

  const currencies = [
    { value: 'USD', label: 'US Dollar', symbol: '$', flag: '🇺🇸' },
    { value: 'UZS', label: 'Uzbek Som', symbol: "so'm", flag: '🇺🇿' },
    { value: 'RUB', label: 'Russian Ruble', symbol: '₽', flag: '🇷🇺' },
  ];

  const languages = [
    { code: 'uz', flag: '🇺🇿', label: "O'zbekcha", sub: "O'zbek tili" },
    { code: 'ru', flag: '🇷🇺', label: 'Русский', sub: 'Русский язык' },
    { code: 'en', flag: '🇬🇧', label: 'English', sub: 'English language' },
  ];

  const themes = [
    {
      value: 'light',
      label: t('light'),
      sub: t('lightDescription') || 'Yorqin fon',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      bg: 'from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20',
      activeBorder: 'border-amber-400 dark:border-amber-500',
      activeText: 'text-amber-600 dark:text-amber-400',
    },
    {
      value: 'dark',
      label: t('dark'),
      sub: t('darkDescription') || 'Qorong\'i fon',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ),
      bg: 'from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20',
      activeBorder: 'border-indigo-400 dark:border-indigo-500',
      activeText: 'text-indigo-600 dark:text-indigo-400',
    },
    {
      value: 'system',
      label: t('auto'),
      sub: t('autoDescription') || 'Tizimga mos',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      bg: 'from-gray-50 to-slate-50 dark:from-gray-800/40 dark:to-slate-800/40',
      activeBorder: 'border-gray-400 dark:border-gray-500',
      activeText: 'text-gray-600 dark:text-gray-400',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />

      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="flex flex-col lg:flex-row gap-6">
          <ProfileSidebar activeTab="system" />

          <div className="flex-1 space-y-6">
            {/* Currency Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 lg:p-8 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('preferredCurrency')}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('currencyDescription') || 'Narxlar tanlangan valyutada ko\'rsatiladi'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {currencies.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => { setCurrency(c.value as any); showSaved('currency'); }}
                    className={`relative group p-4 rounded-xl border-2 transition-all duration-200 ${
                      currency === c.value
                        ? 'border-primary-500 bg-primary-500/5 dark:bg-primary-500/10 shadow-md shadow-primary-500/10'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{c.flag}</span>
                      <div className="text-left">
                        <div className="font-semibold text-gray-900 dark:text-white">{c.value}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{c.label}</div>
                      </div>
                      <div className="ml-auto text-lg font-mono text-gray-400 dark:text-gray-500">{c.symbol}</div>
                    </div>
                    {currency === c.value && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              {saved === 'currency' && (
                <div className="mt-3 text-sm text-green-500 flex items-center gap-1 animate-pulse">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Saqlandi
                </div>
              )}
            </div>

            {/* Language Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 lg:p-8 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('language')}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('languageDescription') || 'Interfeys tilini tanlang'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      changeLanguage(lang.code);
                      setCurrentLanguage(lang.code);
                      showSaved('lang');
                    }}
                    className={`relative group p-4 rounded-xl border-2 transition-all duration-200 ${
                      currentLanguage === lang.code
                        ? 'border-blue-500 bg-blue-500/5 dark:bg-blue-500/10 shadow-md shadow-blue-500/10'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{lang.flag}</span>
                      <div className="text-left">
                        <div className="font-semibold text-gray-900 dark:text-white">{lang.label}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{lang.sub}</div>
                      </div>
                    </div>
                    {currentLanguage === lang.code && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              {saved === 'lang' && (
                <div className="mt-3 text-sm text-green-500 flex items-center gap-1 animate-pulse">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Saqlandi
                </div>
              )}
            </div>

            {/* Theme Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 lg:p-8 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('quickThemeSwitch')}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('themeDescription') || 'Tashqi ko\'rinishni sozlang'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {themes.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setTheme(opt.value as any); showSaved('theme'); }}
                    className={`relative group p-4 rounded-xl border-2 transition-all duration-200 ${
                      theme === opt.value
                        ? `${opt.activeBorder} bg-gradient-to-br ${opt.bg} shadow-md`
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        theme === opt.value ? opt.activeText : 'text-gray-500 dark:text-gray-400'
                      } ${
                        opt.value === 'light' ? 'bg-amber-100 dark:bg-amber-900/30' :
                        opt.value === 'dark' ? 'bg-indigo-100 dark:bg-indigo-900/30' :
                        'bg-gray-100 dark:bg-gray-700'
                      }`}>
                        {opt.icon}
                      </div>
                      <div className="text-left">
                        <div className={`font-semibold transition-colors ${
                          theme === opt.value ? opt.activeText : 'text-gray-900 dark:text-white'
                        }`}>{opt.label}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{opt.sub}</div>
                      </div>
                    </div>
                    {theme === opt.value && (
                      <div className={`absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center ${
                        opt.value === 'light' ? 'bg-amber-500' : opt.value === 'dark' ? 'bg-indigo-500' : 'bg-gray-500'
                      }`}>
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              {saved === 'theme' && (
                <div className="mt-3 text-sm text-green-500 flex items-center gap-1 animate-pulse">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Saqlandi
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SystemSettingsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <SystemSettingsContent />
    </Suspense>
  );
}
