// import {create} from 'zustand'
// import { persist, createJSONStorage } from 'zustand/middleware';




// interface InventoryItemType {
//     id: string;
//     isListed: boolean;
//     listPrice: number | null;
//     isSteamItem?: boolean;
//     steamAssetId?: string;
//     skin: {
//       id: string;
//       name: string;
//       imageUrl: string;
//       rarity: string;
//       exterior: string;
//       weaponType?: string;
//       price?: number;
//     };
//     purchasedAt: string;
//   }


//   interface InventoryStore {
//     inventory:InventoryItemType[],
//     addToInventory:(items:any[])=>void;
//   }



//   export const useInventoryStore = create<InventoryStore>()(
//     persist(
//       (set) => ({
//         inventory: [],
  
//         addToInventory: (newItems) => 
//           set((state) => {
//             console.log("📦 INVENTARGA QO'SHILDI:", newItems);
//             const itemsWithDate = newItems.map((item) => ({
//               ...item,
//               purchasedAt: new Date().toISOString(),
//             }));
  
//             return {
//               inventory: [...state.inventory, ...itemsWithDate],
              
//             };
//         }),
        
        
//         clearInventory: () => set({ inventory: [] }),
//       }),
//       {
//         name: 'user-inventory-storage', 
//         storage: createJSONStorage(() => localStorage), 
//       }
//     )
//   );