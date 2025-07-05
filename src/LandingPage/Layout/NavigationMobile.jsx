import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Collaps from "../../components/Collaps";
import LightColoredButton from "../../components/Buttons/LightColoredButton";
import { Link as ScrollSmooth } from "react-scroll";
import { useTranslation } from "react-i18next";
import LanguageDropdown from "../../components/LanguageDropdown";
import logo from "../../assets/logo.png";

const NavigationMobile = ({ CustomAvatar }) => {
  const [isOpen, setIsOpen] = useState(false);
  const user = null;

  const { t } = useTranslation();

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const handleSetActive = () => {
    setIsOpen(false);
  };

  const menuVars = {
    initial: {
      scaleY: 0,
    },
    animate: {
      scaleY: 1,
      transition: {
        duration: 0.2,
        ease: [0.12, 0, 0.39, 0],
      },
    },
    exit: {
      scaleY: 0,
      transition: {
        delay: 0.1,
        duration: 0.2,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const containerVars = {
    initial: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
    open: {
      transition: {
        delayChildren: 0.4,
        staggerChildren: 0.05,
      },
    },
  };

  const mobileLinksvars = {
    initial: {
      y: 50,
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
    open: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const navItems = [
    {
      type: "collapse",
      title: t("Specialites"),
      children: [t("Pharmacist"), t("Medicine"), t("Midwife"), t("Nurse")],
    },
    {
      type: "collapse",
      title: t("OtherSpecialties"),
      children: [t("CampusFrance"), t("PrivateSchools")],
    },
    {
      type: "scroll",
      title: t("OurServicesLink"),
      to: "ourServices",
    },
    {
      type: "scroll",
      title: t("AboutUsLink"),
      to: "aboutUs",
    },
  ];

  return user ? (
    <header className="lg:hidden">
      {!isOpen && (
        <nav className="flex justify-between items-center px-4 py-2 ">
          <motion.img
            className="w-14 h-14 rounded-full"
            src="../../../src/assets/Logo.png"
            alt="logo"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          />
          <div className="flex items-center justify-between gap-4">
            <LanguageDropdown />
            <motion.img
              onClick={toggleMenu}
              className="w-8 h-8 cursor-pointer"
              src="../../../src/assets/menu.svg"
              alt="menu icon"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            />
          </div>
        </nav>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuVars}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed left-0 top-0 w-full h-full bg-white origin-top p-4 z-[1000]"
          >
            <div className="flex h-full flex-col gap-28">
              <motion.img
                onClick={toggleMenu}
                className="ml-auto w-8 h-8 cursor-pointer"
                src="../../../src/assets/close.svg"
                alt="close icon"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              />

              <motion.div
                variants={containerVars}
                initial="initial"
                animate="open"
                className="flex flex-col px-8 py-2 text-md text-customGray font-medium self-center w-full sm-sm:max-sm-md:text-sm sm-sm:max-sm:px-4"
              >
                <div className="overflow-hidden">
                  <motion.div
                    className="flex flex-col gap-2"
                    variants={mobileLinksvars}
                  >
                    {navItems.map((item, index) =>
                      item.type === "collapse" ? (
                        <Collaps
                          key={index}
                          perentLink={item.title}
                          childLink={item.children}
                        />
                      ) : (
                        <motion.div
                          key={index}
                          className="px-1 py-2 bg-white hover:bg-sky-50 transition-colors duration-200"
                          whileHover={{ x: 10 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <ScrollSmooth
                            to={item.to}
                            spy={true}
                            smooth={true}
                            hashSpy={true}
                            offset={-100}
                            duration={500}
                            onSetActive={handleSetActive}
                            className="block no-underline text-customGray hover:cursor-pointer"
                          >
                            {item.title}
                          </ScrollSmooth>
                        </motion.div>
                      )
                    )}

                    <LightColoredButton text={"Sign Up and Explore"} />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  ) : (
    <header className="lg:hidden">
      <nav className="flex justify-between items-center px-4 py-2">
        <motion.img
          className="w-14 h-14 rounded-full"
          src={logo}
          alt="logo"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        />
        <div className="flex items-center justify-between gap-4">
          <LanguageDropdown />
          <CustomAvatar />
        </div>
      </nav>
    </header>
  );
};

export default NavigationMobile;
