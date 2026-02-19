import { useTranslation } from "react-i18next";
import Flag from "../../components/Flag";
import BackgroundImage from "../../assets/About us.png";
import FranceFlag from "../../../src/assets/France.png";
import CanadaFlag from "../../../src/assets/canada.png";
import EnglandFlag from "../../../src/assets/England.png";
import GermanyFlag from "../../../src/assets/Germany.png";
import BelgiumFlag from "../../../src/assets/Belgium.png";
import UnitedStatesFlag from "../../../src/assets/UnitedStates.png";

function AboutUsSection({ cms }) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === "rtl";
    const lang = i18n.language?.split("-")[0] || "en";
    const c = (key) => cms?.[`${key}_${lang}`] || cms?.[`${key}_en`] || null;

    const flags = [
        { url: FranceFlag, name: t("France") },
        { url: CanadaFlag, name: t("Canada") },
        { url: EnglandFlag, name: t("England") },
        { url: GermanyFlag, name: t("Germany") },
        { url: BelgiumFlag, name: t("Belgium") },
        { url: UnitedStatesFlag, name: t("UnitedStates") },
    ];

    return (
        <div
            id="aboutUs"
            className="relative w-full py-16 flex items-center justify-center px-4 sm:px-6 lg:px-8"
            style={{
                backgroundImage: `url(${BackgroundImage})`,
                backgroundAttachment: "fixed",
                backgroundPosition: "center",
                backgroundSize: "cover",
            }}
        >
            <div className="absolute inset-0 bg-black/10"></div>

            <div className="relative z-10 w-full max-w-7xl mx-auto">
                <div className="backdrop-blur-sm bg-[#F7FCFF]/20 rounded-lg shadow-lg p-6 sm:p-8 md:p-12 lg:p-16">
                    <div className="max-w-4xl mx-auto flex flex-col gap-6 md:gap-8 lg:gap-10">
                        <h1 className="sm:text-2xl lg:text-2xl xl:text-3xl font-medium text-customGray text-center">
                            {c("aboutTitle") || t("AboutUs")}
                        </h1>

                        <p className="sm-sm:text-[12px] sm:text-sm lg:text-base xl:text-lg text-customGray leading-relaxed text-center">
                            {c("aboutDescription") || t("AboutUsDescription")}
                        </p>

                        <div className="grid grid-cols-2 place-items-center sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8 md:gap-4 lg:gap-6 py-6 md:py-8">
                            {flags.map((flag, index) => (
                                <Flag
                                    key={index}
                                    url={flag.url}
                                    name={flag.name}
                                />
                            ))}
                        </div>

                        <div
                            className={` ${
                                isRTL ? "border-r-2" : "border-l-2"
                            }  border-black pl-4 md:pl-6`}
                        >
                            <p className="sm-sm:text-sm text-base sm:text-base md:text-lg lg:text-lg xl:text-xl text-customGray font-medium">
                                {t("StudyAbroadQuote")}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AboutUsSection;
