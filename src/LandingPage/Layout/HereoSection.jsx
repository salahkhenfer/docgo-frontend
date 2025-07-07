import { useTranslation } from "react-i18next";
import DarkColorButton from "../../components/Buttons/DarkColorButton";
import StudyForm from "../../components/StudyForm";
import { Link } from "react-router-dom";

function HeroSection() {
  const { t } = useTranslation();
  return (
    <div className="flex justify-between items-center w-full h-full py-16 px-28 lg-md:max-3xl:px-20 lg-md:max-3xl:py-12 md:max-lg-md:px-8 md:max-lg-md:py-6 sm-sm:max-lg-sm:flex-col sm-sm:max-lg-sm:px-4">
      <div className="flex flex-col items-start gap-5 w-[50%] py-16 sm-sm:max-lg-sm:items-center sm-sm:max-lg-sm:w-full">
        <p className="text-xl text-customGray font-normal md:max-3xl:text-lg md:max-lg-md:text-base sm-sm:max-lg-sm:text-sm sm-sm:max-lg-sm:text-center">
          {t("ExploreOpportunities")}
        </p>
        <h1 className=" text-customGray font-medium leading-snug lg:text-3xl lg-md:leading-normal md:text-lg sm-sm:max-lg-sm:text-center sm-sm:text-lg">
          {t("DiveIntoPossibilities")}
        </h1>
        <p className="text-xl text-customGray leading-10 font-normal md:max-3xl:text-lg lg-md:max-3xl:leading-normal md:max-lg-md:text-base sm-sm:max-lg-sm:text-center sm-sm:max-lg-sm:text-sm">
          {t("JoinUsToDiscover")}
        </p>
        <Link to="/SearchProgram">
          <DarkColorButton
            text={t("StudyAbroad")}
            style={
              "md:text-[12px] sm-sm:px-2 sm-sm:py-1 lg:px-8 lg:py-2 lg:text-base sm-sm:text-sm  px-8"
            }
          />
        </Link>
      </div>
      <StudyForm />
    </div>
  );
}

export default HeroSection;
