"use client";

import { useState, useEffect } from "react";
import { useFilterStore } from "@/store/filterStore";
import { useTranslations } from "next-intl";

interface FilterPanelProps {
  isVisible: boolean;
  onToggle: () => void;
}

export default function FilterPanel({ isVisible, onToggle }: FilterPanelProps) {
  const t = useTranslations("MarketplaceFilters");
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
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

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const rarityOptions = [
    { label: t("rarityOptions.all"), value: "" },
    { label: t("rarityOptions.consumer"), value: "Consumer Grade" },
    { label: t("rarityOptions.industrial"), value: "Industrial Grade" },
    { label: t("rarityOptions.milspec"), value: "Mil-Spec" },
    { label: t("rarityOptions.restricted"), value: "Restricted" },
    { label: t("rarityOptions.classified"), value: "Classified" },
    { label: t("rarityOptions.covert"), value: "Covert" },
    { label: t("rarityOptions.contraband"), value: "Contraband" },
  ];

  const weaponTypes = [
    { label: t("weaponTypes.all"), value: "" },
    { label: t("weaponTypes.pistol"), value: "Pistol" },
    { label: t("weaponTypes.rifle"), value: "Rifle" },
    { label: t("weaponTypes.smg"), value: "SMG" },
    { label: t("weaponTypes.sniper"), value: "Sniper Rifle" },
    { label: t("weaponTypes.shotgun"), value: "Shotgun" },
    { label: t("weaponTypes.knife"), value: "Knife" },
    { label: t("weaponTypes.gloves"), value: "Gloves" },
  ];

  const exteriorOptions = [
    { label: t("exteriorOptions.all"), value: "" },
    { label: t("exteriorOptions.factoryNew"), value: "Factory New" },
    { label: t("exteriorOptions.minimalWear"), value: "Minimal Wear" },
    { label: t("exteriorOptions.fieldTested"), value: "Field-Tested" },
    { label: t("exteriorOptions.wellWorn"), value: "Well-Worn" },
    { label: t("exteriorOptions.battleScarred"), value: "Battle-Scarred" },
  ];

  const sortOptions = [
    { label: t("sortOptions.newest"), value: "createdAt-DESC" },
    { label: t("sortOptions.cheapest"), value: "price-ASC" },
    { label: t("sortOptions.expensive"), value: "price-DESC" },
    { label: t("sortOptions.nameAZ"), value: "name-ASC" },
  ];

  // Count active filters
  const activeCount = [
    rarity,
    weaponType,
    condition,
    priceRange.min > 0 ? true : null,
    priceRange.max > 0 ? true : null,
    searchQuery ? true : null,
  ].filter(Boolean).length;

  const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
    <svg
      className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );

  const FilterSection = ({
    id,
    label,
    children,
    badge,
  }: {
    id: string;
    label: string;
    children: React.ReactNode;
    badge?: string | null;
  }) => {
    const isOpen = openSections[id] || false;
    return (
      <div className="border-b border-gray-100 dark:border-gray-700/50 last:border-0">
        <button
          onClick={() => toggleSection(id)}
          className="w-full flex items-center justify-between py-3 text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{label}</span>
            {badge && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded">
                {badge}
              </span>
            )}
          </div>
          <ChevronIcon isOpen={isOpen} />
        </button>
        {isOpen && <div className="pb-3">{children}</div>}
      </div>
    );
  };

  const selectClass =
    "w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white pl-3 pr-8 py-2 rounded-lg border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm appearance-none bg-no-repeat bg-[length:16px] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQgNkw4IDEwTDEyIDYiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cg==')] bg-[position:right_0.5rem_center]";

  if (!isVisible) return null;

  return (
    <div className="w-full lg:w-72 flex-shrink-0">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
              {t("title")}
            </h2>
            {activeCount > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-primary-600 text-white rounded-full min-w-[18px] text-center">
                {activeCount}
              </span>
            )}
          </div>
          <button
            onClick={onToggle}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded transition-colors lg:hidden"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-4 py-3 space-y-0">
          {/* Search */}
          <div className="pb-3 border-b border-gray-100 dark:border-gray-700/50">
            <div className="relative">
              <input
                type="text"
                placeholder={t("search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white pl-3 pr-9 py-2 rounded-lg border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
              <svg
                className="absolute right-2.5 top-2.5 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Sort */}
          <FilterSection id="sort" label={t("sort")} badge={sortBy !== "createdAt-DESC" && sortBy !== "default" ? "1" : null}>
            <select
              value={sortBy === "default" ? "createdAt-DESC" : sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={selectClass}
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FilterSection>

          {/* Rarity */}
          <FilterSection id="rarity" label={t("rarity")} badge={rarity || null}>
            <div className="space-y-1">
              {rarityOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setFilter("rarity", opt.value || null)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    (rarity || "") === opt.value
                      ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </FilterSection>

          {/* Weapon Type */}
          <FilterSection id="weaponType" label={t("weaponType")} badge={weaponType || null}>
            <div className="space-y-1">
              {weaponTypes.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setFilter("weaponType", opt.value || null)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    (weaponType || "") === opt.value
                      ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </FilterSection>

          {/* Exterior */}
          <FilterSection id="exterior" label={t("exterior")} badge={condition || null}>
            <div className="space-y-1">
              {exteriorOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setFilter("condition", opt.value || null)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    (condition || "") === opt.value
                      ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </FilterSection>

          {/* Price Range */}
          <FilterSection
            id="price"
            label={t("priceRange")}
            badge={priceRange.min > 0 || priceRange.max > 0 ? "1" : null}
          >
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={priceRange.min || ""}
                onChange={(e) => setPriceRange(Number(e.target.value) || 0, priceRange.max)}
                className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
              <span className="flex items-center text-gray-400 text-sm">—</span>
              <input
                type="number"
                placeholder="Max"
                value={priceRange.max || ""}
                onChange={(e) => setPriceRange(priceRange.min, Number(e.target.value) || 0)}
                className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
            </div>
          </FilterSection>

          {/* Reset */}
          {activeCount > 0 && (
            <div className="pt-3">
              <button
                onClick={() => resetFilters()}
                className="w-full py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {t("resetFilters")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
