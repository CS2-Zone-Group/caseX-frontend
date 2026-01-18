"use client";

import { useState, useEffect, Suspense } from "react";
import { useTranslations } from 'next-intl';
import Navbar from "@/components/Navbar";
import ProfileSidebar from "@/components/ProfileSidebar";

function ProfileHistoryContent() {
  const t = useTranslations('ProfilePage');

  useEffect(() => {
    document.title = `${t('paymentHistory')} - CaseX`;
  }, [t]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />

      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="flex flex-col lg:flex-row gap-6">
          <ProfileSidebar activeTab="history" />

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 lg:p-8 shadow-lg border border-gray-200 dark:border-gray-700">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-6 lg:mb-8">
                {t('paymentHistory')}
              </h1>

              {/* Filters */}
              <div className="flex flex-wrap gap-2 lg:gap-4 mb-4 lg:mb-6">
                <button className="px-3 lg:px-4 py-2 bg-primary-600 text-white rounded-lg text-sm lg:text-base">
                  {t('all')}
                </button>
                <button className="px-3 lg:px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 text-sm lg:text-base">
                  {t('deposits')}
                </button>
                <button className="px-3 lg:px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 text-sm lg:text-base">
                  {t('withdrawals')}
                </button>
                <button className="px-3 lg:px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 text-sm lg:text-base">
                  {t('purchases')}
                </button>
              </div>

              {/* Transaction List */}
              <div className="space-y-3 lg:space-y-4">
                {[
                  {
                    type: "deposit",
                    amount: "+$100.00",
                    method: "Payme",
                    date: "2024-12-09 14:30",
                    status: "completed",
                  },
                  {
                    type: "purchase",
                    amount: "-$45.99",
                    method: "Balance",
                    date: "2024-12-08 18:15",
                    status: "completed",
                  },
                  {
                    type: "withdrawal",
                    amount: "-$50.00",
                    method: "Click",
                    date: "2024-12-07 10:20",
                    status: "pending",
                  },
                  {
                    type: "deposit",
                    amount: "+$200.00",
                    method: "VISA",
                    date: "2024-12-06 16:45",
                    status: "completed",
                  },
                ].map((transaction, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 lg:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:bg-gray-200 dark:hover:bg-gray-650 transition border border-gray-200 dark:border-gray-600 gap-3 sm:gap-0"
                  >
                    <div className="flex items-center gap-3 lg:gap-4">
                      <div
                        className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center ${
                          transaction.type === "deposit"
                            ? "bg-green-500/20 text-green-600 dark:text-green-500"
                            : transaction.type === "withdrawal"
                            ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-500"
                            : "bg-blue-500/20 text-blue-600 dark:text-blue-500"
                        }`}
                      >
                        {transaction.type === "deposit"
                          ? "↓"
                          : transaction.type === "withdrawal"
                          ? "↑"
                          : "🛒"}
                      </div>
                      <div>
                        <div className="text-gray-900 dark:text-white font-semibold text-sm lg:text-base">
                          {transaction.type === "deposit"
                            ? t('deposit')
                            : transaction.type === "withdrawal"
                            ? t('withdrawal')
                            : t('purchase')}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 text-xs lg:text-sm">
                          {transaction.method} • {transaction.date}
                        </div>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <div
                        className={`text-base lg:text-lg font-bold ${
                          transaction.amount.startsWith("+")
                            ? "text-green-600 dark:text-green-500"
                            : "text-red-600 dark:text-red-500"
                        }`}
                      >
                        {transaction.amount}
                      </div>
                      <div
                        className={`text-xs lg:text-sm ${
                          transaction.status === "completed"
                            ? "text-green-600 dark:text-green-500"
                            : "text-yellow-600 dark:text-yellow-500"
                        }`}
                      >
                        {transaction.status === "completed" ? t('completed') : t('pending')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfileHistoryPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <ProfileHistoryContent />
    </Suspense>
  );
}