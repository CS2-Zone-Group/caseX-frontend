import { useFavouritesStore } from '@/store/favouritesStore';
import React from 'react'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'; 
import FavoriteIcon from '@mui/icons-material/Favorite';




interface FavoriteButtonProps{
    skinId:string;
    className?:string
}

const FavoriteButton = ({skinId,className=""}:FavoriteButtonProps) => {
    const {favouriteIds,toggleFavourite}=useFavouritesStore()

    const isFavorite=favouriteIds.includes(skinId)

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation(); 
        toggleFavourite(skinId);
      };
  return (
    <button
    onClick={handleClick}
    className={`group flex items-center justify-center rounded-full transition-all duration-300 ${className} 
      ${isFavorite 
        ? 'text-red-500  dark:bg-red-500/10' 
        : 'text-gray-400 hover:text-red-500  dark:bg-gray-800  dark:hover:bg-red-500/10'
      }`}
  >
    {isFavorite ? (
      <FavoriteIcon className="" fontSize="inherit" />
    ) : (
      <FavoriteBorderIcon fontSize="inherit" />
    )}
  </button>
  )
}

export default FavoriteButton