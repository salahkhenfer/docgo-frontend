import { useState, useEffect, useCallback } from "react";
import { useAppContext } from "../AppContext";
import {
    favoritesService,
    addToLocalFavorites,
    removeFromLocalFavorites,
    isInLocalFavorites,
    getFavoritesFromStorage,
} from "../services/favoritesService";

export const useFavorite = (itemId, itemType = "course") => {
    const { isAuth, user } = useAppContext();
    const [isFavorited, setIsFavorited] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Check if item is favorited on mount
    useEffect(() => {
        const checkFavoriteStatus = async () => {
            try {
                if (isAuth && user?.id) {
                    // For authenticated users, check with API
                    const response = await favoritesService.checkFavoriteStatus(
                        itemType === "course" ? itemId : null,
                        itemType === "program" ? itemId : null,
                        itemType
                    );
                    setIsFavorited(response.data.isFavorited);
                } else {
                    // For guests, check local storage
                    setIsFavorited(isInLocalFavorites(itemId, itemType));
                }
            } catch (err) {
                console.error("Error checking favorite status:", err);
                setError(err.message || "Failed to check favorite status");
            }
        };

        if (itemId) {
            checkFavoriteStatus();
        }
    }, [itemId, itemType, isAuth, user?.id]);

    const toggleFavorite = useCallback(
        async (item = null) => {
            if (loading) return;

            setLoading(true);
            setError(null);

            try {
                if (isAuth && user?.id) {
                    // For authenticated users, use API
                    if (isFavorited) {
                        await favoritesService.removeFromFavorites(
                            itemType === "course" ? itemId : null,
                            itemType === "program" ? itemId : null,
                            itemType
                        );
                        setIsFavorited(false);
                    } else {
                        await favoritesService.addToFavorites(
                            itemType === "course" ? itemId : null,
                            itemType === "program" ? itemId : null,
                            itemType
                        );
                        setIsFavorited(true);
                    }
                } else {
                    // For guests, use local storage
                    if (isFavorited) {
                        removeFromLocalFavorites(itemId, itemType);
                        setIsFavorited(false);
                    } else {
                        if (item) {
                            addToLocalFavorites(item, itemType);
                        }
                        setIsFavorited(true);
                    }
                }
            } catch (err) {
                console.error("Error toggling favorite:", err);
                setError(err.message || "Failed to update favorite");
            } finally {
                setLoading(false);
            }
        },
        [itemId, itemType, isFavorited, loading, isAuth, user?.id]
    );

    return {
        isFavorited,
        loading,
        error,
        toggleFavorite,
    };
};

export const useFavorites = () => {
    const { isAuth, user } = useAppContext();
    const [favorites, setFavorites] = useState({ courses: [], programs: [] });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchFavorites = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            if (isAuth && user?.id) {
                // For authenticated users, fetch from API
                const response = await favoritesService.getFavorites();
                const processedFavorites = {
                    courses: response.data.favorites.filter(
                        (fav) => fav.type === "course"
                    ),
                    programs: response.data.favorites.filter(
                        (fav) => fav.type === "program"
                    ),
                };
                setFavorites(processedFavorites);
            } else {
                // For guests, get from local storage
                const localFavorites = getFavoritesFromStorage();
                setFavorites(localFavorites);
            }
        } catch (err) {
            console.error("Error fetching favorites:", err);
            setError(err.message || "Failed to fetch favorites");
        } finally {
            setLoading(false);
        }
    }, [isAuth, user?.id]);

    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);

    const getTotalCount = useCallback(() => {
        return favorites.courses.length + favorites.programs.length;
    }, [favorites]);

    return {
        favorites,
        loading,
        error,
        refetch: fetchFavorites,
        totalCount: getTotalCount(),
    };
};
