'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import api from '@/lib/api';

interface Skin {
  id: string;
  name: string;
  weaponType: string;
  rarity: string;
  exterior: string;
  price: number;
  imageUrl: string;
}

export default function MarketplacePage() {
  const [skins, setSkins] = useState<Skin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/skins')
      .then(({ data }) => {
        setSkins(data.items);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          Yuklanmoqda...
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Marketplace</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {skins.map((skin) => (
            <div
              key={skin.id}
              className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:shadow-lg transition"
            >
              <img
                src={skin.imageUrl}
                alt={skin.name}
                className="w-full h-48 object-contain mb-4"
              />
              <h3 className="font-semibold mb-2">{skin.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {skin.exterior}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-primary-600">
                  {skin.price.toFixed(2)} so'm
                </span>
                <button className="px-4 py-2 bg-primary-600 text-white text-sm rounded hover:bg-primary-700">
                  Sotib olish
                </button>
              </div>
            </div>
          ))}
        </div>

        {skins.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Hozircha skinlar yo'q
          </div>
        )}
      </main>
    </>
  );
}
