import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../../utils/apiClient";
import MDEditor from "@uiw/react-md-editor";
import Swal from "sweetalert2";

export default function InternshipDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [internship, setInternship] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [content, setContent] = useState("");
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    fetchInternship();
  }, [id]);

  const fetchInternship = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(`/other-services/internships/${id}`);
      setInternship(response.data.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load internship details",
      });
      navigate("/other-services/internships");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async () => {
    try {
      setIsSaving(true);
      await apiClient.post("/other-services/internship-application", {
        internshipId: id,
        content,
      });

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Your application has been submitted successfully",
      });

      setHasApplied(true);
    } catch (error) {
      if (error.response?.status === 400) {
        Swal.fire({
          icon: "error",
          title: "Already Applied",
          text: "You have already applied to this internship",
        });
        setHasApplied(true);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || "Failed to submit application",
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading internship details...</div>;
  }

  if (!internship) {
    return <div className="p-8 text-center">Internship not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <button
            onClick={() => navigate("/other-services/internships")}
            className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
          >
            ← Back to Internships
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Image */}
        {internship.introductoryImage && (
          <img
            src={internship.introductoryImage}
            alt={internship.title}
            className="w-full h-64 object-cover rounded-lg mb-8"
          />
        )}

        {/* Title and Meta */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {internship.title}
          </h1>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <p className="text-gray-600 text-sm">Company</p>
              <p className="font-semibold">{internship.companyName}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Location</p>
              <p className="font-semibold">{internship.location}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Type</p>
              <p className="font-semibold capitalize">{internship.type}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Payment</p>
              <p className="font-semibold">
                {internship.isPaid ? `$${internship.price}` : "Unpaid"}
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            {internship.startDate && (
              <p className="text-sm text-gray-600">
                Start: {new Date(internship.startDate).toLocaleDateString()}
              </p>
            )}
            {internship.applicationDeadline && (
              <p className="text-sm text-red-600 font-semibold">
                Application Deadline:{" "}
                {new Date(internship.applicationDeadline).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Description</h2>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: internship.description }}
          />
        </div>

        {/* Requirements */}
        {internship.requirements && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">Requirements</h2>
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: internship.requirements }}
            />
          </div>
        )}

        {/* Contact */}
        {internship.contactEmail || internship.contactPhone ? (
          <div className="bg-blue-50 border border-blue-300 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
            {internship.contactPerson && (
              <p className="mb-2">
                <span className="font-semibold">Contact Person:</span>{" "}
                {internship.contactPerson}
              </p>
            )}
            {internship.contactEmail && (
              <p className="mb-2">
                <span className="font-semibold">Email:</span>{" "}
                <a
                  href={`mailto:${internship.contactEmail}`}
                  className="text-blue-600 hover:underline"
                >
                  {internship.contactEmail}
                </a>
              </p>
            )}
            {internship.contactPhone && (
              <p>
                <span className="font-semibold">Phone:</span>{" "}
                <a
                  href={`tel:${internship.contactPhone}`}
                  className="text-blue-600 hover:underline"
                >
                  {internship.contactPhone}
                </a>
              </p>
            )}
          </div>
        ) : null}

        {/* Application Section */}
        {!hasApplied ? (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-4">
              Apply for This Internship
            </h2>
            <p className="text-gray-600 mb-6">
              Tell us why you're interested in this opportunity and why you'd be
              a great fit.
            </p>

            <label className="block font-semibold mb-2">
              Application Letter / Motivation
            </label>
            <div data-color-mode="light" className="mb-6">
              <MDEditor
                value={content}
                onChange={(val) => setContent(val || "")}
                height={300}
                preview="live"
                visibleDragbar={false}
              />
            </div>

            <div className="flex gap-4 justify-end">
              <button
                onClick={() => navigate("/other-services/internships")}
                className="px-6 py-2 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={isSaving}
                className="px-6 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition disabled:bg-gray-400"
              >
                {isSaving ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-green-50 border-2 border-green-300 rounded-lg p-8">
            <p className="text-lg font-semibold text-green-700">
              ✅ Application Submitted
            </p>
            <p className="text-gray-600 mt-2">
              Thank you for applying! We'll review your application and contact
              you if you're selected.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
