'use client';

import { useEffect } from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import { useAuthStore } from '@/store/authStore';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    useAuthStore.persist.rehydrate();
  }, []);

  return (
    <html lang="uz">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
