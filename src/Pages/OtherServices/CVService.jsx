import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import apiClient from "../../utils/apiClient";
import MDEditor from "@uiw/react-md-editor";
import Swal from "sweetalert2";

export default function CVService() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [cvService, setCVService] = useState(null);
  const [currentApp, setCurrentApp] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [content, setContent] = useState("");
  const [hasExistingApp, setHasExistingApp] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [serviceRes, appRes] = await Promise.all([
        apiClient.get("/other-services/cv-service"),
        apiClient.get("/other-services/cv-application"),
      ]);

      setCVService(serviceRes.data.data);

      if (appRes.data.data) {
        setCurrentApp(appRes.data.data);
        setContent(appRes.data.data.content || "");
        setHasExistingApp(true);
      }
    } catch (error) {
      if (error.response?.status !== 404) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load CV service data",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Required",
        text: "Please fill in your CV content",
      });
      return;
    }

    try {
      setIsSaving(true);
      const response = await apiClient.post("/other-services/cv-application", {
        content,
      });

      Swal.fire({
        icon: "success",
        title: "Success",
        text: hasExistingApp
          ? "Your CV application has been updated"
          : "Your CV application has been submitted successfully",
      });

      setCurrentApp(response.data.data);
      setHasExistingApp(true);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to submit application",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading CV Service...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <button
            onClick={() => navigate("/other-services")}
            className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
          >
            ← Back to Services
          </button>
          <h1 className="text-4xl font-bold text-gray-800">
            {cvService?.title || "Professional CV Creation"}
          </h1>
        </div>
      </div>

      {/* Service Description */}
      {cvService?.introductoryImage && (
        <div className="bg-white p-4">
          <div className="max-w-4xl mx-auto">
            <img
              src={cvService.introductoryImage}
              alt="CV Service"
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Service Info */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Service Description</h2>
          {cvService?.description ? (
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: cvService.description }}
            />
          ) : (
            <p className="text-gray-600">
              Our professional CV creation service helps you craft a compelling
              resume that stands out to employers. Share your information and
              let our experts create a polished, professional CV tailored to
              your industry.
            </p>
          )}

          {cvService?.estimatedPrice && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Estimated Price</p>
              <p className="text-3xl font-bold text-blue-600">
                ${cvService.estimatedPrice}
              </p>
            </div>
          )}
        </div>

        {/* Application Status */}
        {currentApp && (
          <div
            className={`rounded-lg shadow-md p-6 mb-8 ${
              currentApp.status === "accepted"
                ? "bg-green-50 border-2 border-green-300"
                : currentApp.status === "rejected"
                  ? "bg-red-50 border-2 border-red-300"
                  : "bg-yellow-50 border-2 border-yellow-300"
            }`}
          >
            <h3 className="font-bold text-lg mb-2">Application Status</h3>
            <p className="mb-2">
              Status:{" "}
              <span className="font-bold text-lg">
                {currentApp.status.toUpperCase()}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Submitted on:{" "}
              {new Date(currentApp.submissionDate).toLocaleDateString()}
            </p>

            {currentApp.status === "accepted" && (
              <div className="mt-4 p-4 bg-white rounded">
                <p className="font-bold mb-2">🎉 Great News!</p>
                <p className="text-sm mb-3">
                  Your CV application has been accepted. Our team will contact
                  you shortly to discuss the next steps and payment.
                </p>
                <p className="text-sm text-gray-600">
                  Please check your email for contact information from our admin
                  team.
                </p>
              </div>
            )}

            {currentApp.status === "rejected" && currentApp.rejectionReason && (
              <div className="mt-4 p-4 bg-white rounded border-l-4 border-red-500">
                <p className="font-bold text-red-700 mb-2">
                  Reason for Rejection:
                </p>
                <p className="text-sm">{currentApp.rejectionReason}</p>
              </div>
            )}
          </div>
        )}

        {/* Application Form */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-2">
            {hasExistingApp
              ? "Update Your CV Application"
              : "Submit Your CV Application"}
          </h2>
          <p className="text-gray-600 mb-6">
            Share your information and professional details. Our team will use
            this to create your CV.
          </p>

          {currentApp?.status === "accepted" ||
          currentApp?.status === "rejected" ? (
            <p className="text-gray-600 p-4 bg-gray-50 rounded">
              You cannot edit this application as it has already been{" "}
              {currentApp.status}.
            </p>
          ) : (
            <>
              <label className="block font-semibold mb-2">
                Your Information
              </label>
              <div data-color-mode="light" className="mb-6">
                <MDEditor
                  value={content}
                  onChange={(val) => setContent(val || "")}
                  height={400}
                  preview="live"
                  visibleDragbar={false}
                />
              </div>

              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => navigate("/other-services")}
                  className="px-6 py-2 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSaving}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition disabled:bg-gray-400"
                >
                  {isSaving
                    ? "Submitting..."
                    : hasExistingApp
                      ? "Update Application"
                      : "Submit Application"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
