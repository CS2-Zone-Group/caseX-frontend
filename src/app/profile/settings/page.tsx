"use client";

import { useState, useEffect, Suspense } from "react";
import { useAuthStore } from "@/store/authStore";
import { useTelegramStore } from "@/store/telegramStore";
import { useTranslations } from 'next-intl';
import api from "@/lib/api";
import Navbar from "@/components/Navbar";
import ChangePasswordModal from "@/components/ChangePasswordModal";
import AddPhoneModal from "@/components/AddPhoneModal";
import ProfileSidebar from "@/components/ProfileSidebar";
import Loader from "@/components/Loader";

/* ─── Icon components ─── */
const PencilIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);
const PlusIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);
const CheckIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
  </svg>
);
const SaveIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

function ProfileSettingsContent() {
  const { user, updateUser } = useAuthStore();
  const { isTelegramApp } = useTelegramStore();
  const t = useTranslations('ProfilePage');

  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  const [addPhoneModalOpen, setAddPhoneModalOpen] = useState(false);

  // Email
  const [email, setEmail] = useState(user?.email || "");
  const [emailEditing, setEmailEditing] = useState(false);
  const [emailSaving, setEmailSaving] = useState(false);
  const [emailError, setEmailError] = useState("");

  // Trade URL
  const [tradeUrl, setTradeUrl] = useState(user?.tradeUrl || "");
  const [tradeUrlEditing, setTradeUrlEditing] = useState(!user?.tradeUrl);
  const [tradeUrlSaving, setTradeUrlSaving] = useState(false);
  const [tradeUrlError, setTradeUrlError] = useState("");

  useEffect(() => {
    document.title = `${t('profileSettings')} - CaseX`;
  }, [t]);

  const saveEmail = async () => {
    if (!email.trim()) { setEmailError(t('emailRequired')); return; }
    setEmailSaving(true);
    setEmailError("");
    try {
      await api.put('/users/email', { email: email.trim() });
      updateUser({ email: email.trim() });
      setEmailEditing(false);
    } catch (err: any) {
      setEmailError(err.response?.data?.message || t('emailInvalid'));
    } finally {
      setEmailSaving(false);
    }
  };

  const saveTradeUrl = async () => {
    if (!tradeUrl.trim()) { setTradeUrlError(t('tradeUrlRequired')); return; }
    setTradeUrlSaving(true);
    setTradeUrlError("");
    try {
      await api.put('/users/trade-url', { tradeUrl: tradeUrl.trim() });
      updateUser({ tradeUrl: tradeUrl.trim() });
      setTradeUrlEditing(false);
    } catch (err: any) {
      setTradeUrlError(err.response?.data?.message || t('tradeUrlInvalid'));
    } finally {
      setTradeUrlSaving(false);
    }
  };

  /* ─── Action button for each row ─── */
  const iconBtn = "p-2 rounded-lg transition-colors flex-shrink-0";
  const iconBtnGreen = `${iconBtn} text-green-500 hover:bg-green-500/10`;
  const iconBtnGray = `${iconBtn} text-gray-400 hover:bg-gray-500/10 hover:text-white`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />

      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="flex flex-col lg:flex-row gap-6">
          <ProfileSidebar activeTab="settings" />

          <div className="flex-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="mb-6 lg:mb-8">
                <h1 className="text-2xl lg:text-3xl font-bold text-green-600 dark:text-green-400">
                  {t('profileSettings')}
                </h1>
              </div>

              {/* ─── Avatar ─── */}
              <div className="mb-8">
                <label className="block text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {t('profilePhoto')}
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center overflow-hidden">
                    {user?.steamAvatar ? (
                      <img src={user.steamAvatar} alt={user.username} className="w-full h-full object-cover" />
                    ) : user?.avatar ? (
                      <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white font-bold text-xl">
                        {user?.username?.charAt(0).toUpperCase() || "U"}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {user?.username || t('user')}
                    </p>
                    {user?.steamId && (
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center justify-center w-4 h-4 bg-gray-800 rounded-sm">
                          <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                          </svg>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{t('steamUser')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ─── Email ─── */}
              <div className="mb-6">
                <label className="block text-gray-600 dark:text-gray-400 text-sm mb-2">
                  {t('yourEmail').toUpperCase()}
                </label>
                <div className="flex items-center gap-2">
                  {emailEditing ? (
                    <>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                        className="flex-1 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                        autoFocus
                      />
                      <button onClick={saveEmail} disabled={emailSaving} className={iconBtnGreen} title={t('save')}>
                        {emailSaving ? <Loader /> : <SaveIcon />}
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="flex-1 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-sm">
                        {user?.email || <span className="text-gray-400">{t('emailNotSet')}</span>}
                      </div>
                      <button onClick={() => setEmailEditing(true)} className={user?.email ? iconBtnGray : iconBtnGreen} title={user?.email ? undefined : undefined}>
                        {user?.email ? <PencilIcon /> : <PlusIcon />}
                      </button>
                    </>
                  )}
                </div>
                {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
              </div>

              {/* ─── Password ─── */}
              <div className="mb-6">
                <label className="block text-gray-600 dark:text-gray-400 text-sm mb-2">{t('password')}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="password"
                    value="••••••••"
                    readOnly
                    className="flex-1 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none"
                  />
                  <button onClick={() => setChangePasswordModalOpen(true)} className={iconBtnGray}>
                    <PencilIcon />
                  </button>
                </div>
              </div>

              {/* ─── Steam Account ─── */}
              <div className="mb-6">
                <label className="block text-gray-600 dark:text-gray-400 text-sm mb-2">
                  {t('steamAccount')}
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-50 dark:bg-gray-700 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                    </svg>
                    {user?.steamId ? (
                      <span className="text-gray-900 dark:text-white text-sm font-medium">{user.username}</span>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500 text-sm">{t('steamNotLinked')}</span>
                    )}
                  </div>
                  {user?.steamId ? (
                    <span className={iconBtnGreen}><CheckIcon className="w-5 h-5 text-green-500" /></span>
                  ) : (
                    <button
                      onClick={() => {
                        const token = useAuthStore.getState().token;
                        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
                        const steamUrl = `${backendUrl}/auth/steam/link?token=${token}`;
                        if (isTelegramApp && window.Telegram?.WebApp) {
                          window.Telegram.WebApp.openLink(steamUrl);
                        } else {
                          window.location.href = steamUrl;
                        }
                      }}
                      className={iconBtnGreen}
                    >
                      <PlusIcon />
                    </button>
                  )}
                </div>
              </div>

              {/* ─── Trade URL ─── */}
              {user?.steamId && (
                <div className="mb-6">
                  <label className="block text-gray-600 dark:text-gray-400 text-sm mb-2">STEAM TRADE URL</label>
                  <div className="flex items-center gap-2">
                    {tradeUrlEditing ? (
                      <>
                        <input
                          type="text"
                          value={tradeUrl}
                          onChange={(e) => { setTradeUrl(e.target.value); setTradeUrlError(""); }}
                          placeholder="https://steamcommunity.com/tradeoffer/new/?partner=...&token=..."
                          className="flex-1 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                          autoFocus
                        />
                        <button onClick={saveTradeUrl} disabled={tradeUrlSaving} className={iconBtnGreen}>
                          {tradeUrlSaving ? <Loader /> : <SaveIcon />}
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="flex-1 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-sm truncate">
                          {user?.tradeUrl || <span className="text-gray-400">{t('tradeUrlNotSet')}</span>}
                        </div>
                        <button onClick={() => setTradeUrlEditing(true)} className={user?.tradeUrl ? iconBtnGray : iconBtnGreen}>
                          {user?.tradeUrl ? <PencilIcon /> : <PlusIcon />}
                        </button>
                      </>
                    )}
                  </div>
                  {tradeUrlError && <p className="text-red-500 text-xs mt-1">{tradeUrlError}</p>}
                  <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">{t('tradeUrlHelp')}</p>
                </div>
              )}

              {/* ─── Phone ─── */}
              <div className="mb-6">
                <label className="block text-gray-600 dark:text-gray-400 text-sm mb-2">{t('phoneNumber')}</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-50 dark:bg-gray-700 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {user?.phoneNumber ? (
                      <span className="text-gray-900 dark:text-white text-sm font-medium">{user.phoneNumber}</span>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500 text-sm">{t('phoneNotSet')}</span>
                    )}
                  </div>
                  {user?.phoneNumber ? (
                    <span className={iconBtnGreen}><CheckIcon className="w-5 h-5 text-green-500" /></span>
                  ) : (
                    <button onClick={() => setAddPhoneModalOpen(true)} className={iconBtnGreen}>
                      <PlusIcon />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ChangePasswordModal
        isOpen={changePasswordModalOpen}
        onClose={() => setChangePasswordModalOpen(false)}
      />
      <AddPhoneModal
        isOpen={addPhoneModalOpen}
        onClose={() => setAddPhoneModalOpen(false)}
        onSuccess={() => {}}
      />
    </div>
  );
}

export default function ProfileSettingsPage() {
  return (
    <Suspense fallback={<Loader fullScreen />}>
      <ProfileSettingsContent />
    </Suspense>
  );
}
