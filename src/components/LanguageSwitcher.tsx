"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { locales } from "@/i18n/routing";

const languageLabels = {
  uz: "🇺🇿 O'zbek",
  en: "🇺🇸 English",
  ru: "🇷🇺 Русский",
} as const;

export default function LanguageSwitcher() {
  const currentLocale = useLocale();
  const pathname = usePathname();

  return (
    <div className="flex gap-4">
      {locales.map((locale) => (
        <Link
          key={locale}
          href={pathname}
          locale={locale}
          scroll={false}
          className={`px-4 py-2 rounded-lg transition ${
            currentLocale === locale
              ? "bg-primary-600 text-white"
              : "bg-gray-200 dark:bg-gray-700"
          }`}
        >
          {languageLabels[locale]}
        </Link>
      ))}
    </div>
  );
}
