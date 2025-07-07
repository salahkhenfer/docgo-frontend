import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Link as ScrollSmooth } from "react-scroll";
import logo from "../../assets/Logo.png";
import LightColoredButton from "../../components/Buttons/LightColoredButton";
import DropDownContent from "../../components/DropDownContent";
import FlyoutLink from "../../components/FlyoutLink";
import LanguageDropdown from "../../components/LanguageDropdown";
import i18n from "../../i18n";
import NavigationMobile from "./NavigationMobile";

function Navigation() {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    setUser(true);
  };

  const CustomAvatar = () => {
    const dropdownRef = useRef(null);

    // Close dropdown when navigating
    const handleNavigation = () => {
      setIsDropdownOpen(false);
    };

    return (
      <div className="relative" ref={dropdownRef}>
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
            className={`absolute ${
              i18n.language == "fr" ? "right-0 " : "left-0"
            } top-12 w-56 bg-white rounded-lg shadow-xl py-2 z-50
                     transform transition-all duration-200 origin-top-right
                     animate-fadeIn`}
          >
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-600">اسم الحساب</p>
              <p className="text-sm font-semibold text-gray-800">
                {user?.name}
              </p>
            </div>

            <button
              className="w-full px-4 py-4 text-sm hover:bg-gray-50
                     transition-colors duration-200 flex items-center gap-2"
              onClick={() => setIsDropdownOpen(false)}
            >
              <span>{t("home")}</span>
            </button>

            <Link
              to="/myApplications"
              className="w-full px-4 py-2text-sm hover:bg-gray-50
                     transition-colors duration-200 flex items-center"
              onClick={handleNavigation}
            >
              {t("MyApplications")}
            </Link>

            <Link
              to="/notifications"
              className="w-full px-4 py-2 text-sm hover:bg-gray-50
                     transition-colors duration-200 flex items-center gap-2"
              onClick={() => setIsDropdownOpen(false)}
            >
              <span>{t("notificationsWord")}</span>
            </Link>

            <button
              className="w-full px-4 py-2 text-sm text-red-600
                     hover:bg-red-50 transition-colors duration-200
                     flex items-center gap-2"
              onClick={handleLogout}
            >
              <span>{t("Logout")}</span>
            </button>
          </div>
        )}
      </div>
    );
  };

  const MainContent = () => (
    <div
      className="flex justify-center items-center gap-8 text-lg font-medium 
                    lg:max-3xl:text-sm lg-md:max-3xl:gap-6 md:max-lg:text-[12px] md:max-lg:gap-3"
    >
      <Link
        to="/searchProgram"
        className="no-underline text-customGray hover:cursor-pointer"
      >
        {t("Specialites")}
      </Link>
      <Link
        to="/searchProgram"
        className="no-underline text-customGray hover:cursor-pointer"
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
        className="no-underline text-customGray hover:cursor-pointer"
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
        className="no-underline text-customGray hover:cursor-pointer"
      >
        {t("AboutUsLink")}
      </ScrollSmooth>
    </div>
  );

  return (
    <div className="  sticky top-0 w-full z-50 bg-white">
      <nav className="flex justify-between shadow-md   z-50 items-center px-10 sm-sm:max-lg:hidden">
        <Link to="/">
          <img
            className="w-24 h-24 rounded-full md:w-16 md:h-16 lg:w-20 lg:h-20 
                     transition-transform duration-300 hover:scale-105"
            src={logo}
            alt="Godoc Agency logo"
          />
        </Link>
        <MainContent />
        <div
          className="flex justify-center items-center gap-8 font-medium text-lg 
                      lg:max-3xl:text-sm lg-md:max-3xl:gap-6 md:max-lg:text-[12px] md:max-lg:gap-3"
        >
          <LanguageDropdown />
          {!user ? (
            <CustomAvatar />
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
      <NavigationMobile CustomAvatar={CustomAvatar} />
    </div>
  );
}

export default Navigation;
