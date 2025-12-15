'use client';

import { useEffect } from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import { useAuthStore } from '@/store/authStore';
import { useSettingsStore } from '@/store/settingsStore';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Rehydrate stores
    useAuthStore.persist.rehydrate();
    useSettingsStore.persist.rehydrate();
    
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

  return (
    <html lang="uz" className="dark">
      <body className={inter.className} suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
