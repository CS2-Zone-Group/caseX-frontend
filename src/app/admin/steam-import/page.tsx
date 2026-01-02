'use client';

import { useState, useEffect } from 'react';
import { searchSteamSkins, getPopularSteamSkins, importSkinFromSteam, bulkImportSkinsFromSteam } from '@/lib/steam';
import SkinDetailsModal from '@/components/SkinDetailsModal';

interface SteamItem {
  market_hash_name: string;
  market_name: string;
  name: string;
  icon_url: string;
  tags: Array<{
    category: string;
    localized_tag_name: string;
  }>;
}

export default function SteamImportPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SteamItem[]>([]);
  const [popularSkins, setPopularSkins] = useState<SteamItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState({ imported: 0, failed: 0, total: 0 });
  const [selectedSkin, setSelectedSkin] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Simple English translations for now
  const t = {
    title: 'Steam Skin Import',
    searchPlaceholder: 'Search for skins (e.g., AK-47, AWP)',
    search: 'Search',
    popularSkins: 'Popular Skins',
    loadPopular: 'Load Popular Skins',
    selectAll: 'Select All',
    deselectAll: 'Deselect All',
    importSelected: 'Import Selected',
    importing: 'Importing...',
    importProgress: 'Progress: {imported} imported, {failed} failed, {remaining} remaining',
    noResults: 'No results found',
    weapon: 'Weapon',
    rarity: 'Rarity',
    exterior: 'Exterior',
    price: 'Price',
    selected: 'selected',
    importSuccess: 'Successfully imported {count} skins',
    importError: 'Import completed with {failed} errors',
  };

  useEffect(() => {
    loadPopularSkins();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const results = await searchSteamSkins(searchQuery, 0, 50);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPopularSkins = async () => {
    setLoading(true);
    try {
      const results = await getPopularSteamSkins(50);
      setPopularSkins(results);
    } catch (error) {
      console.error('Failed to load popular skins:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (marketHashName: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(marketHashName)) {
      newSelected.delete(marketHashName);
    } else {
      newSelected.add(marketHashName);
    }
    setSelectedItems(newSelected);
  };

  const selectAll = (items: SteamItem[]) => {
    const newSelected = new Set(selectedItems);
    items.forEach(item => newSelected.add(item.market_hash_name));
    setSelectedItems(newSelected);
  };

  const deselectAll = () => {
    setSelectedItems(new Set());
  };

  const importSelected = async () => {
    const itemsToImport = [...searchResults, ...popularSkins].filter(
      item => selectedItems.has(item.market_hash_name)
    );

    if (itemsToImport.length === 0) return;

    setImporting(true);
    setImportProgress({ imported: 0, failed: 0, total: itemsToImport.length });

    try {
      const result = await bulkImportSkinsFromSteam(itemsToImport);
      setImportProgress({ 
        imported: result.imported, 
        failed: result.failed, 
        total: itemsToImport.length 
      });

      if (result.failed === 0) {
        alert(t.importSuccess.replace('{count}', result.imported.toString()));
      } else {
        alert(t.importError.replace('{failed}', result.failed.toString()));
      }

      // Clear selection after import
      setSelectedItems(new Set());
    } catch (error) {
      console.error('Import failed:', error);
    } finally {
      setImporting(false);
    }
  };

  const openSkinDetails = (item: SteamItem) => {
    // Convert SteamItem to Skin format for the modal
    const convertedSkin = {
      id: item.market_hash_name,
      name: item.name || item.market_name,
      weaponType: item.tags?.find(tag => tag.category === 'Weapon')?.localized_tag_name || 'Unknown',
      rarity: item.tags?.find(tag => tag.category === 'Rarity')?.localized_tag_name || 'Unknown',
      exterior: item.tags?.find(tag => tag.category === 'Exterior')?.localized_tag_name || 'Unknown',
      price: 0, // Steam items don't have our price
      imageUrl: item.icon_url.startsWith('http') 
        ? item.icon_url 
        : `https://community.cloudflare.steamstatic.com/economy/image/${item.icon_url}/330x192`,
      marketHashName: item.market_hash_name,
      steamIconUrl: item.icon_url,
      collection: item.tags?.find(tag => tag.category === 'ItemSet')?.localized_tag_name,
      isAvailable: true
    };
    setSelectedSkin(convertedSkin as any);
    setIsModalOpen(true);
  };

  const closeSkinDetails = () => {
    setIsModalOpen(false);
    setSelectedSkin(null);
  };

  const renderSkinCard = (item: SteamItem) => {
    const isSelected = selectedItems.has(item.market_hash_name);
    const weaponTag = item.tags?.find(tag => tag.category === 'Weapon');
    const rarityTag = item.tags?.find(tag => tag.category === 'Rarity');
    const exteriorTag = item.tags?.find(tag => tag.category === 'Exterior');

    return (
      <div
        key={item.market_hash_name}
        className={`border rounded-lg p-4 cursor-pointer transition-all ${
          isSelected 
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
        }`}
      >
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => toggleSelection(item.market_hash_name)}
            className="w-4 h-4 text-primary-600 rounded"
            onClick={(e) => e.stopPropagation()}
          />
          
          <div 
            className="w-16 h-12 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden flex items-center justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            onClick={() => openSkinDetails(item)}
          >
            {item.icon_url ? (
              <img
                src={`https://community.cloudflare.steamstatic.com/economy/image/${item.icon_url}/64x48`}
                alt={item.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = '<div class="text-gray-400 text-xs">No Image</div>';
                  }
                }}
                onLoad={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.opacity = '1';
                }}
                style={{ opacity: '0', transition: 'opacity 0.3s' }}
              />
            ) : (
              <div className="text-gray-400 text-xs">No Image</div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 
              className="text-sm font-medium text-gray-900 dark:text-white truncate cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              onClick={() => openSkinDetails(item)}
            >
              {item.market_name || item.name}
            </h3>
            
            <div className="flex flex-wrap gap-2 mt-1">
              {weaponTag && (
                <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                  {weaponTag.localized_tag_name}
                </span>
              )}
              {rarityTag && (
                <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded">
                  {rarityTag.localized_tag_name}
                </span>
              )}
              {exteriorTag && (
                <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
                  {exteriorTag.localized_tag_name}
                </span>
              )}
            </div>
          </div>
          
          <button
            onClick={() => toggleSelection(item.market_hash_name)}
            className="ml-2 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            title="Select for import"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">{t.title}</h1>
            <p className="text-blue-100">Import CS:GO skins directly from Steam Market</p>
          </div>
          <div className="hidden lg:block">
            <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-100 dark:border-gray-700">
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? '...' : t.search}
          </button>
        </div>

        <button
          onClick={loadPopularSkins}
          disabled={loading}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
        >
          {loading ? '...' : t.loadPopular}
        </button>
      </div>

      {/* Selection Controls */}
      {(searchResults.length > 0 || popularSkins.length > 0) && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              <button
                onClick={() => selectAll([...searchResults, ...popularSkins])}
                className="text-primary-600 hover:text-primary-700"
              >
                {t.selectAll}
              </button>
              <button
                onClick={deselectAll}
                className="text-gray-600 hover:text-gray-700"
              >
                {t.deselectAll}
              </button>
              <span className="text-gray-500">
                {selectedItems.size} {t.selected}
              </span>
            </div>

            <button
              onClick={importSelected}
              disabled={selectedItems.size === 0 || importing}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {importing ? t.importing : t.importSelected}
            </button>
          </div>

          {importing && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-sm text-blue-800 dark:text-blue-200">
                {t.importProgress
                  .replace('{imported}', importProgress.imported.toString())
                  .replace('{failed}', importProgress.failed.toString())
                  .replace('{remaining}', (importProgress.total - importProgress.imported - importProgress.failed).toString())}
              </div>
              <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${((importProgress.imported + importProgress.failed) / importProgress.total) * 100}%`
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Search Results ({searchResults.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {searchResults.map(renderSkinCard)}
          </div>
        </div>
      )}

      {/* Popular Skins */}
      {popularSkins.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t.popularSkins} ({popularSkins.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {popularSkins.map(renderSkinCard)}
          </div>
        </div>
      )}

      {/* No Results */}
      {!loading && searchResults.length === 0 && popularSkins.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">{t.noResults}</p>
        </div>
      )}

      {/* Skin Details Modal */}
      <SkinDetailsModal
        isOpen={isModalOpen}
        onClose={closeSkinDetails}
        skin={selectedSkin}
      />
    </div>
  );
}