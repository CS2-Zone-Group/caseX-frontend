import {create} from "zustand"
import axios from "axios"



interface FavouritesStore{
    favouriteIds:string[],
    count:number,
    isLoading:boolean,
    fetchFavouriteIds:()=>Promise<void>;
    toggleFavourite:(skinId:string)=>Promise<void>
}


export const useFavouritesStore=create<FavouritesStore>((set,get)=>({
    favouriteIds:[],
    count:0,
    isLoading:false,

    fetchFavouriteIds:async()=>{
        set({isLoading:true});
        try {

            const {data}=await axios.get('/api/favorites/ids')
            set({favouriteIds:data,count:data.length,isLoading:false})
            
        } catch (error) {
            console.log('Sevimlilarni yuklashda xato',error);
            set({isLoading:false})
            
        }
    },

    toggleFavourite:async(skinId:string)=>{
        const {favouriteIds}=get()
        const isFavorite=favouriteIds.includes(skinId)

        if(isFavorite){
            set({
                favouriteIds:favouriteIds.filter(id=>id!==skinId),
                count:get().count-1
            })
        }else{
            set({
                favouriteIds:[...favouriteIds,skinId],
                count:get().count+1
            })
        }

        try {
            
            if(isFavorite){
                await axios.delete(`/api/favorites/${skinId}`)
            }else{
                await axios.post(`/api/favorites/${skinId}`)
            }
        } catch (error) {
            console.log("Xatolik",error);
            get().fetchFavouriteIds()
            
        }
    }

}))