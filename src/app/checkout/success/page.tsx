"use client"
import React, { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSettingsStore } from '@/store/settingsStore';
import { useTranslations } from 'next-intl';
import { formatPrice } from '@/lib/currency';
import Loader from '@/components/Loader';

const SuccessContent = () => {
  const t = useTranslations('CheckoutPage');
  const router = useRouter()
  const searchParams = useSearchParams()
  const { currency } = useSettingsStore()
  const [mounted, setMounted] = useState(false)

  // Read transaction summary from URL params or localStorage
  const transactionId = searchParams.get('transactionId')
  const amount = searchParams.get('amount')
  const itemCount = searchParams.get('items')

  useEffect(() => {
    // Trigger animation on mount
    const timer = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className='w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 transition-colors duration-300'>

      <div className='flex flex-col items-center gap-2 mb-8 text-center'>
        {/* Animated checkmark */}
        <div
          className={`w-20 h-20 bg-green-100 dark:bg-green-500/10 rounded-full flex items-center justify-center mb-2 transition-all duration-500 ease-out ${
            mounted ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
          }`}
        >
          <svg
            className={`w-10 h-10 text-green-600 dark:text-green-500 transition-all duration-500 delay-200 ease-out ${
              mounted ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>{t('success')}</h2>
        <p className='text-gray-500 dark:text-gray-400 text-sm'>
          {t('paymentSuccessful')}
        </p>
      </div>

      <div className='bg-gray-50 dark:bg-gray-900 rounded-xl p-4 mb-6 border border-gray-200 dark:border-gray-700/50 transition-colors'>

        <div className='flex justify-between items-center mb-4 pb-4 border-b border-gray-200 dark:border-gray-800'>
          <span className='text-gray-500 dark:text-gray-400 text-sm'>{t('status')}</span>
          <span className='text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-400/10 px-3 py-1 rounded-full text-xs font-bold'>
            {t('killed')}
          </span>
        </div>

        {amount && (
          <div className='flex justify-between items-center mb-4 pb-4 border-b border-gray-200 dark:border-gray-800'>
            <span className='text-gray-500 dark:text-gray-400 text-sm'>{t('checkTotal')}</span>
            <span className='text-gray-900 dark:text-white font-semibold text-sm'>
              {formatPrice(parseFloat(amount), currency)}
            </span>
          </div>
        )}

        {itemCount && (
          <div className='flex justify-between items-center mb-4 pb-4 border-b border-gray-200 dark:border-gray-800'>
            <span className='text-gray-500 dark:text-gray-400 text-sm'>{t('skin')}</span>
            <span className='text-gray-900 dark:text-white font-medium text-sm'>
              {itemCount}
            </span>
          </div>
        )}

        <div className='flex justify-between items-center'>
          <span className='text-gray-500 dark:text-gray-400 text-sm'>{t('transactionId')}</span>
          <span className='text-gray-900 dark:text-white font-mono text-sm font-medium'>
            {transactionId || 'Unknown'}
          </span>
        </div>
      </div>

      <div className='flex flex-col gap-3 w-full'>
        <button
          onClick={() => router.push('/inventory')}
          className='w-full bg-blue-600 hover:bg-blue-700 text-white p-3.5 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-blue-500/20'
        >
          {t('viewInventor')}
        </button>

        <button
          onClick={() => router.push('/marketplace')}
          className='w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-200 p-3.5 rounded-xl font-bold transition-all active:scale-95'
        >
          {t('shoppingAgain')}
        </button>
      </div>

    </div>
  )
}

const SuccessPage = () => {
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-center p-4 transition-colors duration-300'>
      <Suspense fallback={<Loader fullScreen />}>
        <SuccessContent />
      </Suspense>
    </div>
  )
}

export default SuccessPage