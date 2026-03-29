'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { toast } from '@/store/toastStore';
import Loader from '@/components/Loader';

interface BotStatus {
  id: number;
  username: string;
  isLoggedIn: boolean;
  steamId: string | null;
  activeTradesCount: number;
}

interface BotInventoryItem {
  assetid: string;
  name: string;
  market_name: string;
  icon_url: string;
  tradable: boolean;
  marketable: boolean;
}

export default function AdminSteamBotsPage() {
  const [bots, setBots] = useState<BotStatus[]>([]);
  const [totalBots, setTotalBots] = useState(0);
  const [readyBots, setReadyBots] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedBot, setSelectedBot] = useState<number | null>(null);
  const [inventory, setInventory] = useState<BotInventoryItem[]>([]);
  const [invLoading, setInvLoading] = useState(false);

  const fetchStatus = useCallback(async () => {
    try {
      const { data } = await api.get('/steam-bot/status');
      setBots(data.bots || []);
      setTotalBots(data.totalBots || 0);
      setReadyBots(data.readyBots || 0);
    } catch {
      toast.error('Bot status yuklanmadi');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStatus(); }, [fetchStatus]);

  const loadInventory = async (botId: number) => {
    if (selectedBot === botId) { setSelectedBot(null); return; }
    setSelectedBot(botId);
    setInvLoading(true);
    try {
      const { data } = await api.get(`/steam-bot/inventory/${botId}`);
      setInventory(data.items || []);
    } catch {
      toast.error('Inventar yuklanmadi');
      setInventory([]);
    } finally {
      setInvLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader /></div>;

  return (
    <div className="p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Steam Botlar</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {readyBots}/{totalBots} bot online
          </span>
          <button onClick={fetchStatus} className="p-2 text-gray-400 hover:text-white transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Bot Cards */}
      <div className="grid gap-4 mb-6">
        {bots.map((bot) => (
          <div key={bot.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Status dot */}
                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${bot.isLoggedIn ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                <div>
                  <p className="text-white font-semibold">{bot.username}</p>
                  <p className="text-xs text-gray-500">
                    {bot.steamId || 'Steam ID mavjud emas'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-gray-500">Status</p>
                  <span className={`text-sm font-medium ${bot.isLoggedIn ? 'text-green-400' : 'text-red-400'}`}>
                    {bot.isLoggedIn ? 'Online' : 'Offline'}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Active Trades</p>
                  <span className="text-sm font-medium text-white">{bot.activeTradesCount}</span>
                </div>
                <button
                  onClick={() => loadInventory(bot.id)}
                  disabled={!bot.isLoggedIn}
                  className={`px-3 py-1.5 text-sm rounded-lg transition ${
                    selectedBot === bot.id
                      ? 'bg-blue-600 text-white'
                      : bot.isLoggedIn
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  {selectedBot === bot.id ? 'Yopish' : 'Inventar'}
                </button>
              </div>
            </div>

            {/* Inventory */}
            {selectedBot === bot.id && (
              <div className="border-t border-gray-700 p-5">
                {invLoading ? (
                  <div className="flex justify-center py-8"><Loader /></div>
                ) : inventory.length === 0 ? (
                  <p className="text-center text-gray-500 py-8 text-sm">Inventar bo'sh</p>
                ) : (
                  <>
                    <p className="text-xs text-gray-500 mb-3">{inventory.length} ta item</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {inventory.map((item) => (
                        <div key={item.assetid} className="bg-gray-900 rounded-lg p-2 border border-gray-700/50">
                          <div className="aspect-square bg-gray-800 rounded mb-2 flex items-center justify-center overflow-hidden">
                            <img
                              src={`https://community.akamai.steamstatic.com/economy/image/${item.icon_url}/128x128`}
                              alt={item.name}
                              className="w-full h-full object-contain p-1"
                              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                          </div>
                          <p className="text-[10px] text-white truncate" title={item.market_name || item.name}>
                            {item.market_name || item.name}
                          </p>
                          <div className="flex gap-1 mt-1">
                            {item.tradable && <span className="text-[8px] px-1 py-0.5 bg-green-500/20 text-green-400 rounded">Trade</span>}
                            {item.marketable && <span className="text-[8px] px-1 py-0.5 bg-blue-500/20 text-blue-400 rounded">Market</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {bots.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg">Hech qanday bot sozlanmagan</p>
          <p className="text-sm mt-1">STEAM_BOT_COUNT va credentials .env da sozlang</p>
        </div>
      )}
    </div>
  );
}
