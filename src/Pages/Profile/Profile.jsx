import axios from "axios";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../AppContext";
import ApplicationsProfileSection from "../../components/userProfile/ApplicationsProfileSection";
import CertificatesProfileSection from "../../components/userProfile/CertificatesProfileSection";
import CoursesProfileSection from "../../components/userProfile/CoursesProfileSection";
import ProfileInfoSection from "../../components/userProfile/ProfileInfoSection";
import MainLoading from "../../MainLoading";
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
      const response = await axios.get(`${API_URL}/Users/${userId}/Profile`, {
        withCredentials: true,
      });

      // Backend returns the data in response.data.data structure
      if (response.data.success) {
        // Combine user info with profile data
        const combinedData = {
          user: response.data.user,
          ...response.data.data,
        };
        setProfileData(combinedData);
      } else {
        throw new Error(
          response.data.message || "Failed to fetch profile data",
        );
      }
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

  // Transform courses from enrollments data (not progress)
  const transformedCourses =
    profileData.enrollments?.courses?.map((enrollment) => ({
      id: enrollment.Course?.id || enrollment.id,
      title: enrollment.Course?.Title || "Unknown Course",
      description:
        enrollment.Course?.Description ||
        `Course Duration: ${enrollment.Course?.Duration || "Unknown"}`,
      progress: Math.round(
        enrollment.progressPercentage || enrollment.CompletionPercentage || 0,
      ),
      duration: enrollment.Course?.Duration
        ? String(enrollment.Course.Duration)
        : null,
      Image: enrollment.Course?.Image,
      isCompleted: enrollment.IsCompleted || enrollment.status === "completed",
      status:
        enrollment.status || (enrollment.IsCompleted ? "completed" : "active"),
      enrolledAt:
        enrollment.enrollmentDate ||
        enrollment.createdAt ||
        enrollment.LastWatchedAt,
      lastWatchedAt: enrollment.LastWatchedAt,
      videos_count:
        enrollment.Course?.videos_count || enrollment.Course?.VideosCount,
    })) || [];

  // Transform applications (combine programs and courses)
  // Backend structure: data.applications.programs[] and data.applications.courses[]
  const transformedApplications = [
    ...(profileData.applications?.programs?.map((app) => ({
      id: app.id,
      program: app.Program?.Title || app.Program?.Title_ar || "Unknown Program",
      university:
        app.Program?.organization ||
        app.Program?.organization_ar ||
        "Unknown University",
      country: app.Program?.location || "Unknown",
      status: app.status, // "opened", "pending", "approved", "completed"
      submissionDate: app.createdAt,
      deadline: app.Program?.applicationDeadline,
      type: "program",
      scholarshipAmount: app.Program?.scholarshipAmount,
      currency: app.Program?.currency,
      paymentType: app.paymentType,
      category: app.Program?.Category || app.Program?.Category_ar,
    })) || []),
    ...(profileData.applications?.courses?.map((app) => ({
      id: app.id,
      program: app.Course?.Title || app.Course?.Title_ar || "Unknown Course",
      university: "DocGo Platform",
      country: "Online",
      status: app.status,
      submissionDate: app.createdAt,
      type: "course",
      price: app.Course?.Price,
      level: app.Course?.Level || app.Course?.Level_ar,
      category: app.Course?.Category || app.Course?.Category_ar,
    })) || []),
  ];

  // Transform certificates
  const transformedCertificates =
    profileData.certificates?.courses?.map((cert) => ({
      id: cert.id,
      title: `Certificate - ${cert.Course?.Title}`,
      issuer: "DocGo Platform",
      Image:
        cert.Course?.Image ||
        "https://cdn.builder.io/api/v1/image/assets/TEMP/be9d9db59ed58e6e4a710e2dbe87bba966958ca6",
      officialUrl: cert.certificateUrl || "#",
      issueDate: cert.createdAt,
      course: cert.Course,
    })) || [];

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

        {/* Courses Section - Always show */}
        {transformedCourses.length > 0 ? (
          <CoursesProfileSection
            courses={transformedCourses}
            currentSlide={courseSlide}
            setSlide={setCourseSlide}
          />
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="mb-6">
                <svg
                  className="w-16 h-16 text-blue-400 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t("profile_data.noCourses", "No Courses Yet")}
                </h3>
                <p className="text-gray-600 mb-6">
                  {t(
                    "profile_data.noCoursesDescription",
                    "Commencez votre parcours d’apprentissage en vous inscrivant à nos incroyables cours !",
                  )}
                </p>
              </div>
              <button
                onClick={() => Navigate("/courses")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                {t("profile_data.browseCourses", "Parcourir les cours")}
              </button>
            </div>
          </div>
        )}

        {/* Applications Section - Always show */}
        {transformedApplications.length > 0 ? (
          <ApplicationsProfileSection
            applications={transformedApplications}
            currentSlide={applicationSlide}
            setSlide={setApplicationSlide}
          />
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="mb-6">
                <svg
                  className="w-16 h-16 text-green-400 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t("profile_data.noApplications", "No Applications Yet")}
                </h3>
                <p className="text-gray-600 mb-6">
                  {t(
                    "profile_data.noApplicationsDescription",
                    "Apply for scholarship programs and courses to boost your career!",
                  )}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => Navigate("/programs")}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  {t("profile_data.browsePrograms", "Browse Programs")}
                </button>
                <button
                  onClick={() => Navigate("/courses")}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  {t("profile_data.applyCourses", "Apply for Courses")}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Certificates Section - Always show */}
        {transformedCertificates.length > 0 ? (
          <CertificatesProfileSection
            certificates={transformedCertificates}
            currentSlide={certificateSlide}
            setSlide={setCertificateSlide}
          />
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="mb-6">
                <svg
                  className="w-16 h-16 text-purple-400 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t("profile_data.noCertificates", "No Certificates Yet")}
                </h3>
                <p className="text-gray-600 mb-6">
                  {t(
                    "profile_data.noCertificatesDescription",
                    "Complete courses to earn certificates and showcase your achievements!",
                  )}
                </p>
              </div>
              <button
                onClick={() => Navigate("/courses")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                {t("profile_data.startLearning", "Start Learning")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
