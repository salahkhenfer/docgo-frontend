import { useState, useEffect } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import DarkColorButton from "./Buttons/DarkColorButton";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { clientProgramsAPI } from "../API/Programs";

const StudyForm = () => {
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedCountry, setSelectedCountry] = useState("");
    const [categories, setCategories] = useState([]);
    const [countries, setCountries] = useState([]);
    const [filteredCountries, setFilteredCountries] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === "rtl";
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            // Fetch categories and locations in parallel
            const [categoriesRes, locationsRes] = await Promise.all([
                clientProgramsAPI.getProgramCategories(),
                clientProgramsAPI.getProgramLocations()
            ]);

            // Handle categories response
            if (categoriesRes) {
                const cats = categoriesRes.data?.categories || categoriesRes.categories || [];
                setCategories(Array.isArray(cats) ? cats : []);
            }

            // Handle locations response
            if (locationsRes) {
                const locs = locationsRes.data?.locations || locationsRes.locations || [];
                setCountries(Array.isArray(locs) ? locs : []);
                setFilteredCountries(Array.isArray(locs) ? locs : []);
            }
        } catch (error) {
            console.error("Error fetching form data:", error);
            // Set empty arrays on error to prevent crashes
            setCategories([]);
            setCountries([]);
            setFilteredCountries([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = async (categoryValue) => {
        setSelectedCategory(categoryValue);
        setSelectedCountry(""); // Reset country selection

        if (!categoryValue) {
            setFilteredCountries(countries);
            return;
        }

        try {
            // Fetch programs for selected category to get available countries
            const response = await clientProgramsAPI.searchPrograms({
                category: categoryValue
            });

            // Handle different response structures
            let programs = [];
            if (response) {
                programs = response.data?.programs || response.programs || [];
            }
            
            if (programs.length > 0) {
                // Extract unique countries from programs
                const uniqueCountries = [...new Set(
                    programs
                        .map(p => p.Location || p.location)
                        .filter(Boolean)
                )];
                
                // Filter countries list based on available countries for this category
                const filtered = countries.filter(country => 
                    uniqueCountries.includes(country)
                );
                
                setFilteredCountries(filtered.length > 0 ? filtered : countries);
            } else {
                // If no programs found, show all countries
                setFilteredCountries(countries);
            }
        } catch (error) {
            console.error("Error filtering countries:", error);
            setFilteredCountries(countries);
        }
    };

    const handleSubmit = () => {
        // Navigate to programs page with filters
        const params = new URLSearchParams();
        
        console.log("StudyForm - Navigating with:", {
            category: selectedCategory,
            location: selectedCountry
        });
        
        if (selectedCategory) {
            params.append("category", selectedCategory);
        }
        if (selectedCountry) {
            params.append("location", selectedCountry);
        }

        navigate(`/Programs${params.toString() ? `?${params.toString()}` : ""}`);
    };

    if (loading) {
        return (
            <div className="w-full max-w-md mx-auto p-6 space-y-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-xl flex items-center justify-center min-h-[200px]">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="w-full max-w-md mx-auto p-4 sm:p-6 space-y-3 sm:space-y-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <div className="relative">
                <select
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full p-3 sm:p-4 bg-white border-2 border-gray-200 rounded-xl appearance-none cursor-pointer hover:border-blue-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm sm:text-base transition-all duration-200"
                    dir={i18n.dir()}
                >
                    <option value="" disabled>
                        {t("WhatDoYouWantToStudy")}
                    </option>
                    {categories.map((category) => (
                        <option
                            key={category}
                            value={category}
                            className="text-sm sm:text-base"
                        >
                            {category}
                        </option>
                    ))}
                </select>
                <ChevronDown
                    className={`absolute ${
                        isRTL ? "left-3 sm:left-4" : "right-3 sm:right-4"
                    } top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none transition-transform ${selectedCategory ? 'rotate-180' : ''}`}
                    size={20}
                />
            </div>

            <div className="relative">
                <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full p-3 sm:p-4 bg-white border-2 border-gray-200 rounded-xl appearance-none cursor-pointer hover:border-blue-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm sm:text-base transition-all duration-200"
                    dir={i18n.dir()}
                    disabled={!selectedCategory}
                >
                    <option value="" disabled>
                        {t("WhereDoYouwantToStudy?")}
                    </option>
                    {filteredCountries.map((country) => (
                        <option
                            key={country}
                            value={country}
                            className="text-sm sm:text-base"
                        >
                            {country}
                        </option>
                    ))}
                </select>
                <ChevronDown
                    className={`absolute ${
                        isRTL ? "left-3 sm:left-4" : "right-3 sm:right-4"
                    } top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none transition-transform ${selectedCountry ? 'rotate-180' : ''}`}
                    size={20}
                />
            </div>

            <button
                onClick={handleSubmit}
                disabled={!selectedCategory}
                className="w-full p-3 sm:p-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base disabled:cursor-not-allowed disabled:opacity-60"
            >
                {t("ToRegister")}
            </button>
        </div>
    );
};

export default StudyForm;
