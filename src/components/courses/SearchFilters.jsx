import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { FiSearch, FiLoader } from "react-icons/fi";

export function SearchFilters({ onFiltersChange }) {
    const { t } = useTranslation();
    const { i18n } = useTranslation();
    const [price, setPrice] = useState("free");
    const [certificate, setCertificate] = useState("with");
    const [date, setDate] = useState("latest");
    const [query, setQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    // Use ref to avoid dependency issues
    const onFiltersChangeRef = useRef(onFiltersChange);
    onFiltersChangeRef.current = onFiltersChange;

    // Debounce search
    const [debouncedQuery, setDebouncedQuery] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 500); // 500ms delay

        return () => clearTimeout(timer);
    }, [query]);

    const handleSearch = useCallback(
        (searchTerm = "") => {
            setIsSearching(true);
            const filters = {
                search: searchTerm.trim(),
                price,
                certificate,
                date,
                sortBy: date === "latest" ? "createdAt" : "updatedAt",
                order: "DESC",
            };

            if (onFiltersChangeRef.current) {
                onFiltersChangeRef.current(filters);
            }

            // Reset searching state after a delay
            setTimeout(() => setIsSearching(false), 1000);
        },
        [price, certificate, date]
    );

    // Trigger search when debounced query changes
    useEffect(() => {
        if (debouncedQuery || debouncedQuery === "") {
            handleSearch(debouncedQuery);
        }
    }, [debouncedQuery, handleSearch]);

    const handleFilterChange = (filterType, value) => {
        setIsSearching(true);

        switch (filterType) {
            case "price":
                setPrice(value);
                break;
            case "certificate":
                setCertificate(value);
                break;
            case "date":
                setDate(value);
                break;
        }

        const allFilters = {
            search: query.trim(),
            price: filterType === "price" ? value : price,
            certificate: filterType === "certificate" ? value : certificate,
            date: filterType === "date" ? value : date,
            sortBy:
                (filterType === "date" ? value : date) === "latest"
                    ? "createdAt"
                    : "updatedAt",
            order: "DESC",
        };

        if (onFiltersChangeRef.current) {
            onFiltersChangeRef.current(allFilters);
        }

        // Reset searching state after a delay
        setTimeout(() => setIsSearching(false), 1000);
    };
    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <section className="flex flex-wrap gap-4 items-center  mx-auto  text-lg  max-md:max-w-full">
            {/* Search Input */}
            <div className="self-stretch my-auto whitespace-nowrap min-w-60 text-neutral-600 w-[558px] max-md:max-w-full">
                <div
                    className={`relative flex items-center px-6 py-3 w-full bg-white rounded-3xl border border-solid shadow-xl max-md:px-5 max-md:max-w-full transition-all duration-200 ${
                        isSearching
                            ? "border-blue-300 shadow-lg"
                            : "border-gray-200"
                    }`}
                >
                    {isSearching ? (
                        <FiLoader className="w-6 h-6 text-blue-500 mr-3 animate-spin" />
                    ) : (
                        <FiSearch className="w-6 h-6 text-neutral-600 mr-3" />
                    )}
                    <input
                        type="text"
                        placeholder={t("RechercherUnCours")}
                        value={query}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        className="flex-1 bg-transparent outline-none text-neutral-600 placeholder:text-neutral-400 pr-12"
                    />
                    {query.trim() && !isSearching && (
                        <button
                            onClick={() => handleSearch()}
                            className={` ${
                                i18n.language === "ar" ? "left-4" : "right-4"
                            }absolute  p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition`}
                        >
                            <FiSearch className="w-4 h-4" />
                        </button>
                    )}
                    {isSearching && (
                        <div
                            className={`${
                                i18n.language === "ar" ? "left-4" : "right-4"
                            } absolute p-2`}
                        >
                            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}
                </div>
            </div>

            {/* Filters */}
            <div
                className={`flex flex-wrap gap-4 items-center my-auto min-w-60 text-zinc-800 max-md:max-w-full transition-opacity duration-200 ${
                    isSearching ? "opacity-70" : "opacity-100"
                }`}
            >
                {/* Price Filter */}
                <div className="flex gap-1 self-stretch px-4 py-2 my-auto whitespace-nowrap rounded-2xl bg-stone-100">
                    <button
                        onClick={() => handleFilterChange("price", "free")}
                        disabled={isSearching}
                        className={`px-2 py-1 rounded-lg transition-all ${
                            price === "free"
                                ? "bg-white text-zinc-800"
                                : "text-gray-600"
                        } ${
                            isSearching
                                ? "cursor-not-allowed"
                                : "hover:bg-gray-50"
                        }`}
                    >
                        {t("Gratuit")}
                    </button>
                    <button
                        onClick={() => handleFilterChange("price", "paid")}
                        disabled={isSearching}
                        className={`px-2 py-1 rounded-lg transition-all ${
                            price === "paid"
                                ? "bg-white text-zinc-800"
                                : "text-gray-600"
                        } ${
                            isSearching
                                ? "cursor-not-allowed"
                                : "hover:bg-gray-50"
                        }`}
                    >
                        {t("Payant")}
                    </button>
                </div>

                {/* Certificate Filter */}
                <div className="flex gap-1 self-stretch px-4 py-2 my-auto rounded-2xl bg-stone-100">
                    <button
                        onClick={() =>
                            handleFilterChange("certificate", "with")
                        }
                        className={`px-2 py-1 rounded-lg ${
                            certificate === "with"
                                ? "bg-white text-zinc-800"
                                : "text-gray-600"
                        }`}
                    >
                        {t("AvecCertificat")}
                    </button>
                    <button
                        onClick={() =>
                            handleFilterChange("certificate", "without")
                        }
                        className={`px-2 py-1 rounded-lg ${
                            certificate === "without"
                                ? "bg-white text-zinc-800"
                                : "text-gray-600"
                        }`}
                    >
                        {t("Sans")}
                    </button>
                </div>

                {/* Date Filter */}
                <div className="flex gap-1 self-stretch px-4 py-2 my-auto rounded-2xl bg-stone-100">
                    <button
                        onClick={() => handleFilterChange("date", "latest")}
                        className={`px-2 py-1 rounded-lg ${
                            date === "latest"
                                ? "bg-white text-zinc-800"
                                : "text-gray-600"
                        }`}
                    >
                        {t("Dernier")}
                    </button>
                    <button
                        onClick={() => handleFilterChange("date", "newest")}
                        className={`px-2 py-1 rounded-lg ${
                            date === "newest"
                                ? "bg-white text-zinc-800"
                                : "text-gray-600"
                        }`}
                    >
                        {t("LePlusRecent")}
                    </button>
                </div>
            </div>
        </section>
    );
}
