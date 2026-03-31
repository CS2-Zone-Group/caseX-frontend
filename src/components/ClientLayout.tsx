"use client";

import { useEffect, useState } from "react";
import { NextIntlClientProvider } from "next-intl";
import { useAuthStore } from "@/store/authStore";
import { useSettingsStore } from "@/store/settingsStore";
import { useTelegramStore } from "@/store/telegramStore";
import { isTelegramWebApp, getTelegramInitData } from "@/lib/telegram";
import api from "@/lib/api";
import ChatSupport from "@/components/ChatSupport";
import Loader from "@/components/Loader";
import ToastContainer from "@/components/ToastContainer";
import { LanguageProvider } from "@/contexts/LanguageContext";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [locale, setLocale] = useState("uz");
  const [messages, setMessages] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Capture referral code from URL globally
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      const refCode = url.searchParams.get('ref');
      if (refCode) {
        localStorage.setItem('pending_referral_code', refCode);
      }
    }
  }, []);

  useEffect(() => {
    // Rehydrate stores and set hydration state
    const rehydrateStores = async () => {
      await useAuthStore.persist.rehydrate();
      await useSettingsStore.persist.rehydrate();

      useAuthStore.getState().setHasHydrated(true);

      // settingsStore dan tilni olish (primary source)
      const settingsLanguage = useSettingsStore.getState().language;
      // Eski localStorage 'language' key dan ham tekshirish (backward compat)
      const legacyLanguage = typeof window !== 'undefined' ? localStorage.getItem('language') : null;

      // settingsStore ga ustunlik berish, lekin agar bo'sh bo'lsa legacy dan olish
      const resolvedLanguage = settingsLanguage || legacyLanguage || 'uz';
      setLocale(resolvedLanguage);

      // Sinxronlash: ikkala joyda ham bir xil qiymat bo'lishi kerak
      if (typeof window !== 'undefined') {
        localStorage.setItem('language', resolvedLanguage);
      }
      if (settingsLanguage !== resolvedLanguage) {
        useSettingsStore.getState().setLanguage(resolvedLanguage as any);
      }

      // Tarjima fayllarini yuklash
      try {
        const messagesModule = await import(`../messages/${resolvedLanguage}.json`);
        setMessages(messagesModule.default);
      } catch (error) {
        console.error('Failed to load messages:', error);
        const fallbackMessages = await import('../messages/uz.json');
        setMessages(fallbackMessages.default);
      }

      setIsLoaded(true);

      // Telegram Mini App detection and auto-login
      try {
        if (isTelegramWebApp()) {
          useTelegramStore.getState().setIsTelegramApp(true);

          const tgWebApp = window.Telegram?.WebApp;
          if (tgWebApp) {
            tgWebApp.ready();
            tgWebApp.expand();

            // Apply Telegram theme
            const tgColorScheme = tgWebApp.colorScheme;
            if (tgColorScheme) {
              const root = window.document.documentElement;
              root.classList.remove("light", "dark");
              root.classList.add(tgColorScheme);
              useSettingsStore.getState().setTheme(tgColorScheme as any);
            }

            // Auto-login if no valid auth token exists
            const existingToken = useAuthStore.getState().token;
            if (!existingToken) {
              const initData = getTelegramInitData();
              if (initData) {
                api.post('/auth/telegram', { initData })
                  .then((response) => {
                    const { token: newToken, user: userData } = response.data;
                    if (newToken && userData) {
                      useAuthStore.getState().setAuth(userData, newToken);
                      // Apply pending referral code
                      const pendingRef = localStorage.getItem('pending_referral_code');
                      if (pendingRef) {
                        api.post('/referral/apply', { code: pendingRef }).catch(() => {});
                        localStorage.removeItem('pending_referral_code');
                      }
                    }
                  })
                  .catch((err) => {
                    console.warn('Telegram auto-login failed:', err?.message || err);
                  });
              }
            }
          }
        }
      } catch (err) {
        console.warn('Telegram Mini App initialization failed:', err);
      }
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

      // localStorage ni ham yangilash
      if (typeof window !== 'undefined') {
        localStorage.setItem('language', newLanguage);
      }

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
    return <Loader fullScreen size="lg" />;
  }

  return (
    <LanguageProvider>
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
        <ChatSupport />
        <ToastContainer />
      </NextIntlClientProvider>
    </LanguageProvider>
  );
}
