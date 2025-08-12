import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useState } from "react";
import {
    Filter,
    X,
    RotateCcw,
    Building,
    Star,
    Calendar,
    Tag,
    DollarSign,
    Globe,
    MapPin,
    Monitor,
    Search,
} from "lucide-react";

const FilterSidebar = ({
    filters,
    onFilterChange,
    categories,
    organizations,
    onReset,
}) => {
    const { t } = useTranslation();

    // Local state for text inputs to prevent rerendering on every keystroke
    const [localLocation, setLocalLocation] = useState(filters.location || "");
    const [localTags, setLocalTags] = useState(filters.tags || "");
    const [localMinPrice, setLocalMinPrice] = useState(filters.minPrice || "");
    const [localMaxPrice, setLocalMaxPrice] = useState(filters.maxPrice || "");

    // Handle search button clicks for text inputs
    const handleLocationSearch = () => {
        onFilterChange("location", localLocation);
    };

    const handleTagsSearch = () => {
        onFilterChange("tags", localTags);
    };

    const handlePriceSearch = () => {
        onFilterChange("minPrice", localMinPrice);
        onFilterChange("maxPrice", localMaxPrice);
    };

    const statusOptions = [
        { value: "", label: t("All Status") || "All Status" },
        { value: "open", label: t("Open") || "Open" },
        { value: "closed", label: t("Closed") || "Closed" },
        { value: "upcoming", label: t("Upcoming") || "Upcoming" },
    ];

    const programTypeOptions = [
        { value: "", label: t("All Types") || "All Types" },
        { value: "scholarship", label: t("Scholarship") || "Scholarship" },
        { value: "exchange", label: t("Exchange") || "Exchange" },
        { value: "grant", label: t("Grant") || "Grant" },
        { value: "internship", label: t("Internship") || "Internship" },
    ];

    // Complete countries list with flags
    const commonCountries = [
        { code: "", name: t("All Countries") || "All Countries", flag: "🌍" },
        { code: "AF", name: "Afghanistan", flag: "🇦🇫" },
        { code: "ZA", name: "South Africa", flag: "🇿🇦" },
        { code: "AL", name: "Albania", flag: "🇦🇱" },
        { code: "DZ", name: "Algeria", flag: "🇩🇿" },
        { code: "DE", name: "Germany", flag: "🇩🇪" },
        { code: "AD", name: "Andorra", flag: "🇦🇩" },
        { code: "AO", name: "Angola", flag: "🇦🇴" },
        { code: "AI", name: "Anguilla", flag: "🇦🇮" },
        { code: "AQ", name: "Antarctica", flag: "🇦🇶" },
        { code: "AG", name: "Antigua and Barbuda", flag: "🇦🇬" },
        { code: "SA", name: "Saudi Arabia", flag: "🇸🇦" },
        { code: "AR", name: "Argentina", flag: "🇦🇷" },
        { code: "AM", name: "Armenia", flag: "🇦🇲" },
        { code: "AW", name: "Aruba", flag: "🇦🇼" },
        { code: "AU", name: "Australia", flag: "🇦🇺" },
        { code: "AT", name: "Austria", flag: "🇦🇹" },
        { code: "AZ", name: "Azerbaijan", flag: "🇦🇿" },
        { code: "BS", name: "Bahamas", flag: "�🇸" },
        { code: "BH", name: "Bahrain", flag: "🇧🇭" },
        { code: "BD", name: "Bangladesh", flag: "🇧🇩" },
        { code: "BB", name: "Barbados", flag: "🇧🇧" },
        { code: "BY", name: "Belarus", flag: "🇧🇾" },
        { code: "BE", name: "Belgium", flag: "🇧🇪" },
        { code: "BZ", name: "Belize", flag: "🇧🇿" },
        { code: "BJ", name: "Benin", flag: "🇧🇯" },
        { code: "BM", name: "Bermuda", flag: "🇧🇲" },
        { code: "BT", name: "Bhutan", flag: "🇧🇹" },
        { code: "BO", name: "Bolivia", flag: "🇧🇴" },
        { code: "BA", name: "Bosnia and Herzegovina", flag: "🇧🇦" },
        { code: "BW", name: "Botswana", flag: "🇧🇼" },
        { code: "BR", name: "Brazil", flag: "🇧🇷" },
        { code: "BN", name: "Brunei", flag: "�🇳" },
        { code: "BG", name: "Bulgaria", flag: "🇧�🇬" },
        { code: "BF", name: "Burkina Faso", flag: "🇧🇫" },
        { code: "BI", name: "Burundi", flag: "🇧🇮" },
        { code: "KH", name: "Cambodia", flag: "🇰🇭" },
        { code: "CM", name: "Cameroon", flag: "🇨🇲" },
        { code: "CA", name: "Canada", flag: "🇨🇦" },
        { code: "CV", name: "Cape Verde", flag: "🇨🇻" },
        { code: "CL", name: "Chile", flag: "🇨🇱" },
        { code: "CN", name: "China", flag: "🇨🇳" },
        { code: "CY", name: "Cyprus", flag: "🇨🇾" },
        { code: "CO", name: "Colombia", flag: "🇨🇴" },
        { code: "KM", name: "Comoros", flag: "🇰🇲" },
        { code: "CG", name: "Congo", flag: "🇨🇬" },
        { code: "CD", name: "Congo (DRC)", flag: "🇨🇩" },
        { code: "KR", name: "South Korea", flag: "🇰🇷" },
        { code: "KP", name: "North Korea", flag: "🇰🇵" },
        { code: "CR", name: "Costa Rica", flag: "🇨🇷" },
        { code: "CI", name: "Côte d'Ivoire", flag: "🇨🇮" },
        { code: "HR", name: "Croatia", flag: "🇭🇷" },
        { code: "CU", name: "Cuba", flag: "�🇺" },
        { code: "DK", name: "Denmark", flag: "🇩🇰" },
        { code: "DJ", name: "Djibouti", flag: "🇩🇯" },
        { code: "DM", name: "Dominica", flag: "🇩🇲" },
        { code: "DO", name: "Dominican Republic", flag: "🇩🇴" },
        { code: "EG", name: "Egypt", flag: "🇪🇬" },
        { code: "AE", name: "United Arab Emirates", flag: "🇦🇪" },
        { code: "EC", name: "Ecuador", flag: "🇪🇨" },
        { code: "ER", name: "Eritrea", flag: "🇪🇷" },
        { code: "ES", name: "Spain", flag: "�🇸" },
        { code: "EE", name: "Estonia", flag: "🇪🇪" },
        { code: "US", name: "United States", flag: "🇺🇸" },
        { code: "ET", name: "Ethiopia", flag: "🇪🇹" },
        { code: "FJ", name: "Fiji", flag: "🇫🇯" },
        { code: "FI", name: "Finland", flag: "🇫🇮" },
        { code: "FR", name: "France", flag: "🇫🇷" },
        { code: "GA", name: "Gabon", flag: "🇬🇦" },
        { code: "GM", name: "Gambia", flag: "🇬🇲" },
        { code: "GE", name: "Georgia", flag: "🇬🇪" },
        { code: "GH", name: "Ghana", flag: "🇬🇭" },
        { code: "GI", name: "Gibraltar", flag: "🇬🇮" },
        { code: "GR", name: "Greece", flag: "🇬🇷" },
        { code: "GD", name: "Grenada", flag: "🇬🇩" },
        { code: "GL", name: "Greenland", flag: "🇬🇱" },
        { code: "GP", name: "Guadeloupe", flag: "🇬🇵" },
        { code: "GU", name: "Guam", flag: "🇬🇺" },
        { code: "GT", name: "Guatemala", flag: "🇬🇹" },
        { code: "GN", name: "Guinea", flag: "🇬🇳" },
        { code: "GW", name: "Guinea-Bissau", flag: "🇬🇼" },
        { code: "GQ", name: "Equatorial Guinea", flag: "🇬🇶" },
        { code: "GY", name: "Guyana", flag: "🇬🇾" },
        { code: "GF", name: "French Guiana", flag: "🇬🇫" },
        { code: "HT", name: "Haiti", flag: "🇭🇹" },
        { code: "HN", name: "Honduras", flag: "🇭🇳" },
        { code: "HK", name: "Hong Kong", flag: "🇭🇰" },
        { code: "HU", name: "Hungary", flag: "🇭�" },
        { code: "BV", name: "Bouvet Island", flag: "🇧🇻" },
        { code: "CX", name: "Christmas Island", flag: "��" },
        { code: "NF", name: "Norfolk Island", flag: "🇳🇫" },
        { code: "IM", name: "Isle of Man", flag: "🇮�" },
        { code: "KY", name: "Cayman Islands", flag: "🇰🇾" },
        { code: "CC", name: "Cocos Islands", flag: "🇨🇨" },
        { code: "CK", name: "Cook Islands", flag: "�🇰" },
        { code: "FO", name: "Faroe Islands", flag: "🇫🇴" },
        { code: "FK", name: "Falkland Islands", flag: "🇫🇰" },
        { code: "MP", name: "Northern Mariana Islands", flag: "🇲🇵" },
        { code: "MH", name: "Marshall Islands", flag: "🇲🇭" },
        { code: "SB", name: "Solomon Islands", flag: "��" },
        { code: "TC", name: "Turks and Caicos Islands", flag: "🇹🇨" },
        { code: "VG", name: "British Virgin Islands", flag: "🇻🇬" },
        { code: "VI", name: "US Virgin Islands", flag: "🇻🇮" },
        { code: "IN", name: "India", flag: "🇮🇳" },
        { code: "ID", name: "Indonesia", flag: "🇮🇩" },
        { code: "IQ", name: "Iraq", flag: "🇮🇶" },
        { code: "IR", name: "Iran", flag: "🇮🇷" },
        { code: "IE", name: "Ireland", flag: "🇮🇪" },
        { code: "IS", name: "Iceland", flag: "🇮🇸" },
        { code: "IL", name: "Israel", flag: "🇮🇱" },
        { code: "IT", name: "Italy", flag: "🇮🇹" },
        { code: "JM", name: "Jamaica", flag: "🇯🇲" },
        { code: "JP", name: "Japan", flag: "🇯🇵" },
        { code: "JE", name: "Jersey", flag: "🇯🇪" },
        { code: "JO", name: "Jordan", flag: "🇯🇴" },
        { code: "KZ", name: "Kazakhstan", flag: "🇰🇿" },
        { code: "KE", name: "Kenya", flag: "🇰🇪" },
        { code: "KG", name: "Kyrgyzstan", flag: "🇰🇬" },
        { code: "KI", name: "Kiribati", flag: "🇰🇮" },
        { code: "KW", name: "Kuwait", flag: "��" },
        { code: "LA", name: "Laos", flag: "🇱🇦" },
        { code: "LS", name: "Lesotho", flag: "🇱🇸" },
        { code: "LV", name: "Latvia", flag: "🇱🇻" },
        { code: "LB", name: "Lebanon", flag: "🇱🇧" },
        { code: "LR", name: "Liberia", flag: "🇱🇷" },
        { code: "LY", name: "Libya", flag: "🇱🇾" },
        { code: "LI", name: "Liechtenstein", flag: "🇱🇮" },
        { code: "LT", name: "Lithuania", flag: "🇱🇹" },
        { code: "LU", name: "Luxembourg", flag: "🇱🇺" },
        { code: "MO", name: "Macao", flag: "🇲🇴" },
        { code: "MK", name: "North Macedonia", flag: "🇲🇰" },
        { code: "MG", name: "Madagascar", flag: "🇲🇬" },
        { code: "MY", name: "Malaysia", flag: "🇲🇾" },
        { code: "MW", name: "Malawi", flag: "🇲🇼" },
        { code: "MV", name: "Maldives", flag: "🇲🇻" },
        { code: "ML", name: "Mali", flag: "🇲🇱" },
        { code: "MT", name: "Malta", flag: "🇲🇹" },
        { code: "MA", name: "Morocco", flag: "🇲🇦" },
        { code: "MQ", name: "Martinique", flag: "🇲🇶" },
        { code: "MU", name: "Mauritius", flag: "🇲🇺" },
        { code: "MR", name: "Mauritania", flag: "🇲🇷" },
        { code: "YT", name: "Mayotte", flag: "🇾🇹" },
        { code: "MX", name: "Mexico", flag: "🇲🇽" },
        { code: "FM", name: "Micronesia", flag: "🇫🇲" },
        { code: "MD", name: "Moldova", flag: "🇲🇩" },
        { code: "MC", name: "Monaco", flag: "🇲🇨" },
        { code: "MN", name: "Mongolia", flag: "🇲🇳" },
        { code: "ME", name: "Montenegro", flag: "🇲🇪" },
        { code: "MS", name: "Montserrat", flag: "🇲🇸" },
        { code: "MZ", name: "Mozambique", flag: "🇲🇿" },
        { code: "MM", name: "Myanmar", flag: "🇲🇲" },
        { code: "NA", name: "Namibia", flag: "��🇦" },
        { code: "NR", name: "Nauru", flag: "�🇷" },
        { code: "NP", name: "Nepal", flag: "🇳🇵" },
        { code: "NI", name: "Nicaragua", flag: "🇳🇮" },
        { code: "NE", name: "Niger", flag: "🇳🇪" },
        { code: "NG", name: "Nigeria", flag: "🇳🇬" },
        { code: "NU", name: "Niue", flag: "🇳🇺" },
        { code: "NO", name: "Norway", flag: "🇳�" },
        { code: "NC", name: "New Caledonia", flag: "🇳🇨" },
        { code: "NZ", name: "New Zealand", flag: "🇳🇿" },
        { code: "OM", name: "Oman", flag: "🇴🇲" },
        { code: "UG", name: "Uganda", flag: "🇺🇬" },
        { code: "UZ", name: "Uzbekistan", flag: "🇺🇿" },
        { code: "PK", name: "Pakistan", flag: "🇵🇰" },
        { code: "PW", name: "Palau", flag: "🇵�" },
        { code: "PS", name: "Palestine", flag: "🇵🇸" },
        { code: "PA", name: "Panama", flag: "🇵🇦" },
        { code: "PG", name: "Papua New Guinea", flag: "🇵🇬" },
        { code: "PY", name: "Paraguay", flag: "🇵🇾" },
        { code: "NL", name: "Netherlands", flag: "�🇱" },
        { code: "PE", name: "Peru", flag: "🇵�🇪" },
        { code: "PH", name: "Philippines", flag: "🇵�" },
        { code: "PN", name: "Pitcairn", flag: "🇵🇳" },
        { code: "PL", name: "Poland", flag: "🇵🇱" },
        { code: "PF", name: "French Polynesia", flag: "🇵�" },
        { code: "PR", name: "Puerto Rico", flag: "�🇷" },
        { code: "PT", name: "Portugal", flag: "🇵🇹" },
        { code: "QA", name: "Qatar", flag: "🇶🇦" },
        { code: "RE", name: "Réunion", flag: "🇷🇪" },
        { code: "RO", name: "Romania", flag: "��" },
        { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
        { code: "RU", name: "Russia", flag: "🇷🇺" },
        { code: "RW", name: "Rwanda", flag: "🇷🇼" },
        { code: "EH", name: "Western Sahara", flag: "🇪🇭" },
        { code: "BL", name: "Saint Barthélemy", flag: "🇧🇱" },
        { code: "KN", name: "Saint Kitts and Nevis", flag: "🇰🇳" },
        { code: "SM", name: "San Marino", flag: "🇸🇲" },
        { code: "MF", name: "Saint Martin", flag: "🇲🇫" },
        { code: "PM", name: "Saint Pierre and Miquelon", flag: "🇵🇲" },
        { code: "VA", name: "Vatican City", flag: "🇻🇦" },
        { code: "VC", name: "Saint Vincent and the Grenadines", flag: "🇻🇨" },
        { code: "LC", name: "Saint Lucia", flag: "🇱🇨" },
        { code: "SH", name: "Saint Helena", flag: "🇸🇭" },
        { code: "SV", name: "El Salvador", flag: "🇸🇻" },
        { code: "WS", name: "Samoa", flag: "🇼🇸" },
        { code: "AS", name: "American Samoa", flag: "🇦🇸" },
        { code: "ST", name: "São Tomé and Príncipe", flag: "🇸🇹" },
        { code: "SN", name: "Senegal", flag: "�🇳" },
        { code: "RS", name: "Serbia", flag: "🇷🇸" },
        { code: "SC", name: "Seychelles", flag: "🇸🇨" },
        { code: "SL", name: "Sierra Leone", flag: "🇸🇱" },
        { code: "SG", name: "Singapore", flag: "🇸🇬" },
        { code: "SK", name: "Slovakia", flag: "🇸🇰" },
        { code: "SI", name: "Slovenia", flag: "🇸🇮" },
        { code: "SO", name: "Somalia", flag: "🇸🇴" },
        { code: "SD", name: "Sudan", flag: "🇸🇩" },
        { code: "SS", name: "South Sudan", flag: "🇸🇸" },
        { code: "LK", name: "Sri Lanka", flag: "🇱🇰" },
        { code: "SE", name: "Sweden", flag: "🇸🇪" },
        { code: "CH", name: "Switzerland", flag: "🇨🇭" },
        { code: "SR", name: "Suriname", flag: "🇸🇷" },
        { code: "SJ", name: "Svalbard and Jan Mayen", flag: "�🇯" },
        { code: "SZ", name: "Eswatini", flag: "🇸🇿" },
        { code: "SY", name: "Syria", flag: "🇸🇾" },
        { code: "TJ", name: "Tajikistan", flag: "🇹🇯" },
        { code: "TW", name: "Taiwan", flag: "🇹🇼" },
        { code: "TZ", name: "Tanzania", flag: "🇹🇿" },
        { code: "TD", name: "Chad", flag: "🇹🇩" },
        { code: "CZ", name: "Czech Republic", flag: "🇨🇿" },
        { code: "TF", name: "French Southern Territories", flag: "🇹🇫" },
        { code: "IO", name: "British Indian Ocean Territory", flag: "🇮🇴" },
        { code: "TH", name: "Thailand", flag: "🇹🇭" },
        { code: "TL", name: "East Timor", flag: "🇹🇱" },
        { code: "TG", name: "Togo", flag: "🇹🇬" },
        { code: "TK", name: "Tokelau", flag: "🇹🇰" },
        { code: "TO", name: "Tonga", flag: "🇹🇴" },
        { code: "TT", name: "Trinidad and Tobago", flag: "🇹🇹" },
        { code: "TN", name: "Tunisia", flag: "🇹🇳" },
        { code: "TM", name: "Turkmenistan", flag: "🇹🇲" },
        { code: "TR", name: "Turkey", flag: "🇹🇷" },
        { code: "TV", name: "Tuvalu", flag: "🇹🇻" },
        { code: "UA", name: "Ukraine", flag: "🇺🇦" },
        { code: "UY", name: "Uruguay", flag: "�🇾" },
        { code: "VU", name: "Vanuatu", flag: "🇻🇺" },
        { code: "VE", name: "Venezuela", flag: "🇻🇪" },
        { code: "VN", name: "Vietnam", flag: "🇻�🇳" },
        { code: "WF", name: "Wallis and Futuna", flag: "🇼🇫" },
        { code: "YE", name: "Yemen", flag: "🇾🇪" },
        { code: "ZM", name: "Zambia", flag: "🇿🇲" },
        { code: "ZW", name: "Zimbabwe", flag: "🇿🇼" },
    ];

    const hasActiveFilters = Object.entries(filters).some(
        ([key, value]) => key !== "search" && value !== ""
    );

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                        {t("Filters") || "Filters"}
                    </h3>
                </div>
                {hasActiveFilters && (
                    <button
                        onClick={onReset}
                        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <RotateCcw className="w-4 h-4" />
                        {t("Reset") || "Reset"}
                    </button>
                )}
            </div>

            <div className="space-y-6">
                {/* Featured Filter - Move to top with special styling */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-200">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                        <Star className="w-5 h-5 text-yellow-600 fill-yellow-600" />
                        {t("Featured Programs") || "Featured Programs"}
                    </label>
                    <div className="space-y-2">
                        {[
                            {
                                value: "",
                                label: t("All Programs") || "All Programs",
                                icon: "🌟",
                            },
                            {
                                value: "true",
                                label: t("Featured Only") || "Featured Only",
                                icon: "⭐",
                            },
                        ].map((option) => (
                            <label
                                key={option.value}
                                className="flex items-center gap-3 cursor-pointer hover:bg-yellow-100 p-2 rounded-lg transition-colors"
                            >
                                <input
                                    type="radio"
                                    name="featured"
                                    value={option.value}
                                    checked={filters.featured === option.value}
                                    onChange={(e) =>
                                        onFilterChange(
                                            "featured",
                                            e.target.value
                                        )
                                    }
                                    className="text-yellow-600 focus:ring-yellow-500"
                                />
                                <span className="text-lg">{option.icon}</span>
                                <span className="text-sm font-medium text-gray-700">
                                    {option.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Category Filter */}
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                        <Tag className="w-4 h-4 text-blue-600" />
                        {t("Category") || "Category"}
                    </label>
                    <select
                        value={filters.category}
                        onChange={(e) =>
                            onFilterChange("category", e.target.value)
                        }
                        className="w-full p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                    >
                        <option value="">
                            {t("All Categories") || "All Categories"}
                        </option>
                        {categories.map((category, index) => {
                            // Handle both object {category, category_ar} and string formats
                            const categoryValue =
                                typeof category === "object"
                                    ? category.category || category.value
                                    : category;
                            const categoryLabel =
                                typeof category === "object"
                                    ? category.category || category.label
                                    : category;

                            return (
                                <option
                                    key={`category-${categoryValue}-${index}`}
                                    value={categoryValue}
                                >
                                    {categoryLabel}
                                </option>
                            );
                        })}
                    </select>
                </div>

                {/* Organization Filter */}
                <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                        <Building className="w-4 h-4 text-green-600" />
                        {t("Organization") || "Organization"}
                    </label>
                    <select
                        value={filters.organization}
                        onChange={(e) =>
                            onFilterChange("organization", e.target.value)
                        }
                        className="w-full p-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm bg-white"
                    >
                        <option value="">
                            {t("All Organizations") || "All Organizations"}
                        </option>
                        {organizations.map((org, index) => {
                            // Handle both object {organization, organization_ar} and string formats
                            const orgValue =
                                typeof org === "object"
                                    ? org.organization || org.value
                                    : org;
                            const orgLabel =
                                typeof org === "object"
                                    ? org.organization || org.label
                                    : org;

                            return (
                                <option
                                    key={`org-${orgValue}-${index}`}
                                    value={orgValue}
                                >
                                    {orgLabel}
                                </option>
                            );
                        })}
                    </select>
                </div>

                {/* Status Filter */}
                <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                        <Calendar className="w-4 h-4 text-purple-600" />
                        {t("Status") || "Status"}
                    </label>
                    <select
                        value={filters.status}
                        onChange={(e) =>
                            onFilterChange("status", e.target.value)
                        }
                        className="w-full p-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm bg-white"
                    >
                        {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Program Type Filter */}
                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-200">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                        <Star className="w-4 h-4 text-indigo-600" />
                        {t("Program Type") || "Program Type"}
                    </label>
                    <select
                        value={filters.programType}
                        onChange={(e) =>
                            onFilterChange("programType", e.target.value)
                        }
                        className="w-full p-3 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white"
                    >
                        {programTypeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Country Filter */}
                <div className="bg-teal-50 p-4 rounded-xl border border-teal-200">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                        <Globe className="w-4 h-4 text-teal-600" />
                        {t("Country") || "Country"}
                    </label>
                    <select
                        value={filters.country}
                        onChange={(e) =>
                            onFilterChange("country", e.target.value)
                        }
                        className="w-full p-3 border border-teal-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm bg-white"
                    >
                        {commonCountries.map((country) => (
                            <option key={country.code} value={country.code}>
                                {country.flag} {country.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Location Filter with Search Button */}
                <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                        <MapPin className="w-4 h-4 text-red-600" />
                        {t("Location") || "Location"}
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder={
                                t("Enter city or region") ||
                                "Enter city or region"
                            }
                            value={localLocation}
                            onChange={(e) => setLocalLocation(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                    handleLocationSearch();
                                }
                            }}
                            className="flex-1 p-3 border border-red-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm bg-white"
                        />
                        <button
                            onClick={handleLocationSearch}
                            className="px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center gap-2"
                        >
                            <Search className="w-4 h-4" />
                        </button>
                    </div>
                    <p className="text-xs text-red-600 mt-1">
                        {t("Example: Paris, London, Toronto") ||
                            "Example: Paris, London, Toronto"}
                    </p>
                </div>

                {/* Program Format Filter */}
                <div className="bg-cyan-50 p-4 rounded-xl border border-cyan-200">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                        <Monitor className="w-4 h-4 text-cyan-600" />
                        {t("Program Format") || "Program Format"}
                    </label>
                    <div className="space-y-2">
                        {[
                            {
                                value: "",
                                label: t("All Formats") || "All Formats",
                                icon: "🌍",
                            },
                            {
                                value: "true",
                                label:
                                    t("Online Programs") || "Online Programs",
                                icon: "💻",
                            },
                            {
                                value: "false",
                                label:
                                    t("On-site Programs") || "On-site Programs",
                                icon: "🏢",
                            },
                        ].map((option) => (
                            <label
                                key={option.value}
                                className="flex items-center gap-3 cursor-pointer hover:bg-cyan-100 p-2 rounded-lg transition-colors"
                            >
                                <input
                                    type="radio"
                                    name="programFormat"
                                    value={option.value}
                                    checked={filters.isRemote === option.value}
                                    onChange={(e) =>
                                        onFilterChange(
                                            "isRemote",
                                            e.target.value
                                        )
                                    }
                                    className="text-cyan-600 focus:ring-cyan-500"
                                />
                                <span className="text-lg">{option.icon}</span>
                                <span className="text-sm font-medium text-gray-700">
                                    {option.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Tags Filter with Search Button */}
                <div className="bg-pink-50 p-4 rounded-xl border border-pink-200">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                        <Tag className="w-4 h-4 text-pink-600" />
                        {t("Tags") || "Tags"}
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder={
                                t("Enter tags (comma separated)") ||
                                "Enter tags (comma separated)"
                            }
                            value={localTags}
                            onChange={(e) => setLocalTags(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                    handleTagsSearch();
                                }
                            }}
                            className="flex-1 p-3 border border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm bg-white"
                        />
                        <button
                            onClick={handleTagsSearch}
                            className="px-4 py-3 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition-colors flex items-center gap-2"
                        >
                            <Search className="w-4 h-4" />
                        </button>
                    </div>
                    <p className="text-xs text-pink-600 mt-1">
                        {t("Example: technology, medicine, engineering") ||
                            "Example: technology, medicine, engineering"}
                    </p>
                </div>

                {/* Price Range Filter with Search Button */}
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                        <DollarSign className="w-4 h-4 text-emerald-600" />
                        {t("Price Range") || "Price Range"}
                    </label>

                    {/* Preset Price Ranges */}
                    <div className="space-y-2 mb-4">
                        {[
                            {
                                value: "",
                                label: t("All Prices") || "All Prices",
                            },
                            { value: "0-1000", label: "$0 - $1,000" },
                            { value: "1000-5000", label: "$1,000 - $5,000" },
                            { value: "5000-10000", label: "$5,000 - $10,000" },
                            {
                                value: "10000-25000",
                                label: "$10,000 - $25,000",
                            },
                            {
                                value: "25000-50000",
                                label: "$25,000 - $50,000",
                            },
                            { value: "50000+", label: "$50,000+" },
                            { value: "free", label: t("Free") || "Free" },
                        ].map((option) => (
                            <label
                                key={option.value}
                                className="flex items-center gap-2 cursor-pointer hover:bg-emerald-100 p-2 rounded-lg transition-colors"
                            >
                                <input
                                    type="radio"
                                    name="priceRange"
                                    value={option.value}
                                    checked={
                                        filters.priceRange === option.value
                                    }
                                    onChange={(e) =>
                                        onFilterChange(
                                            "priceRange",
                                            e.target.value
                                        )
                                    }
                                    className="text-emerald-600 focus:ring-emerald-500"
                                />
                                <span className="text-sm font-medium text-gray-700">
                                    {option.label}
                                </span>
                            </label>
                        ))}
                    </div>

                    {/* Custom Price Range */}
                    <div className="border-t border-emerald-200 pt-3">
                        <p className="text-xs text-emerald-600 mb-2 font-medium">
                            {t("Custom Range") || "Custom Range"}
                        </p>
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-xs text-emerald-600 mb-1 block">
                                        {t("Min Price") || "Min Price"}
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={localMinPrice}
                                        onChange={(e) =>
                                            setLocalMinPrice(e.target.value)
                                        }
                                        onKeyPress={(e) => {
                                            if (e.key === "Enter") {
                                                handlePriceSearch();
                                            }
                                        }}
                                        className="w-full p-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-emerald-600 mb-1 block">
                                        {t("Max Price") || "Max Price"}
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="∞"
                                        value={localMaxPrice}
                                        onChange={(e) =>
                                            setLocalMaxPrice(e.target.value)
                                        }
                                        onKeyPress={(e) => {
                                            if (e.key === "Enter") {
                                                handlePriceSearch();
                                            }
                                        }}
                                        className="w-full p-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm bg-white"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={handlePriceSearch}
                                className="w-full px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <Search className="w-4 h-4" />
                                {t("Apply Price Filter") ||
                                    "Apply Price Filter"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            
        </div>
    );
};

FilterSidebar.propTypes = {
    filters: PropTypes.shape({
        category: PropTypes.string,
        organization: PropTypes.string,
        status: PropTypes.string,
        programType: PropTypes.string,
        featured: PropTypes.string,
        priceRange: PropTypes.string,
        minPrice: PropTypes.string,
        maxPrice: PropTypes.string,
        tags: PropTypes.string,
        search: PropTypes.string,
        country: PropTypes.string,
        location: PropTypes.string,
        isRemote: PropTypes.string,
    }).isRequired,
    onFilterChange: PropTypes.func.isRequired,
    categories: PropTypes.arrayOf(
        PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.shape({
                category: PropTypes.string,
                category_ar: PropTypes.string,
                value: PropTypes.string,
                label: PropTypes.string,
            }),
        ])
    ).isRequired,
    organizations: PropTypes.arrayOf(
        PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.shape({
                organization: PropTypes.string,
                organization_ar: PropTypes.string,
                value: PropTypes.string,
                label: PropTypes.string,
            }),
        ])
    ).isRequired,
    onReset: PropTypes.func.isRequired,
};

export default FilterSidebar;
