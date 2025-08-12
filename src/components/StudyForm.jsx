import { useState } from "react";
import { ChevronDown } from "lucide-react";
import DarkColorButton from "./Buttons/DarkColorButton";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const StudyForm = () => {
    const [subject, setSubject] = useState("");
    const [location, setLocation] = useState("");
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === "rtl";

    const subjects = [
        "Mathematics",
        "Science",
        "Literature",
        "History",
        "Computer Science",
    ];

    const locations = ["Paris", "Lyon", "Marseille", "Toulouse", "Bordeaux"];

    return (
        <div className="w-full max-w-md mx-auto p-4 sm:p-6 space-y-3 sm:space-y-4 bg-[#F5F5F5] rounded-xl border border-gray-200 shadow-lg">
            <div className="relative">
                <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full p-3 sm:p-4 bg-white border rounded-lg appearance-none cursor-pointer hover:border-blue-500 focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                    dir={i18n.dir()}
                >
                    <option value="" disabled>
                        {t("WhatDoYouWantToStudy")}
                    </option>
                    {subjects.map((item) => (
                        <option
                            key={item}
                            value={item}
                            className="text-sm sm:text-base"
                        >
                            {item}
                        </option>
                    ))}
                </select>
                <ChevronDown
                    className={`absolute ${
                        isRTL ? "left-3 sm:left-4" : "right-3 sm:right-4"
                    } top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none`}
                    size={20}
                />
            </div>

            <div className="relative">
                <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-3 sm:p-4 bg-white border rounded-lg appearance-none cursor-pointer hover:border-blue-500 focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                    dir={i18n.dir()}
                >
                    <option value="" disabled>
                        {t("WhereDoYouwantToStudy?")}
                    </option>
                    {locations.map((item) => (
                        <option
                            key={item}
                            value={item}
                            className="text-sm sm:text-base"
                        >
                            {item}
                        </option>
                    ))}
                </select>
                <ChevronDown
                    className={`absolute ${
                        isRTL ? "left-3 sm:left-4" : "right-3 sm:right-4"
                    } top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none`}
                    size={20}
                />
            </div>

            {/* <DarkColorButton
        text={t("ToRegister")}
        style={
          "md:text-[12px] sm-sm:px-2 sm-sm:py-1 lg:px-8 lg:py-2 lg:text-base sm-sm:text-sm  px-8 w-full"
        }
      /> */}
            <Link to="/Programs">
                <DarkColorButton
                    text={t("ToRegister")}
                    style={
                        "md:text-[12px] sm-sm:px-2 sm-sm:py-1 lg:px-8 lg:py-2 lg:text-base sm-sm:text-sm  px-8 w-full"
                    }
                />
            </Link>
        </div>
    );
};

export default StudyForm;
