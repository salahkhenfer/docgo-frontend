import LightColoredButton from "../../components/Buttons/LightColoredButton";
import DropDownContent from "../../components/DropDownContent";
import FlyoutLink from "../../components/FlyoutLink";
import LanguageDropdown from "../../components/LanguageDropdown";
import NavigationMobile from "./NavigationMobile";
import { Link as ScrollSmooth } from "react-scroll";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
function Navigation() {
  const { t } = useTranslation();

  return (
    <>
      <nav
        className={`flex justify-between items-center px-28 py-16 lg-md:max-3xl:px-20 lg-md:max-3xl:py-12 md:max-lg-md:px-8 md:max-lg-md:py-6 sm:max-md:p-4  sm-sm:max-lg:hidden`}
      >
        <Link to="/">
          <img
            className="w-24 h-24 rounded-full  md:w-16 md:h-16 lg:w-20 lg:h-20"
            src="./src/assets/Logo.png"
            alt="Godoc Agency logo"
          />
        </Link>
        <div className="flex justify-center items-center gap-8 text-lg font-medium lg:max-3xl:text-sm lg-md:max-3xl:gap-6 md:max-lg:text-[12px] md:max-lg:gap-3  ">
          <FlyoutLink
            href="#"
            FlyoutContent={() => (
              <DropDownContent
                links={[
                  { href: "#", text: t("Pharmacist") },
                  { href: "#", text: t("Medicine") },
                  { href: "#", text: t("Midwife") },
                  { href: "#", text: t("Nurse") },
                ]}
              />
            )}
          >
            {t("Specialites")}
          </FlyoutLink>
          <FlyoutLink
            href="#"
            FlyoutContent={() => (
              <DropDownContent
                links={[
                  { href: "#", text: t("CampusFrance") },
                  { href: "#", text: t("PrivateSchools") },
                ]}
              />
            )}
          >
            {t("OtherSpecialties")}
          </FlyoutLink>
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
        <div className=" flex justify-center items-center gap-8 font-medium text-lg lg:max-3xl:text-sm lg-md:max-3xl:gap-6 md:max-lg:text-[12px] md:max-lg:gap-3">
          <LanguageDropdown />
          <Link to="/login">
            <LightColoredButton
              text={t("BeingAstudent")}
              style={
                "md:text-[12px] md:px-2 md:py-1 lg:px-8 lg:py-2 lg:text-sm  px-8"
              }
            />
          </Link>
        </div>
      </nav>

      <NavigationMobile />
    </>
  );
}

export default Navigation;
