import { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useFavorites } from "../hooks/useFavorite";
import { useAppContext } from "../AppContext";
import FavoriteButton from "../components/FavoriteButton";
import MainLoading from "../MainLoading";

const FavoritesPage = () => {
    const { favorites, loading, totalCount } = useFavorites();
    const { user } = useAppContext();
    const [activeTab, setActiveTab] = useState("all");

    const filterFavorites = () => {
        switch (activeTab) {
            case "courses":
                return favorites.courses;
            case "programs":
                return favorites.programs;
            default:
                return [...favorites.courses, ...favorites.programs];
        }
    };

    const filteredFavorites = filterFavorites();

    if (loading) {
        return <MainLoading />;
    }

    return (
        <div className="min-h-screen bg-gray-50 w-full">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        My Favorites
                    </h1>
                    <p className="text-gray-600 text-lg">
                        {user
                            ? "Your saved courses and programs"
                            : "Your locally saved courses and programs"}
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg w-full max-w-lg">
                    <button
                        onClick={() => setActiveTab("all")}
                        className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
                            activeTab === "all"
                                ? "bg-white text-blue-600 shadow-sm"
                                : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        All ({totalCount})
                    </button>
                    <button
                        onClick={() => setActiveTab("courses")}
                        className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
                            activeTab === "courses"
                                ? "bg-white text-blue-600 shadow-sm"
                                : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        Courses ({favorites.courses.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("programs")}
                        className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
                            activeTab === "programs"
                                ? "bg-white text-blue-600 shadow-sm"
                                : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        Programs ({favorites.programs.length})
                    </button>
                </div>

                {/* Content */}
                {filteredFavorites.length === 0 ? (
                    <div className="text-center py-16 px-4">
                        <div className="w-32 h-32 mx-auto mb-6 text-gray-300">
                            <svg
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                className="w-full h-full"
                            >
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                            No favorites yet
                        </h3>
                        <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                            Start exploring courses and programs to add them to
                            your favorites!
                        </p>
                        <Link
                            to="/allcourses"
                            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Browse Courses
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                        {filteredFavorites.map((item) => {
                            // Handle different ID field names
                            const itemId = item.id || item.ID || item.Id;
                            return (
                                <FavoriteCard
                                    key={`${item.type || "course"}-${itemId}`}
                                    item={item}
                                    type={item.type || "course"}
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

const FavoriteCard = ({ item, type }) => {
    const isProgram = type === "program";

    // Handle different ID field names
    const itemId = item.id || item.ID || item.Id;

    // Don't render if no valid item or ID
    if (!item || !itemId) {
        console.warn("FavoriteCard: Missing item or item ID", { item, itemId });
        return null;
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            {/* Image */}
            <div className="relative aspect-video bg-gradient-to-br from-blue-50 to-indigo-100">
                {item.ThumbnailUrl || item.ImageUrl ? (
                    <img
                        src={item.ThumbnailUrl || item.ImageUrl}
                        alt={item.Title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg
                            className="w-16 h-16"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {isProgram ? (
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            ) : (
                                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                            )}
                        </svg>
                    </div>
                )}

                {/* Favorite Button */}
                <div className="absolute top-3 right-3">
                    <FavoriteButton
                        item={item}
                        type={type}
                        className="bg-white/95 backdrop-blur-sm p-2 rounded-full hover:bg-white shadow-sm"
                        size="w-5 h-5"
                    />
                </div>

                {/* Type Badge */}
                <div className="absolute top-3 left-3">
                    <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-sm ${
                            isProgram
                                ? "bg-purple-500/90 text-white"
                                : "bg-blue-500/90 text-white"
                        }`}
                    >
                        {isProgram ? "Program" : "Course"}
                    </span>
                </div>

                {/* Featured Badge */}
                {item.isFeatured && (
                    <div className="absolute bottom-3 left-3">
                        <span className="px-3 py-1 text-xs font-semibold bg-yellow-400/90 text-yellow-900 rounded-full backdrop-blur-sm">
                            ⭐ Featured
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5">
                <div className="mb-3">
                    <h3 className="font-bold text-gray-900 text-lg line-clamp-2 mb-2 leading-tight">
                        {item.Title}
                    </h3>
                    {item.shortDescription && (
                        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                            {item.shortDescription}
                        </p>
                    )}
                </div>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-sm mb-3">
                    {item.Category && (
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                            {item.Category}
                        </span>
                    )}
                    {item.Level && (
                        <span className="capitalize text-gray-500 font-medium">
                            {item.Level}
                        </span>
                    )}
                </div>

                {/* Rating */}
                {item.rating && (
                    <div className="flex items-center mb-3">
                        <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                    key={star}
                                    className={`w-4 h-4 ${
                                        star <= Math.floor(item.rating.average)
                                            ? "text-yellow-400"
                                            : "text-gray-300"
                                    }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">
                            {item.rating.average} ({item.rating.totalReviews})
                        </span>
                    </div>
                )}

                {/* Price */}
                {item.Price !== undefined && (
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                            {item.discountPrice ? (
                                <>
                                    <span className="text-xl font-bold text-green-600">
                                        {item.Currency || "USD"}{" "}
                                        {item.discountPrice}
                                    </span>
                                    <span className="text-sm text-gray-500 line-through">
                                        {item.Currency || "USD"} {item.Price}
                                    </span>
                                </>
                            ) : item.Price === 0 ? (
                                <span className="text-xl font-bold text-green-600">
                                    Free
                                </span>
                            ) : (
                                <span className="text-xl font-bold text-gray-900">
                                    {item.Currency || "USD"} {item.Price}
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Action Button */}
                <Link
                    to={
                        isProgram
                            ? `/programs/${itemId}`
                            : `/coursedetails/${itemId}`
                    }
                    className="block w-full text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                >
                    View {isProgram ? "Program" : "Course"}
                </Link>
            </div>
        </div>
    );
};

FavoriteCard.propTypes = {
    item: PropTypes.object.isRequired,
    type: PropTypes.oneOf(["course", "program"]).isRequired,
};

export default FavoritesPage;
