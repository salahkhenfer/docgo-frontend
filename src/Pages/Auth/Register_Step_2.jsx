import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import InlineLoading from "../../InlineLoading";
import apiClient from "../../utils/apiClient";

// Emoji flags for countries (same as admin dashboard)
const EMOJI_FLAGS = {
  France: "🇫🇷",
  Canada: "🇨🇦",
  Belgique: "🇧🇪",
  Suisse: "🇨🇭",
  Maroc: "🇲🇦",
  Algérie: "🇩🇿",
  Tunisie: "🇹🇳",
  Sénégal: "🇸🇳",
  "Côte d'Ivoire": "🇨🇮",
  Luxembourg: "🇱🇺",
  "États-Unis": "🇺🇸",
  "Royaume-Uni": "🇬🇧",
  Allemagne: "🇩🇪",
  Espagne: "🇪🇸",
  Italie: "🇮🇹",
  "Pays-Bas": "🇳🇱",
  Autriche: "🇦🇹",
  Portugal: "🇵🇹",
  Grèce: "🇬🇷",
  Suède: "🇸🇪",
  Norvège: "🇳🇴",
  Danemark: "🇩🇰",
  Finlande: "🇫🇮",
  Pologne: "🇵🇱",
  Turquie: "🇹🇷",
  Japon: "🇯🇵",
  Chine: "🇨🇳",
  Inde: "🇮🇳",
  Brésil: "🇧🇷",
  Mexique: "🇲🇽",
  "Afrique du Sud": "🇿🇦",
  Australie: "🇦🇺",
};

// Bilingual country names mapping
const BILINGUAL_COUNTRIES = {
  France: { fr: "France", ar: "فرنسا" },
  Canada: { fr: "Canada", ar: "كندا" },
  Belgique: { fr: "Belgique", ar: "بلجيكا" },
  Suisse: { fr: "Suisse", ar: "سويسرا" },
  Maroc: { fr: "Maroc", ar: "المغرب" },
  Algérie: { fr: "Algérie", ar: "الجزائر" },
  Tunisie: { fr: "Tunisie", ar: "تونس" },
  Sénégal: { fr: "Sénégal", ar: "السنغال" },
  "Côte d'Ivoire": { fr: "Côte d'Ivoire", ar: "ساحل العاج" },
  Luxembourg: { fr: "Luxembourg", ar: "لوكسمبرغ" },
  "États-Unis": { fr: "États-Unis", ar: "الولايات المتحدة" },
  "Royaume-Uni": { fr: "Royaume-Uni", ar: "المملكة المتحدة" },
  Allemagne: { fr: "Allemagne", ar: "ألمانيا" },
  Espagne: { fr: "Espagne", ar: "إسبانيا" },
  Italie: { fr: "Italie", ar: "إيطاليا" },
};

