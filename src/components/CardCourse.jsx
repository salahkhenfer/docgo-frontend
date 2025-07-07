import DarkColorButton from "./Buttons/DarkColorButton";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Star, Clock, BookOpen, Award, ImageIcon, Loader2 } from "lucide-react";

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
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  return (
    <motion.div className="flex flex-col gap-2 cursor-grab w-[260px] sm:w-[300px] md:w-[320px] p-2">
      {/* Image container with loading state */}
      <div className="relative w-full h-32 sm:h-40 rounded-lg overflow-hidden bg-gray-200">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
          </div>
        )}

        {imageError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="flex flex-col items-center gap-2 text-gray-400">
              <ImageIcon className="w-8 h-8" />
              <span className="text-xs">
                {t("ImageNotFound") || "Image not found"}
              </span>
            </div>
          </div>
        ) : (
          <img
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoading ? "opacity-0" : "opacity-100"
            }`}
            src={url}
            alt={title}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}
      </div>

      {/* Stars rating */}
      <div className="flex gap-1">
        {[...Array(starsNumber)].map((_, i) => (
          <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
        ))}
      </div>

      <h3 className="text-sm sm:text-base font-semibold text-customGray truncate">
        {title}
      </h3>

      <p className="text-xs text-customGray">
        {t("Professor")} {ProfesseorName}
      </p>

      <p className="text-xs text-customGray line-clamp-2">
        {description || t("CourseDescription")}
      </p>

      <span className="text-sm font-bold text-customGray">
        {price} {t("Currency")}
      </span>

      {/* Duration and lessons info */}
      <div className="flex items-center gap-2 text-xs">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-customGray" />
          <span>{hours}h</span>
        </div>
        <div className="flex items-center gap-1">
          <BookOpen className="w-3 h-3 text-customGray" />
          <span>
            {lessonNumber} {t("Lessons")}
          </span>
        </div>
      </div>

      {/* Certificate info */}
      <div className="flex items-center gap-1 text-xs">
        <Award className="w-3 h-3 text-customGray" />
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
