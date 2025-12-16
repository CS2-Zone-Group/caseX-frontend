import api from './api';

interface SteamSkinData {
  success: boolean;
  price?: string;
  volume?: string;
  imageUrl?: string;
  iconUrl?: string;
  marketHashName?: string;
}

interface SteamApiResponse {
  success: boolean;
  data?: SteamSkinData;
  message?: string;
}

interface BatchSteamResponse {
  success: boolean;
  data?: (SteamSkinData | null)[];
  message?: string;
}

interface SteamSearchResponse {
  success: boolean;
  count: number;
  data: any[];
}

/**
 * Get single skin data from Steam
 */
export const getSteamSkinData = async (marketHashName: string): Promise<SteamSkinData | null> => {
  try {
    const response = await api.get<SteamApiResponse>(
      `/steam/skin/${encodeURIComponent(marketHashName)}`
    );
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to fetch Steam skin data:', error);
    return null;
  }
};

/**
 * Get multiple skins data from Steam in batch
 */
export const getBatchSteamSkinData = async (marketHashNames: string[]): Promise<(SteamSkinData | null)[]> => {
  try {
    const response = await api.post<BatchSteamResponse>('/steam/skins/batch', {
      marketHashNames,
    });
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    
    return [];
  } catch (error) {
    console.error('Failed to fetch batch Steam skin data:', error);
    return [];
  }
};

/**
 * Search for skins on Steam Market
 */
export const searchSteamSkins = async (
  query: string = '',
  start: number = 0,
  count: number = 10
): Promise<any[]> => {
  try {
    const response = await api.get<SteamSearchResponse>('/steam/search', {
      params: { query, start, count },
    });
    
    if (response.data.success) {
      return response.data.data;
    }
    
    return [];
  } catch (error) {
    console.error('Failed to search Steam skins:', error);
    return [];
  }
};

/**
 * Get popular CS:GO skins
 */
export const getPopularSteamSkins = async (count: number = 50): Promise<any[]> => {
  try {
    const response = await api.get<SteamSearchResponse>('/steam/popular', {
      params: { count },
    });
    
    if (response.data.success) {
      return response.data.data;
    }
    
    return [];
  } catch (error) {
    console.error('Failed to get popular Steam skins:', error);
    return [];
  }
};

/**
 * Parse skin information from Steam item
 */
