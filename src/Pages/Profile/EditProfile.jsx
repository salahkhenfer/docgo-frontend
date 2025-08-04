import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../AppContext";
import { toast } from "react-toastify";
import { StudyFields, StudyDomains } from "../../data/fields";
import { Countries } from "../../data/Countries";
import { User } from "lucide-react";
import axios from "axios";
import { useTranslation } from "react-i18next"; // Add this import

const EditProfile = () => {
    const { user, updateUserProfile } = useAppContext();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        country: "",
        studyField: "",
        studyDomain: "",
        phoneNumber: "",
        profile_pic_link: "",
    });
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

    // Function to get country name based on current language
    const getCountryDisplayName = (countryString) => {
        const [french, arabic] = countryString.split(" / ");
        return i18n.language === "ar" ? arabic : french;
    };
    // Function to get placeholder text based on language
    const getSelectCountryText = () => {
        return t("editProfile.selectCountry") || "Select Country";
    };
    const getFields = (optionString) => {
        const [english_french, arabic] = optionString.split(" / ");
        return i18n.language === "ar" ? arabic : english_french;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageUpload = async (e) => {
        const ProfilePic = e.target.files[0];
        if (!ProfilePic) return;

        // Validate file type
        if (!ProfilePic.type.startsWith("image/")) {
            toast.error("Please select a valid Image file");
            return;
        }

        // Validate file size (5MB max)
        if (ProfilePic.size > 5 * 1024 * 1024) {
            toast.error("Image size should be less than 5MB");
            return;
        }

        setUploadingImage(true);

        try {
            const formDataImage = new FormData();
            formDataImage.append("ProfilePic", ProfilePic);

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/upload/User/ProfilePic`,
                formDataImage,
                {
                    withCredentials: true,
                }
            );
            console.log("Image upload response:", response);

            const data = response.data;

            if (response.status === 200 || data.success) {
                setFormData((prev) => ({
                    ...prev,
                    profile_pic_link: data.fileLink,
                }));
                toast.success("Profile picture uploaded successfully!");
            } else {
                toast.error(data.error || "Failed to upload Image");
            }
        } catch (error) {
            console.error("Error uploading Image:", error);
            toast.error("Network error. Please try again.");
        } finally {
            setUploadingImage(false);
        }
    };

    const triggerImageUpload = () => {
        document.getElementById("profile-pic-input").click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Validate phone number if provided
        if (formData.phoneNumber && formData.phoneNumber.trim() !== "") {
            const phone = formData.phoneNumber.trim();
            const phoneRegex = /^[+]?[\d\s\-().]{6,20}$/;

            if (!phoneRegex.test(phone)) {
                toast.error("Invalid phone number format");
                setLoading(false);
                return;
            }
        }

        try {
            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/Users/${user.id}/Profile`,
                formData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = response;
            console.log("Response data:", data);

            if (
                response.status === 200 ||
                (response.status === 201 && data.success)
            ) {
                // Update user in context
                if (updateUserProfile) {
                    updateUserProfile(data.user);
                }

                toast.success("Profile updated successfully!");
                navigate("/profile");
            } else {
                toast.error(data.error || "Failed to update profile");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    const fetch_data = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/Users/${user.id}/Profile`,
                {
                    withCredentials: true,
                }
            );

            const data = response.data;
            if (data) {
                setFormData((prev) => ({
                    ...prev,
                    ...data,
                }));
            } else {
                toast.error("Failed to fetch profile data");
            }
        } catch (error) {
            console.error("Error fetching profile data:", error);
            toast.error("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (user) {
            fetch_data();
        }
        if (user) {
            console.log("User data:", user);

            setFormData({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                country: user.country || "",
                studyField: user.studyField || "",
                studyDomain: user.studyDomain || "",
                phoneNumber: user.phoneNumber || "",
                profile_pic_link: user.profile_pic_link || "",
            });
        } else {
            navigate("/login");
        }
    }, [user]);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">
                            {t("editProfile.title") || "Edit Profile"}
                        </h1>
                        <button
                            onClick={() => navigate("/profile")}
                            className="text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Profile Picture Section */}
                        <div className="flex flex-col items-center mb-6">
                            <div className="relative mb-4">
                                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                    {formData.profile_pic_link ? (
                                        <img
                                            src={`${API_URL}${formData.profile_pic_link}`}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <User className="w-16 h-16 lg:w-20 lg:h-20 text-gray-400" />
                                    )}
                                </div>
                                {uploadingImage && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                id="profile-pic-input"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={triggerImageUpload}
                                disabled={uploadingImage}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {uploadingImage
                                    ? t("editProfile.uploadingImage") ||
                                      "Uploading Image..."
                                    : t("editProfile.uploadProfileImage") ||
                                      "Upload profile Image"}
                            </button>
                        </div>
                        {/* Personal Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label
                                    htmlFor="firstName"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    {t("editProfile.firstName") || "First Name"}{" "}
                                    *
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                    minLength={3}
                                    maxLength={30}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="lastName"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    {t("editProfile.lastName") || "Last Name"} *
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                    minLength={3}
                                    maxLength={30}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                {t("editProfile.email") || "Email Address"} *
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="phoneNumber"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                {t("editProfile.phoneNumber") || "Phone Number"}
                            </label>
                            <input
                                type="tel"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder="+1234567890"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="country"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                {t("editProfile.country") || "Country"}
                            </label>
                            <select
                                id="country"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                style={{
                                    direction:
                                        i18n.language === "ar" ? "rtl" : "ltr",
                                    textAlign:
                                        i18n.language === "ar"
                                            ? "right"
                                            : "left",
                                }}
                            >
                                <option value="">
                                    {getSelectCountryText()}
                                </option>
                                {Countries.map((country) => (
                                    <option key={country} value={country}>
                                        {getCountryDisplayName(country)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* Academic Information */}
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                {t("editProfile.academicInformation") ||
                                    "Academic Information"}
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label
                                        htmlFor="studyField"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        {t("editProfile.studyField") ||
                                            "Study Field"}
                                    </label>
                                    <select
                                        id="studyField"
                                        name="studyField"
                                        value={formData.studyField}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        style={{
                                            direction:
                                                i18n.language === "ar"
                                                    ? "rtl"
                                                    : "ltr",
                                            textAlign:
                                                i18n.language === "ar"
                                                    ? "right"
                                                    : "left",
                                        }}
                                    >
                                        <option value="">
                                            {t(
                                                "editProfile.selectStudyField"
                                            ) || "Select Study Field"}
                                        </option>
                                        {StudyFields.map((field) => (
                                            <option key={field} value={field}>
                                                {getFields(field)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label
                                        htmlFor="studyDomain"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        {t("editProfile.studyDomain") ||
                                            "Study Domain"}
                                    </label>
                                    <select
                                        id="studyDomain"
                                        name="studyDomain"
                                        value={formData.studyDomain}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        style={{
                                            direction:
                                                i18n.language === "ar"
                                                    ? "rtl"
                                                    : "ltr",
                                            textAlign:
                                                i18n.language === "ar"
                                                    ? "right"
                                                    : "left",
                                        }}
                                    >
                                        <option value="">
                                            {t(
                                                "editProfile.selectStudyDomain"
                                            ) || "Select Study Domain"}
                                        </option>
                                        {StudyDomains.map((domain) => (
                                            <option key={domain} value={domain}>
                                                {getFields(domain)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6">
                            <button
                                type="submit"
                                disabled={loading || uploadingImage}
                                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <svg
                                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        {t("editProfile.saving") || "Saving..."}
                                    </div>
                                ) : (
                                    t("editProfile.saveChanges") ||
                                    "Save Changes"
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate("/profile")}
                                className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                            >
                                {t("editProfile.cancel") || "Cancel"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;
