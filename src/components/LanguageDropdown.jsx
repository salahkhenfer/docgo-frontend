import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { MdLanguage } from "react-icons/md";

const LanguageDropdown = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(
    i18n.language || "fr"
  );
  const dropdownRef = useRef(null);

  const languages = [
    { code: "fr", name: "Français" },
    { code: "ar", name: "عربي" },
  ];

  useEffect(() => {
    document.documentElement.dir = i18n.dir();
    document.documentElement.lang = i18n.language;
    document.title = i18n.t("appTitle");

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [i18n.language]);

  const handleChangeLanguage = (code) => {
    i18n.changeLanguage(code);
    setSelectedLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <MdLanguage className="text-xl" />
        <span className="text-sm font-medium">
          {languages.find((lang) => lang.code === selectedLanguage)?.name}
        </span>
      </button>

      {isOpen && (
        <ul className="absolute left-0 mt-2 w-32 bg-white border shadow-lg z-20 rounded-md overflow-hidden">
          {languages.map((lang) => (
            <li
              key={lang.code}
              onClick={() => handleChangeLanguage(lang.code)}
              className={`px-4 py-2 text-sm cursor-pointer flex justify-between items-center hover:bg-gray-100 ${
                selectedLanguage === lang.code
                  ? "font-semibold text-blue-600"
                  : ""
              }`}
            >
              {lang.name}
              {selectedLanguage === lang.code && (
                <span className="text-green-500 text-sm">✔</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageDropdown;
