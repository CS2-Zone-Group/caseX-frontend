'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';

export default function Header() {
  const { user, logout } = useAuthStore();
  const { itemCount, fetchCart } = useCartStore();

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user, fetchCart]);

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
              <Link href="/inventory" className="hover:text-primary-600">
                Inventorim
              </Link>
              <Link href="/cart" className="hover:text-primary-600 relative">
                Savat
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">
                  {user.balance?.toFixed(2) || '0.00'} so'm
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
