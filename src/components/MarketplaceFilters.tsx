'use client';

import {  useState } from 'react';
import { useSettingsStore } from '@/store/settingsStore';
import { translations } from '@/lib/translations';
import { useFilterStore } from '@/store/filterStore';

interface MarketplaceFiltersProps {
  onFilterChange?: (filters: any) => void;
  filters: any;
}

export default function MarketplaceFilters({ onFilterChange, filters }: MarketplaceFiltersProps) {
  const { language } = useSettingsStore();
  const t = translations[language];
  const [isOpen, setIsOpen] = useState(true);
  const [sortOpen, setSortOpen] = useState(false);
  const [rarityOpen, setRarityOpen] = useState(false);
  const [weaponTypeOpen, setWeaponTypeOpen] = useState(false);
  const [exteriorOpen, setExteriorOpen] = useState(false);
  const [priceRangeOpen, setPriceRangeOpen] = useState(false);
  const {searchQuery,sortBy,rarity,weaponType,condition,priceRange,setFilter,setPriceRange,setSearchQuery,setSortBy,resetFilters}=useFilterStore()
  





  const rarityOptions = [
    { 
      label: t.allRarities, 
      value: '',
      uz: 'Barcha raritylar',
      ru: 'Все редкости',
      en: 'All rarities'
    },
    { 
      label: language === 'uz' ? 'Consumer Grade' : language === 'ru' ? 'Потребительский' : 'Consumer Grade', 
      value: 'consumer' 
    },
    { 
      label: language === 'uz' ? 'Industrial Grade' : language === 'ru' ? 'Промышленный' : 'Industrial Grade', 
      value: 'industrial' 
    },
    { 
      label: language === 'uz' ? 'Mil-Spec' : language === 'ru' ? 'Армейский' : 'Mil-Spec', 
      value: 'milspec' 
    },
    { 
      label: language === 'uz' ? 'Restricted' : language === 'ru' ? 'Запрещённый' : 'Restricted', 
      value: 'restricted' 
    },
    { 
      label: language === 'uz' ? 'Classified' : language === 'ru' ? 'Засекреченный' : 'Classified', 
      value: 'classified' 
    },
    { 
      label: language === 'uz' ? 'Covert' : language === 'ru' ? 'Тайный' : 'Covert', 
      value: 'covert' 
    },
    { 
      label: language === 'uz' ? 'Contraband' : language === 'ru' ? 'Контрабанда' : 'Contraband', 
      value: 'contraband' 
    }
  ];

  const weaponTypes = [
    { 
      label: language === 'uz' ? 'Barcha qurollar' : language === 'ru' ? 'Все оружия' : 'All Weapons', 
      value: '' 
    },
    { 
      label: language === 'uz' ? 'Pistoletlar' : language === 'ru' ? 'Пистолеты' : 'Pistols', 
      value: 'pistol' 
    },
    { 
      label: language === 'uz' ? 'Miltiqlar' : language === 'ru' ? 'Винтовки' : 'Rifles', 
      value: 'rifle' 
    },
    { 
      label: language === 'uz' ? 'SMG' : language === 'ru' ? 'ПП' : 'SMGs', 
      value: 'smg' 
    },
    { 
      label: language === 'uz' ? 'Snayperlar' : language === 'ru' ? 'Снайперские' : 'Snipers', 
      value: 'sniper' 
    },
    { 
      label: language === 'uz' ? 'Ov miltiqlar' : language === 'ru' ? 'Дробовики' : 'Shotguns', 
      value: 'shotgun' 
    },
    { 
      label: language === 'uz' ? 'Pichoqlar' : language === 'ru' ? 'Ножи' : 'Knives', 
      value: 'knife' 
    },
    { 
      label: language === 'uz' ? 'Qo\'lqoplar' : language === 'ru' ? 'Перчатки' : 'Gloves', 
      value: 'gloves' 
    }
  ];

  const exteriorOptions = [
    { 
      label: language === 'uz' ? 'Barcha holatlar' : language === 'ru' ? 'Все состояния' : 'All Conditions', 
      value: '' 
    },
    { 
      label: language === 'uz' ? 'Zavod yangi' : language === 'ru' ? 'Прямо с завода' : 'Factory New', 
      value: 'Factory New' 
    },
    { 
      label: language === 'uz' ? 'Kam eskirgan' : language === 'ru' ? 'Немного поношенное' : 'Minimal Wear', 
      value: 'Minimal Wear' 
    },
    { 
      label: language === 'uz' ? 'Maydon sinovdan o\'tgan' : language === 'ru' ? 'После полевых испытаний' : 'Field-Tested', 
      value: 'Field-Tested' 
    },
    { 
      label: language === 'uz' ? 'Yaxshi eskirgan' : language === 'ru' ? 'Поношенное' : 'Well-Worn', 
      value: 'Well-Worn' 
    },
    { 
      label: language === 'uz' ? 'Jang izlari' : language === 'ru' ? 'Закалённое в боях' : 'Battle-Scarred', 
      value: 'Battle-Scarred' 
    }
  ];

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    onFilterChange?.(newFilters);
  };

  const sortOptions = [
    { 
      label: t.newest, 
      value: 'createdAt-DESC' 
    },
    { 
      label: t.cheapest, 
      value: 'price-ASC' 
    },
    { 
      label: t.expensive, 
      value: 'price-DESC' 
    },
    { 
      label: t.nameAZ, 
      value: 'name-ASC' 
    }
  ];

  return (
    <div className="w-full lg:w-80 bg-white dark:bg-gray-900 rounded-xl p-4 h-fit shadow-lg border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white">
          {language === 'uz' ? 'Filtrlar' : language === 'ru' ? 'Фильтры' : 'Filters'}
        </h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white lg:hidden"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {(isOpen || (typeof window !== 'undefined' && window.innerWidth >= 1024)) && (
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder={t.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery( e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-600"
            />
            <svg className="absolute right-3 top-2.5 w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Sort */}
          <div>
            <button 
              onClick={() => setSortOpen(!sortOpen)}
              className="w-full flex items-center justify-between text-gray-900 dark:text-white py-2"
            >
              <span>{language === 'uz' ? 'Saralash' : language === 'ru' ? 'Сортировка' : 'Sort'}</span>
              <svg className={`w-4 h-4 transition-transform ${sortOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
           {sortOpen && (
                 <select
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value)}   
                        className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-600 mt-2"
                      >
                        {sortOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                </select>
                    )}
          </div>

          {/* Rarity */}
          <div>
            <button 
              onClick={() => setRarityOpen(!rarityOpen)}
              className="w-full flex items-center justify-between text-gray-900 dark:text-white py-2"
            >
              <span>{language === 'uz' ? 'Kamyoblik' : language === 'ru' ? 'Редкость' : 'Rarity'}</span>
              <svg className={`w-4 h-4 transition-transform ${rarityOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {rarityOpen && (
              <select
                value={rarity||''}
                onChange={(e) => setFilter('rarity', e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-600 mt-2"
              >
                {rarityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Weapon Type */}
          <div>
            <button 
              onClick={() => setWeaponTypeOpen(!weaponTypeOpen)}
              className="w-full flex items-center justify-between text-gray-900 dark:text-white py-2"
            >
              <span>{language === 'uz' ? 'Qurol turi' : language === 'ru' ? 'Тип оружия' : 'Weapon Type'}</span>
              <svg className={`w-4 h-4 transition-transform ${weaponTypeOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {weaponTypeOpen && (
              <select
                value={weaponType||''}
                onChange={(e) => setFilter('weaponType', e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-600 mt-2"
              >
                {weaponTypes.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Exterior */}
          <div>
            <button 
              onClick={() => setExteriorOpen(!exteriorOpen)}
              className="w-full flex items-center justify-between text-gray-900 dark:text-white py-2"
            >
              <span>{language === 'uz' ? 'Holat' : language === 'ru' ? 'Состояние' : 'Exterior'}</span>
              <svg className={`w-4 h-4 transition-transform ${exteriorOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {exteriorOpen && (
              <select
                value={condition||''}
                onChange={(e) => setFilter('condition', e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-600 mt-2"
              >
                {exteriorOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Price Range */}
          <div>
            <button 
              onClick={() => setPriceRangeOpen(!priceRangeOpen)}
              className="w-full flex items-center justify-between text-gray-900 dark:text-white py-2"
            >
              <span>{language === 'uz' ? 'Narx oralig\'i' : language === 'ru' ? 'Диапазон цен' : 'Price Range'}</span>
              <svg className={`w-4 h-4 transition-transform ${priceRangeOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {priceRangeOpen && (
              <div className="grid grid-cols-2 gap-3 mt-2">
                <input
                  type="number"
                  placeholder="0"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(Number(e.target.value),priceRange.max)}
                  className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-600"
                />
                <input
                  type="number"
                  placeholder="∞"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(priceRange.min,Number(e.target.value))}
                  className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-600"
                />
              </div>
            )}
          </div>

          {/* Reset Button */}
          <button 
            onClick={() =>resetFilters()}
            className="w-full py-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition"
          >
            {language === 'uz' ? 'Filtrlarni tozalash' : language === 'ru' ? 'Сбросить фильтры' : 'Reset Filters'}
          </button>
        </div>
      )}
    </div>
  );
}