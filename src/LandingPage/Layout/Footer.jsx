import { useTranslation } from "react-i18next";
import { Link as ScrollSmooth } from "react-scroll";
function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-gray-50 px-4 py-12 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:gap-28 md:gap-20 sm-sm:gap-8">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {t("Specialites")}
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  {t("Pharmacist")}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  {t("Medicine")}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  {t("Midwife")}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  {t("Nurse")}
                </a>
              </li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 pt-6">
              {t("OtherSpecialties")}
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  {t("CampusFrance")}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  {t("PrivateSchools")}
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {t("OurServicesLink")}
            </h3>
            <ul className="space-y-2">
              <li>
                <ScrollSmooth
                  to={"aboutUs"}
                  spy={true}
                  smooth={true}
                  hashSpy={true}
                  offset={-100}
                  duration={500}
                  className="text-gray-600 hover:text-gray-900 hover:cursor-pointer"
                >
                  {t("AboutUsLink")}
                </ScrollSmooth>
              </li>
              <li>
                <ScrollSmooth
                  to={"FAQ"}
                  spy={true}
                  smooth={true}
                  hashSpy={true}
                  offset={-100}
                  duration={500}
                  className="text-gray-600 hover:text-gray-900 hover:cursor-pointer"
                >
                  {"FAQ"}
                </ScrollSmooth>
              </li>
              <li>
                <ScrollSmooth
                  to={"Steps"}
                  spy={true}
                  smooth={true}
                  hashSpy={true}
                  offset={-100}
                  duration={500}
                  className="text-gray-600 hover:text-gray-900 hover:cursor-pointer"
                >
                  {t("TheStages")}
                </ScrollSmooth>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  {t("ContactUs")}
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  {t("StudyAbroad")}
                </a>
              </li>
              <li>
                <ScrollSmooth
                  to={"Coureses"}
                  spy={true}
                  smooth={true}
                  hashSpy={true}
                  offset={-100}
                  duration={500}
                  className="text-gray-600 hover:text-gray-900 hover:cursor-pointer"
                >
                  {t("OurCourses")}
                </ScrollSmooth>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  {t("ToRegister")}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  {t("SignIn")}
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <img
              src="../../../src/assets/Logo.png"
              alt="Logo"
              className="w-12 h-12"
            />
            <p className="text-gray-600">{t("OurPlatform")}</p>

            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <img
                  src="../../../src/assets/Facebook.png"
                  alt="facebook logo"
                  className="w-6 h-6"
                />
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <img
                  src="../../../src/assets/Instagram.png"
                  alt="instagram logo"
                  className="w-6 h-6"
                />
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <img
                  src="../../../src/assets/LinkedIn.png"
                  alt="linkedin logo"
                  className="w-6 h-6"
                />
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <img
                  src="../../../src/assets/YouTube.png"
                  alt="youtube logo"
                  className="w-6 h-6"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
