import { useState } from "react";
import { useTranslation } from "react-i18next";

const Switch = () => {
  const { t } = useTranslation();
  const [isSwitched, setIsSwitched] = useState(false);
  return (
    <div className="flex flex-col sm:flex-row text-sm md:text-base font-medium p-2 md:p-3 self-center w-full sm:w-auto">
      <button
        onClick={() => setIsSwitched(false)}
        className={`w-full sm:w-auto bg-white border-2 rounded-t-full sm:rounded-s-full sm:rounded-tr-none px-3 md:px-12 py-2 md:py-3 ${
          !isSwitched
            ? "border-customBlue text-customBlue"
            : "border-gray-400 text-customGray"
        }`}
      >
        {t("studyAbroad")}
      </button>
      <button
        onClick={() => setIsSwitched(true)}
        className={`w-full sm:w-auto bg-white border-2 rounded-b-full sm:rounded-e-full sm:rounded-bl-none px-3 md:px-12 py-2 md:py-3 ${
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
