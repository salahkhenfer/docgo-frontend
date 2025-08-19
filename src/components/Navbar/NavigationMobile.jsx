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
                        className="text-2xl text-primary"
                    >
                        {isOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </div>

            {isOpen && (
                <div className="bg-white shadow-md py-4 px-6 absolute w-full z-[9000]">
                    <div className="flex flex-col gap-4">
                        {user && isAuth && (
                            <Link
                                to="/Profile"
                                className="text-customGray py-2 border-b border-gray-100"
                                onClick={() => setIsOpen(false)}
                            >
                                {t("Profile_nav")}
                            </Link>
                        )}

                        <Link
                            to="/"
                            className="text-customGray py-2 border-b border-gray-100"
                            onClick={() => setIsOpen(false)}
                        >
                            {t("Home_nav")}
                        </Link>

                        <Link
                            to="/Programs"
                            className="text-customGray py-2 border-b border-gray-100"
                            onClick={() => setIsOpen(false)}
                        >
                            {t("Programs_nav")}
                        </Link>

                        <Link
                            to="/Courses"
                            className="text-customGray py-2 border-b border-gray-100"
                            onClick={() => setIsOpen(false)}
                        >
                            {t("Courses_nav")}
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

                        <Link
                            to="/faq"
                            className="text-customGray py-2 border-b border-gray-100 flex items-center gap-2"
                            onClick={() => setIsOpen(false)}
                        >
                            {t("FAQ")}
                        </Link>

                        {!user && !isAuth && (
                            <>
                                <button
                                    onClick={() =>
                                        handleScrollToSection("ourServices")
                                    }
                                    className="text-customGray py-2 border-b border-gray-100 cursor-pointer bg-transparent border-none text-left w-full"
                                >
                                    {t("OurServicesLink")}
                                </button>
                                <button
                                    onClick={() =>
                                        handleScrollToSection("aboutUs")
                                    }
                                    className="text-customGray py-2 cursor-pointer bg-transparent border-none text-left w-full"
                                >
                                    {t("AboutUsLink")}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default NavigationMobile;
