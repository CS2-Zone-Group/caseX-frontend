"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import Navbar from "@/components/Navbar";
import PaymentMethods from "@/components/PaymentMethods";
import PopularItems from "@/components/PopularItems";

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
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              {t("features.title")}
            </h2>
            <div className="mt-3 w-16 h-1 bg-blue-600 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-8 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl hover:border-blue-500 dark:hover:border-blue-500 transition-colors">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                {t("features.bestPrices.title")}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                {t("features.bestPrices.description")}
              </p>
            </div>

            <div className="p-8 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl hover:border-blue-500 dark:hover:border-blue-500 transition-colors">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                {t("features.securePayments.title")}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                {t("features.securePayments.description")}
              </p>
            </div>

            <div className="p-8 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl hover:border-blue-500 dark:hover:border-blue-500 transition-colors">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/40 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                {t("features.fastDelivery.title")}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
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
          <div className="text-center mb-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              {t("about.title")}
            </h2>
            <div className="mt-3 w-16 h-1 bg-blue-600 mx-auto rounded-full" />
          </div>
          <p className="text-lg text-gray-500 dark:text-gray-300 leading-relaxed">
            {t("about.description")}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-white dark:bg-gray-900 dark:text-white">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src="/logo-icon.png" alt="CaseX" className="h-8 w-auto" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
              CaseX
            </span>
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
