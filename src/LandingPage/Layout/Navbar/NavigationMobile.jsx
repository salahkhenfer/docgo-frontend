import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaBars, FaTimes } from "react-icons/fa";
import logo from "../../../assets/Logo.png";
import LanguageDropdown from "../../../components/LanguageDropdown";
import { useAppContext } from "../../../AppContext";
import CustomAvatar from "./Avatar"; // Import directly

function NavigationMobile() {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [isAvatarDropdownOpen, setIsAvatarDropdownOpen] = useState(false);
    const { user } = useAppContext();
    const navigate = useNavigate();
    const location = useLocation();

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
                        alt="Godoc Agency logo"
                    />
                </Link>

                <div className="flex items-center gap-4">
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
                            className="text-customGray py-2 border-b border-gray-100 flex items-center gap-2"
                            onClick={() => setIsOpen(false)}
                        >
                            <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                            {t("Favorites")}
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