const Register_Sterp_2 = ({
  formData,
  setFormData,
  handleChange,
  handleSelectChange,
  handleSubmit,
  setStep,
  loading,
  error,
  setError,
  setLoading,
  backgroundImage,
  AnimatedSelect,
}) => {
  const { t, i18n } = useTranslation();

  // Add local validation state
  const [phoneError, setPhoneError] = useState("");

  // Options loaded from API (admin controls all options - empty by default)
  const [userOriginCountries, setUserOriginCountries] = useState([]);
  const [userSpecialties, setUserSpecialties] = useState([]);
  const [professionalStatuses, setProfessionalStatuses] = useState([]);
  const [academicStatuses, setAcademicStatuses] = useState([]);

  useEffect(() => {
    const loadRegisterOptions = async () => {
      try {
        const resp = await apiClient.get("/public/register-options");
        const data = resp.data;
        if (data?.options) {
          // Use new field names from admin-controlled API
          if (
            Array.isArray(data.options.userOriginCountries) &&
            data.options.userOriginCountries.length > 0
          )
            setUserOriginCountries(data.options.userOriginCountries);
          if (
            Array.isArray(data.options.userSpecialties) &&
            data.options.userSpecialties.length > 0
          )
            setUserSpecialties(data.options.userSpecialties);
          if (
            Array.isArray(data.options.professionalStatuses) &&
            data.options.professionalStatuses.length > 0
          )
            setProfessionalStatuses(data.options.professionalStatuses);
          if (
            Array.isArray(data.options.academicStatuses) &&
            data.options.academicStatuses.length > 0
          )
            setAcademicStatuses(data.options.academicStatuses);
        }
      } catch (error) {
        // silent: empty defaults already set - user will see empty dropdowns until admin configures options
      }
    };
    loadRegisterOptions();
  }, []);

  // Function to get localized display name
  const getLocalizedOption = (optionString) => {
    if (!optionString) return optionString;
    const country = BILINGUAL_COUNTRIES[optionString];
    if (!country) return optionString;
    return i18n.language === "ar" ? country.ar : country.fr;
  };

  // Function to get emoji flag for country
  const getCountryEmoji = (countryString) => {
    return EMOJI_FLAGS[countryString] || "🌍";
  };

  // Custom handler for phone number changes
  const handlePhoneChange = (e) => {
    const phoneValue = e.target.value;
    // Clear error when field is modified
    if (phoneError) setPhoneError("");

    // Update form data
    handleChange(e);
  };

  // Validate before submitting
  const validateAndSubmit = (e) => {
    e.preventDefault();

    // Phone validation logic
    if (formData.phoneNumber && formData.phoneNumber.trim() !== "") {
      const phone = formData.phoneNumber.trim();
      const phoneRegex = /^[+]?[\d\s\-().]{6,20}$/;

      if (!phoneRegex.test(phone)) {
        const errorMessage =
          t("register.phoneValidationError", "Invalid phone number format.") ||
          "Invalid phone format.";
        setPhoneError(errorMessage);
        return;
      }
    }

    // If we reach here, validation passed
    handleSubmit(e);
  };

  return (
    <div className="w-full transition-all duration-300 ease-in-out">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          {t("auth.completeProfile", "Complete Your Profile")}
        </h1>
        <p className="text-gray-600 text-base sm:text-lg">
          {t(
            "auth.completeProfileSubtitle",
            "Help us personalize your learning experience",
          )}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg text-sm sm:text-base">
          <div className="font-semibold mb-1">Error</div>
          <div>{error}</div>
        </div>
      )}

      <form onSubmit={validateAndSubmit} className="space-y-5">
        {/* Country Selection with Emoji Flags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t(
              "register.countryQuestion",
              "In which country do you want to pursue your studies?",
            ) || "In which country do you want to pursue your studies?"}
          </label>
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            style={{
              direction: i18n.language === "ar" ? "rtl" : "ltr",
              textAlign: i18n.language === "ar" ? "right" : "left",
            }}
          >
            <option value="">
              {t("register.selectCountry", "Select Country") ||
                "Select Country"}
            </option>
            {userOriginCountries.map((country) => {
              const emoji = getCountryEmoji(country);
              const displayName = getLocalizedOption(country);
              return (
                <option key={country} value={country}>
                  {emoji} {displayName}
                </option>
              );
            })}
          </select>
          {formData.country && (
            <div className="mt-3 flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <span className="text-2xl">
                {EMOJI_FLAGS[formData.country] || "🌍"}
              </span>
              <span className="text-gray-700 font-medium">
                {getLocalizedOption(formData.country)}
              </span>
            </div>
          )}
        </div>

        {/* Study Domain Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t(
              "register.fieldQuestion",
              "In which field do you want to pursue your studies?",
            ) || "In which field do you want to pursue your studies?"}
          </label>
          <select
            name="studyDomain"
            value={formData.studyDomain}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            style={{
              direction: i18n.language === "ar" ? "rtl" : "ltr",
              textAlign: i18n.language === "ar" ? "right" : "left",
            }}
          >
            <option value="">
              {t("register.selectField", "Select Study Domain") ||
                "Select Study Domain"}
            </option>
            {userSpecialties.map((field) => (
              <option key={field} value={field}>
                {getLocalizedOption(field)}
              </option>
            ))}
          </select>
        </div>

        {/* Phone Number Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("register.phoneOptional", "Phone Number") || "Phone Number"}
            <span className="text-gray-400 font-normal"> (optional)</span>
          </label>
          <input
            type="tel"
            name="phoneNumber"
            placeholder="+1 (555) 123-4567"
            value={formData.phoneNumber || ""}
            onChange={handlePhoneChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
              phoneError ? "border-red-500" : "border-gray-300"
            }`}
            style={{
              direction: i18n.language === "ar" ? "rtl" : "ltr",
              textAlign: i18n.language === "ar" ? "right" : "left",
            }}
          />
          {phoneError && (
            <p className="text-red-500 text-sm mt-2">{phoneError}</p>
          )}
        </div>

        {/* University/Institution Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("register.universityOptional", "University / Institution") ||
              "University / Institution"}
            <span className="text-gray-400 font-normal"> (optional)</span>
          </label>
          <input
            type="text"
            name="university"
            placeholder="Enter your university or institution name"
            value={formData.university || ""}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            style={{
              direction: i18n.language === "ar" ? "rtl" : "ltr",
              textAlign: i18n.language === "ar" ? "right" : "left",
            }}
          />
        </div>

        {/* Professional Status Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("register.professionalStatus", "Professional Status") ||
              "Professional Status"}
            <span className="text-gray-400 font-normal"> (optional)</span>
          </label>
          <select
            name="professionalStatus"
            value={formData.professionalStatus || ""}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            style={{
              direction: i18n.language === "ar" ? "rtl" : "ltr",
              textAlign: i18n.language === "ar" ? "right" : "left",
            }}
          >
            <option value="">
              {t(
                "register.selectProfessionalStatus",
                "Select Professional Status",
              ) || "Select Professional Status"}
            </option>
            {professionalStatuses.map((status) => (
              <option key={status} value={status}>
                {status === "student"
                  ? t("register.student", "Student") || "Student"
                  : status === "worker"
                    ? t("register.worker", "Working Professional") ||
                      "Working Professional"
                    : t("register.other", "Other") || "Other"}
              </option>
            ))}
          </select>
        </div>

        {/* Academic Status Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("register.academicStatus", "Academic Status") ||
              "Academic Status"}
            <span className="text-gray-400 font-normal"> (optional)</span>
          </label>
          <select
            name="academicStatus"
            value={formData.academicStatus || ""}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            style={{
              direction: i18n.language === "ar" ? "rtl" : "ltr",
              textAlign: i18n.language === "ar" ? "right" : "left",
            }}
          >
            <option value="">
              {t("register.selectAcademicStatus", "Select Academic Status") ||
                "Select Academic Status"}
            </option>
            {academicStatuses.map((status) => (
              <option key={status} value={status}>
                {status === "student"
                  ? t("register.currentStudent", "Current Student") ||
                    "Current Student"
                  : status === "graduated"
                    ? t("register.graduated", "Graduated") || "Graduated"
                    : t("register.other", "Other") || "Other"}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div
          className="flex gap-4"
          style={{
            flexDirection: i18n.language === "ar" ? "row-reverse" : "row",
          }}
        >
          <button
            type="button"
            onClick={() => setStep(1)}
            className="w-1/3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition-all duration-200"
          >
            {t("auth.back", "Back") || "Back"}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="w-2/3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <InlineLoading borderColor="white" /> Processing...
              </span>
            ) : (
              t("auth.createAccount", "Create Account") || "Create Account"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register_Sterp_2;
