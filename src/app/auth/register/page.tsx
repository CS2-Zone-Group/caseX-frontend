'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useLanguage } from '@/contexts/LanguageContext';

// Translation helper function
const getTranslations = (language: string) => {
  const translations = {
    en: {
      title: "Sign Up",
      subtitle: "Or",
      loginLink: "sign in to your account",
      email: "Email Address",
      emailPlaceholder: "john@example.com",
      password: "Password",
      passwordPlaceholder: "••••••••",
      passwordHint: "At least 8 characters with letters and numbers",
      confirmPassword: "Confirm Password",
      confirmPasswordPlaceholder: "••••••••",
      acceptTerms: "I agree to the",
      termsLink: "Terms of Service",
      and: "and",
      privacyLink: "Privacy Policy",
      register: "Sign Up",
      registering: "Signing up...",
      or: "Or",
      steamRegister: "Sign up with Steam",
      emailInvalid: "Please enter a valid email address",
      passwordTooShort: "Password must be at least 8 characters long",
      passwordTooWeak: "Password must contain at least one letter and one number",
      passwordMismatch: "Passwords do not match",
      termsRequired: "You must accept the Terms of Service",
      emailExists: "This email is already registered",
      registrationFailed: "Registration failed. Please try again.",
      successTitle: "Registration Successful!",
      successMessage: "Your account has been created successfully.",
      checkEmail: "Please check your email and click the verification link to activate your account.",
      backToLogin: "Back to Login"
    },
    uz: {
      title: "Ro'yxatdan O'tish",
      subtitle: "Yoki",
      loginLink: "hisobingizga kiring",
      email: "Email manzil",
      emailPlaceholder: "john@example.com",
      password: "Parol",
      passwordPlaceholder: "••••••••",
      passwordHint: "Kamida 8 ta belgi, harf va raqam bo'lishi kerak",
      confirmPassword: "Parolni tasdiqlang",
      confirmPasswordPlaceholder: "••••••••",
      acceptTerms: "Men",
      termsLink: "Foydalanish shartlari",
      and: "va",
      privacyLink: "Maxfiylik siyosati",
      register: "Ro'yxatdan O'tish",
      registering: "Ro'yxatdan o'tmoqda...",
      or: "Yoki",
      steamRegister: "Steam orqali ro'yxatdan o'tish",
      emailInvalid: "To'g'ri email manzilini kiriting",
      passwordTooShort: "Parol kamida 8 ta belgidan iborat bo'lishi kerak",
      passwordTooWeak: "Parolda kamida bitta harf va bitta raqam bo'lishi kerak",
      passwordMismatch: "Parollar mos kelmaydi",
      termsRequired: "Foydalanish shartlarini qabul qilishingiz kerak",
      emailExists: "Bu email allaqachon ro'yxatdan o'tgan",
      registrationFailed: "Ro'yxatdan o'tishda xatolik. Qayta urinib ko'ring.",
      successTitle: "Ro'yxatdan O'tish Muvaffaqiyatli!",
      successMessage: "Hisobingiz muvaffaqiyatli yaratildi.",
      checkEmail: "Emailingizni tekshiring va hisobingizni faollashtirish uchun tasdiqlash havolasini bosing.",
      backToLogin: "Kirish sahifasiga qaytish"
    },
    ru: {
      title: "Регистрация",
      subtitle: "Или",
      loginLink: "войдите в свой аккаунт",
      email: "Email адрес",
      emailPlaceholder: "john@example.com",
      password: "Пароль",
      passwordPlaceholder: "••••••••",
      passwordHint: "Минимум 8 символов, должны быть буквы и цифры",
      confirmPassword: "Подтвердите пароль",
      confirmPasswordPlaceholder: "••••••••",
      acceptTerms: "Я согласен с",
      termsLink: "Условиями использования",
      and: "и",
      privacyLink: "Политикой конфиденциальности",
      register: "Зарегистрироваться",
      registering: "Регистрация...",
      or: "Или",
      steamRegister: "Регистрация через Steam",
      emailInvalid: "Введите корректный email адрес",
      passwordTooShort: "Пароль должен содержать минимум 8 символов",
      passwordTooWeak: "Пароль должен содержать минимум одну букву и одну цифру",
      passwordMismatch: "Пароли не совпадают",
      termsRequired: "Вы должны принять Условия использования",
      emailExists: "Этот email уже зарегистрирован",
      registrationFailed: "Ошибка регистрации. Попробуйте еще раз.",
      successTitle: "Регистрация Успешна!",
      successMessage: "Ваш аккаунт успешно создан.",
      checkEmail: "Проверьте свою почту и нажмите на ссылку подтверждения для активации аккаунта.",
      backToLogin: "Вернуться к входу"
    }
  };
  return translations[language as keyof typeof translations] || translations.en;
};

