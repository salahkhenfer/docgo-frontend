import React, { useState } from "react";
import { StudyFields, StudyDomains } from "../../data/fields";
import { Countries } from "../../data/Countries";
import { useTranslation } from "react-i18next";
import InlineLoading from "../../InlineLoading";

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
    backgroundImage = "../../src/assets/Login.png", // Default background Image
    AnimatedSelect,
}) => {
    const { t, i18n } = useTranslation();

    // Add local validation state
    const [phoneError, setPhoneError] = useState("");

    // Function to get localized display name
    const getLocalizedOption = (optionString) => {
        if (!optionString || !optionString.includes(" / ")) {
            return optionString;
        }
        const [french, arabic] = optionString.split(" / ");
        return i18n.language === "ar" ? arabic : french;
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
                    t("register.phoneValidationError") ||
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
            <h2 className="text-2xl font-bold mb-2">
                {t("register.title") || "Register"}
            </h2>
            <p className="text-gray-600 mb-6">
                {t("register.welcome") ||
                    "Welcome to DocGo, your first step towards success"}
            </p>

            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            <form onSubmit={validateAndSubmit} className="space-y-4">
                {/* Country Selection */}
                <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("register.countryQuestion") ||
                            "In which country do you want to pursue your studies?"}
                    </label>
                    <select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        style={{
                            direction: i18n.language === "ar" ? "rtl" : "ltr",
                            textAlign:
                                i18n.language === "ar" ? "right" : "left",
                        }}
                    >
                        <option value="">
                            {t("register.selectCountry") || "Select Country"}
                        </option>
                        {Countries.map((country) => (
                            <option key={country} value={country}>
                                {getLocalizedOption(country)}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Study Field Selection */}
                <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("register.fieldQuestion") ||
                            "In which field do you want to pursue your studies?"}
                    </label>
                    <select
                        name="studyField"
                        value={formData.studyField}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        style={{
                            direction: i18n.language === "ar" ? "rtl" : "ltr",
                            textAlign:
                                i18n.language === "ar" ? "right" : "left",
                        }}
                    >
                        <option value="">
                            {t("register.selectField") || "Select Study Field"}
                        </option>
                        {StudyFields.map((field) => (
                            <option key={field} value={field}>
                                {getLocalizedOption(field)}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Study Domain Selection */}
                <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("register.domainQuestion") ||
                            "What is your specialization?"}
                    </label>
                    <select
                        name="studyDomain"
                        value={formData.studyDomain}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        style={{
                            direction: i18n.language === "ar" ? "rtl" : "ltr",
                            textAlign:
                                i18n.language === "ar" ? "right" : "left",
                        }}
                    >
                        <option value="">
                            {t("register.selectDomain") ||
                                "Select Specialization"}
                        </option>
                        {StudyDomains.map((domain) => (
                            <option key={domain} value={domain}>
                                {getLocalizedOption(domain)}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Phone Number Input */}
                <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("register.phoneOptional") ||
                            "Phone Number (optional)"}
                    </label>
                    <input
                        type="tel"
                        name="phoneNumber"
                        placeholder={
                            t("register.phoneNumber") || "Phone Number"
                        }
                        value={formData.phoneNumber || ""}
                        onChange={handlePhoneChange}
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            phoneError ? "border-red-500" : ""
                        }`}
                        style={{
                            direction: i18n.language === "ar" ? "rtl" : "ltr",
                            textAlign:
                                i18n.language === "ar" ? "right" : "left",
                        }}
                    />
                    {phoneError && (
                        <p className="text-red-500 text-sm mt-1">
                            {phoneError}
                        </p>
                    )}
                </div>

                {/* Action Buttons */}
                <div
                    className="flex space-x-4"
                    style={{
                        flexDirection:
                            i18n.language === "ar" ? "row-reverse" : "row",
                        gap: i18n.language === "ar" ? "1rem" : "0",
                    }}
                >
                    <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="w-1/3 bg-gray-300 text-gray-700 p-3 rounded-lg hover:bg-gray-400 transition-colors"
                        style={{
                            marginLeft: i18n.language === "ar" ? "0" : "1rem",
                        }}
                    >
                        {t("register.back") || "Back"}
                    </button>
                    <button
                        type="submit"
                        className="w-2/3 bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
                        disabled={loading}
                    >
                        {loading ? (
                            <InlineLoading borderColor="white" />
                        ) : (
                            t("register.finish") || "Finish"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Register_Sterp_2;
