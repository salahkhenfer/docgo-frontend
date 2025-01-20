import DarkColorButton from "./Buttons/DarkColorButton";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const CardCourse = ({
  url,
  title,
  ProfesseorName,
  description,
  price,
  hours,
  lessonNumber,
  starsNumber,
}) => {
  const { t } = useTranslation();

  return (
    <motion.div className="flex flex-col gap-2 cursor-grab w-[260px] sm:w-[300px] md:w-[320px] p-2">
      <img
        className="w-full h-32 sm:h-40 object-cover rounded-lg"
        src={url}
        alt={title}
      />

      <div className="flex gap-1 ">
        {[...Array(starsNumber)].map((_, i) => (
          <img
            key={i}
            src="../../src/assets/Star 3.png"
            alt={t("Star")}
            className="w-3"
          />
        ))}
      </div>

      <h3 className="text-sm sm:text-base font-semibold text-customGray truncate">
        {title}
      </h3>
      <p className="text-xs text-customGray">
        {t("Professor")} {ProfesseorName}
      </p>
      <p className="text-xs text-customGray line-clamp-2">
        {t("CourseDescription")}
      </p>
      <span className="text-sm font-bold text-customGray">
        {price} {t("Currency")}
      </span>

      <div className="flex items-center gap-2 text-xs">
        <div className="flex items-center gap-1">
          <img
            src="../../src/assets/hour.png"
            alt={t("Duration")}
            className="w-3"
          />
          <span>{hours}h</span>
        </div>
        <div className="flex items-center gap-1">
          <img
            src="../../src/assets/study.png"
            alt={t("Lessons")}
            className="w-3"
          />
          <span>
            {lessonNumber} {t("Lessons")}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 text-xs">
        <img
          src="../../src/assets/certeficate.png"
          alt={t("Certificate")}
          className="w-3"
        />
        <span>{t("CertificateAvailable")}</span>
      </div>

      <DarkColorButton
        text={t("ViewMoreDetails")}
        style="sm-sm:text-[12px] sm-sm:px-2 sm-sm:py-1 lg:px-8 lg:py-2 lg:text-sm px-8sm-sm:max-sm:p-2 sm-sm:max-sm:text-[12px] sm-sm:max-sm:p-2"
      />
    </motion.div>
  );
};

export default CardCourse;
