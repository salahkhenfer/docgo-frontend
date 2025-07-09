import React, { useRef, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../../../AppContext";
import i18n from "../../../i18n";

const CustomAvatar = ({ isDropdownOpen, setIsDropdownOpen }) => {
    const { t } = useTranslation();
    const { user, set_Auth } = useAppContext();
    const avatarDropdownRef = useRef(null);

    // Add click outside handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                avatarDropdownRef.current &&
                !avatarDropdownRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [setIsDropdownOpen]);

    // Handle logout action
    const handleLogout = () => {
        setIsDropdownOpen(false);
        if (set_Auth) {
            set_Auth(false);
        }
    };

    return (
        <div className="relative" ref={avatarDropdownRef}>
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFB457] to-[#FF705B]
                flex items-center justify-center border-2 border-white hover:opacity-90
                transition-all duration-300 transform hover:scale-105"
            >
                <FaUser className="text-black/80 w-5 h-5" />
            </button>

            {isDropdownOpen && (
                <div
                    className="fixed md:right-[20px] md:top-[70px] right-4 top-20 w-56 bg-white rounded-lg shadow-xl py-2
                    z-[9999]"
                    style={{
                        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                        border: "1px solid rgba(0,0,0,0.1)",
                    }}
                >
                    <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-600">
                            {t("accountName")}
                        </p>
                        <p className="text-sm font-semibold text-gray-800">
                            {user?.name || t("guest")}
                        </p>
                    </div>

                    <Link
                        to="/"
                        className="block w-full px-4 py-2 text-sm hover:bg-gray-50
                        transition-colors duration-200"
                        onClick={() => setIsDropdownOpen(false)}
                    >
                        <span>{t("home")}</span>
                    </Link>

                    <Link
                        to="/myApplications"
                        className="block w-full px-4 py-2 text-sm hover:bg-gray-50
                        transition-colors duration-200"
                        onClick={() => setIsDropdownOpen(false)}
                    >
                        <span>{t("MyApplications")}</span>
                    </Link>

                    <Link
                        to="/notifications"
                        className="block w-full px-4 py-2 text-sm hover:bg-gray-50
                        transition-colors duration-200"
                        onClick={() => setIsDropdownOpen(false)}
                    >
                        <span>{t("notificationsWord")}</span>
                    </Link>

                    <button
                        className="w-full text-left px-4 py-2 text-sm text-red-600
                        hover:bg-red-50 transition-colors duration-200"
                        onClick={handleLogout}
                    >
                        <span>{t("Logout")}</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default CustomAvatar;
