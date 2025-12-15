'use client';

interface InventoryItemProps {
  id: string;
  name: string;
  image: string;
  price: number;
  wear?: string;
  float?: number;
  stattrak?: boolean;
  tradable?: boolean;
  marketable?: boolean;
  selected?: boolean;
  onSelect?: (id: string) => void;
}

export default function InventoryItem({
  id,
  name,
  image,
  price,
  wear,
  float,
  stattrak = false,
  tradable = true,
  marketable = true,
  selected = false,
  onSelect
}: InventoryItemProps) {
  return (
    <div
      onClick={() => onSelect?.(id)}
      className={`relative bg-gray-800 rounded-lg p-3 cursor-pointer transition-all hover:bg-gray-750 border-2 ${
        selected ? 'border-primary-500' : 'border-transparent'
      }`}
    >
      {/* Checkmark */}
      {selected && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center z-10">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}

      {/* StatTrak Badge */}
      {stattrak && (
        <div className="absolute top-2 left-2 px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded">
          ST
        </div>
      )}

      {/* Image */}
      <div className="relative h-32 flex items-center justify-center mb-2">
        <img src={image} alt={name} className="max-h-full max-w-full object-contain" />
      </div>

      {/* Name */}
      <div className="text-sm text-white font-medium mb-1 truncate" title={name}>
        {name}
      </div>

      {/* Wear */}
      {wear && (
        <div className="text-xs text-gray-400 mb-1">{wear}</div>
      )}

      {/* Float */}
      {float !== undefined && (
        <div className="text-xs text-gray-500 mb-2">Float: {float.toFixed(4)}</div>
      )}

      {/* Price */}
      <div className="text-lg font-bold text-green-400">${price.toFixed(2)}</div>

      {/* Status Icons */}
      <div className="flex gap-2 mt-2">
        {tradable && (
          <div className="w-5 h-5 bg-green-500/20 rounded flex items-center justify-center" title="Tradable">
            <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
        {marketable && (
          <div className="w-5 h-5 bg-blue-500/20 rounded flex items-center justify-center" title="Marketable">
            <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
