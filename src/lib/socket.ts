import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

// Derive the Socket.IO server URL from the API URL (strip /api suffix)
function getSocketUrl(): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
  return apiUrl.replace(/\/api\/?$/, '');
}

let marketplaceSocket: Socket | null = null;

export function getMarketplaceSocket(): Socket {
  if (!marketplaceSocket) {
    marketplaceSocket = io(`${getSocketUrl()}/marketplace`, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      autoConnect: true,
    });
  }
  return marketplaceSocket;
}

export interface ItemListedPayload {
  skinId: string;
  name: string;
  price: number;
  imageUrl: string;
  seller: string;
  inventoryId?: string;
  rarity?: string;
  exterior?: string;
  weaponType?: string;
  float?: number;
}

export interface ItemSoldPayload {
  skinId: string;
  inventoryId?: string;
}

export interface ItemUnlistedPayload {
  skinId: string;
  inventoryId?: string;
}

export interface ItemPriceUpdatedPayload {
  skinId: string;
  inventoryId?: string;
  newPrice: number;
}

type MarketplaceEvents = {
  'item:listed': (payload: ItemListedPayload) => void;
  'item:sold': (payload: ItemSoldPayload) => void;
  'item:unlisted': (payload: ItemUnlistedPayload) => void;
  'item:price-updated': (payload: ItemPriceUpdatedPayload) => void;
};

/**
 * Hook to subscribe to real-time marketplace events.
 * Automatically connects on mount and cleans up listeners on unmount.
 */
export function useMarketplaceSocket(handlers: Partial<MarketplaceEvents>) {
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    const socket = getMarketplaceSocket();

    const onListed = (payload: ItemListedPayload) => {
      handlersRef.current['item:listed']?.(payload);
    };
    const onSold = (payload: ItemSoldPayload) => {
      handlersRef.current['item:sold']?.(payload);
    };
    const onUnlisted = (payload: ItemUnlistedPayload) => {
      handlersRef.current['item:unlisted']?.(payload);
    };
    const onPriceUpdated = (payload: ItemPriceUpdatedPayload) => {
      handlersRef.current['item:price-updated']?.(payload);
    };

    socket.on('item:listed', onListed);
    socket.on('item:sold', onSold);
    socket.on('item:unlisted', onUnlisted);
    socket.on('item:price-updated', onPriceUpdated);

    return () => {
      socket.off('item:listed', onListed);
      socket.off('item:sold', onSold);
      socket.off('item:unlisted', onUnlisted);
      socket.off('item:price-updated', onPriceUpdated);
    };
  }, []);
}