export const parseSkinInfo = async (item: any): Promise<{
  weaponType: string;
  skinName: string;
  exterior: string;
  rarity: string;
  collection: string;
} | null> => {
  try {
    const response = await api.post('/steam/parse-skin', { item });
    
    if (response.data.success) {
      return response.data.data;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to parse skin info:', error);
    return null;
  }
};

/**
 * Import skin from Steam to database
 */
export const importSkinFromSteam = async (steamItem: any): Promise<boolean> => {
  try {
    // First parse the skin info
    const skinInfo = await parseSkinInfo(steamItem);
    if (!skinInfo) {
      return false;
    }

    // Get price data
    const priceData = await getSteamSkinData(steamItem.market_hash_name);
    
    // Create skin object
    const skinData = {
      name: skinInfo.skinName,
      weaponType: skinInfo.weaponType,
      rarity: skinInfo.rarity,
      exterior: skinInfo.exterior,
      collection: skinInfo.collection,
      marketHashName: steamItem.market_hash_name,
      steamIconUrl: steamItem.icon_url,
      imageUrl: steamItem.icon_url ? 
        `https://community.cloudflare.steamstatic.com/economy/image/${steamItem.icon_url}/330x192` :
        '/images/default-skin.png',
      steamPrice: priceData?.price,
      steamVolume: priceData?.volume,
      price: priceData?.price ? parseFloat(priceData.price.replace('$', '')) : 0,
    };

    // Save to database
    const response = await api.post('/skins', skinData);
    return response.data.success || response.status === 201;
  } catch (error) {
    console.error('Failed to import skin from Steam:', error);
    return false;
  }
};

/**
 * Bulk import skins from Steam
 */
export const bulkImportSkinsFromSteam = async (steamItems: any[]): Promise<{
  imported: number;
  failed: number;
  errors: string[];
}> => {
  const result = {
    imported: 0,
    failed: 0,
    errors: [] as string[],
  };

  for (const item of steamItems) {
    try {
      const success = await importSkinFromSteam(item);
      if (success) {
        result.imported++;
      } else {
        result.failed++;
        result.errors.push(`Failed to import: ${item.market_name || item.name}`);
      }
      
      // Add delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      result.failed++;
      result.errors.push(`Error importing ${item.market_name || item.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  return result;
};

/**
 * Generate Steam image URL for a skin
 */
export const getSteamImageUrl = async (
  marketHashName: string, 
  size: 'small' | 'medium' | 'large' = 'medium'
): Promise<string | null> => {
  try {
    const response = await api.get(
      `/steam/image-url/${encodeURIComponent(marketHashName)}?size=${size}`
    );
    
    if (response.data.success) {
      return response.data.imageUrl;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to get Steam image URL:', error);
    return null;
  }
};

/**
 * Get image URL from Steam CDN using icon URL
 */
export const getSteamCdnImageUrl = async (
  iconUrl: string,
  size: 'small' | 'medium' | 'large' = 'medium'
): Promise<string | null> => {
  try {
    const response = await api.get(
      `/steam/cdn-image/${encodeURIComponent(iconUrl)}?size=${size}`
    );
    
    if (response.data.success) {
      return response.data.imageUrl;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to get Steam CDN image URL:', error);
    return null;
  }
};

/**
 * Update single skin with Steam data
 */
export const updateSkinSteamData = async (skinId: string): Promise<boolean> => {
  try {
    const response = await api.post(`/skins/${skinId}/update-steam-data`);
    return response.data.success;
  } catch (error) {
    console.error('Failed to update skin Steam data:', error);
    return false;
  }
};

/**
 * Update all skins with Steam data
 */
export const updateAllSkinsSteamData = async (): Promise<{ updated: number; failed: number } | null> => {
  try {
    const response = await api.post('/skins/update-all-steam-data');
    
    if (response.data.success) {
      return response.data.data;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to update all skins Steam data:', error);
    return null;
  }
};

/**
 * Get skin image URL with Steam integration
 */
export const getSkinImageUrl = async (
  skinId: string,
  size: 'small' | 'medium' | 'large' = 'medium'
): Promise<string | null> => {
  try {
    const response = await api.get(`/skins/${skinId}/image-url?size=${size}`);
    
    if (response.data.success) {
      return response.data.imageUrl;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to get skin image URL:', error);
    return null;
  }
};

/**
 * Clear Steam service cache
 */
export const clearSteamCache = async (): Promise<boolean> => {
  try {
    const response = await api.post('/steam/cache/clear');
    return response.data.success;
  } catch (error) {
    console.error('Failed to clear Steam cache:', error);
    return false;
  }
};

/**
 * Get Steam cache statistics
 */
export const getSteamCacheStats = async (): Promise<{ size: number; keys: string[] } | null> => {
  try {
    const response = await api.get('/steam/cache/stats');
    
    if (response.data.success) {
      return response.data.stats;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to get Steam cache stats:', error);
    return null;
  }
};

/**
 * Generate market hash name from skin data
 */
export const generateMarketHashName = (weaponName: string, skinName: string, exterior?: string): string => {
  let hashName = `${weaponName} | ${skinName}`;
  
  if (exterior && exterior !== 'Not Painted') {
    hashName += ` (${exterior})`;
  }
  
  return hashName;
};

/**
 * Validate market hash name format
 */
export const isValidMarketHashName = (marketHashName: string): boolean => {
  // Basic validation for CS:GO market hash names
  return marketHashName.includes('|') && marketHashName.length > 5;
};

/**
 * Get fallback image URL
 */
export const getFallbackImageUrl = (skinName?: string): string => {
  // Return a default skin image or generate a placeholder
  return '/images/default-skin.svg';
};