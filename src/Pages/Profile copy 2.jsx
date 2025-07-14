import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ProfileInfoSection from "../components/userProfile/ProfileInfoSection";
import CoursesProfileSection from "../components/userProfile/CoursesProfileSection";
import ApplicationsProfileSection from "../components/userProfile/ApplicationsProfileSection";
import CertificatesProfileSection from "../components/userProfile/CertificatesProfileSection";
import { useAppContext } from "../AppContext";
import axios from "axios";
const Profile = () => {
    const { t } = useTranslation();
    const [courseSlide, setCourseSlide] = useState(0);
    const [applicationSlide, setApplicationSlide] = useState(0);
    const [certificateSlide, setCertificateSlide] = useState(0);
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProfileData();
    }, []);
    const { user } = useAppContext();

    const fetchProfileData = async () => {
        try {
            setLoading(true);
            const userId = user.id; // You might need to store this during login

            if (!userId) {
                setError("Authentication required");
                return;
            }
            const API_URL = import.meta.env.VITE_API_URL;

            const response = await axios.get(
                `${API_URL}/users/${userId}/Profile`,
                {
                    withCredentials: true,
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setProfileData(data);
        } catch (error) {
            console.error("Error fetching profile:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">{t("loading")}...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600">
                        {t("error")}: {error}
                    </p>
                    <button
                        onClick={fetchProfileData}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        {t("retry")}
                    </button>
                </div>
            </div>
        );
    }

    if (!profileData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-600">{t("no_data")}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-12">
                <ProfileInfoSection profile={profileData.profile} />

                {profileData.courses && profileData.courses.length > 0 && (
                    <CoursesProfileSection
                        courses={profileData.courses}
                        currentSlide={courseSlide}
                        setSlide={setCourseSlide}
                    />
                )}

                {profileData.applications &&
                    profileData.applications.length > 0 && (
                        <ApplicationsProfileSection
                            applications={profileData.applications}
                            currentSlide={applicationSlide}
                            setSlide={setApplicationSlide}
                        />
                    )}

                {profileData.certificates &&
                    profileData.certificates.length > 0 && (
                        <CertificatesProfileSection
                            certificates={profileData.certificates}
                            currentSlide={certificateSlide}
                            setSlide={setCertificateSlide}
                        />
                    )}
            </div>
        </div>
    );
};

export default Profile;
