import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaBars, FaTimes } from "react-icons/fa";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import logo from "../../assets/Logo.png";
import LanguageDropdown from "../../components/LanguageDropdown";
import { useAppContext } from "../../AppContext";
import { useFavorites } from "../../hooks/useFavorite";
import { useUserNavigation } from "../../context/UserNavigationContext";
import NavBarDropDown from "./NavBarDropDown";

function NavigationMobile({ branding = null }) {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [isAvatarDropdownOpen, setIsAvatarDropdownOpen] = useState(false);
    const { user, isAuth } = useAppContext();
    const { getActiveNavItem } = useUserNavigation();
    const navigate = useNavigate();
    const location = useLocation();

    const apiBase = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const brandName = branding?.brandName || "";
    const brandLogoSrc = (() => {
        const logoUrl = branding?.logoUrl;
        if (!logoUrl) return logo;
        const base = `${apiBase}${logoUrl}`;
        const updatedAt = branding?.logoUpdatedAt;
        if (!updatedAt) return base;
        const v = new Date(updatedAt).getTime();
        return `${base}?v=${v}`;
    })();

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
        <div className="block lg:hidden">
            <div className="flex justify-between items-center px-4 py-3 shadow-md">
                <Link to="/">
                    <div className="flex items-center gap-3">
                        <img
                            className="w-14 h-14 rounded-xl object-cover shadow-sm ring-2 ring-gray-100 transition-transform duration-300 hover:scale-105"
                            src={brandLogoSrc}
                            alt="Logo"
                        />
                        {brandName ? (
                            <div className="flex flex-col">
                                <span className="font-extrabold text-lg tracking-tight text-gray-900 leading-tight">
                                    {brandName}
                                </span>
                                <span className="text-xs text-blue-600 font-medium tracking-wide">
                                    e-learning
                                </span>
                            </div>
                        ) : null}
                    </div>
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

                            {user && isAuth && (
                                <>
                                    <Link
                                        to="/dashboard/my-learning"
                                        className={`px-4 py-3 rounded-lg transition-all duration-200 group relative overflow-hidden
                                            ${
                                                location.pathname
                                                    .toLowerCase()
                                                    .startsWith(
                                                        "/dashboard/my-learning",
                                                    )
                                                    ? "bg-blue-50 text-[#0086C9] border-l-4 border-[#0086C9]"
                                                    : "text-gray-700 hover:bg-blue-50 hover:text-[#0086C9]"
                                            }`}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <span className="relative z-10">
                                            {t("MyLearning", "My Learning")}
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-cyan-50 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
                                    </Link>
                                    <Link
                                        to="/dashboard/my-programs"
                                        className={`px-4 py-3 rounded-lg transition-all duration-200 group relative overflow-hidden
                                            ${
                                                location.pathname
                                                    .toLowerCase()
                                                    .startsWith(
                                                        "/dashboard/my-programs",
                                                    )
                                                    ? "bg-blue-50 text-[#0086C9] border-l-4 border-[#0086C9]"
                                                    : "text-gray-700 hover:bg-blue-50 hover:text-[#0086C9]"
                                            }`}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <span className="relative z-10">
                                            {t("MyPrograms", "My Programs")}
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-cyan-50 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
                                    </Link>
                                </>
                            )}

                            <Link
                                to="/"
                                className={`px-4 py-3 rounded-lg transition-all duration-200 group relative overflow-hidden
                                    ${
                                        getActiveNavItem === "home"
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
                                        getActiveNavItem === "programs"
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
                                        getActiveNavItem === "courses"
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
                                        getActiveNavItem === "favorites"
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
                                        getActiveNavItem === "faq"
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
