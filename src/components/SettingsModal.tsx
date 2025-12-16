'use client';

import { useState, useEffect } from 'react';
import { useSettingsStore, Theme, Language, Currency } from '@/store/settingsStore';
import { translations } from '@/lib/translations';
import { getExchangeRates } from '@/lib/currency';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { theme, language, currency, setTheme, setLanguage, setCurrency } = useSettingsStore();
  const t = translations[language];
  const [rates, setRates] = useState({ UZS: 1, USD: 12750, RUB: 127 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadRates();
    }
  }, [isOpen]);

  const loadRates = async () => {
    setLoading(true);
    try {
      const newRates = await getExchangeRates();
      setRates(newRates);
    } catch (error) {
      console.error('Failed to load rates:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {language === 'uz' ? 'Sozlamalar' : language === 'ru' ? 'Настройки' : 'Settings'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* Theme */}
          <div>
            <label className="block text-sm font-medium mb-2">
              {language === 'uz' ? 'Mavzu' : language === 'ru' ? 'Тема' : 'Theme'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['light', 'dark', 'system'] as Theme[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`px-4 py-2 rounded-lg border transition ${
                    theme === t
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {t === 'light' ? (language === 'uz' ? 'Yorug\'' : language === 'ru' ? 'Светлая' : 'Light') :
                   t === 'dark' ? (language === 'uz' ? 'Qorong\'i' : language === 'ru' ? 'Темная' : 'Dark') :
                   (language === 'uz' ? 'Tizim' : language === 'ru' ? 'Система' : 'System')}
                </button>
              ))}
            </div>
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-medium mb-2">
              {language === 'uz' ? 'Til' : language === 'ru' ? 'Язык' : 'Language'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['uz', 'ru', 'en'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-4 py-2 rounded-lg border transition ${
                    language === lang
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {lang === 'uz' ? 'O\'zbek' : lang === 'ru' ? 'Русский' : 'English'}
                </button>
              ))}
            </div>
          </div>

          {/* Currency */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">
                {language === 'uz' ? 'Valyuta' : language === 'ru' ? 'Валюта' : 'Currency'}
              </label>
              {loading && (
                <span className="text-xs text-gray-500">
                  {language === 'uz' ? 'Yangilanmoqda...' : language === 'ru' ? 'Обновление...' : 'Updating...'}
                </span>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {(['UZS', 'USD', 'RUB'] as Currency[]).map((curr) => (
                <button
                  key={curr}
                  onClick={() => setCurrency(curr)}
                  className={`px-4 py-2 rounded-lg border transition ${
                    currency === curr
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>
            {/* Exchange Rates */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-1">
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                {language === 'uz' ? 'Joriy kurslar (CBU):' : language === 'ru' ? 'Текущие курсы (ЦБУ):' : 'Current rates (CBU):'}
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium">1 USD</span>
                <span className="text-gray-600 dark:text-gray-400">
                  {rates.USD.toLocaleString('uz-UZ')} so'm
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium">1 RUB</span>
                <span className="text-gray-600 dark:text-gray-400">
                  {rates.RUB.toLocaleString('uz-UZ')} so'm
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-2 text-center">
                {language === 'uz' ? 'Asosiy valyuta: UZS (O\'zbek so\'mi)' : 
                 language === 'ru' ? 'Базовая валюта: UZS (Узбекский сум)' : 
                 'Base currency: UZS (Uzbek Som)'}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
        >
          {language === 'uz' ? 'Saqlash' : language === 'ru' ? 'Сохранить' : 'Save'}
        </button>
      </div>
    </div>
  );
}
