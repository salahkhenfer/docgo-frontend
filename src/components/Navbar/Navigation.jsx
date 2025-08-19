import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { useAppContext } from "../../AppContext";
import { useFavorites } from "../../hooks/useFavorite";
import logo from "../../assets/Logo.png";
import LanguageDropdown from "../../components/LanguageDropdown";
// import LightColoredButton from "../../../components/UI/LightColoredButton";
import LightColoredButton from "../../components/Buttons/LightColoredButton";
import NavigationMobile from "./NavigationMobile";
import NavBarDropDown from "./NavBarDropDown"; // Import the component directly

function Navigation() {
    const { t } = useTranslation();
    const { user, isAuth } = useAppContext();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    // Add favorites hook
    const { totalCount } = useFavorites();

    // Function to handle scrolling to sections
    const handleScrollToSection = (sectionId) => {
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
    const MainContent = () => {
        return (
            <div className="flex justify-center items-center gap-5 lg:max-3xl:gap-4 lg:text-base">
                <Link
                    to="/"
                    className="hover:text-[#0086C9] hover:text-[16px] font-medium transition-all duration-300 lg:max-3xl:text-sm md:max-lg:text-[12px]"
                >
                    {t("Home_nav")}
                </Link>
                <Link
                    to="/Programs"
                    className="hover:text-[#0086C9] hover:text-[16px] font-medium transition-all duration-300 lg:max-3xl:text-sm md:max-lg:text-[12px]"
                >
                    {t("Programs_nav")}
                </Link>
                <Link
                    to="/Courses"
                    className="hover:text-[#0086C9] hover:text-[16px] font-medium transition-all duration-300 lg:max-3xl:text-sm md:max-lg:text-[12px]"
                >
                    {t("Courses_nav")}
                </Link>
                <Link
                    to="/faq"
                    className="hover:text-[#0086C9] hover:text-[16px] font-medium transition-all duration-300 lg:max-3xl:text-sm md:max-lg:text-[12px] flex items-center gap-1"
                >
                    {/* <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg> */}
                    {t("FAQ")}
                </Link>
                {/* <Link
                    to="/favorites"
                    className="hover:text-[#0086C9] hover:text-[16px] font-medium transition-all duration-300 lg:max-3xl:text-sm md:max-lg:text-[12px] flex items-center gap-1"
                >
                    <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    {t("Favorites")}
                </Link> */}
                {!isAuth && (
                    <>
                        <button
                            onClick={() => handleScrollToSection("ourServices")}
                            className="hover:text-[#0086C9] hover:text-[16px] font-medium transition-all duration-300 hover:cursor-pointer lg:max-3xl:text-sm md:max-lg:text-[12px] bg-transparent border-none"
                        >
                            {t("OurServicesLink")}
                        </button>
                        <button
                            onClick={() => handleScrollToSection("aboutUs")}
                            className="hover:text-[#0086C9] hover:text-[16px] font-medium transition-all duration-300 hover:cursor-pointer lg:max-3xl:text-sm md:max-lg:text-[12px] bg-transparent border-none"
                        >
                            {t("AboutUsLink")}
                        </button>
                    </>
                )}
            </div>
        );
    };

    return (
        <div className="sticky top-0 w-full z-50 bg-white">
            <nav className="flex justify-between shadow-md z-50 items-center px-10 sm-sm:max-lg:hidden">
                <Link to="/">
                    <img
                        className="w-24 h-24 rounded-full md:w-16 md:h-16 lg:w-20 lg:h-20 
                        transition-transform duration-300 hover:scale-105"
                        src={logo}
                        alt="Docgo Agency logo"
                    />
                </Link>
                <MainContent />
                {/* <div
                    className="flex justify-center items-center gap-8 font-medium text-lg 
                      lg:max-3xl:text-sm lg-md:max-3xl:gap-6 md:max-lg:text-[12px] md:max-lg:gap-3"
                >
                    <LanguageDropdown />
                    {user ? (
                        <NavBarDropDown
                            isDropdownOpen={isDropdownOpen}
                            setIsDropdownOpen={setIsDropdownOpen}
                        />
                    ) : (
                        <Link to="/login">
                            <LightColoredButton
                                text={t("BeingAstudent")}
                                style="md:text-[12px] md:px-2 md:py-1 lg:px-8 lg:py-2 lg:text-sm px-8"
                            />
                        </Link>
                    )}
                </div>
                 */}
                <div
                    className={`flex justify-${
                        i18n.language === "ar" ? "end" : "start"
                    } items-center gap-4 font-medium text-lg 
                    lg:max-3xl:text-sm lg-md:max-3xl:gap-3 md:max-lg:text-[12px] md:max-lg:gap-2`}
                >
                    <LanguageDropdown />

                    {/* Favorites Button */}
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

                    {isAuth && user ? (
                        <NavBarDropDown
                            isDropdownOpen={isDropdownOpen}
                            setIsDropdownOpen={setIsDropdownOpen}
                        />
                    ) : (
                        <Link to="/login">
                            <LightColoredButton
                                text={t("BeingAstudent")}
                                style="md:text-[12px] md:px-2 md:py-1 lg:px-8 lg:py-2 lg:text-sm px-8"
                            />
                        </Link>
                    )}
                </div>
            </nav>

            {/* Pass the isDropdownOpen and setIsDropdownOpen states to NavigationMobile */}
            <NavigationMobile />
        </div>
    );
}

export default Navigation;
