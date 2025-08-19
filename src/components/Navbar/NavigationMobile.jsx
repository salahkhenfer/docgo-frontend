import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaBars, FaTimes } from "react-icons/fa";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import logo from "../../assets/Logo.png";
import LanguageDropdown from "../../components/LanguageDropdown";
import { useAppContext } from "../../AppContext";
import { useFavorites } from "../../hooks/useFavorite";
import NavBarDropDown from "./NavBarDropDown";

function NavigationMobile() {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [isAvatarDropdownOpen, setIsAvatarDropdownOpen] = useState(false);
    const { user, isAuth } = useAppContext();
    const navigate = useNavigate();
    const location = useLocation();

    const { totalCount } = useFavorites();

    const handleScrollToSection = (sectionId) => {
        setIsOpen(false);
        if (location.pathname === "/") {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        } else {
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

                    {user && isAuth ? (
                        <NavBarDropDown
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
                        className={`text-2xl transition-all duration-300 p-2 rounded-lg
                            ${
                                isOpen
                                    ? "text-red-500 bg-red-50 rotate-180"
                                    : "text-[#0086C9] hover:bg-blue-50 hover:text-blue-600"
                            }`}
                    >
                        {isOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </div>

            {isOpen && (
                <div
                    className="bg-white/95 backdrop-blur-md shadow-xl border-t border-gray-100 
                    absolute w-full z-[9000] animate-in slide-in-from-top-3 fade-in duration-300"
                >
                    <div className="py-4 px-6">
                        <div className="flex flex-col space-y-2">
                            {user && isAuth && (
                                <Link
                                    to="/Profile"
                                    className={`px-4 py-3 rounded-lg transition-all duration-200 group relative overflow-hidden
                                        ${
                                            location.pathname === "/Profile"
                                                ? "bg-blue-50 text-[#0086C9] border-l-4 border-[#0086C9]"
                                                : "text-gray-700 hover:bg-blue-50 hover:text-[#0086C9]"
                                        }`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <span className="relative z-10">
                                        {t("Profile_nav")}
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-cyan-50 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
                                </Link>
                            )}

                            <Link
                                to="/"
                                className={`px-4 py-3 rounded-lg transition-all duration-200 group relative overflow-hidden
                                    ${
                                        location.pathname === "/" ||
                                        location.pathname === "/dashboard"
                                            ? "bg-blue-50 text-[#0086C9] border-l-4 border-[#0086C9]"
                                            : "text-gray-700 hover:bg-blue-50 hover:text-[#0086C9]"
                                    }`}
                                onClick={() => setIsOpen(false)}
                            >
                                <span className="relative z-10">
                                    {t("Home_nav")}
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-cyan-50 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
                            </Link>

                            <Link
                                to="/Programs"
                                className={`px-4 py-3 rounded-lg transition-all duration-200 group relative overflow-hidden
                                    ${
                                        location.pathname === "/Programs" ||
                                        location.pathname.startsWith(
                                            "/Programs/"
                                        )
                                            ? "bg-blue-50 text-[#0086C9] border-l-4 border-[#0086C9]"
                                            : "text-gray-700 hover:bg-blue-50 hover:text-[#0086C9]"
                                    }`}
                                onClick={() => setIsOpen(false)}
                            >
                                <span className="relative z-10">
                                    {t("Programs_nav")}
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-cyan-50 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
                            </Link>

                            <Link
                                to="/Courses"
                                className={`px-4 py-3 rounded-lg transition-all duration-200 group relative overflow-hidden
                                    ${
                                        location.pathname === "/Courses" ||
                                        location.pathname.startsWith(
                                            "/Courses/"
                                        )
                                            ? "bg-blue-50 text-[#0086C9] border-l-4 border-[#0086C9]"
                                            : "text-gray-700 hover:bg-blue-50 hover:text-[#0086C9]"
                                    }`}
                                onClick={() => setIsOpen(false)}
                            >
                                <span className="relative z-10">
                                    {t("Courses_nav")}
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-cyan-50 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
                            </Link>

                            <Link
                                to="/favorites"
                                className={`px-4 py-3 rounded-lg transition-all duration-200 group relative overflow-hidden flex items-center gap-2
                                    ${
                                        location.pathname === "/favorites" ||
                                        location.pathname.startsWith(
                                            "/favorites/"
                                        )
                                            ? "bg-red-50 text-red-600 border-l-4 border-red-500"
                                            : "text-gray-700 hover:bg-red-50 hover:text-red-600"
                                    }`}
                                onClick={() => setIsOpen(false)}
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    {totalCount > 0 ? (
                                        <BsHeartFill className="w-4 h-4 text-red-500" />
                                    ) : (
                                        <BsHeart className="w-4 h-4" />
                                    )}
                                    {t("Favorites")}
                                    {totalCount > 0 && (
                                        <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center min-w-[20px] ml-auto">
                                            {totalCount > 99
                                                ? "99+"
                                                : totalCount}
                                        </span>
                                    )}
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-red-50 to-pink-50 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
                            </Link>

                            <Link
                                to="/faq"
                                className={`px-4 py-3 rounded-lg transition-all duration-200 group relative overflow-hidden
                                    ${
                                        location.pathname === "/faq"
                                            ? "bg-blue-50 text-[#0086C9] border-l-4 border-[#0086C9]"
                                            : "text-gray-700 hover:bg-blue-50 hover:text-[#0086C9]"
                                    }`}
                                onClick={() => setIsOpen(false)}
                            >
                                <span className="relative z-10">
                                    {t("FAQ")}
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-cyan-50 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
                            </Link>

                            {!user && !isAuth && (
                                <>
                                    <button
                                        onClick={() =>
                                            handleScrollToSection("ourServices")
                                        }
                                        className="px-4 py-3 rounded-lg transition-all duration-200 group relative overflow-hidden
                                            text-gray-700 hover:bg-orange-50 hover:text-orange-600 cursor-pointer bg-transparent border-none text-left w-full"
                                    >
                                        <span className="relative z-10">
                                            {t("OurServicesLink")}
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-yellow-50 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleScrollToSection("aboutUs")
                                        }
                                        className="px-4 py-3 rounded-lg transition-all duration-200 group relative overflow-hidden
                                            text-gray-700 hover:bg-green-50 hover:text-green-600 cursor-pointer bg-transparent border-none text-left w-full"
                                    >
                                        <span className="relative z-10">
                                            {t("AboutUsLink")}
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-emerald-50 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default NavigationMobile;
