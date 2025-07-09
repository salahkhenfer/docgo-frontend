import React, { useState } from "react";
import { StudyFields, StudyDomains } from "../../data/fields";
import { Countries } from "../../data/Countries";
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
    backgroundImage = "../../src/assets/Login.png", // Default background image
    AnimatedSelect,
}) => {
    // Add local validation state
    const [phoneError, setPhoneError] = useState("");

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
                setPhoneError("Le format du numéro de téléphone est invalide.");
                return;
            }
        }

        // If we reach here, validation passed
        handleSubmit(e);
    };

    return (
        <div className="w-full transition-all duration-300 ease-in-out">
            <h2 className="text-2xl font-bold mb-2">S'inscrire</h2>
            <p className="text-gray-600 mb-6">
                Bienvenue à Docgo, si premier pas vers votre réussite
            </p>

            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            <form onSubmit={validateAndSubmit} className="space-y-4">
                <div className="relative">
                    <div className="space-y-4">
                        <AnimatedSelect
                            options={Countries}
                            placeholder="Dans quel pays souhaitez-vous poursuivre vos études ?"
                            onChange={(value) =>
                                handleSelectChange("country", value)
                            }
                            value={formData.country}
                            maxHeight="200px" // Set a max height for the dropdown
                            className="scrollable-options"
                        />
                        <AnimatedSelect
                            options={StudyFields}
                            placeholder="Dans quel domaine souhaitez-vous poursuivre vos études ?"
                            onChange={(value) =>
                                handleSelectChange("studyField", value)
                            }
                            value={formData.studyField}
                            maxHeight="200px" // Set a max height for the dropdown
                            className="scrollable-options"
                        />
                    </div>
                </div>

                <div className="relative">
                    <AnimatedSelect
                        options={StudyDomains}
                        placeholder="Dans quel domaine souhaitez-vous poursuivre vos études et filières"
                        onChange={(value) =>
                            handleSelectChange("studyDomain", value)
                        }
                        value={formData.studyDomain}
                        maxHeight="200px" // Set a max height for the dropdown
                        className="scrollable-options"
                    />
                </div>

                <div className="relative">
                    <input
                        type="tel"
                        name="phoneNumber"
                        placeholder="Votre numéro de téléphone (optionnel)"
                        value={formData.phoneNumber || ""}
                        onChange={handlePhoneChange}
                        className={`w-full p-3 border rounded-lg ${
                            phoneError ? "border-red-500" : ""
                        }`}
                    />
                    {phoneError && (
                        <p className="text-red-500 text-sm mt-1">
                            {phoneError}
                        </p>
                    )}
                </div>

                <div className="flex space-x-4">
                    <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="w-1/3 bg-gray-300 text-gray-700 p-3 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                        Retour
                    </button>
                    <button
                        type="submit"
                        className="w-2/3 bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
                        disabled={loading}
                    >
                        {loading ? (
                            <InlineLoading borderColor="white" />
                        ) : (
                            "Finalisé"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Register_Sterp_2;
