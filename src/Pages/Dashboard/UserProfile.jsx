import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
    UserIcon,
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon,
    CalendarDaysIcon,
    AcademicCapIcon,
    PencilIcon,
    CameraIcon,
    CheckIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { useAppContext } from "../../AppContext";
import apiClient from "../../services/apiClient";

const UserProfile = () => {
    const { t, i18n } = useTranslation();
    const { user, setUser } = useAppContext();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const isRTL = i18n.language === "ar";

    useEffect(() => {
        if (user?.id) {
            fetchProfile();
        }
    }, [user?.id]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get(`/Users/${user.id}/Profile`);

            if (response.data.success) {
                setProfile(response.data.data);
                setFormData({
                    FirstName: response.data.data.FirstName || "",
                    LastName: response.data.data.LastName || "",
                    Email: response.data.data.Email || "",
                    PhoneNumber: response.data.data.PhoneNumber || "",
                    Country: response.data.data.Country || "",
                    City: response.data.data.City || "",
                    DateOfBirth: response.data.data.DateOfBirth || "",
                    Bio: response.data.data.Bio || "",
                });
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        try {
            setUpdating(true);

            const updateData = new FormData();
            Object.keys(formData).forEach((key) => {
                if (formData[key] !== null && formData[key] !== undefined) {
                    updateData.append(key, formData[key]);
                }
            });

            if (imageFile) {
                updateData.append("ProfileImage", imageFile);
            }

            const response = await apiClient.put(
                `/Users/${user.id}/Profile`,
                updateData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.data.success) {
                setProfile(response.data.data);
                setUser((prev) => ({ ...prev, ...response.data.data }));
                setEditing(false);
                setImageFile(null);
                setImagePreview(null);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        } finally {
            setUpdating(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            FirstName: profile?.FirstName || "",
            LastName: profile?.LastName || "",
            Email: profile?.Email || "",
            PhoneNumber: profile?.PhoneNumber || "",
            Country: profile?.Country || "",
            City: profile?.City || "",
            DateOfBirth: profile?.DateOfBirth || "",
            Bio: profile?.Bio || "",
        });
        setEditing(false);
        setImageFile(null);
        setImagePreview(null);
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">
                        {t("profile.loading", "Loading profile...")}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={`max-w-4xl mx-auto p-6 ${isRTL ? "rtl" : "ltr"}`}>
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                            <UserIcon className="h-7 w-7 text-blue-600 mr-3" />
                            {t("profile.title", "My Profile")}
                        </h1>
                        <p className="mt-1 text-gray-600">
                            {t(
                                "profile.subtitle",
                                "Manage your personal information"
                            )}
                        </p>
                    </div>

                    {!editing ? (
                        <button
                            onClick={() => setEditing(true)}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            <PencilIcon className="h-4 w-4 mr-2" />
                            {t("profile.edit", "Edit Profile")}
                        </button>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={handleCancel}
                                disabled={updating}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                <XMarkIcon className="h-4 w-4 mr-2" />
                                {t("profile.cancel", "Cancel")}
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={updating}
                                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                                {updating ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                ) : (
                                    <CheckIcon className="h-4 w-4 mr-2" />
                                )}
                                {updating
                                    ? t("profile.saving", "Saving...")
                                    : t("profile.save", "Save")}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Profile Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Image and Basic Info */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                        <div className="relative inline-block">
                            <img
                                src={
                                    imagePreview ||
                                    (profile?.ProfileImage
                                        ? `${import.meta.env.VITE_API_URL}${
                                              profile.ProfileImage
                                          }`
                                        : "/default-avatar.png")
                                }
                                alt={`${profile?.FirstName} ${profile?.LastName}`}
                                className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-white shadow-lg"
                                onError={(e) => {
                                    e.target.src = "/default-avatar.png";
                                }}
                            />
                            {editing && (
                                <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                                    <CameraIcon className="h-4 w-4" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>

                        <div className="mt-4">
                            <h2 className="text-xl font-semibold text-gray-900">
                                {profile?.FirstName} {profile?.LastName}
                            </h2>
                            <p className="text-gray-600">{profile?.Email}</p>

                            {profile?.Bio && (
                                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-700 italic">
                                        &quot;{profile.Bio}&quot;
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Stats */}
                        <div className="mt-6 grid grid-cols-2 gap-4 text-center">
                            <div className="bg-blue-50 rounded-lg p-3">
                                <div className="text-2xl font-bold text-blue-600">
                                    {profile?.Stats?.CoursesCompleted || 0}
                                </div>
                                <div className="text-xs text-gray-600">
                                    {t(
                                        "profile.coursesCompleted",
                                        "Courses Completed"
                                    )}
                                </div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-3">
                                <div className="text-2xl font-bold text-green-600">
                                    {profile?.Stats?.CertificatesEarned || 0}
                                </div>
                                <div className="text-xs text-gray-600">
                                    {t("profile.certificates", "Certificates")}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Details Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">
                            {t("profile.personalInfo", "Personal Information")}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* First Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <UserIcon className="h-4 w-4 inline mr-1" />
                                    {t("profile.firstName", "First Name")}
                                </label>
                                {editing ? (
                                    <input
                                        type="text"
                                        name="FirstName"
                                        value={formData.FirstName}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                ) : (
                                    <p className="p-3 bg-gray-50 rounded-md text-gray-900">
                                        {profile?.FirstName ||
                                            t(
                                                "profile.notProvided",
                                                "Not provided"
                                            )}
                                    </p>
                                )}
                            </div>

                            {/* Last Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <UserIcon className="h-4 w-4 inline mr-1" />
                                    {t("profile.lastName", "Last Name")}
                                </label>
                                {editing ? (
                                    <input
                                        type="text"
                                        name="LastName"
                                        value={formData.LastName}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                ) : (
                                    <p className="p-3 bg-gray-50 rounded-md text-gray-900">
                                        {profile?.LastName ||
                                            t(
                                                "profile.notProvided",
                                                "Not provided"
                                            )}
                                    </p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <EnvelopeIcon className="h-4 w-4 inline mr-1" />
                                    {t("profile.email", "Email")}
                                </label>
                                {editing ? (
                                    <input
                                        type="email"
                                        name="Email"
                                        value={formData.Email}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                ) : (
                                    <p className="p-3 bg-gray-50 rounded-md text-gray-900">
                                        {profile?.Email ||
                                            t(
                                                "profile.notProvided",
                                                "Not provided"
                                            )}
                                    </p>
                                )}
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <PhoneIcon className="h-4 w-4 inline mr-1" />
                                    {t("profile.phone", "Phone Number")}
                                </label>
                                {editing ? (
                                    <input
                                        type="tel"
                                        name="PhoneNumber"
                                        value={formData.PhoneNumber}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                ) : (
                                    <p className="p-3 bg-gray-50 rounded-md text-gray-900">
                                        {profile?.PhoneNumber ||
                                            t(
                                                "profile.notProvided",
                                                "Not provided"
                                            )}
                                    </p>
                                )}
                            </div>

                            {/* Country */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <MapPinIcon className="h-4 w-4 inline mr-1" />
                                    {t("profile.country", "Country")}
                                </label>
                                {editing ? (
                                    <input
                                        type="text"
                                        name="Country"
                                        value={formData.Country}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                ) : (
                                    <p className="p-3 bg-gray-50 rounded-md text-gray-900">
                                        {profile?.Country ||
                                            t(
                                                "profile.notProvided",
                                                "Not provided"
                                            )}
                                    </p>
                                )}
                            </div>

                            {/* City */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <MapPinIcon className="h-4 w-4 inline mr-1" />
                                    {t("profile.city", "City")}
                                </label>
                                {editing ? (
                                    <input
                                        type="text"
                                        name="City"
                                        value={formData.City}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                ) : (
                                    <p className="p-3 bg-gray-50 rounded-md text-gray-900">
                                        {profile?.City ||
                                            t(
                                                "profile.notProvided",
                                                "Not provided"
                                            )}
                                    </p>
                                )}
                            </div>

                            {/* Date of Birth */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <CalendarDaysIcon className="h-4 w-4 inline mr-1" />
                                    {t("profile.dateOfBirth", "Date of Birth")}
                                </label>
                                {editing ? (
                                    <input
                                        type="date"
                                        name="DateOfBirth"
                                        value={
                                            formData.DateOfBirth
                                                ? formData.DateOfBirth.split(
                                                      "T"
                                                  )[0]
                                                : ""
                                        }
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                ) : (
                                    <p className="p-3 bg-gray-50 rounded-md text-gray-900">
                                        {profile?.DateOfBirth
                                            ? new Date(
                                                  profile.DateOfBirth
                                              ).toLocaleDateString()
                                            : t(
                                                  "profile.notProvided",
                                                  "Not provided"
                                              )}
                                    </p>
                                )}
                            </div>

                            {/* Bio */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <AcademicCapIcon className="h-4 w-4 inline mr-1" />
                                    {t("profile.bio", "Bio")}
                                </label>
                                {editing ? (
                                    <textarea
                                        name="Bio"
                                        value={formData.Bio}
                                        onChange={handleInputChange}
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder={t(
                                            "profile.bioPlaceholder",
                                            "Tell us about yourself..."
                                        )}
                                    />
                                ) : (
                                    <p className="p-3 bg-gray-50 rounded-md text-gray-900 min-h-[100px]">
                                        {profile?.Bio ||
                                            t(
                                                "profile.notProvided",
                                                "Not provided"
                                            )}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
