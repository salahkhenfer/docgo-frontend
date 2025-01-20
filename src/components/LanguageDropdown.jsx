import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const LanguageDropdown = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(
    i18n.language || "fr"
  );

  const languages = [
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "ar", name: "عربي", flag: "🇸🇦" },
  ];

  useEffect(() => {
    setSelectedLanguage(i18n.language);
    document.documentElement.dir = i18n.dir();
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const handleChangeLanguage = (code) => {
    i18n.changeLanguage(code);
    setSelectedLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between lg:px-4 lg:py-2 sm-sm:px-2 sm-sm:py-1  bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {languages.find((lang) => lang.code === selectedLanguage)?.flag}
        <span className="ml-2">▼</span>
      </button>

      {isOpen && (
        <ul className="absolute left-0 mt-2 lg:w-40 md:w-32 sm-sm:w-24 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-40 overflow-auto sm:w-48">
          {languages.map((lang) => (
            <li
              key={lang.code}
              onClick={() => handleChangeLanguage(lang.code)}
              className={`flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                selectedLanguage === lang.code ? "font-semibold" : ""
              }`}
            >
              <span className="flex items-center">
                <span className="mr-2 text-xl">{lang.flag}</span>
                <span className="hidden sm:inline">{lang.name}</span>
              </span>
              {selectedLanguage === lang.code && (
                <span className="text-green-500 text-sm ml-2">✔</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageDropdown;
