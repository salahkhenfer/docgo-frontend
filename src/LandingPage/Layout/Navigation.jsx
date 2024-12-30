import LightColoredButton from "../../components/Buttons/LightColoredButton";
import DropDownContent from "../../components/DropDownContent";
import FlyoutLink from "../../components/FlyoutLink";
import NavigationMobile from "./NavigationMobile";
import { Link as ScrollSmooth } from "react-scroll";
function Navigation() {
  return (
    <>
      <nav className="flex justify-between items-center  px-28 py-16 lg-md:max-3xl:px-20 lg-md:max-3xl:py-12 md:max-lg-md:px-8 md:max-lg-md:py-6 sm:max-md:p-4  sm-sm:max-md:hidden">
        <img
          className="w-28 h-28 rounded-full  md:max-3xl:w-20 md:max-3xl:h-20 md:max-lg:w-16 md:max-lg:h-16"
          src="./src/assets/Logo.png"
          alt="Godoc Agency logo"
        />
        <div className="flex justify-center items-center gap-8 text-xl font-medium lg:max-3xl:text-base lg-md:max-3xl:gap-6 md:max-lg:text-[12px] md:max-lg:gap-3  ">
          <FlyoutLink
            href="#"
            FlyoutContent={() => (
              <DropDownContent
                links={[
                  { href: "#", text: "Pharmacien" },
                  { href: "#", text: "Médecine" },
                  { href: "#", text: "Sage-femme" },
                  { href: "#", text: "Infirmière" },
                ]}
              />
            )}
          >
            Spécialités médicales
          </FlyoutLink>
          <FlyoutLink
            href="#"
            FlyoutContent={() => (
              <DropDownContent
                links={[
                  { href: "#", text: "Campus France" },
                  { href: "#", text: "Écoles privées" },
                ]}
              />
            )}
          >
            Autres spécialités{" "}
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
            Nos services
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
            À propos de nous
          </ScrollSmooth>
        </div>
        <LightColoredButton text="Être étudiant" />
      </nav>

      <NavigationMobile />
    </>
  );
}

export default Navigation;
