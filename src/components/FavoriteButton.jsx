import { useState } from "react";
import PropTypes from "prop-types";
import { useFavorites } from "../context/FavoritesContext";

const FavoriteButton = ({ item, type, className = "", size = "w-6 h-6" }) => {
    const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
    const [loading, setLoading] = useState(false);

    const isItemFavorite = isFavorite(item.id, type);

    const handleToggleFavorite = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        setLoading(true);
        try {
            if (isItemFavorite) {
                await removeFromFavorites(item.id, type);
            } else {
                await addToFavorites(item, type);
            }
        } catch (error) {
            console.error("Error toggling favorite:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggleFavorite}
            disabled={loading}
            className={`
                relative transition-all duration-200 hover:scale-110 
                ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                ${className}
            `}
            aria-label={
                isItemFavorite ? `Remove from favorites` : `Add to favorites`
            }
        >
            <svg
                className={`${size} transition-colors duration-200`}
                fill={isItemFavorite ? "#ef4444" : "none"}
                stroke={isItemFavorite ? "#ef4444" : "currentColor"}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
            </svg>

            {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                </div>
            )}
        </button>
    );
};

FavoriteButton.propTypes = {
    item: PropTypes.object.isRequired,
    type: PropTypes.oneOf(["course", "program"]).isRequired,
    className: PropTypes.string,
    size: PropTypes.string,
};

export default FavoriteButton;
