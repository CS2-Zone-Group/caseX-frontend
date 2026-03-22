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
      <section className="pt-28 pb-16 md:pt-36 md:pb-24 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left animate-fade-in-left">
              <div className="inline-block mb-6 px-4 py-1.5 border border-gray-600 dark:border-gray-500 rounded-full">
                <span className="text-xs font-semibold tracking-widest text-gray-700 dark:text-gray-300 uppercase">
                  {t("hero.badge")}
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                <span className="text-gray-900 dark:text-white">
                  {t("hero.titleLine1")}{" "}
                </span>
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  {t("hero.titleHighlight")}
                </span>
                <br />
                <span className="text-gray-900 dark:text-white">
                  {t("hero.titleLine2")}
                </span>
              </h1>

              <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-lg mx-auto lg:mx-0">
                {t("hero.description")}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/marketplace"
                  className="px-7 py-3.5 bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/25 text-white rounded-lg transition-all duration-300 text-base font-semibold hover:scale-105"
                >
                  {t("hero.startTrading")}
                </Link>
                <Link
                  href="/marketplace"
                  className="px-7 py-3.5 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg transition-all duration-300 text-base font-semibold border border-gray-300 dark:border-gray-600 hover:scale-105"
                >
                  {t("hero.browseCatalog")}
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div className="flex-1 flex justify-center lg:justify-end animate-fade-in-right">
              <div className="relative w-full max-w-md lg:max-w-lg xl:max-w-xl">
                <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800 via-gray-900 to-black shadow-2xl">
                  <img
                    src="/images/karambit.png"
                    alt="Karambit Doppler"
                    className="w-full h-auto object-contain p-4 animate-float"
                  />
                </div>
                {/* Glow effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 rounded-3xl blur-2xl -z-10 animate-pulse-glow" />
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
            <div className="p-8 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-blue-500/10">
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

            <div className="p-8 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-green-500/10">
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

            <div className="p-8 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-purple-500/10">
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

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t("howItWorks.title")}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              {t("howItWorks.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting lines */}
            <div className="hidden md:block absolute top-[3.5rem] left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px bg-gray-700" />

            {/* Step 1 */}
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-blue-950 border border-blue-800 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-blue-500/20">
                <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {t("howItWorks.step1.title")}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("howItWorks.step1.description")}
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-emerald-950 border border-emerald-800 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-emerald-500/20">
                <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {t("howItWorks.step2.title")}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("howItWorks.step2.description")}
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-amber-950 border border-amber-800 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-amber-500/20">
                <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {t("howItWorks.step3.title")}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("howItWorks.step3.description")}
              </p>
            </div>
          </div>
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
