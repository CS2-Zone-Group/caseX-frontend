"use client";

import { useEffect } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Navbar from "@/components/Navbar";
import PaymentMethods from "@/components/PaymentMethods";
import PopularItems from "@/components/PopularItems";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Home() {
  const t = useTranslations("HomePage");
  const currentYear = new Date().getFullYear();
  useEffect(() => {
    document.title = t("meta.title");
  }, [t]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 rounded-full">
            <span className="text-primary-600 dark:text-primary-400 font-semibold">
              {t("hero.badge")}
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold pb-6 bg-gradient-to-r from-gray-900 via-primary-600 to-blue-600 dark:from-white dark:via-primary-400 dark:to-blue-400 bg-clip-text text-transparent">
            {t("hero.title")}
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            {t("hero.description")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/marketplace"
              className="px-8 py-4 bg-gradient-to-r from-primary-600 to-blue-600 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all text-lg font-semibold"
            >
              {t("hero.marketplaceButton")}
            </Link>
            <Link
              href="/auth/register"
              className="px-8 py-4 border-2 border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all text-lg font-semibold"
            >
              {t("hero.signUpButton")}
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                1000+
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                {t("stats.skins")}
              </div>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                500+
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                {t("stats.users")}
              </div>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                24/7
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                {t("stats.support")}
              </div>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                100%
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                {t("stats.secure")}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Items Section */}
      <PopularItems />

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white dark:bg-gray-800">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            {t("features.title")}
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-gradient-to-br from-blue-50 to-primary-50 dark:from-gray-900 dark:to-gray-800 rounded-xl">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold mb-3">
                {t("features.bestPrices.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t("features.bestPrices.description")}
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 rounded-xl">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold mb-3">
                {t("features.securePayments.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t("features.securePayments.description")}
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 rounded-xl">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-3">
                {t("features.fastDelivery.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t("features.fastDelivery.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Methods Section */}
      <PaymentMethods />
      {/* About Section */}
      <section id="about" className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">{t("about.title")}</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            {t("about.description")}
          </p>
          {/* Language Switcher */}
          <div className="flex justify-center">
            <LanguageSwitcher />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-white dark:bg-gray-900 dark:text-white">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">C</span>
            </div>
            <span className="text-xl font-bold">CaseX</span>
          </div>
          <p className="dark:text-gray-300 text-gray-700 mb-4">
            {t("footer.description")}
          </p>
          <p className="dark:text-gray-400 text-gray-600  text-sm">
            © {currentYear} CaseX. {t("footer.copyright")}
          </p>
        </div>
      </footer>
    </div>
  );
}
