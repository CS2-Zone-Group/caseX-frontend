import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const locales = ["uz", "en", "ru"] as const;

export const routing = defineRouting({
  locales: locales,
  defaultLocale: "uz",
  localePrefix: "as-needed",
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
