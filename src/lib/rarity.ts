// Rarity color mapping for CS2 skins
const RARITY_COLORS: Record<string, { color: string; bg: string; gradient: string }> = {
  'consumer grade': { color: '#b0c3d9', bg: 'rgba(176,195,217,0.1)', gradient: 'linear-gradient(180deg, transparent 0%, rgba(176,195,217,0.15) 100%)' },
  'industrial grade': { color: '#5e98d9', bg: 'rgba(94,152,217,0.1)', gradient: 'linear-gradient(180deg, transparent 0%, rgba(94,152,217,0.15) 100%)' },
  'mil-spec': { color: '#4b69ff', bg: 'rgba(75,105,255,0.1)', gradient: 'linear-gradient(180deg, transparent 0%, rgba(75,105,255,0.2) 100%)' },
  'mil-specgrade': { color: '#4b69ff', bg: 'rgba(75,105,255,0.1)', gradient: 'linear-gradient(180deg, transparent 0%, rgba(75,105,255,0.2) 100%)' },
  'milspec': { color: '#4b69ff', bg: 'rgba(75,105,255,0.1)', gradient: 'linear-gradient(180deg, transparent 0%, rgba(75,105,255,0.2) 100%)' },
  'restricted': { color: '#8847ff', bg: 'rgba(136,71,255,0.1)', gradient: 'linear-gradient(180deg, transparent 0%, rgba(136,71,255,0.2) 100%)' },
  'classified': { color: '#d32ce6', bg: 'rgba(211,44,230,0.1)', gradient: 'linear-gradient(180deg, transparent 0%, rgba(211,44,230,0.2) 100%)' },
  'covert': { color: '#eb4b4b', bg: 'rgba(235,75,75,0.12)', gradient: 'linear-gradient(180deg, transparent 0%, rgba(235,75,75,0.25) 100%)' },
  'contraband': { color: '#e4ae39', bg: 'rgba(228,174,57,0.12)', gradient: 'linear-gradient(180deg, transparent 0%, rgba(228,174,57,0.25) 100%)' },
  'extraordinary': { color: '#eb4b4b', bg: 'rgba(235,75,75,0.12)', gradient: 'linear-gradient(180deg, transparent 0%, rgba(235,75,75,0.25) 100%)' },
  'exotic': { color: '#d32ce6', bg: 'rgba(211,44,230,0.1)', gradient: 'linear-gradient(180deg, transparent 0%, rgba(211,44,230,0.2) 100%)' },
  'remarkable': { color: '#8847ff', bg: 'rgba(136,71,255,0.1)', gradient: 'linear-gradient(180deg, transparent 0%, rgba(136,71,255,0.2) 100%)' },
  'high grade': { color: '#4b69ff', bg: 'rgba(75,105,255,0.1)', gradient: 'linear-gradient(180deg, transparent 0%, rgba(75,105,255,0.2) 100%)' },
  'superior': { color: '#d32ce6', bg: 'rgba(211,44,230,0.1)', gradient: 'linear-gradient(180deg, transparent 0%, rgba(211,44,230,0.2) 100%)' },
  'master': { color: '#eb4b4b', bg: 'rgba(235,75,75,0.12)', gradient: 'linear-gradient(180deg, transparent 0%, rgba(235,75,75,0.25) 100%)' },
};

const DEFAULT = { color: '#6b7280', bg: 'rgba(107,114,128,0.08)', gradient: 'linear-gradient(180deg, transparent 0%, rgba(107,114,128,0.1) 100%)' };

export function getRarityStyle(rarity: string | undefined | null) {
  if (!rarity) return DEFAULT;
  const key = rarity.toLowerCase().replace(/[_-]/g, '').replace(/\s+/g, ' ').trim();
  // Try exact match first, then partial
  if (RARITY_COLORS[key]) return RARITY_COLORS[key];
  for (const [k, v] of Object.entries(RARITY_COLORS)) {
    if (key.includes(k) || k.includes(key)) return v;
  }
  return DEFAULT;
}

export function getRarityColor(rarity: string | undefined | null): string {
  return getRarityStyle(rarity).color;
}

export function getRarityBorderColor(rarity: string | undefined | null): string {
  const style = getRarityStyle(rarity);
  return `${style.color}33`; // 20% opacity hex
}
