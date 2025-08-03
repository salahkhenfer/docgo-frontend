import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ProfileInfoSection from "../../components/userProfile/ProfileInfoSection";
import CoursesProfileSection from "../../components/userProfile/CoursesProfileSection";
import ApplicationsProfileSection from "../../components/userProfile/ApplicationsProfileSection";
import CertificatesProfileSection from "../../components/userProfile/CertificatesProfileSection";
import { useAppContext } from "../../AppContext";
import axios from "axios";
import MainLoading from "../../MainLoading";
import { useNavigate } from "react-router-dom";
const Profile = () => {
    const Navigate = useNavigate();
    const { t } = useTranslation();
    const [courseSlide, setCourseSlide] = useState(0);
    const [applicationSlide, setApplicationSlide] = useState(0);
    const [certificateSlide, setCertificateSlide] = useState(0);
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAppContext();

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            setLoading(true);
            const userId = user?.id;

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

            // Backend returns the data directly, not wrapped in response.data for axios
            setProfileData(response.data);
        } catch (error) {
            console.error("Error fetching profile:", error);
            setError(error.response?.data?.error || error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <MainLoading />;
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

    // Transform backend data to match component expectations
    const transformedProfile = {
        name: `${profileData.user.firstName} ${profileData.user.lastName}`,
        firstName: profileData.user.firstName,
        lastName: profileData.user.lastName,
        email: profileData.user.email,
        avatar: profileData.user.profile_pic_link || (
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
        ),
        country: profileData.user.country,
        studyField: profileData.user.studyField,
        studyDomain: profileData.user.studyDomain,
        phoneNumber: profileData.user.phoneNumber,
        stats: profileData.statistics,
    };

    // Transform courses from progress data
    const transformedCourses = profileData.progress.courses.map((progress) => ({
        id: progress.Course?.id || progress.id,
        title: progress.Course?.Title || "Unknown Course",
        description: `Course Duration: ${
            progress.Course?.Duration || "Unknown"
        }`,
        progress: Math.round(progress.CurrentProgress || 0),
        duration: progress.Course?.Duration,
        Image: progress.Course?.Image,
        isCompleted: progress.IsCompleted,
        lastWatchedAt: progress.LastWatchedAt,
    }));

    // Transform applications (combine programs and courses)
    const transformedApplications = [
        ...profileData.applications.programs.map((app) => ({
            id: app.id,
            program: app.Program?.title || "Unknown Program",
            university: app.Program?.organization || "Unknown University",
            country: app.Program?.location || "Unknown",
            status: app.status,
            submissionDate: app.createdAt,
            deadline: app.Program?.applicationDeadline,
            type: "program",
            scholarshipAmount: app.Program?.scholarshipAmount,
            currency: app.Program?.currency,
        })),
        ...profileData.applications.courses.map((app) => ({
            id: app.id,
            program: app.Course?.Title || "Unknown Course",
            university: "DocGo Platform",
            country: "Online",
            status: app.status,
            submissionDate: app.createdAt,
            type: "course",
            price: app.Course?.Price,
            level: app.Course?.Level,
            category: app.Course?.Category,
        })),
    ];

    // Transform certificates
    const transformedCertificates = profileData.certificates.courses.map(
        (cert) => ({
            id: cert.id,
            title: `Certificate - ${cert.Course?.Title}`,
            issuer: "DocGo Platform",
            Image:
                cert.Course?.Image ||
                "https://cdn.builder.io/api/v1/image/assets/TEMP/be9d9db59ed58e6e4a710e2dbe87bba966958ca6",
            officialUrl: cert.certificateUrl || "#",
            issueDate: cert.createdAt,
            course: cert.Course,
        })
    );

    return (
        <div className="min-h-screen relative bg-gray-50 p-4 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-12">
                <button
                    onClick={() => Navigate("/profile/edit")}
                    className="absolute top-4 right-4 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r
                     from-blue-600 to-blue-500 text-white rounded-full shadow-md hover:from-blue-700
                      hover:to-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400
                       focus:ring-offset-2"
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                    </svg>
                    <span className="text-sm font-semibold tracking-wide">
                        {t("edit_profile") || "Edit Profile"}
                    </span>
                </button>
                <ProfileInfoSection profile={transformedProfile} />

                {transformedCourses.length > 0 && (
                    <CoursesProfileSection
                        courses={transformedCourses}
                        currentSlide={courseSlide}
                        setSlide={setCourseSlide}
                    />
                )}

                {transformedApplications.length > 0 && (
                    <ApplicationsProfileSection
                        applications={transformedApplications}
                        currentSlide={applicationSlide}
                        setSlide={setApplicationSlide}
                    />
                )}

                {transformedCertificates.length > 0 && (
                    <CertificatesProfileSection
                        certificates={transformedCertificates}
                        currentSlide={certificateSlide}
                        setSlide={setCertificateSlide}
                    />
                )}
            </div>
        </div>
    );
};

export default Profile;
