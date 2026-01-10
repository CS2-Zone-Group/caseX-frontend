import {create} from "zustand"
import api from "@/lib/api"

interface FavouritesStore{
    favouriteIds:string[],
    count:number,
    isLoading:boolean,
    loadingItems:string[], // Qaysi itemlar loading holatida
    fetchFavouriteIds:()=>Promise<void>;
    toggleFavourite:(skinId:string)=>Promise<void>;
    resetStore:()=>void;
}

export const useFavouritesStore=create<FavouritesStore>((set,get)=>({
    favouriteIds:[],
    count:0,
    isLoading:false,
    loadingItems:[], // Qaysi itemlar loading holatida

    fetchFavouriteIds:async()=>{
        set({isLoading:true});
        try {
            const {data}=await api.get('/favorites/ids')
            
            // Data structure ni to'g'ri handle qilish
            let favoriteIds = [];
            if (Array.isArray(data)) {
                favoriteIds = data;
            } else if (data.favoriteIds && Array.isArray(data.favoriteIds)) {
                favoriteIds = data.favoriteIds;
            } else if (data.ids && Array.isArray(data.ids)) {
                favoriteIds = data.ids;
            }
            
            set({favouriteIds:favoriteIds,count:favoriteIds.length,isLoading:false})
            
        } catch (error) {
            console.log('Sevimlilarni yuklashda xato',error);
            set({isLoading:false})
        }
    },

    toggleFavourite:async(skinId:string)=>{
        const {favouriteIds, loadingItems}=get()
        const isFavorite=favouriteIds.includes(skinId)

        // Agar allaqachon loading bo'lsa, return qil
        if(loadingItems.includes(skinId)) return;

        // Loading holatini qo'shish
        set({
            loadingItems: [...loadingItems, skinId]
        });

        try {
            if(isFavorite){
                await api.delete(`/favorites/${skinId}`)
                // Backend dan success kelgandan keyin store ni yangilash
                set({
                    favouriteIds:favouriteIds.filter(id=>id!==skinId),
                    count:get().count-1,
                    loadingItems: get().loadingItems.filter(id => id !== skinId)
                })
            }else{
                await api.post(`/favorites/${skinId}`)
                // Backend dan success kelgandan keyin store ni yangilash
                set({
                    favouriteIds:[...favouriteIds,skinId],
                    count:get().count+1,
                    loadingItems: get().loadingItems.filter(id => id !== skinId)
                })
            }
        } catch (error) {
            console.log("Xatolik",error);
            // Loading holatini olib tashlash
            set({
                loadingItems: get().loadingItems.filter(id => id !== skinId)
            });
            // Xatolik bo'lsa, haqiqiy holatni qayta yuklash
            get().fetchFavouriteIds()
        }
    },

    resetStore:()=>{
        set({
            favouriteIds:[],
            count:0,
            isLoading:false,
            loadingItems:[]
        })
    }
}))