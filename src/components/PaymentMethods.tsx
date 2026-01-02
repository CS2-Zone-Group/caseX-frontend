'use client'
import { translations } from '@/lib/translations';
import { useSettingsStore } from '@/store/settingsStore';
import React from 'react'

const PaymentMethods = () => {
  const { language } = useSettingsStore();
  const t = translations[language];

  return (
    <>
      <section className="py-20 px-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              {language === 'uz' ? 'Xavfsiz To\'lov Usullari' : 
               language === 'ru' ? 'Безопасные Способы Оплаты' : 
               'Secure Payment Methods'}
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
            
            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:bg-gray-100 dark:hover:bg-gray-700 transition group shadow-sm dark:shadow-none">
              <div className="text-center mb-3">
                    <div className="flex items-center justify-center h-36">
                    <img src="/assets/logos/payme.png" alt="Payme" className='h-full max-w-36 dark:invert dark:hue-rotate-180 object-contain' />
                    </div>
                <div className="font-bold text-sm text-gray-700 dark:text-gray-300">{t.payme}</div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 text-center mb-2">$1000 / {t.transaction}</div>
              <div className="text-xs text-center px-2 py-1 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 rounded">0% {t.fee}</div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:bg-gray-100 dark:hover:bg-gray-700 transition group shadow-sm dark:shadow-none">
              <div className="text-center mb-3">
              <div className="flex items-center justify-center h-36">
                    <img src="/assets/logos/click.png" alt="Click" className='h-full max-w-36 object-contain' />
                    </div>
                <div className="font-bold text-sm text-gray-700 dark:text-gray-300">{t.click}</div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 text-center mb-2">$1000 / {t.transaction}</div>
              <div className="text-xs text-center px-2 py-1 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 rounded">0% {t.fee}</div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:bg-gray-100 dark:hover:bg-gray-700 transition group shadow-sm dark:shadow-none">
              <div className="text-center mb-3">
              <div className="flex items-center justify-center h-36">
                    <img src="/assets/logos/uzum.png" alt="Uzum" className='h-full max-w-36 object-contain' />
                    </div>
                <div className="font-bold text-sm text-gray-700 dark:text-gray-300">{t.uzum}</div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 text-center mb-2">$1000 / {t.transaction}</div>
              <div className="text-xs text-center px-2 py-1 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 rounded">0% {t.fee}</div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:bg-gray-100 dark:hover:bg-gray-700 transition group shadow-sm dark:shadow-none">
              <div className="text-center mb-3">
              <div className="flex items-center justify-center h-36">
                    <img src="/assets/logos/paynet.svg.png" alt="Paynet" className='h-full dark:invert dark:hue-rotate-180 max-w-36 object-contain' />
                    </div>
                <div className="font-bold text-sm text-gray-700 dark:text-gray-300">{t.paynet}</div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 text-center mb-2">$1000 / {t.transaction}</div>
              <div className="text-xs text-center px-2 py-1 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 rounded">0% {t.fee}</div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:bg-gray-100 dark:hover:bg-gray-700 transition group shadow-sm dark:shadow-none">
              <div className="text-center mb-3">
              <div className="flex items-center justify-center h-36">
                    <img src="/assets/logos/visa.png" alt="VISA" className='h-full max-w-36 object-contain' />
                    </div>
                <div className="font-bold text-sm text-gray-700 dark:text-gray-300">{t.visa}</div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 text-center mb-2">$1500 / {t.transaction}</div>
              <div className="text-xs text-center px-2 py-1 bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 rounded">1.25% {t.fee}</div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:bg-gray-100 dark:hover:bg-gray-700 transition group shadow-sm dark:shadow-none">
              <div className="text-center mb-3">
              <div className="flex items-center justify-center h-20 mb-16">
                    <img src="/assets/logos/mastercard.png" alt="Mastercard" className='h-full max-w-36 object-contain' />
                    </div>
                <div className="font-bold text-sm text-gray-700 dark:text-gray-300">{t.mastercard}</div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 text-center mb-2">$1500 / {t.transaction}</div>
              <div className="text-xs text-center px-2 py-1 bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 rounded">1.25% {t.fee}</div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:bg-gray-100 dark:hover:bg-gray-700 transition group shadow-sm dark:shadow-none">
              <div className="text-center mb-3">
              <div className="flex items-center justify-center h-20 mb-16">
                    <img src="/assets/logos/bitcoin.png" alt="Bitcoin" className='h-full max-w-36 object-contain' />
                    </div>
                <div className="font-bold text-sm text-gray-700 dark:text-gray-300">{t.bitcoin}</div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 text-center mb-2">$3500 / {t.transaction}</div>
              <div className="text-xs text-center px-2 py-1 bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 rounded">1.5% {t.fee}</div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:bg-gray-100 dark:hover:bg-gray-700 transition group shadow-sm dark:shadow-none">
              <div className="text-center mb-3">
              <div className="flex items-center justify-center h-20 mb-16">
                    <img src="/assets/logos/ethereum.png" alt="Ethereum" className='h-full max-w-36 object-contain' />
                    </div>
                <div className="font-bold text-sm text-gray-700 dark:text-gray-300">{t.ethereum}</div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 text-center mb-2">$3500 / {t.transaction}</div>
              <div className="text-xs text-center px-2 py-1 bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 rounded">2% {t.fee}</div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:bg-gray-100 dark:hover:bg-gray-700 transition group shadow-sm dark:shadow-none">
              <div className="text-center mb-3">
              <div className="flex items-center justify-center h-20 mb-16">
                    <img src="/assets/logos/USDT.svg.png" alt="USDT" className='h-full max-w-36 object-contain' />
                    </div>
                <div className="font-bold text-sm text-gray-700 dark:text-gray-300">{t.usdt}</div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 text-center mb-2">$3500 / {t.transaction}</div>
              <div className="text-xs text-center px-2 py-1 bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 rounded">1% {t.fee}</div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:bg-gray-100 dark:hover:bg-gray-700 transition group shadow-sm dark:shadow-none">
              <div className="text-center mb-3">
                <div className="flex items-center justify-center mb-16 h-20">
                  <div className="text-7xl">💎</div>
                </div>
                <div className="font-bold text-sm text-gray-700 dark:text-gray-300">
                  {language === 'uz' ? `${t.more}` : language === 'ru' ? 'Другие' : 'More'}
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 text-center mb-2">
                {language === 'uz' ? 'Turli usullar' : language === 'ru' ? 'Различные методы' : 'Various methods'}
              </div>
              <div className="text-xs text-center px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded">...</div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {language === 'uz' ? 'Barcha to\'lovlar xavfsiz va shifrlangan. Biz sizning moliyaviy ma\'lumotlaringizni saqlamaymiz.' : 
               language === 'ru' ? 'Все платежи безопасны и зашифрованы. Мы не храним ваши финансовые данные.' : 
               'All payments are secure and encrypted. We do not store your financial information.'}
            </p>
            <div className="flex justify-center items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                SSL {language === 'uz' ? 'Shifrlangan' : language === 'ru' ? 'Зашифровано' : 'Encrypted'}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                PCI DSS {language === 'uz' ? 'Sertifikatlangan' : language === 'ru' ? 'Сертифицировано' : 'Certified'}
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default PaymentMethods