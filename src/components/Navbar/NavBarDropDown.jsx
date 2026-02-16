import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import handleLogout from "../../API/Logout";
import { useAppContext } from "../../AppContext";

const NavBarDropDown = ({ isDropdownOpen, setIsDropdownOpen }) => {
    const { t } = useTranslation();
    const { user, set_Auth, set_user, store_logout } = useAppContext();
    const avatarDropdownRef = useRef(null);

    const { i18n } = useTranslation();
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
    const logout = () => {
        handleLogout({
            setAuth: set_Auth,
            setUser: set_user,
            storeLogout: store_logout,
            setIsDropdownOpen: setIsDropdownOpen,
        });
    };

    return (
        <div className="relative" ref={avatarDropdownRef}>
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFB457] to-[#FF705B]
                flex items-center justify-center border-2 border-white shadow-lg hover:shadow-xl
                transition-all duration-300 transform hover:scale-110 relative overflow-hidden
                before:absolute before:inset-0 before:bg-white/20 before:rounded-full
                before:scale-0 hover:before:scale-100 before:transition-transform before:duration-300"
            >
                <FaUser className="text-white w-5 h-5 relative z-10" />
                {/* Active indicator ring */}
                <div
                    className={`absolute inset-0 rounded-full border-2 transition-all duration-300
                    ${
                        isDropdownOpen
                            ? "border-[#0086C9] scale-125"
                            : "border-transparent scale-100"
                    }`}
                />
            </button>

            {isDropdownOpen && (
                <div
                    className={`fixed ${
                        i18n.language === "ar"
                            ? "md:left-[20px] left-4"
                            : "md:right-[20px] right-4"
                    } md:top-[70px] top-20 w-56 bg-white rounded-lg shadow-xl py-2 z-[9999]
                    animate-in slide-in-from-top-2 fade-in duration-200`}
                    style={{
                        boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
                        border: "1px solid rgba(0,0,0,0.1)",
                    }}
                >
                    <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-cyan-50">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0086C9] to-[#00A6E6] flex items-center justify-center">
                                <span className="text-white text-sm font-bold">
                                    {user?.firstName
                                        ?.charAt(0)
                                        ?.toUpperCase() || "G"}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-800">
                                    {user?.firstName
                                        ? user.firstName.length > 12
                                            ? user.firstName.slice(0, 12) +
                                              "..."
                                            : user.firstName
                                        : t("guest")}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {t("welcomeBack")}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="py-1">
                        <Link
                            to="/Profile"
                            className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#0086C9]
                            transition-all duration-200 relative overflow-hidden"
                            onClick={() => setIsDropdownOpen(false)}
                        >
                            <div className="absolute left-0 top-0 h-full w-1 bg-[#0086C9] scale-y-0 group-hover:scale-y-100 transition-transform duration-200" />
                            <span className="ml-2">{t("Profile")}</span>
                        </Link>
                        <Link
                            to="/"
                            className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#0086C9]
                            transition-all duration-200 relative overflow-hidden"
                            onClick={() => setIsDropdownOpen(false)}
                        >
                            <div className="absolute left-0 top-0 h-full w-1 bg-[#0086C9] scale-y-0 group-hover:scale-y-100 transition-transform duration-200" />
                            <span className="ml-2">{t("home")}</span>
                        </Link>

                        <Link
                            to="/dashboard/my-learning"
                            className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#0086C9]
                            transition-all duration-200 relative overflow-hidden"
                            onClick={() => setIsDropdownOpen(false)}
                        >
                            <div className="absolute left-0 top-0 h-full w-1 bg-[#0086C9] scale-y-0 group-hover:scale-y-100 transition-transform duration-200" />
                            <span className="ml-2">
                                {t("MyLearning", "My Learning")}
                            </span>
                        </Link>
                        <Link
                            to="/dashboard/my-programs"
                            className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#0086C9]
                            transition-all duration-200 relative overflow-hidden"
                            onClick={() => setIsDropdownOpen(false)}
                        >
                            <div className="absolute left-0 top-0 h-full w-1 bg-[#0086C9] scale-y-0 group-hover:scale-y-100 transition-transform duration-200" />
                            <span className="ml-2">
                                {t("MyPrograms", "My Programs")}
                            </span>
                        </Link>

                        <Link
                            to="/myApplications"
                            className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#0086C9]
                            transition-all duration-200 relative overflow-hidden"
                            onClick={() => setIsDropdownOpen(false)}
                        >
                            <div className="absolute left-0 top-0 h-full w-1 bg-[#0086C9] scale-y-0 group-hover:scale-y-100 transition-transform duration-200" />
                            <span className="ml-2">{t("MyApplications")}</span>
                        </Link>

                        {/* Notifications link removed from profile dropdown */}
                    </div>

                    <div className="border-t border-gray-100 pt-1">
                        <button
                            className="group flex items-center w-full px-4 py-2 text-sm text-red-600
                            hover:bg-red-50 transition-all duration-200 relative overflow-hidden"
                            onClick={logout}
                        >
                            <div className="absolute left-0 top-0 h-full w-1 bg-red-500 scale-y-0 group-hover:scale-y-100 transition-transform duration-200" />
                            <span className="ml-2">{t("Logout")}</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NavBarDropDown;
