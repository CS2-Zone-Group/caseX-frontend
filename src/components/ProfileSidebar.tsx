"use client";

import Link from "next/link";
import { useTranslations } from 'next-intl';

interface ProfileSidebarProps {
  activeTab: "settings" | "system" | "balance";
}

export default function ProfileSidebar({ activeTab }: ProfileSidebarProps) {
  const t = useTranslations('ProfilePage');

  const tabs = [
    {
      key: 'settings' as const,
      href: '/profile/settings',
      label: t('profileSettings'),
      shortLabel: t('profileShort'),
      icon: (
        <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      key: 'system' as const,
      href: '/profile/system',
      label: t('systemSettings'),
      shortLabel: t('systemShort'),
      icon: (
        <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      key: 'balance' as const,
      href: '/profile/balance',
      label: t('balanceAndPayments'),
      shortLabel: t('balanceShort'),
      icon: (
        <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="w-full lg:w-80 bg-white dark:bg-gray-800 rounded-xl p-4 lg:p-6 h-fit shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="grid grid-cols-3 gap-2 lg:grid-cols-none lg:space-y-2">
        {tabs.map((tab) => (
          <Link
            key={tab.key}
            href={tab.href}
            className={`w-full flex items-center justify-center lg:justify-start gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg transition text-sm lg:text-base ${
              activeTab === tab.key
                ? "bg-primary-600 text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            {tab.icon}
            <span className="hidden lg:inline">{tab.label}</span>
            <span className="lg:hidden text-xs">{tab.shortLabel}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
