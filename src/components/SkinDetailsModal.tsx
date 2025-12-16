'use client';

import { useState, useEffect } from 'react';

interface SkinDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  skin: {
    market_hash_name: string;
    market_name: string;
    name: string;
    icon_url: string;
    tags: Array<{
      category: string;
      localized_tag_name: string;
    }>;
  } | null;
}

export default function SkinDetailsModal({ isOpen, onClose, skin }: SkinDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'sales'>('details');

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'Tab') {
        // Handle tab navigation between tabs
        if (event.shiftKey && activeTab === 'sales') {
          event.preventDefault();
          setActiveTab('details');
        } else if (!event.shiftKey && activeTab === 'details') {
          event.preventDefault();
          setActiveTab('sales');
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, activeTab]);

  if (!isOpen || !skin) return null;

  const weaponTag = skin.tags?.find(tag => tag.category === 'Weapon');
  const rarityTag = skin.tags?.find(tag => tag.category === 'Rarity');
  const exteriorTag = skin.tags?.find(tag => tag.category === 'Exterior');
  const collectionTag = skin.tags?.find(tag => tag.category === 'ItemSet');

  // Generate realistic mock data based on skin rarity
  const generateMockPrice = () => {
    const rarityMultipliers: { [key: string]: number } = {
      'covert': 50,
      'classified': 25,
      'restricted': 10,
      'milspec': 3,
      'industrial': 1,
      'consumer': 0.5
    };
    
    const rarity = rarityTag?.localized_tag_name?.toLowerCase() || 'milspec';
    const basePrice = rarityMultipliers[rarity] || 3;
    const variation = Math.random() * 0.4 + 0.8; // 0.8 to 1.2 multiplier
    return (basePrice * variation).toFixed(2);
  };

  const mockPrice = generateMockPrice();
  const mockData = {
    instantSellPrice: `$${(parseFloat(mockPrice) * 0.85).toFixed(2)}`,
    payoutPrice: `$${mockPrice}`,
    tradeLock: Math.random() > 0.7 ? '7 days' : 'No',
    itemLocation: 'Steam',
    itemType: 'Weapon',
    ownerBlockchainId: '0xA200bAf5f5e950eF307871d8310A675...',
    collection: collectionTag?.localized_tag_name || 'Unknown Collection',
    salesHistory: Array.from({ length: 5 }, (_, i) => {
      const date = new Date();
      date.setHours(date.getHours() - i * 2);
      const priceVariation = parseFloat(mockPrice) * (Math.random() * 0.2 + 0.9);
      return {
        price: `$${priceVariation.toFixed(2)}`,
        operation: Math.random() > 0.5 ? 'Target' : 'Market',
        date: date.toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric', 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        })
      };
    })
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-black bg-opacity-75"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal */}
        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-gray-900 shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-2 text-lg font-medium transition-colors border-b-2 ${
                  activeTab === 'details'
                    ? 'text-white border-green-500'
                    : 'text-gray-400 border-transparent hover:text-gray-300'
                }`}
              >
                ITEM DETAILS
              </button>
              <button
                onClick={() => setActiveTab('sales')}
                className={`pb-2 text-lg font-medium transition-colors border-b-2 ${
                  activeTab === 'sales'
                    ? 'text-white border-green-500'
                    : 'text-gray-400 border-transparent hover:text-gray-300'
                }`}
              >
                SALES INFO
              </button>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'details' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left side - Image and basic info */}
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 id="modal-title" className="text-2xl font-bold text-white mb-4">
                      {skin.market_name || skin.name}
                    </h2>
                    
                    <div className="w-64 h-48 mx-auto bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
                      {skin.icon_url ? (
                        <img
                          src={
                            skin.icon_url.startsWith('http') 
                              ? skin.icon_url 
                              : `https://community.cloudflare.steamstatic.com/economy/image/${skin.icon_url}/330x192`
                          }
                          alt={skin.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = '<div class="text-gray-400">No Image Available</div>';
                            }
                          }}
                        />
                      ) : (
                        <div className="text-gray-400">No Image Available</div>
                      )}
                    </div>

                    <button 
                      className="mt-4 px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      onClick={() => {
                        const steamUrl = `https://steamcommunity.com/market/listings/730/${encodeURIComponent(skin.market_hash_name)}`;
                        window.open(steamUrl, '_blank');
                      }}
                    >
                      View at Steam
                    </button>
                  </div>

                  {/* Price Information */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Instant Sell Price</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-yellow-500">⚡</span>
                        <span className="text-yellow-500 font-bold">{mockData.instantSellPrice}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Payout Price</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-green-500">●</span>
                        <span className="text-green-500 font-bold">{mockData.payoutPrice}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side - Detailed information */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <span className="text-gray-400 block mb-1">Trade lock:</span>
                      <span className="text-white">{mockData.tradeLock}</span>
                    </div>

                    <div>
                      <span className="text-gray-400 block mb-1">Item location:</span>
                      <span className="text-white">{mockData.itemLocation}</span>
                    </div>

                    <div>
                      <span className="text-gray-400 block mb-1">Item type:</span>
                      <span className="text-white">{weaponTag?.localized_tag_name || mockData.itemType}</span>
                    </div>

                    {exteriorTag && (
                      <div>
                        <span className="text-gray-400 block mb-1">Exterior:</span>
                        <span className="text-white">{exteriorTag.localized_tag_name}</span>
                      </div>
                    )}

                    {rarityTag && (
                      <div>
                        <span className="text-gray-400 block mb-1">Rarity:</span>
                        <span className="text-white">{rarityTag.localized_tag_name}</span>
                      </div>
                    )}

                    <div>
                      <span className="text-gray-400 block mb-1">Owner's Blockchain ID:</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-mono text-sm">{mockData.ownerBlockchainId}</span>
                        <button 
                          className="text-gray-400 hover:text-white"
                          onClick={() => {
                            navigator.clipboard.writeText(mockData.ownerBlockchainId);
                            // You could add a toast notification here
                          }}
                          title="Copy to clipboard"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="text-gray-400 block mb-1">Collection:</span>
                      <span className="text-white">{mockData.collection}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sales' && (
              <div className="space-y-6">
                {/* Sales History Chart Placeholder */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">Sales History</h3>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 text-sm bg-gray-700 text-white rounded">7D</button>
                      <button className="px-3 py-1 text-sm bg-gray-700 text-white rounded">1M</button>
                      <button className="px-3 py-1 text-sm bg-gray-700 text-white rounded">6M</button>
                      <button className="px-3 py-1 text-sm bg-green-600 text-white rounded">1Y</button>
                    </div>
                  </div>
                  
                  <div className="h-64 bg-gray-800 rounded-lg flex items-center justify-center">
                    <div className="text-gray-400">
                      <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <p>Sales chart will be displayed here</p>
                    </div>
                  </div>
                </div>

                {/* Recent Sales */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">Recent sales</h3>
                    <button className="text-gray-400 hover:text-white">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-4 text-gray-400 text-sm font-medium pb-2 border-b border-gray-700">
                      <span>Selling price</span>
                      <span>Operation</span>
                      <span>Date/Time</span>
                    </div>

                    {mockData.salesHistory.map((sale, index) => (
                      <div key={index} className="grid grid-cols-3 gap-4 py-3 border-b border-gray-800 last:border-b-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-400">💎</span>
                          <span className="text-white font-medium">{sale.price}</span>
                        </div>
                        <span className="text-gray-300">{sale.operation}</span>
                        <span className="text-gray-400">{sale.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex space-x-4 p-6 border-t border-gray-700">
            <button className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all flex items-center justify-center space-x-2">
              <span>⚡</span>
              <span>Sell now</span>
            </button>
            <button className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center space-x-2">
              <span>🕒</span>
              <span>Sell | Ask</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}