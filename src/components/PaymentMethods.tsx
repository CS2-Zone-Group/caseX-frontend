'use client'
import { translations } from '@/lib/translations';
import { useSettingsStore } from '@/store/settingsStore';
import { useRouter } from 'next/navigation';
import React from 'react'

const PaymentMethods = () => {
  const { language } = useSettingsStore();
  const t = translations[language];
  const router = useRouter();

  const methods = [
    {
      name: t.payme,
      logo: '/assets/logos/payme.png',
      limit: '$1000',
      fee: '0%',
      isZeroFee: true,
      logoClass: 'dark:invert dark:hue-rotate-180',
      containerClass: 'h-36',
    },
    {
      name: t.click,
      logo: '/assets/logos/click.png',
      limit: '$1000',
      fee: '0%',
      isZeroFee: true,
      logoClass: '',
      containerClass: 'h-36',
    },
    {
      name: t.uzum,
      logo: '/assets/logos/uzum.png',
      limit: '$1000',
      fee: '0%',
      isZeroFee: true,
      logoClass: '',
      containerClass: 'h-36',
    },
    {
      name: t.paynet,
      logo: '/assets/logos/paynet.svg.png',
      limit: '$1000',
      fee: '0%',
      isZeroFee: true,
      logoClass: 'dark:invert dark:hue-rotate-180',
      containerClass: 'h-36',
    },
    {
      name: t.visa,
      logo: '/assets/logos/visa.png',
      limit: '$1500',
      fee: '1.25%',
      isZeroFee: false,
      containerClass: 'h-36',
      logoClass: '',

    },
    {
      name: t.mastercard,
      logo: '/assets/logos/mastercard.png',
      limit: '$1500',
      fee: '1.25%',
      isZeroFee: false,
      containerClass: 'h-20 mb-16',
      logoClass: '',

    },
    {
      name: t.bitcoin,
      logo: '/assets/logos/bitcoin.png',
      limit: '$3500',
      fee: '1.5%',
      isZeroFee: false,
      containerClass: 'h-20 mb-16',
      logoClass: '',

    },
    {
      name: t.ethereum,
      logo: '/assets/logos/ethereum.png',
      limit: '$3500',
      fee: '2%',
      isZeroFee: false,
      containerClass: 'h-20 mb-16',
      logoClass: '',

    },
    {
      name: t.usdt,
      logo: '/assets/logos/USDT.svg.png',
      limit: '$3500',
      fee: '1%',
      isZeroFee: false,
      containerClass: 'h-20 mb-16',
      logoClass: '',

    }
  ];

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
            {methods.map((item, index) => (
              <div 
                key={index} 
               
                className="cursor-pointer bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm dark:shadow-none"
              >
                <div className="text-center mb-3">
                  <div className={`flex items-center justify-center ${item.containerClass}`}>
                    <img
                      src={item.logo}
                      alt={item.name}
                      className={`h-full max-w-36 object-contain ${item.logoClass}`}
                    />
                  </div>
                  <div className="font-bold text-sm text-gray-700 dark:text-gray-300">{item.name}</div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 text-center mb-2">{item.limit} / {t.transaction}</div>
                <div className={`text-xs text-center px-2 py-1 rounded ${item.isZeroFee
                    ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400'
                    : 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400'
                  }`}>
                  {item.fee} {t.fee}
                </div>
              </div>
            ))}

            <div 
             
              className="cursor-pointer bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm dark:shadow-none"
            >
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