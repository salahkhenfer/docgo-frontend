import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Link as ScrollSmooth } from "react-scroll";
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
    const MainContent = () => {
        return (
            <div className="flex justify-center items-center gap-5 lg:max-3xl:gap-4 lg:text-base">
                <Link
                    to="/searchProgram"
                    className="hover:text-[#0086C9] hover:text-lg font-medium transition-all duration-300 lg:max-3xl:text-sm md:max-lg:text-[12px]"
                >
                    {t("Specialites")}
                </Link>
                <Link
                    to="/searchProgram"
                    className="hover:text-[#0086C9] hover:text-lg font-medium transition-all duration-300 lg:max-3xl:text-sm md:max-lg:text-[12px]"
                >
                    {t("OtherSpecialties")}
                </Link>
                <ScrollSmooth
                    to="ourServices"
                    spy={true}
                    smooth={true}
                    hashSpy={true}
                    offset={-100}
                    duration={500}
                    className="hover:text-[#0086C9] hover:text-lg font-medium transition-all duration-300 hover:cursor-pointer lg:max-3xl:text-sm md:max-lg:text-[12px]"
                >
                    {t("OurServicesLink")}
                </ScrollSmooth>
                <ScrollSmooth
                    to="aboutUs"
                    spy={true}
                    smooth={true}
                    hashSpy={true}
                    offset={-100}
                    duration={500}
                    className="hover:text-[#0086C9] hover:text-lg font-medium transition-all duration-300 hover:cursor-pointer lg:max-3xl:text-sm md:max-lg:text-[12px]"
                >
                    {t("AboutUsLink")}
                </ScrollSmooth>
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
