import { BsHeart, BsHeartFill } from "react-icons/bs";
import PropTypes from "prop-types";
import { useFavorite } from "../hooks/useFavorite";

const FavoriteButton = ({ item, type, className = "", size = "w-6 h-6" }) => {
    const { isFavorited, loading, toggleFavorite } = useFavorite(item.id, type);

    const handleToggleFavorite = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(item);
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
                isFavorited ? `Remove from favorites` : `Add to favorites`
            }
        >
            {isFavorited ? (
                <BsHeartFill className={`${size} text-red-500`} />
            ) : (
                <BsHeart
                    className={`${size} text-gray-400 hover:text-red-500`}
                />
            )}

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
