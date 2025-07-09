import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Link as ScrollSmooth } from "react-scroll";
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
                            {t("Specialites")}
                        </Link>
                        <Link
                            to="/searchProgram"
                            className="text-customGray py-2 border-b border-gray-100"
                            onClick={() => setIsOpen(false)}
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
                            className="text-customGray py-2 border-b border-gray-100 cursor-pointer"
                            onClick={() => setIsOpen(false)}
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
                            className="text-customGray py-2 cursor-pointer"
                            onClick={() => setIsOpen(false)}
                        >
                            {t("AboutUsLink")}
                        </ScrollSmooth>
                    </div>
                </div>
            )}
        </div>
    );
}

export default NavigationMobile;
