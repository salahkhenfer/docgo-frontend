import DarkColorButton from "./Buttons/DarkColorButton";
import { motion } from "framer-motion";

function CardCourse({
  url,
  title,
  ProfesseorName,
  description,
  price,
  hours,
  lessonNumber,
  starsNumber,
}) {
  const lengthStar = new Array(starsNumber);

  return (
    <motion.div className="flex flex-col gap-2 sm:gap-3 lg:gap-4 w-full min-w-[280px] sm:min-w-[320px] lg:min-w-[380px]">
      <img
        className="w-full h-auto object-cover rounded-lg"
        src={url}
        alt={`${title} course`}
      />

      <div className="flex items-center gap-1 sm:gap-2">
        {lengthStar.map((_, index) => (
          <img
            key={index}
            src="../../src/assets/Star 3.png"
            alt="star icon"
            className="w-4 sm:w-5 lg:w-6"
          />
        ))}
      </div>

      <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold text-customGray leading-normal">
        {title}
      </h3>

      <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-customGray font-medium">
        Le professeur : {ProfesseorName}
      </p>

      <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-customGray font-light leading-normal line-clamp-3">
        {description}
      </p>

      <span className="text-lg sm:text-xl lg:text-2xl xl:text-3xl text-customGray font-bold">
        {price}DA
      </span>

      <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
        <div className="flex items-center gap-1 sm:gap-2">
          <img
            src="../../src/assets/hour.png"
            alt="hour icon"
            className="w-4 sm:w-5 lg:w-6"
          />
          <span className="text-xs sm:text-sm lg:text-base xl:text-lg text-customGray font-medium">
            {hours} heures
          </span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <img
            src="../../src/assets/study.png"
            alt="study icon"
            className="w-4 sm:w-5 lg:w-6"
          />
          <span className="text-xs sm:text-sm lg:text-base xl:text-lg text-customGray font-medium">
            {lessonNumber} leçons
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <img
          src="../../src/assets/certeficate.png"
          alt="certeficate icon"
          className="w-4 sm:w-5 lg:w-6"
        />
        <span className="text-xs sm:text-sm lg:text-base xl:text-lg text-customGray font-medium">
          Certificat disponible
        </span>
      </div>

      <DarkColorButton
        style="2xl:w-full lg:text-base sm:w-[60%]  text-sm sm:text-base "
        text="Voir plus de détails"
      />
    </motion.div>
  );
}

export default CardCourse;
