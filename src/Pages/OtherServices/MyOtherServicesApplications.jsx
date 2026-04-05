import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import Swal from "sweetalert2";
import "./OtherServices.css";

// Status badge component
const StatusBadge = ({ status }) => {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    accepted: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  const statusLabels = {
    pending: "Pending Review",
    accepted: "Accepted",
    rejected: "Rejected",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-semibold ${
        statusColors[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {statusLabels[status] || status}
    </span>
  );
};

const MyOtherServicesApplications = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [cvApplication, setCvApplication] = useState(null);
  const [internshipApplications, setInternshipApplications] = useState([]);
  const [expandedApp, setExpandedApp] = useState(null);
  const [error, setError] = useState(null);

  // Fetch user's CV application
  const fetchCVApplication = async () => {
    try {
      const response = await axios.get("/api/other-services/cv-application");
      if (response.data.success && response.data.data) {
        setCvApplication(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching CV application:", err);
      // Not an error if no application exists yet
    }
  };

  // Fetch user's internship applications
  const fetchInternshipApplications = async () => {
    try {
      const response = await axios.get(
        "/api/other-services/my-internship-applications",
      );
      if (response.data.success && response.data.data) {
        setInternshipApplications(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching internship applications:", err);
      setError(t("error_loading_applications", "Error loading applications"));
    }
  };

  // Load all data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchCVApplication(), fetchInternshipApplications()]);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">
              {t("loading", "Loading your applications...")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t("my_applications", "My Applications")}
          </h1>
          <p className="text-gray-600">
            {t(
              "view_track_applications",
              "View and track your CV and internship applications here",
            )}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* CV Application Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {t("cv_professional_creation", "Professional CV Creation")}
          </h2>

          {cvApplication ? (
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-primary-600">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {t("cv_application_submitted", "CV Application")}
                    </h3>
                    <StatusBadge status={cvApplication.status} />
                  </div>
                  <p className="text-sm text-gray-600">
                    {t("submitted_on", "Submitted on")}:{" "}
                    {new Date(
                      cvApplication.submissionDate,
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* CV Content Preview */}
              <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-200">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  {t("cv_content", "CV Content")}:
                </p>
                <div className="prose prose-sm max-w-none text-gray-700">
                  {cvApplication.content ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: cvApplication.content,
                      }}
                    />
                  ) : (
                    <p className="text-gray-500 italic">
                      {t("no_content", "No content")}
                    </p>
                  )}
                </div>
              </div>

              {/* Rejection Reason if applicable */}
              {cvApplication.status === "rejected" &&
                cvApplication.rejectionReason && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
                    <p className="text-sm font-semibold text-red-800 mb-2">
                      {t("rejection_reason", "Rejection Reason")}:
                    </p>
                    <p className="text-red-700">
                      {cvApplication.rejectionReason}
                    </p>
                  </div>
                )}

              {/* Admin Contact Info if Accepted */}
              {cvApplication.status === "accepted" && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
                  <p className="text-sm font-semibold text-green-800 mb-2">
                    {t("congratulations", "Congratulations!")}
                  </p>
                  <p className="text-green-700 mb-3">
                    {t(
                      "cv_accepted_message",
                      "Your CV application has been accepted. Our team will contact you with next steps.",
                    )}
                  </p>
                  <p className="text-xs text-green-600">
                    {t("review_date", "Reviewed on")}:{" "}
                    {new Date(cvApplication.reviewedDate).toLocaleDateString()}
                  </p>
                </div>
              )}

              {/* Notes if accepted */}
              {cvApplication.status === "accepted" && cvApplication.notes && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-sm font-semibold text-blue-800 mb-2">
                    {t("admin_notes", "Admin Notes")}:
                  </p>
                  <p className="text-blue-700">{cvApplication.notes}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 flex gap-3">
                {cvApplication.status === "pending" && (
                  <a
                    href="/other-services/cv"
                    className="inline-block px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    {t("edit_application", "Edit Application")}
                  </a>
                )}
                <a
                  href="/other-services"
                  className="inline-block px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  {t("back", "Back")}
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-600 mb-4">
                {t(
                  "no_cv_application",
                  "You haven't submitted a CV application yet.",
                )}
              </p>
              <a
                href="/other-services/cv"
                className="inline-block px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                {t("submit_cv_application", "Submit CV Application")}
              </a>
            </div>
          )}
        </section>

        {/* Internship Applications Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {t("internship_applications", "Internship Applications")}
          </h2>

          {internshipApplications.length > 0 ? (
            <div className="space-y-4">
              {internshipApplications.map((app) => (
                <div
                  key={app.id}
                  className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() =>
                    setExpandedApp(expandedApp === app.id ? null : app.id)
                  }
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 break-words">
                          {app.Internship?.title ||
                            t("internship", "Internship")}
                        </h3>
                        <StatusBadge status={app.status} />
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>
                          {t("company", "Company")}:{" "}
                          <span className="font-medium">
                            {app.Internship?.companyName || "—"}
                          </span>
                        </p>
                        <p>
                          {t("location", "Location")}:{" "}
                          <span className="font-medium">
                            {app.Internship?.location || "—"}
                          </span>
                        </p>
                        <p>
                          {t("applied_on", "Applied on")}:{" "}
                          {new Date(app.submissionDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-gray-500">
                        {expandedApp === app.id ? "▼" : "▶"}
                      </span>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedApp === app.id && (
                    <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                      {/* Application Content */}
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">
                          {t("your_application", "Your Application")}:
                        </p>
                        <div className="prose prose-sm max-w-none text-gray-700 bg-gray-50 p-3 rounded">
                          {app.content ? (
                            <div
                              dangerouslySetInnerHTML={{ __html: app.content }}
                            />
                          ) : (
                            <p className="text-gray-500 italic">
                              {t("no_content", "No content")}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Internship Info */}
                      {app.Internship && (
                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-2">
                            {t("internship_details", "Internship Details")}:
                          </p>
                          <div className="bg-gray-50 p-3 rounded space-y-2">
                            <p>
                              <span className="font-medium">
                                {t("type", "Type")}:
                              </span>{" "}
                              {app.Internship.type === "work"
                                ? t("work", "Work")
                                : t("study", "Study")}
                            </p>
                            <p>
                              <span className="font-medium">
                                {t("duration", "Duration")}:
                              </span>{" "}
                              {new Date(
                                app.Internship.startDate,
                              ).toLocaleDateString()}{" "}
                              -{" "}
                              {new Date(
                                app.Internship.endDate,
                              ).toLocaleDateString()}
                            </p>
                            {app.Internship.isPaid && (
                              <p>
                                <span className="font-medium">
                                  {t("compensation", "Compensation")}:
                                </span>{" "}
                                {app.Internship.price} {app.Internship.currency}
                                /{t("month", "month")}
                              </p>
                            )}
                            {app.Internship.contactEmail && (
                              <p>
                                <span className="font-medium">
                                  {t("contact_email", "Contact")}:
                                </span>{" "}
                                <a
                                  href={`mailto:${app.Internship.contactEmail}`}
                                  className="text-primary-600 hover:underline"
                                >
                                  {app.Internship.contactEmail}
                                </a>
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Rejection Reason if applicable */}
                      {app.status === "rejected" && app.rejectionReason && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded">
                          <p className="text-sm font-semibold text-red-800 mb-2">
                            {t("rejection_reason", "Rejection Reason")}:
                          </p>
                          <p className="text-red-700">{app.rejectionReason}</p>
                        </div>
                      )}

                      {/* Status with review date */}
                      <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50 p-3 rounded">
                        <span>
                          {app.reviewedDate
                            ? `${t("reviewed_on", "Reviewed on")}: ${new Date(
                                app.reviewedDate,
                              ).toLocaleDateString()}`
                            : t("pending_review", "Pending review")}
                        </span>
                      </div>

                      {/* Action Button */}
                      <div className="flex gap-3 pt-3">
                        <a
                          href={`/other-services/internships/${app.internshipId}`}
                          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          {t("view_internship", "View Internship")}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-600 mb-4">
                {t(
                  "no_internship_applications",
                  "You haven't applied to any internships yet.",
                )}
              </p>
              <a
                href="/other-services/internships"
                className="inline-block px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                {t("browse_internships", "Browse Internships")}
              </a>
            </div>
          )}
        </section>

        {/* Summary Stats */}
        {(cvApplication || internshipApplications.length > 0) && (
          <section className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-primary-600">
                {cvApplication ? 1 : 0}
              </div>
              <div className="text-sm text-gray-600">
                {t("cv_applications", "CV Applications")}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-blue-600">
                {internshipApplications.length}
              </div>
              <div className="text-sm text-gray-600">
                {t("internship_applications_count", "Internship Applications")}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-green-600">
                {(cvApplication?.status === "accepted" ? 1 : 0) +
                  internshipApplications.filter((a) => a.status === "accepted")
                    .length}
              </div>
              <div className="text-sm text-gray-600">
                {t("accepted_applications", "Accepted")}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default MyOtherServicesApplications;
