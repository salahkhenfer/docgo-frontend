import { useTranslation } from "react-i18next";
import { Link as ScrollSmooth } from "react-scroll";
import PropTypes from "prop-types";
import {
    Facebook,
    Instagram,
    Linkedin,
    Youtube,
    Mail,
    Phone,
} from "lucide-react";

function Footer({ contactInfo }) {
    const { t } = useTranslation();

    // Get social media links from contactInfo
    const getSocialLink = (type) => {
        if (!contactInfo?.social) return "#";
        const social = contactInfo.social.find((s) => s.type === type);
        return social?.value || "#";
    };

    // Get email
    const getEmail = () => {
        if (!contactInfo?.emails || contactInfo.emails.length === 0)
            return null;
        return contactInfo.emails[0].value;
    };

    // Get phone
    const getPhone = () => {
        if (!contactInfo?.phones || contactInfo.phones.length === 0)
            return null;
        return contactInfo.phones[0].value;
    };

    return (
        <footer className="bg-gray-50 px-4 py-12 md:px-8 lg:px-16 max-lg:text-center">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:gap-28 md:gap-20 sm-sm:gap-8">
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                            {t("Specialites")}
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="/programs?status=open"
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    {t("Pharmacist")}
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/programs?status=open"
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    {t("Medicine")}
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/programs?status=open"
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    {t("Midwife")}
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/programs?status=open"
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    {t("Nurse")}
                                </a>
                            </li>
                        </ul>

                        <h3 className="text-lg font-semibold text-gray-900 pt-6">
                            {t("OtherSpecialties")}
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="/programs?status=open"
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    {t("CampusFrance")}
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/programs?status=open"
                                    className="text-gray-600 hover:text-gray-900"
                                >
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
                                <a
                                    href="/faq"
                                    className="text-gray-600 hover:text-gray-900 hover:cursor-pointer"
                                >
                                    {"FAQ"}
                                </a>
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
                                <ScrollSmooth
                                    to="contact"
                                    spy={true}
                                    smooth={true}
                                    hashSpy={true}
                                    offset={-100}
                                    duration={500}
                                    className="text-gray-600 hover:text-gray-900 hover:cursor-pointer"
                                >
                                    {t("ContactUs")}
                                </ScrollSmooth>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="/programs?status=open"
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    {t("StudyAbroad")}
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/courses"
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    {t("OurCourses")}
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/Register"
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    {t("ToRegister")}
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/Login"
                                    className="text-gray-600 hover:text-gray-900"
                                >
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

                        <div className="flex space-x-4 max-lg:justify-center">
                            {contactInfo?.social?.find(
                                (s) => s.type === "facebook"
                            ) && (
                                <a
                                    href={getSocialLink("facebook")}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-600 hover:text-blue-600 transition-colors"
                                >
                                    <Facebook className="w-6 h-6" />
                                </a>
                            )}
                            {contactInfo?.social?.find(
                                (s) => s.type === "instagram"
                            ) && (
                                <a
                                    href={getSocialLink("instagram")}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-600 hover:text-pink-600 transition-colors"
                                >
                                    <Instagram className="w-6 h-6" />
                                </a>
                            )}
                            {contactInfo?.social?.find(
                                (s) => s.type === "linkedin"
                            ) && (
                                <a
                                    href={getSocialLink("linkedin")}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-600 hover:text-blue-700 transition-colors"
                                >
                                    <Linkedin className="w-6 h-6" />
                                </a>
                            )}
                            {contactInfo?.social?.find(
                                (s) => s.type === "youtube"
                            ) && (
                                <a
                                    href={getSocialLink("youtube")}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-600 hover:text-red-600 transition-colors"
                                >
                                    <Youtube className="w-6 h-6" />
                                </a>
                            )}
                        </div>

                        {/* Contact Details */}
                        <div className="space-y-2 text-sm text-gray-600">
                            {getEmail() && (
                                <a
                                    href={`mailto:${getEmail()}`}
                                    className="flex items-center gap-2 hover:text-gray-900 max-lg:justify-center"
                                >
                                    <Mail className="w-4 h-4" />
                                    <span>{getEmail()}</span>
                                </a>
                            )}
                            {getPhone() && (
                                <a
                                    href={`tel:${getPhone()}`}
                                    className="flex items-center gap-2 hover:text-gray-900 max-lg:justify-center"
                                >
                                    <Phone className="w-4 h-4" />
                                    <span>{getPhone()}</span>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

Footer.propTypes = {
    contactInfo: PropTypes.shape({
        social: PropTypes.arrayOf(PropTypes.object),
        emails: PropTypes.arrayOf(PropTypes.object),
        phones: PropTypes.arrayOf(PropTypes.object),
    }),
};

export default Footer;
