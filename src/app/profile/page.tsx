"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function ProfilePage() {
  const router = useRouter();
  const t = useTranslations("ProfilePage");

  useEffect(() => {
    // Redirect to profile settings by default
    router.replace("/profile/settings");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-gray-600 dark:text-gray-400">{t("redirecting")}</div>
    </div>
  );
}
