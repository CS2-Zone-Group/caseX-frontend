"use client";

import { useState } from "react";
import { useFilterStore } from "@/store/filterStore";
import { useTranslations } from "next-intl";

interface MarketplaceFiltersProps {
  onFilterChange?: (filters: any) => void;
  filters: any;
}

export default function MarketplaceFilters({
  onFilterChange,
  filters,
}: MarketplaceFiltersProps) {
  const t = useTranslations("MarketplaceFilters");
  const [isOpen, setIsOpen] = useState(true);
  const [sortOpen, setSortOpen] = useState(false);
  const [rarityOpen, setRarityOpen] = useState(false);
  const [weaponTypeOpen, setWeaponTypeOpen] = useState(false);
  const [exteriorOpen, setExteriorOpen] = useState(false);
  const [priceRangeOpen, setPriceRangeOpen] = useState(false);
  const {
    searchQuery,
    sortBy,
    rarity,
    weaponType,
    condition,
    priceRange,
    setFilter,
    setPriceRange,
    setSearchQuery,
    setSortBy,
    resetFilters,
  } = useFilterStore();

  const rarityOptions = [
    { label: t("rarityOptions.all"), value: "" },
    { label: t("rarityOptions.consumer"), value: "consumer" },
    { label: t("rarityOptions.industrial"), value: "industrial" },
    { label: t("rarityOptions.milspec"), value: "milspec" },
    { label: t("rarityOptions.restricted"), value: "restricted" },
    { label: t("rarityOptions.classified"), value: "classified" },
    { label: t("rarityOptions.covert"), value: "covert" },
    { label: t("rarityOptions.contraband"), value: "contraband" },
  ];

  const weaponTypes = [
    { label: t("weaponTypes.all"), value: "" },
    { label: t("weaponTypes.pistol"), value: "pistol" },
    { label: t("weaponTypes.rifle"), value: "rifle" },
    { label: t("weaponTypes.smg"), value: "smg" },
    { label: t("weaponTypes.sniper"), value: "sniper" },
    { label: t("weaponTypes.shotgun"), value: "shotgun" },
    { label: t("weaponTypes.knife"), value: "knife" },
    { label: t("weaponTypes.gloves"), value: "gloves" },
  ];

  const exteriorOptions = [
    { label: t("exteriorOptions.all"), value: "" },
    { label: t("exteriorOptions.factoryNew"), value: "Factory New" },
    { label: t("exteriorOptions.minimalWear"), value: "Minimal Wear" },
    { label: t("exteriorOptions.fieldTested"), value: "Field-Tested" },
    { label: t("exteriorOptions.wellWorn"), value: "Well-Worn" },
    { label: t("exteriorOptions.battleScarred"), value: "Battle-Scarred" },
  ];

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    onFilterChange?.(newFilters);
  };

  const sortOptions = [
    { label: t("sortOptions.newest"), value: "createdAt-DESC" },
    { label: t("sortOptions.cheapest"), value: "price-ASC" },
    { label: t("sortOptions.expensive"), value: "price-DESC" },
    { label: t("sortOptions.nameAZ"), value: "name-ASC" },
  ];

  return (
    <div className="w-full lg:w-80 bg-white dark:bg-gray-900 rounded-xl p-4 h-fit shadow-lg border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white">
          {t("title")}
        </h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white lg:hidden"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {(isOpen ||
        (typeof window !== "undefined" && window.innerWidth >= 1024)) && (
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder={t("search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-1.5 pr-9 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-600 text-sm h-8"
            />
            <svg
              className="absolute right-2.5 top-2 w-4 h-4 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Sort */}
          <div>
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="w-full flex items-center justify-between text-gray-900 dark:text-white py-1.5"
            >
              <span className="text-sm font-medium">{t("sort")}</span>
              <svg
                className={`w-5 h-5 transition-transform ${
                  sortOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {sortOpen && (
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white pl-3 pr-10 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-600 mt-2 text-sm h-8 appearance-none bg-no-repeat bg-[length:16px] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQgNkw4IDEwTDEyIDYiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cg==')] bg-[position:right_0.75rem_center]"
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
              className="w-full flex items-center justify-between text-gray-900 dark:text-white py-1.5"
            >
              <span className="text-sm font-medium">{t("rarity")}</span>
              <svg
                className={`w-5 h-5 transition-transform ${
                  rarityOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {rarityOpen && (
              <select
                value={rarity || ""}
                onChange={(e) => setFilter("rarity", e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white pl-3 pr-10 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-600 mt-2 text-sm h-8 appearance-none bg-no-repeat bg-[length:16px] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQgNkw4IDEwTDEyIDYiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cg==')] bg-[position:right_0.75rem_center]"
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
              className="w-full flex items-center justify-between text-gray-900 dark:text-white py-1.5"
            >
              <span className="text-sm font-medium">{t("weaponType")}</span>
              <svg
                className={`w-5 h-5 transition-transform ${
                  weaponTypeOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {weaponTypeOpen && (
              <select
                value={weaponType || ""}
                onChange={(e) => setFilter("weaponType", e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white pl-3 pr-10 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-600 mt-2 text-sm h-8 appearance-none bg-no-repeat bg-[length:16px] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQgNkw4IDEwTDEyIDYiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cg==')] bg-[position:right_0.75rem_center]"
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
              className="w-full flex items-center justify-between text-gray-900 dark:text-white py-1.5"
            >
              <span className="text-sm font-medium">{t("exterior")}</span>
              <svg
                className={`w-5 h-5 transition-transform ${
                  exteriorOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {exteriorOpen && (
              <select
                value={condition || ""}
                onChange={(e) => setFilter("condition", e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white pl-3 pr-10 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-600 mt-2 text-sm h-8 appearance-none bg-no-repeat bg-[length:16px] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQgNkw4IDEwTDEyIDYiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cg==')] bg-[position:right_0.75rem_center]"
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
              className="w-full flex items-center justify-between text-gray-900 dark:text-white py-1.5"
            >
              <span className="text-sm font-medium">{t("priceRange")}</span>
              <svg
                className={`w-5 h-5 transition-transform ${
                  priceRangeOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {priceRangeOpen && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min || ""}
                  onChange={(e) =>
                    setPriceRange(Number(e.target.value) || 0, priceRange.max)
                  }
                  className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-600 text-sm h-8"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max || ""}
                  onChange={(e) =>
                    setPriceRange(priceRange.min, Number(e.target.value) || 0)
                  }
                  className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-600 text-sm h-8"
                />
              </div>
            )}
          </div>

          {/* Reset Button */}
          <button
            onClick={() => resetFilters()}
            className="w-full py-1.5 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition text-sm h-8"
          >
            {t("resetFilters")}
          </button>
        </div>
      )}
    </div>
  );
}