export default function RegisterPage() {
  const { language } = useLanguage();
  const t = getTranslations(language);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    document.title = `${t.title} - CaseX`;
  }, [t.title]);

  const validateForm = () => {
    if (!formData.email || !formData.email.includes('@')) {
      setError(t.emailInvalid);
      return false;
    }

    if (!formData.password || formData.password.length < 8) {
      setError(t.passwordTooShort);
      return false;
    }

    // Password strength validation
    const hasLetter = /[a-zA-Z]/.test(formData.password);
    const hasNumber = /\d/.test(formData.password);
    
    if (!hasLetter || !hasNumber) {
      setError(t.passwordTooWeak);
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t.passwordMismatch);
      return false;
    }

    if (!formData.acceptTerms) {
      setError(t.termsRequired);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      await api.post('/auth/register', {
        email: formData.email,
        password: formData.password,
        locale: language,
      });

      setSuccess(true);
    } catch (err: any) {
      const errorCode = err.response?.data?.message || 'REGISTRATION_FAILED';
      
      switch (errorCode) {
        case 'EMAIL_ALREADY_EXISTS':
          setError(t.emailExists);
          break;
        case 'PASSWORD_TOO_WEAK':
          setError(t.passwordTooWeak);
          break;
        default:
          setError(t.registrationFailed);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSteamLogin = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
    window.location.href = `${apiUrl}/auth/steam`;
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-2">
              {t.successTitle}
            </h2>
            <p className="text-green-700 dark:text-green-300 mb-4">
              {t.successMessage}
            </p>
            <p className="text-sm text-green-600 dark:text-green-400 mb-6">
              {t.checkEmail}
            </p>
            <Link 
              href="/auth/login"
              className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              {t.backToLogin}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white">
            {t.title}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {t.subtitle}{' '}
            <Link href="/auth/login" className="text-primary-600 hover:text-primary-500">
              {t.loginLink}
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                {t.email}
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                placeholder={t.emailPlaceholder}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                {t.password}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                  placeholder={t.passwordPlaceholder}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {t.passwordHint}
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                {t.confirmPassword}
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                  placeholder={t.confirmPasswordPlaceholder}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showConfirmPassword ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-start">
              <input
                id="acceptTerms"
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="acceptTerms" className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                {t.acceptTerms}{' '}
                <Link href="/terms" className="text-primary-600 hover:text-primary-500">
                  {t.termsLink}
                </Link>{' '}
                {t.and}{' '}
                <Link href="/privacy" className="text-primary-600 hover:text-primary-500">
                  {t.privacyLink}
                </Link>
                {language === 'uz' ? 'ni qabul qilaman' : language === 'ru' ? '' : ''}
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t.registering : t.register}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 dark:bg-gray-900 text-gray-500">{t.or}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSteamLogin}
            className="w-full py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition flex items-center justify-center gap-2"
          >
            <span>{t.steamRegister}</span>
          </button>
        </form>
      </div>
    </div>
  );
}