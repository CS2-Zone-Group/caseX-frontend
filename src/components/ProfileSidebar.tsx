"use client";

import Link from "next/link";
import { useTranslations } from 'next-intl';

interface ProfileSidebarProps {
  activeTab: "settings" | "balance" | "history";
}

export default function ProfileSidebar({ activeTab }: ProfileSidebarProps) {
  const t = useTranslations('ProfilePage');

  return (
    <div className="w-full lg:w-80 bg-white dark:bg-gray-800 rounded-xl p-4 lg:p-6 h-fit shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="grid grid-cols-2 gap-2 lg:space-y-2 lg:grid-cols-none">
        <Link
          href="/profile/settings"
          className={`w-full flex items-center justify-center lg:justify-start gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg transition text-sm lg:text-base ${
            activeTab === "settings"
              ? "bg-primary-600 text-white"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="hidden lg:inline">{t('profileSettings')}</span>
          <span className="lg:hidden text-xs">{t('profileShort')}</span>
        </Link>

        <Link
          href="/profile/balance"
          className={`w-full flex items-center justify-center lg:justify-start gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg transition text-sm lg:text-base ${
            activeTab === "balance"
              ? "bg-primary-600 text-white"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="hidden lg:inline">{t('languageAndCurrency')}</span>
          <span className="lg:hidden text-xs">{t('languageShort')}</span>
        </Link>

        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          {t('twoFA')}
        </button>

        <div className="border-t border-gray-700 my-4"></div>

        <Link
          href="/profile/history"
          className={`w-full flex items-center justify-center lg:justify-start gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg transition text-sm lg:text-base ${
            activeTab === "history"
              ? "bg-primary-600 text-white"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span className="hidden lg:inline">{t('paymentHistory')}</span>
          <span className="lg:hidden text-xs">{t('historyShort')}</span>
        </Link>
      </div>
    </div>
  );
}