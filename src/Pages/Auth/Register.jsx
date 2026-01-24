import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../AppContext";
import handleRegister, { validateFirstStep } from "../../API/Register";
import AnimatedSelect from "../../components/AnimatedSelect";
import Register_Step_2 from "./Register_Step_2";
import InlineLoading from "../../InlineLoading";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
const Register = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { set_Auth, set_user } = useAppContext();
    const { t } = useTranslation();
    const backgroundImage = "../../src/assets/Login.png";
    // Form data state
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        country: "",
        studyField: "",
        studyDomain: "",
        phoneNumber: "",
    });

    // Handle form field changes - use callback to prevent re-renders
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }, []);

    // Handle select changes - use callback to prevent re-renders
    const handleSelectChange = useCallback((name, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }, []);

    // Handle first step submission
    const handleFirstStep = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Basic client-side validation
        if (
            !formData.firstName ||
            !formData.lastName ||
            !formData.email ||
            !formData.password
        ) {
            setError("Please fill all required fields");
            setLoading(false);
            return;
        }

        // Validate with backend
        const validation = await validateFirstStep({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
        });

        if (validation.success) {
            setStep(2);
        } else {
            setError(validation.message || "Validation failed");
        }

        setLoading(false);
    };

    // Handle final submission
    const handleSubmit = useCallback(
        async (e) => {
            e.preventDefault();
            setLoading(true);
            setError("");

            const r = await handleRegister({
                userData: formData,
                setAuth: set_Auth,
                setUser: set_user,
            });

            if (r.success) {
                setLoading(false);
                Swal.fire({
                    title: t("alerts.auth.registrationSuccessTitle", "Registration Successful"),
                    text: t("alerts.auth.registrationSuccessText", "You are now registered. You can log in."),
                    icon: "success",
                    timerProgressBar: true,
                    timer: 2000,
                    allowEscapeKey: true,
                }).then(() => {
                    window.location.href = "/";
                });
            } else if (r.status === 410) {
                Swal.fire({
                    title: t("alerts.auth.registrationSuccessTitle", "Registration Successful"),
                    text: t("common.loginRequired", "You must log in"),
                    icon: "success",
                    confirmButtonText: t("common.ok", "OK"),
                    timerProgressBar: true,
                    timer: 2000,
                    allowEscapeKey: true,
                }).then(() => {
                    window.location.href = "/login";
                });
            } else setError(r.message || "Registration failed");
        },
        [formData, set_Auth, set_user, navigate]
    );
    const step_2 = useCallback(
        () => (
            <Register_Step_2
                formData={formData}
                setFormData={setFormData}
                handleChange={handleChange}
                handleSelectChange={handleSelectChange}
                handleSubmit={handleSubmit}
                setStep={setStep}
                loading={loading}
                error={error}
                setError={setError}
                setLoading={setLoading}
                backgroundImage={backgroundImage}
                AnimatedSelect={AnimatedSelect}
            />
        ),
        [
            formData,
            handleChange,
            handleSelectChange,
            handleSubmit,
            loading,
            error,
        ]
    );

    // Render step 1 form
    const renderStep1Form = () => (
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

            <form onSubmit={handleFirstStep} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="firstName"
                        placeholder="Nom"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="p-3 border rounded-lg"
                        required
                    />
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Prénom"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="p-3 border rounded-lg"
                        required
                    />
                </div>
                <input
                    type="email"
                    name="email"
                    placeholder="Votre email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg"
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Votre mot de passe"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg"
                    required
                    minLength={8}
                />

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
                    disabled={loading}
                >
                    {loading ? (
                        <InlineLoading borderColor="white" />
                    ) : (
                        "continuer"
                    )}
                </button>
            </form>

            <div className="mt-6 text-center">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        {/* <span className="px-2 bg-white text-gray-500">OU</span> */}
                    </div>
                </div>

                <p className="mt-4 text-sm text-gray-600">
                    Si vous avez un compte{" "}
                    <a href="/Login" className="text-blue-500 hover:underline">
                        Se connecter
                    </a>
                </p>
            </div>
        </div>
    );

    return (
        <div className="flex items-center h-[92vh]">
            <div className="hidden lg:flex md:w-1/2 relative px-20">
                <div className="absolute inset-0 from-black/40 to-transparent"></div>
                <div className="w-full h-full p-16">
                    <img
                        src={backgroundImage}
                        alt="Airplane in sky"
                        className="3xl:w-full 3xl:h-full md:max-2xl:w-[400px] xl:max-2xl:h-full object-cover"
                    />
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
                <div className="max-w-md w-full">
                    <div className="transition-all duration-300 ease-in-out">
                        {step === 1 ? renderStep1Form() : step_2()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
