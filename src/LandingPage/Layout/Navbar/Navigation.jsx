import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../../../AppContext";
import logo from "../../../assets/Logo.png";
import LanguageDropdown from "../../../components/LanguageDropdown";
// import LightColoredButton from "../../../components/UI/LightColoredButton";
import LightColoredButton from "../../../components/Buttons/LightColoredButton";
import NavigationMobile from "./NavigationMobile";
import CustomAvatar from "./Avatar"; // Import the component directly

function Navigation() {
    const { t } = useTranslation();
    const { user } = useAppContext();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

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
                    to="/searchProgram"
                    className="hover:text-[#0086C9] hover:text-[16px] font-medium transition-all duration-300 lg:max-3xl:text-sm md:max-lg:text-[12px]"
                >
                    {t("Programs")}
                </Link>
                <Link
                    to="/allcourses"
                    className="hover:text-[#0086C9] hover:text-[16px] font-medium transition-all duration-300 lg:max-3xl:text-sm md:max-lg:text-[12px]"
                >
                    {t("Courses")}
                </Link>
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
                        alt="Godoc Agency logo"
                    />
                </Link>
                <MainContent />
                {/* <div
                    className="flex justify-center items-center gap-8 font-medium text-lg 
                      lg:max-3xl:text-sm lg-md:max-3xl:gap-6 md:max-lg:text-[12px] md:max-lg:gap-3"
                >
                    <LanguageDropdown />
                    {user ? (
                        <CustomAvatar
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
                    } items-center gap-8 font-medium text-lg 
                    lg:max-3xl:text-sm lg-md:max-3xl:gap-6 md:max-lg:text-[12px] md:max-lg:gap-3`}
                >
                    <LanguageDropdown />
                    {user ? (
                        <CustomAvatar
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
