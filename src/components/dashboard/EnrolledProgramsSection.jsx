import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const EnrolledProgramsSection = ({ enrollments }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!enrollments || enrollments.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
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
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t("dashboard.noEnrolledPrograms", "No Enrolled Programs")}
            </h3>
            <p className="text-gray-600 mb-6">
              {t(
                "dashboard.noEnrolledProgramsDescription",
                "Apply to scholarship programs to boost your career!"
              )}
            </p>
          </div>
          <button
            onClick={() => navigate("/programs")}
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
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            {t("dashboard.browsePrograms", "Browse Programs")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <svg
              className="w-6 h-6 text-green-600"
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
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {t("dashboard.enrolledPrograms", "My Enrolled Programs")}
          </h2>
        </div>
        <div className="text-sm text-gray-500">
          {enrollments.length} {t("dashboard.programs", "programs")}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {enrollments.map((enrollment) => (
          <div
            key={enrollment.id}
            className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer border border-green-100"
            onClick={() => navigate(`/Programs/${enrollment.ProgramId}`)}
          >
            <div className="flex items-start gap-4">
              <img
                src={
                  enrollment.Program?.Image
                    ? `${import.meta.env.VITE_API_URL}${
                        enrollment.Program.Image
                      }`
                    : "/placeholder-program.png"
                }
                alt={enrollment.Program?.Title}
                className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 mb-1 text-lg">
                  {enrollment.Program?.Title}
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-gray-600">
                    {enrollment.Program?.organization}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-600">
                    {enrollment.Program?.location}
                  </span>
                </div>

                {/* Status and Scholarship Info */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      enrollment.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : enrollment.status === "pending_start"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {enrollment.status === "completed"
                      ? t("dashboard.completed", "Completed")
                      : enrollment.status === "pending_start"
                      ? t("dashboard.pendingStart", "Pending Start")
                      : t("dashboard.active", "Active")}
                  </span>

                  {enrollment.isScholarship && (
                    <div className="flex items-center gap-1 text-green-600">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-xs font-medium">
                        {t("dashboard.scholarship", "Scholarship")}
                      </span>
                    </div>
                  )}
                </div>

                {/* Program Dates */}
                <div className="space-y-1">
                  <div className="text-xs text-gray-600 flex items-center justify-between">
                    <span>{t("dashboard.enrolledOn", "Enrolled on")}:</span>
                    <span className="font-medium">
                      {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                    </span>
                  </div>
                  {enrollment.programStartDate && (
                    <div className="text-xs text-gray-600 flex items-center justify-between">
                      <span>{t("dashboard.startDate", "Start Date")}:</span>
                      <span className="font-medium">
                        {new Date(
                          enrollment.programStartDate
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {enrollment.programEndDate && (
                    <div className="text-xs text-gray-600 flex items-center justify-between">
                      <span>{t("dashboard.endDate", "End Date")}:</span>
                      <span className="font-medium">
                        {new Date(
                          enrollment.programEndDate
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Scholarship Amount */}
                {enrollment.isScholarship && enrollment.scholarshipAmount && (
                  <div className="mt-3 p-2 bg-green-50 rounded-lg">
                    <div className="text-sm text-green-700 font-medium">
                      {t("dashboard.scholarshipAmount", "Scholarship Amount")}:
                      <span className="ml-1 font-bold">
                        {enrollment.scholarshipAmount}{" "}
                        {enrollment.Program?.currency || "DZD"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      {enrollments.length > 4 && (
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/Programs")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {t("dashboard.viewAllPrograms", "View All My Programs")}
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

EnrolledProgramsSection.propTypes = {
  enrollments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      ProgramId: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired,
      enrollmentDate: PropTypes.string.isRequired,
      progressPercentage: PropTypes.number,
      isScholarship: PropTypes.bool,
      scholarshipAmount: PropTypes.number,
      programStartDate: PropTypes.string,
      programEndDate: PropTypes.string,
      Program: PropTypes.shape({
        Title: PropTypes.string,
        Image: PropTypes.string,
        organization: PropTypes.string,
        location: PropTypes.string,
        currency: PropTypes.string,
      }),
    })
  ),
};

export default EnrolledProgramsSection;
