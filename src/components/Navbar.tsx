"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useSettingsStore } from "@/store/settingsStore";
import { useTranslations } from "next-intl";
import { convertCurrency, formatPrice } from "@/lib/currency";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useFavouritesStore } from "@/store/favouritesStore";
import { useChatStore } from "@/store/useChatStore";
import { ChatUI } from "./chatUI";

export default function Navbar() {
  const { count, fetchFavouriteIds, resetStore } = useFavouritesStore();
  const { isChatOpen, openChat, closeChat } = useChatStore();
  const router = useRouter();
  const { currency } = useSettingsStore();
  const { itemCount } = useCartStore();
  const { user, token, logout, hasHydrated } = useAuthStore();
  const t = useTranslations("Navbar");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [convertedBalance, setConvertedBalance] = useState(0);

  const isLoggedIn = hasHydrated && !!user && !!token;
  const baseBalance = user?.balance || 0;
  useEffect(() => {
    if (isLoggedIn) {
      fetchFavouriteIds();
    }
  }, [isLoggedIn, fetchFavouriteIds]);
  // Check token validity and fetch balance on mount and periodically
  useEffect(() => {
    if (isLoggedIn) {
      const { checkTokenValidity, fetchUserBalance } = useAuthStore.getState();

      const initializeUser = async () => {
        const isValid = await checkTokenValidity();
        if (isValid) {
          await fetchUserBalance();
        }
      };

      initializeUser();

      // Check token validity and fetch balance every 5 minutes
      const interval = setInterval(async () => {
        const { checkTokenValidity, fetchUserBalance } =
          useAuthStore.getState();
        const isValid = await checkTokenValidity();
        if (isValid) {
          await fetchUserBalance();
        }
      }, 5 * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [user?.id, token, isLoggedIn]); // Only depend on user.id and token, not the functions

  // Convert balance when currency changes
  useEffect(() => {
    const convertBalance = async () => {
      try {
        const converted = await convertCurrency(baseBalance, "USD", currency);
        setConvertedBalance(converted);
      } catch (error) {
        console.error("Currency conversion failed in Navbar:", error);
        setConvertedBalance(baseBalance);
      }
    };

    if (baseBalance > 0) {
      convertBalance();
    }
  }, [currency, baseBalance]);

  const handleLogout = () => {
    logout();
    resetStore(); // Favorites store ni tozalash
    setProfileMenuOpen(false);
    router.push("/auth/login");
  };

  return (
    <nav className="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-50 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
              CaseX
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/marketplace"
              className="hover:text-primary-600 transition"
            >
              {t("marketplace")}
            </Link>

            {isLoggedIn && (
              <>
                <Link
                  href="/inventory"
                  className="hover:text-primary-600 transition"
                >
                  {t("inventory")}
                </Link>

                <Link
                  href="/cart"
                  className="relative p-2 hover:text-primary-600 transition"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  {/* Cart badge */}
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {itemCount > 99 ? "99+" : itemCount}
                    </span>
                  )}
                </Link>

                <Link
                  href="/favorites"
                  className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors"
                >
                  <FavoriteBorderIcon />

                  {count > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
                      {count}
                    </span>
                  )}
                </Link>
              </>
            )}

            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-3 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-blue-600 rounded-full flex items-center justify-center overflow-hidden">
                    {user.steamAvatar ? (
                      <img
                        src={user.steamAvatar}
                        alt={user.username}
                        className="w-full h-full object-cover"
                      />
                    ) : user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-bold text-sm">
                        {user.username[0].toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="text-left">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold">
                        {user.username}
                      </span>
                      {user.steamId && (
                        <div
                          className="flex items-center justify-center w-3 h-3 bg-gray-800 rounded-sm"
                          title="Steam User"
                        >
                          <svg
                            className="w-2 h-2 text-white"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatPrice(convertedBalance, currency)}
                    </div>
                  </div>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      profileMenuOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="font-semibold text-sm">
                        {user.username}
                      </div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>

                    <div className="py-2">
                      <Link
                        href="/profile/settings"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <span>{t("profile")}</span>
                      </Link>

                      <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

                      <Link
                        href="/profile/balance"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <div className="flex-1">
                          <div className="text-sm">{t("balance")}</div>
                          <div className="text-xs text-primary-600 font-semibold">
                            {formatPrice(convertedBalance, currency)}
                          </div>
                        </div>
                        <button
                          className="w-6 h-6 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Add deposit logic here
                            console.log("Deposit clicked");
                          }}
                          title={t("depositTooltip")}
                        >
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </button>
                      </Link>

                      <Link
                        href="/profile/history"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                        <span>{t("paymentHistory")}</span>
                      </Link>

                      {/* Admin Panel Link - Only for admin users */}
                      {user.role === "admin" && (
                        <>
                          <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

                          <Link
                            href="/admin"
                            className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 transition"
                            onClick={() => setProfileMenuOpen(false)}
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            <span>{t("adminPanel")}</span>
                          </Link>
                        </>
                      )}

                      <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

                      <button
                        className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 transition w-full"
                        onClick={handleLogout}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        <span>{t("logout")}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
              >
                {t("login")}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2">
            <Link
              href="/marketplace"
              className="block py-2 hover:text-primary-600"
            >
              {t("marketplace")}
            </Link>

            {isLoggedIn ? (
              <>
                <Link
                  href="/inventory"
                  className="block py-2 hover:text-primary-600"
                >
                  {t("inventory")}
                </Link>
                <Link
                  href="/cart"
                  className="block py-2 hover:text-primary-600"
                >
                  {t("cart")}
                </Link>
                <Link
                  href="/profile/settings"
                  className="block py-2 hover:text-primary-600"
                >
                  {t("profile")}
                </Link>

                {/* Admin Panel Link for mobile - Only for admin users */}
                {user?.role === "admin" && (
                  <Link
                    href="/admin"
                    className="block py-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {t("adminPanel")}
                  </Link>
                )}
              </>
            ) : (
              <Link
                href="/auth/login"
                className="block px-4 py-2 bg-primary-600 text-white rounded-lg text-center"
              >
                {t("login")}
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Chat Support Button */}
      {isLoggedIn && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-[100] group print:hidden">
          <button
            onClick={openChat}
            className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-primary-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-105 border-2 border-white dark:border-gray-800 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            title="Support Chat"
            aria-label="Open support chat"
          >
            {/* Pulse animation ring */}
            <div className="absolute inset-0 rounded-full bg-primary-600 animate-ping opacity-20"></div>
            
            <svg 
              className="relative w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
              />
            </svg>
          </button>
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-3 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs sm:text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none shadow-lg z-10">
            Support Chat
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
          </div>
        </div>
      )}

      {/* Chat UI */}
      <ChatUI isOpen={isChatOpen} closeChat={closeChat} />
    </nav>
  );
}
