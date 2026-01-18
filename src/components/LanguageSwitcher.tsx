"use client";

import { useState, useEffect } from "react";
import { locales } from "@/i18n/routing";
import { changeLanguage, getCurrentLanguage } from "@/lib/language";

const languageLabels = {
  uz: "🇺🇿 O'zbek",
  en: "🇺🇸 English",
  ru: "🇷🇺 Русский",
} as const;

export default function LanguageSwitcher() {
  const [currentLanguage, setCurrentLanguage] = useState(getCurrentLanguage());

  useEffect(() => {
    const handleLanguageChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      setCurrentLanguage(customEvent.detail);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('languageChange', handleLanguageChange);
      
      return () => {
        window.removeEventListener('languageChange', handleLanguageChange);
      };
    }
  }, []);

  const handleLanguageChange = (locale: string) => {
    changeLanguage(locale);
    setCurrentLanguage(locale);
  };

  return (
    <div className="flex gap-4">
      {locales.map((locale) => (
        <button
          key={locale}
          onClick={() => handleLanguageChange(locale)}
          className={`px-4 py-2 rounded-lg transition ${
            currentLanguage === locale
              ? "bg-primary-600 text-white"
              : "bg-gray-200 dark:bg-gray-700"
          }`}
        >
          {languageLabels[locale]}
        </button>
      ))}
    </div>
  );
}
