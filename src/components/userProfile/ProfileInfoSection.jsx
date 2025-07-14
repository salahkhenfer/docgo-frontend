import React from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle, Clock, Award, FileText, User } from "lucide-react";

const ProfileInfoSection = ({ profile }) => {
    const { t } = useTranslation();

    if (!profile) {
        return (
            <div className="bg-white rounded-3xl p-8 shadow-sm">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl p-8 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
                <div className="flex-shrink-0">
                    <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden shadow-lg bg-gray-200 flex items-center justify-center">
                        {profile?.avatar ? (
                            <img
                                src={profile.avatar}
                                className="w-full h-full object-cover"
                                alt="Profile avatar"
                                onError={(e) => {
                                    // Hide the broken image and show fallback
                                    e.target.style.display = "none";
                                    const fallback =
                                        e.target.nextElementSibling;
                                    if (fallback) {
                                        fallback.style.display = "flex";
                                    }
                                }}
                            />
                        ) : null}
                        {/* Fallback avatar - always rendered but hidden if image loads */}
                        <div
                            className={`w-full h-full flex items-center justify-center ${
                                profile?.avatar ? "hidden" : "flex"
                            }`}
                            style={{
                                display: profile?.avatar ? "none" : "flex",
                            }}
                        >
                            <User className="w-16 h-16 lg:w-20 lg:h-20 text-gray-400" />
                        </div>
                    </div>
                </div>
                <div className="flex-1 text-center lg:text-left">
                    <div className="flex flex-col lg:flex-row gap-4 items-center lg:items-start mb-6">
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">
                            {profile?.name}
                        </h1>
                        <div className="flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full">
                            <div className="w-5 h-5 bg-amber-400 rounded-full"></div>
                            <span className="text-sm font-medium text-gray-800">
                                {t("profile_data.professional_member")}
                            </span>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="w-5 h-5" />
                            <div>
                                <div className="font-bold text-lg">
                                    {profile?.stats?.coursesCompleted || 0}
                                </div>
                                <div className="text-xs text-gray-600">
                                    {t("profile_data.completed")}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-orange-500">
                            <Clock className="w-5 h-5" />
                            <div>
                                <div className="font-bold text-lg">
                                    {profile?.stats?.coursesInProgress || 0}
                                </div>
                                <div className="text-xs text-gray-600">
                                    {t("profile_data.in_progress")}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-blue-600">
                            <Award className="w-5 h-5" />
                            <div>
                                <div className="font-bold text-lg">
                                    {profile?.stats?.totalCertificates || 0}
                                </div>
                                <div className="text-xs text-gray-600">
                                    {t("profile_data.certificates")}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-purple-600">
                            <FileText className="w-5 h-5" />
                            <div>
                                <div className="font-bold text-lg">
                                    {profile?.stats?.totalApplications || 0}
                                </div>
                                <div className="text-xs text-gray-600">
                                    {t("profile_data.applications")}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        {profile?.email && (
                            <div className="text-gray-600">
                                <span className="font-medium">
                                    {t("profile_data.email")}:{" "}
                                </span>
                                {profile?.email}
                            </div>
                        )}
                        {profile?.country && (
                            <div className="text-gray-600">
                                <span className="font-medium">
                                    {t("profile_data.country")}:{" "}
                                </span>
                                {profile?.country}
                            </div>
                        )}
                        {profile?.studyField && (
                            <div className="text-gray-600">
                                <span className="font-medium">
                                    {t("profile_data.study_field")}:{" "}
                                </span>
                                {profile?.studyField}
                            </div>
                        )}
                        {profile?.studyDomain && (
                            <div className="text-gray-600">
                                <span className="font-medium">
                                    {t("profile_data.study_domain")}:{" "}
                                </span>
                                {profile?.studyDomain}
                            </div>
                        )}
                        {profile?.phoneNumber && (
                            <div className="text-gray-600">
                                <span className="font-medium">
                                    {t("profile_data.phone")}:{" "}
                                </span>
                                {profile?.phoneNumber}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileInfoSection;
