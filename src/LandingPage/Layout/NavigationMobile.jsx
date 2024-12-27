import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Collaps from "../../components/Collaps";
import LightColoredButton from "../../components/Buttons/LightColoredButton";

const NavigationMobile = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);

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

  return (
    <header className=" md:hidden">
      {!isOpen && (
        <nav className="flex justify-between items-center px-4 py-4">
          <motion.img
            className="w-14 h-14 rounded-full"
            src="../../../src/assets/Logo.png"
            alt="logo"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          />
          <motion.img
            onClick={toggleMenu}
            className="w-8 h-8 cursor-pointer"
            src="../../../src/assets/menu.svg"
            alt="menu icon"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          />
        </nav>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuVars}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed left-0 top-0 w-full h-full bg-white origin-top p-4"
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
                className="flex flex-col px-8 py-2 text-md text-customGray font-medium self-center w-full sm-sm:max-sm-md:text-sm sm-sm:max-sm:px-4 "
              >
                <div className=" overflow-hidden">
                  <motion.div
                    className="flex flex-col gap-2"
                    variants={mobileLinksvars}
                  >
                    <Collaps
                      perentLink={"Medical Specialties"}
                      childLink={[
                        "Pharmacien",
                        "Médecine",
                        "Sage-femme",
                        "Infirmière",
                      ]}
                    />
                    <Collaps
                      perentLink={"Autres spécialités"}
                      childLink={["Campus France", "Écoles privées"]}
                    />
                    <motion.a
                      className="px-1 py-4 bg-white hover:bg-sky-50 transition-colors duration-200"
                      href="#"
                      whileHover={{ x: 10 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Nos services
                    </motion.a>
                    <motion.a
                      className="px-1 py-4 bg-white hover:bg-sky-50 transition-colors duration-200"
                      href="#"
                      whileHover={{ x: 10 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      À propos de nous
                    </motion.a>

                    <LightColoredButton text={"Sign Up and Explore"} />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default NavigationMobile;
