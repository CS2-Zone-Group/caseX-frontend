import { useFavouritesStore } from '@/store/favouritesStore';
import React from 'react'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'; 
import FavoriteIcon from '@mui/icons-material/Favorite';

interface FavoriteButtonProps{
    skinId:string;
    className?:string
}

const FavoriteButton = ({skinId,className=""}:FavoriteButtonProps) => {
    const {favouriteIds, loadingItems, toggleFavourite}=useFavouritesStore()

    const isFavorite=favouriteIds.includes(skinId)
    const isLoading=loadingItems.includes(skinId)

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation(); 
        if(!isLoading) {
            toggleFavourite(skinId);
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={isLoading}
            className={`group flex items-center justify-center rounded-full transition-all duration-300 ${className} 
                ${isFavorite 
                    ? 'text-red-500 dark:bg-red-500/10' 
                    : 'text-gray-400 hover:text-red-500 dark:bg-gray-800 dark:hover:bg-red-500/10'
                } ${isLoading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
        >
            {isLoading ? (
                <div className="animate-spin rounded-full border-2 border-current border-t-transparent" 
                     style={{width: '1em', height: '1em'}}>
                </div>
            ) : isFavorite ? (
                <FavoriteIcon className="" fontSize="inherit" />
            ) : (
                <FavoriteBorderIcon fontSize="inherit" />
            )}
        </button>
    )
}

export default FavoriteButton