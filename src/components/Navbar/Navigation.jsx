import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { useAppContext } from "../../AppContext";
import { useFavorites } from "../../hooks/useFavorite";
import { useUserNavigation } from "../../context/UserNavigationContext";
import logo from "../../assets/Logo.png";
import LanguageDropdown from "../../components/LanguageDropdown";
import LightColoredButton from "../../components/Buttons/LightColoredButton";
import NavigationMobile from "./NavigationMobile";
import NavBarDropDown from "./NavBarDropDown";

function Navigation({ branding = null }) {
    const { t } = useTranslation();
    const { user, isAuth } = useAppContext();
    const { getActiveNavItem } = useUserNavigation();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("");
    const [isScrolled, setIsScrolled] = useState(false);
    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const isDashboardRoute = location.pathname
        .toLowerCase()
        .startsWith("/dashboard");

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

    // Add favorites hook
    const { totalCount } = useFavorites();

    // Scroll detection for navbar background
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Active section detection
    useEffect(() => {
        if (location.pathname !== "/") {
            setActiveSection(location.pathname);
            return;
        }

        const sections = ["ourServices", "aboutUs"];
        const handleScroll = () => {
            const current = sections.find((section) => {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    return rect.top <= 100 && rect.bottom >= 100;
                }
                return false;
            });
            setActiveSection(current || "");
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll(); // Initial check
        return () => window.removeEventListener("scroll", handleScroll);
    }, [location.pathname]);

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
        const activeNavItem = getActiveNavItem;

        const getNavLinkClass = (itemId, sectionId = null) => {
            let isActive = false;

            if (sectionId) {
                // For section buttons (Our Services, About Us)
                isActive = activeSection === sectionId;
            } else {
                // For regular navigation links
                isActive = activeNavItem === itemId;
            }

            return `relative px-3 py-2 font-medium text-sm lg:text-base transition-all duration-300 group
                ${
                    isActive
                        ? "text-[#0086C9]"
                        : "text-gray-700 hover:text-[#0086C9]"
                }
                `;
        };

        const ActiveIndicator = ({ isActive }) => (
            <span
                className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#0086C9] to-[#00A6E6] 
                transition-transform duration-300 origin-center
                ${
                    isActive
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                }`}
            />
        );

        ActiveIndicator.propTypes = {
            isActive: PropTypes.bool,
        };

        const isHomeActive = activeNavItem === "home";
        const isProgramsActive = activeNavItem === "programs";
        const isCoursesActive = activeNavItem === "courses";
        const isFaqActive = activeNavItem === "faq";

        return (
            <div className="flex justify-center items-center gap-2 lg:gap-4">
                <Link to="/" className={getNavLinkClass("home")}>
                    {t("Home_nav")}
                    <ActiveIndicator isActive={isHomeActive} />
                </Link>
                <Link to="/programs" className={getNavLinkClass("programs")}>
                    {t("Programs_nav")}
                    <ActiveIndicator isActive={isProgramsActive} />
                </Link>
                <Link to="/courses" className={getNavLinkClass("courses")}>
                    {t("Courses_nav")}
                    <ActiveIndicator isActive={isCoursesActive} />
                </Link>
                {/* {isAuth && (
                    <>
                        <Link
                            to="/dashboard/my-learning"
                            className={getNavLinkClass("dashboard")}
                        >
                            {t("MyLearning", "My Learning")}
                            <ActiveIndicator isActive={isDashboardActive} />
                        </Link>
                        <Link
                            to="/dashboard/my-programs"
                            className={getNavLinkClass("dashboard")}
                        >
                            {t("MyPrograms", "My Programs")}
                            <ActiveIndicator isActive={isDashboardActive} />
                        </Link>
                    </>
                )} */}
                <Link
                    to="/faq"
                    className={`${getNavLinkClass(
                        "faq",
                    )} flex items-center gap-1`}
                >
                    {t("FAQ")}
                    <ActiveIndicator isActive={isFaqActive} />
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
                            className={`${getNavLinkClass(
                                "",
                                "ourServices",
                            )} bg-transparent border-none cursor-pointer`}
                        >
                            {t("OurServicesLink")}
                            <ActiveIndicator
                                isActive={activeSection === "ourServices"}
                            />
                        </button>
                        <button
                            onClick={() => handleScrollToSection("aboutUs")}
                            className={`${getNavLinkClass(
                                "",
                                "aboutUs",
                            )} bg-transparent border-none cursor-pointer`}
                        >
                            {t("AboutUsLink")}
                            <ActiveIndicator
                                isActive={activeSection === "aboutUs"}
                            />
                        </button>
                    </>
                )}
            </div>
        );
    };

    return (
        <div
            className={`sticky top-0 w-full z-50 transition-all duration-300 
            ${
                isScrolled
                    ? "bg-white/95 backdrop-blur-md shadow-lg"
                    : "bg-white"
            }`}
        >
            {/* Progress indicator */}
            <div
                className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#0086C9] to-transparent opacity-0 animate-pulse"
                style={{
                    background: `linear-gradient(90deg, 
                        transparent 0%, 
                        #0086C9 ${
                            (window.scrollY /
                                (document.documentElement.scrollHeight -
                                    window.innerHeight)) *
                            100
                        }%, 
                        transparent 100%)`,
                }}
            />

            <nav
                className={`hidden lg:flex justify-between items-center px-4 sm:px-6 lg:px-10 transition-all duration-300
                ${isScrolled ? "py-2" : "py-3"}`}
            >
                <Link to="/" className="flex items-center">
                    <div className="flex items-center gap-3">
                        <img
                            className={`rounded-full transition-all duration-300 hover:scale-105
                                ${
                                    isScrolled
                                        ? "w-16 h-16 md:w-12 md:h-12 lg:w-14 lg:h-14"
                                        : "w-24 h-24 md:w-16 md:h-16 lg:w-20 lg:h-20"
                                }`}
                            src={brandLogoSrc}
                            alt="Logo"
                        />
                        {brandName ? (
                            <span className="hidden md:block font-semibold text-gray-800">
                                {brandName}
                            </span>
                        ) : null}
                    </div>
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
                    } items-center gap-3 font-medium text-sm lg:text-base`}
                >
                    <LanguageDropdown />

                    {/* Favorites Button */}
                    <Link
                        to="/favorites"
                        className={`relative p-3 rounded-full transition-all duration-300 group
                            ${
                                location.pathname === "/favorites" ||
                                location.pathname.startsWith("/favorites/")
                                    ? "bg-red-100 text-red-600"
                                    : "text-gray-600 hover:text-red-500 hover:bg-red-50"
                            }`}
                        title={t("Favorites") || "Favorites"}
                    >
                        <div className="relative">
                            {totalCount > 0 ? (
                                <BsHeartFill className="w-6 h-6 text-red-500 animate-pulse" />
                            ) : (
                                <BsHeart className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                            )}
                            {totalCount > 0 && (
                                <span
                                    className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full 
                                    w-5 h-5 flex items-center justify-center min-w-[20px] font-bold shadow-lg animate-bounce
                                    ring-2 ring-white"
                                >
                                    {totalCount > 99 ? "99+" : totalCount}
                                </span>
                            )}
                        </div>
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
            {!isDashboardRoute ? (
                <NavigationMobile branding={branding} />
            ) : null}
        </div>
    );
}

Navigation.propTypes = {
    branding: PropTypes.shape({
        brandName: PropTypes.string,
        logoUrl: PropTypes.string,
        logoUpdatedAt: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
            PropTypes.instanceOf(Date),
        ]),
    }),
};

export default Navigation;
