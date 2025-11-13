'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';

export default function Header() {
  const { user, logout } = useAuthStore();

  return (
    <header className="border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          CaseX
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/marketplace" className="hover:text-primary-600">
            Marketplace
          </Link>
          
          {user ? (
            <>
              <Link href="/profile" className="hover:text-primary-600">
                Profil
              </Link>
              <div className="flex items-center gap-4">
                <span className="text-sm">
                  {user.balance.toFixed(2)} so'm
                </span>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Chiqish
                </button>
              </div>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
            >
              Kirish
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
