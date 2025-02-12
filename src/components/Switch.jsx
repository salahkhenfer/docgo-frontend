import { s } from "framer-motion/client";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const Switch = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const [isSwitched, setIsSwitched] = useState(false);
  const styleBtn1 = isRTL
    ? "rounded-b-full sm:rounded-bl-none"
    : "rounded-t-full sm:rounded-tr-none ";
  const styleBtn2 = isRTL
    ? "rounded-t-full sm:rounded-tr-none"
    : "rounded-b-full sm:rounded-bl-none ";
  const styleFlex = isRTL ? "flex-col-reverse" : "flex-col";
  return (
<<<<<<< HEAD
    <div className="flex flex-col gap-4 sm:flex-row text-sm md:text-base font-medium p-2 md:p-3 self-center w-full sm:w-auto">
      <button
        onClick={() => setIsSwitched(false)}
        className={`w-full sm:w-auto bg-white border-2   md:rounded-full   max-lg:rounded-t-full  px-3 md:px-12 py-2 md:py-3 ${
=======
    <div
      className={`flex ${styleFlex}  sm:flex-row text-sm md:text-base font-medium p-2 md:p-3 self-center w-full sm:w-auto`}
    >
      <button
        onClick={() => setIsSwitched(false)}
        className={`w-full sm:w-auto bg-white border-2  sm:rounded-s-full ${styleBtn1}  px-3 md:px-12 py-2 md:py-3 ${
>>>>>>> a4e8094d23ac86fd3e30c8615d3cf76875a2f99d
          !isSwitched
            ? "border-customBlue text-customBlue"
            : "border-gray-400 text-customGray"
        }`}
      >
        {t("studyAbroad")}
      </button>
      <button
        onClick={() => setIsSwitched(true)}
<<<<<<< HEAD
        className={`w-full sm:w-auto bg-white border-2  md:rounded-full   max-lg:rounded-b-full    px-3 md:px-12 py-2 md:py-3 ${
=======
        className={`w-full sm:w-auto bg-white border-2 sm:rounded-e-full ${styleBtn2} px-3 md:px-12 py-2 md:py-3 ${
>>>>>>> a4e8094d23ac86fd3e30c8615d3cf76875a2f99d
          isSwitched
            ? "border-customBlue text-customBlue"
            : "border-gray-400 text-customGray"
        }`}
      >
        {t("learningCourses")}
      </button>
    </div>
  );
};

export default Switch;
