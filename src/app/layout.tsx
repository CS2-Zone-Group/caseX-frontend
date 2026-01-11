'use client';

import { useEffect } from 'react';
import { Inter } from 'next/font/google';
import { useAuthStore } from '@/store/authStore';
import { useSettingsStore } from '@/store/settingsStore';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Chat } from './chat/page';
import { useChatStore } from '@/store/useChatStore';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const rehydrateStores = async () => {
      await useAuthStore.persist.rehydrate();
      await useSettingsStore.persist.rehydrate();
      
      // Mark auth store as hydrated
      useAuthStore.getState().setHasHydrated(true);
    };
    
    rehydrateStores();
    
    // Apply theme after rehydration with a small delay to prevent hydration mismatch
    const applyTheme = () => {
     
      const { theme } = useSettingsStore.getState();
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');

      if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
        root.classList.add(systemTheme);
      } else {
        root.classList.add(theme);
      }
    };

    // Use setTimeout to prevent hydration mismatch
    setTimeout(applyTheme, 0);
    
    // Fetch exchange rates
    import('@/lib/currency').then(({ getExchangeRates }) => {
      getExchangeRates().catch(console.error);
    });
  }, []);

  const isChatOpen=useChatStore((state)=>state.isChatOpen)
  const closeChat=useChatStore((state)=>state.closeChat)

  return (
    <html lang="uz" className="dark">
      <body className={inter.className} suppressHydrationWarning={true}>
        <LanguageProvider>
          {children}
          <Chat isOpen={isChatOpen} closeChat={closeChat} />
        </LanguageProvider>
      </body>
    </html>
  );
}
