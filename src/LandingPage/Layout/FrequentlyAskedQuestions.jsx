import { useTranslation } from "react-i18next";
import AnswerQuestion from "../../components/AnswerQuestion";
import DarkColorButton from "../../components/Buttons/DarkColorButton";
import Switch from "../../components/Switch";
import BackgroundImage from "../../../src/assets/three monochrome plastic spheres.png";
import LightColoredButton from "../../components/Buttons/LightColoredButton";
import Container from "../../components/Container";
import GeometricShapes from "../../../src/assets/geometric shapes.png";
import phoneIcon from "../../../src/assets/phone.png"; // Adjust the path as necessary

function FrequentlyAskedQuestions() {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === "rtl";

    return (
        <div
            id="FAQ"
            style={{
                backgroundImage: `url(${BackgroundImage})`,
                backgroundAttachment: "fixed",
                backgroundPosition: "right",
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain",
            }}
            className="w-full flex justify-center items-center bg-sky-50 mt-10 md:mt-20 relative"
        >
            <Container style="flex flex-col sm-sm:gap-4 bg-sky-50 opacity-95 md:gap-6 p-4 md:p-16 w-full md:w-[90%] lg:w-[80%] xl:w-[70%] max-w-7xl relative z-10">
                <img
                    className="w-full h-full object-contain"
                    src={GeometricShapes}
                    alt={t("geometricShapes")}
                />

                <h1 className="text-xl md:text-2xl text-center font-medium text-customGray">
                    {t("faqTitle")}
                </h1>

                <p className="text-customGray text-center leading-normal font-normal text-sm md:text-base px-4">
                    {t("faqDescription")}
                </p>

                <DarkColorButton
                    style="flex gap-2 items-center justify-center text-center self-center sm-sm:text-[12px] sm-sm:px-2 sm-sm:py-1 lg:px-8 lg:py-2 lg:text-sm  px-8sm-sm:max-sm:p-2 sm-sm:max-sm:text-[12px] sm-sm:max-sm:p-2"
                    icon={
                        <img
                            src={phoneIcon}
                            alt={t("phoneIcon")}
                            className="w-5 h-5"
                        />
                    }
                    text={t("contactUs")}
                />

                <Switch />

                <div className="flex flex-col gap-3 md:gap-6">
                    <AnswerQuestion
                        question={t("faqQuestion1")}
                        answer={t("faqAnswer1")}
                    />
                    <AnswerQuestion
                        question={t("faqQuestion2")}
                        answer={t("faqAnswer2")}
                    />
                    <AnswerQuestion
                        question={t("faqQuestion3")}
                        answer={t("faqAnswer3")}
                    />
                </div>

                {/* <div className="flex flex-col sm:flex-row gap-4 items-center justify-end w-full sm:w-[80%] md:w-[60%] lg:w-[50%] ml-auto">
          <LightColoredButton
            style="sm-sm:text-[12px] sm-sm:px-2 sm-sm:py-1 lg:px-8 lg:py-2 lg:text-sm  px-8sm-sm:max-sm:p-2 sm-sm:max-sm:text-[12px] sm-sm:max-sm:p-2 flex justify-center items-center gap-2 text-center"
            text={t("previous")}
            icon={
              isRTL ? (
                ""
              ) : (
                <img
                  src="../../../src/assets/arrow-left.png"
                  alt={t("previousIcon")}
                />
              )
            }
          />
          <DarkColorButton
            style="sm-sm:text-[12px] sm-sm:px-2 sm-sm:py-1 lg:px-8 lg:py-2 lg:text-sm  px-8sm-sm:max-sm:p-2 sm-sm:max-sm:text-[12px] sm-sm:max-sm:p-2 flex-row-reverse flex justify-center items-center gap-2 text-center"
            text={t("next")}
            icon={
              isRTL ? (
                ""
              ) : (
                <img
                  src="../../../src/assets/arrow-right.png"
                  alt={t("nextIcon")}
                />
              )
            }
          />
        </div> */}
            </Container>
        </div>
    );
}

export default FrequentlyAskedQuestions;
