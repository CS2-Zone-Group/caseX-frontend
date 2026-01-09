"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useSettingsStore } from "@/store/settingsStore";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Rehydrate stores and set hydration state
    const rehydrateStores = async () => {
      await useAuthStore.persist.rehydrate();
      await useSettingsStore.persist.rehydrate();

      useAuthStore.getState().setHasHydrated(true);
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

  return <>{children}</>;
}
