'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import InventoryFilters from '@/components/InventoryFilters';
import InventoryItem from '@/components/InventoryItem';
import { useAuthStore } from '@/store/authStore';
import { useSettingsStore } from '@/store/settingsStore';
import { translations } from '@/lib/translations';
import api from '@/lib/api';

interface InventoryItemType {
  id: string;
  isListed: boolean;
  listPrice: number | null;
  skin: {
    id: string;
    name: string;
    imageUrl: string;
    rarity: string;
    exterior: string;
  };
}

export default function InventoryPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { language, currency } = useSettingsStore();
  const t = translations[language];
  const [items, setItems] = useState<InventoryItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('deliveries');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    
    if (!user) {
      router.push('/auth/login');
      return;
    }
    fetchInventory();
  }, [user, router, isHydrated]);

  const fetchInventory = async () => {
    try {
      const { data } = await api.get('/inventory');
      setItems(data);
    } catch (error) {
      console.error('Inventory fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const handleWithdraw = () => {
    console.log('Withdraw items:', selectedItems);
  };

  const handleSellNow = () => {
    console.log('Sell items:', selectedItems);
  };

  const handleSell = () => {
    console.log('List items for sale:', selectedItems);
  };

  const handleDonate = () => {
    console.log('Donate items:', selectedItems);
  };

  const totalValue = items
    .filter(item => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + (item.listPrice || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center text-white">
          Yuklanmoqda...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 pt-20">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Filters Sidebar */}
          <div className="lg:hidden">
            <InventoryFilters />
          </div>
          <div className="hidden lg:block">
            <InventoryFilters />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 lg:mb-6 gap-4 sm:gap-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <div className="flex items-center gap-2">
                  <button className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700">
                    <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                  <button className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700">
                    <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                  <button className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700">
                    <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
                
                <div className="text-white text-sm lg:text-base">
                  <span className="text-gray-400">Inventory price for</span>
                  <span className="font-bold ml-1 lg:ml-2">{items.length} items</span>
                  <span className="text-green-400 ml-1 lg:ml-2">≈ ${totalValue.toFixed(2)}</span>
                </div>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 lg:px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 text-sm lg:text-base"
              >
                <option value="deliveries">Sort: Deliveries</option>
                <option value="price-high">Price: High to Low</option>
                <option value="price-low">Price: Low to High</option>
                <option value="name">Name: A-Z</option>
              </select>
            </div>

            {/* Items Grid */}
            {items.length === 0 ? (
              <div className="text-center py-12 bg-gray-900 rounded-xl">
                <p className="text-gray-400 mb-4">Inventoringiz bo'sh</p>
                <button
                  onClick={() => router.push('/marketplace')}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Marketplace'ga o'tish
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {items.map((item) => (
                  <InventoryItem
                    key={item.id}
                    id={item.id}
                    name={item.skin.name}
                    image={item.skin.imageUrl}
                    price={item.listPrice || 0}
                    wear={item.skin.exterior}
                    selected={selectedItems.includes(item.id)}
                    onSelect={handleSelectItem}
                  />
                ))}
              </div>
            )}

            {/* Action Buttons */}
            {selectedItems.length > 0 && (
              <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-3 lg:p-4">
                <div className="container mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                  <div className="text-white text-sm lg:text-base">
                    <span className="text-gray-400">Selected items:</span>
                    <span className="font-bold ml-1 lg:ml-2">{selectedItems.length}</span>
                    <span className="text-green-400 ml-2 lg:ml-4">Total: ${totalValue.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 lg:gap-3">
                    <button
                      onClick={handleWithdraw}
                      className="px-3 lg:px-6 py-2 lg:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-1 lg:gap-2 text-sm lg:text-base"
                    >
                      <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span className="hidden sm:inline">Withdraw</span>
                      <span className="sm:hidden">Out</span>
                    </button>
                    
                    <button
                      onClick={handleSellNow}
                      className="px-3 lg:px-6 py-2 lg:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-1 lg:gap-2 text-sm lg:text-base"
                    >
                      <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="hidden sm:inline">Sell now</span>
                      <span className="sm:hidden">Now</span>
                    </button>
                    
                    <button
                      onClick={handleSell}
                      className="px-3 lg:px-6 py-2 lg:py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition flex items-center gap-1 lg:gap-2 text-sm lg:text-base"
                    >
                      <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Sell
                    </button>
                    
                    <button
                      onClick={handleDonate}
                      className="px-3 lg:px-6 py-2 lg:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-1 lg:gap-2 text-sm lg:text-base"
                    >
                      <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                      </svg>
                      <span className="hidden sm:inline">Donate</span>
                      <span className="sm:hidden">Gift</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
