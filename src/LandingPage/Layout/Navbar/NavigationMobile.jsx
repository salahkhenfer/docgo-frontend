import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaBars, FaTimes } from "react-icons/fa";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import logo from "../../../assets/Logo.png";
import LanguageDropdown from "../../../components/LanguageDropdown";
import { useAppContext } from "../../../AppContext";
import { useFavorites } from "../../../hooks/useFavorite";
import CustomAvatar from "./Avatar"; // Import directly
function NavigationMobile() {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [isAvatarDropdownOpen, setIsAvatarDropdownOpen] = useState(false);
    const { user } = useAppContext();
    const navigate = useNavigate();
    const location = useLocation();

    // Add favorites hook
    const { totalCount } = useFavorites();

    // Function to handle scrolling to sections
    const handleScrollToSection = (sectionId) => {
        setIsOpen(false); // Close mobile menu
        if (location.pathname === "/") {
            // If already on home page, just scroll
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }
        } else {
            // Navigate to home first, then scroll
            navigate("/");
            setTimeout(() => {
                const element = document.getElementById(sectionId);
                if (element) {
                    element.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });
                }
            }, 100);
        }
    };

    return (
        <div className="hidden sm-sm:max-lg:block">
            <div className="flex justify-between items-center px-4 py-3 shadow-md">
                <Link to="/">
                    <img
                        className="w-16 h-16 rounded-full transition-transform duration-300 hover:scale-105"
                        src={logo}
                        alt="Docgo Agency logo"
                    />
                </Link>

                <div className="flex items-center gap-4">
                    <Link
                        to="/favorites"
                        className="relative p-2 text-gray-600 hover:text-red-500 transition-colors duration-200"
                        title={t("Favorites") || "Favorites"}
                    >
                        {totalCount > 0 ? (
                            <BsHeartFill className="w-6 h-6 text-red-500" />
                        ) : (
                            <BsHeart className="w-6 h-6" />
                        )}
                        {totalCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center min-w-[20px]">
                                {totalCount > 99 ? "99+" : totalCount}
                            </span>
                        )}
                    </Link>
                    <LanguageDropdown />

                    {/* Use CustomAvatar directly with its own state */}
                    {user ? (
                        <CustomAvatar
                            isDropdownOpen={isAvatarDropdownOpen}
                            setIsDropdownOpen={setIsAvatarDropdownOpen}
                        />
                    ) : (
                        <Link
                            to="/login"
                            className="text-sm px-3 py-1 bg-primary text-white rounded-md"
                        >
                            {t("BeingAstudent")}
                        </Link>
                    )}

                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-2xl text-primary"
                    >
                        {isOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </div>

            {/* Mobile menu dropdown */}
            {isOpen && (
                <div className="bg-white shadow-md py-4 px-6 absolute w-full z-[9000]">
                    <div className="flex flex-col gap-4">
                        <Link
                            to="/searchProgram"
                            className="text-customGray py-2 border-b border-gray-100"
                            onClick={() => setIsOpen(false)}
                        >
                            {t("Programs")}
                        </Link>
                        <Link
                            to="/allcourses"
                            className="text-customGray py-2 border-b border-gray-100"
                            onClick={() => setIsOpen(false)}
                        >
                            {t("Courses")}
                        </Link>
                        <Link
                            to="/favorites"
                            className="text-customGray py-2 border-b border-gray-100 flex items-center gap-2 relative"
                            onClick={() => setIsOpen(false)}
                        >
                            {totalCount > 0 ? (
                                <BsHeartFill className="w-4 h-4 text-red-500" />
                            ) : (
                                <BsHeart className="w-4 h-4" />
                            )}
                            {t("Favorites")}
                            {totalCount > 0 && (
                                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center min-w-[20px] ml-auto">
                                    {totalCount > 99 ? "99+" : totalCount}
                                </span>
                            )}
                        </Link>
                        <button
                            onClick={() => handleScrollToSection("ourServices")}
                            className="text-customGray py-2 border-b border-gray-100 cursor-pointer bg-transparent border-none text-left w-full"
                        >
                            {t("OurServicesLink")}
                        </button>
                        <button
                            onClick={() => handleScrollToSection("aboutUs")}
                            className="text-customGray py-2 cursor-pointer bg-transparent border-none text-left w-full"
                        >
                            {t("AboutUsLink")}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default NavigationMobile;
