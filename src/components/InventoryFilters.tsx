'use client';

import { useState } from 'react';

interface FilterOption {
  label: string;
  value: string;
}

interface InventoryFiltersProps {
  onFilterChange?: (filters: any) => void;
}

export default function InventoryFilters({ onFilterChange }: InventoryFiltersProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 7]);
  const [selectedExterior, setSelectedExterior] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string[]>([]);
  const [proSkinsOnly, setProSkinsOnly] = useState(false);
  const [extraFilters, setExtraFilters] = useState(false);
  const [tradeLockOnly, setTradeLockOnly] = useState(false);

  const exteriorOptions = [
    { label: 'All', value: 'all' },
    { label: 'Factory New', value: 'fn' },
    { label: 'Minimal Wear', value: 'mw' },
    { label: 'Field-Tested', value: 'ft' },
    { label: 'Well-Worn', value: 'ww' },
    { label: 'Battle-Scarred', value: 'bs' }
  ];

  const categoryOptions = [
    { label: 'Pistols', value: 'pistols' },
    { label: 'Rifles', value: 'rifles' },
    { label: 'SMGs', value: 'smgs' },
    { label: 'Snipers', value: 'snipers' },
    { label: 'Knives', value: 'knives' },
    { label: 'Gloves', value: 'gloves' }
  ];

  const handleExteriorToggle = (value: string) => {
    if (value === 'all') {
      setSelectedExterior([]);
    } else {
      setSelectedExterior(prev =>
        prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
      );
    }
  };

  return (
    <div className="w-full lg:w-80 bg-gray-900 rounded-xl p-4 h-fit">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg lg:text-xl font-bold text-white">Filters</h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-400 hover:text-white lg:hidden"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {(isOpen || window.innerWidth >= 1024) && (
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search inventory"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 text-white px-4 py-2 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
            />
            <svg className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Pro Skins */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-white">Pro Skins</span>
              <span className="px-2 py-0.5 bg-pink-500 text-white text-xs font-bold rounded">NEW</span>
            </div>
            <button
              onClick={() => setProSkinsOnly(!proSkinsOnly)}
              className={`relative w-12 h-6 rounded-full transition ${
                proSkinsOnly ? 'bg-primary-500' : 'bg-gray-700'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  proSkinsOnly ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </div>

          {/* Items Location */}
          <div>
            <button className="w-full flex items-center justify-between text-white py-2">
              <span>Items' location</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Trade Lock */}
          <div>
            <button className="w-full flex items-center justify-between text-white py-2">
              <div className="flex items-center gap-2">
                <span>Trade lock (by days)</span>
                <div className="w-4 h-4 bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-xs text-gray-400">?</span>
                </div>
              </div>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Price Range Slider */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>{priceRange[0]}</span>
                <span>{priceRange[1]}</span>
              </div>
              <input
                type="range"
                min="0"
                max="7"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Exterior */}
          <div>
            <button className="w-full flex items-center justify-between text-white py-2 mb-2">
              <span>Exterior</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <div className="space-y-2">
              {exteriorOptions.map((option) => (
                <label key={option.value} className="flex items-center gap-2 text-gray-300 cursor-pointer hover:text-white">
                  <input
                    type="checkbox"
                    checked={option.value === 'all' ? selectedExterior.length === 0 : selectedExterior.includes(option.value)}
                    onChange={() => handleExteriorToggle(option.value)}
                    className="w-4 h-4 rounded border-gray-600 text-primary-600 focus:ring-primary-600"
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Extra */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-white">Extra</span>
              <span className="px-2 py-0.5 bg-pink-500 text-white text-xs font-bold rounded">NEW</span>
            </div>
            <button
              onClick={() => setExtraFilters(!extraFilters)}
              className={`relative w-12 h-6 rounded-full transition ${
                extraFilters ? 'bg-primary-500' : 'bg-gray-700'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  extraFilters ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </div>

          {/* Items Category */}
          <div>
            <button className="w-full flex items-center justify-between text-white py-2">
              <span>Items category</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Collection */}
          <div>
            <button className="w-full flex items-center justify-between text-white py-2">
              <span>Collection</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Reset Button */}
          <button className="w-full py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition">
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
