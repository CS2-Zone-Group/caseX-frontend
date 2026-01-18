"use client";

import { useEffect, useState } from "react";
import { NextIntlClientProvider } from "next-intl";
import { useAuthStore } from "@/store/authStore";
import { useSettingsStore } from "@/store/settingsStore";
import ChatSupport from "@/components/ChatSupport";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [locale, setLocale] = useState("uz");
  const [messages, setMessages] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Rehydrate stores and set hydration state
    const rehydrateStores = async () => {
      await useAuthStore.persist.rehydrate();
      await useSettingsStore.persist.rehydrate();

      useAuthStore.getState().setHasHydrated(true);
      
      // localStorage dan tilni olish
      const savedLanguage = typeof window !== 'undefined' ? localStorage.getItem('language') || 'uz' : 'uz';
      setLocale(savedLanguage);
      
      // Tarjima fayllarini yuklash
      try {
        const messagesModule = await import(`../messages/${savedLanguage}.json`);
        setMessages(messagesModule.default);
      } catch (error) {
        console.error('Failed to load messages:', error);
        const fallbackMessages = await import('../messages/uz.json');
        setMessages(fallbackMessages.default);
      }
      
      setIsLoaded(true);
    };

    rehydrateStores();

    const applyTheme = () => {
      const { theme } = useSettingsStore.getState();
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");

      if (theme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
          .matches
          ? "dark"
          : "light";
        root.classList.add(systemTheme);
      } else {
        root.classList.add(theme);
      }
    };

    setTimeout(applyTheme, 0);

    import("@/lib/currency").then(({ getExchangeRates }) => {
      getExchangeRates().catch(console.error);
    });
  }, []);

  // Til o'zgarishini kuzatish
  useEffect(() => {
    const handleLanguageChange = async (event: Event) => {
      const customEvent = event as CustomEvent;
      const newLanguage = customEvent.detail;
      setLocale(newLanguage);
      
      try {
        const messagesModule = await import(`../messages/${newLanguage}.json`);
        setMessages(messagesModule.default);
      } catch (error) {
        console.error('Failed to load messages:', error);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('languageChange', handleLanguageChange);
      
      return () => {
        window.removeEventListener('languageChange', handleLanguageChange);
      };
    }
  }, []);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
      <ChatSupport />
    </NextIntlClientProvider>
  );
}
