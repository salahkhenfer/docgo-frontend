import { Download, ExternalLink, FileText, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useCourse } from "../hooks/useCourse";
import MainLoading from "../MainLoading";

export default function CourseResources() {
  const { courseId } = useParams();
  const { t } = useTranslation();
  const { courseData, loading } = useCourse(courseId);
  const [viewingPdf, setViewingPdf] = useState(null);

  if (loading) {
    return <MainLoading />;
  }

  const course = courseData?.course;
  console.log("CourseResources - Full courseData:", courseData);
  console.log("CourseResources - course object:", course);
  console.log("CourseResources - course.resources:", course?.resources);
  console.log("CourseResources - course.pdfs:", course?.pdfs);
  console.log("CourseResources - course.documents:", course?.documents);
  console.log("CourseResources - course.files:", course?.files);

  const resources =
    course?.resources ||
    course?.pdfs ||
    course?.documents ||
    course?.files ||
    [];
  console.log("CourseResources - final resources array:", resources);

  // If viewing a PDF, show it in an embedded viewer
  if (viewingPdf) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    {viewingPdf.title || viewingPdf.name || "Document"}
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Viewing PDF Document
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingPdf(null)}
                className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-700 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <X className="w-5 h-5" />
                <span>{t("Close")}</span>
              </button>
            </div>
          </div>

          {/* PDF Viewer */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
            <div className="w-full" style={{ height: "calc(100vh - 220px)" }}>
              <iframe
                src={viewingPdf.url}
                className="w-full h-full"
                title={viewingPdf.title || "PDF Viewer"}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-slate-200 backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl shadow-lg">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                {t("Course Resources")}
              </h2>
              <p className="text-slate-600 mt-2 text-lg">
                {t("Download PDFs and course materials")}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mt-8">
          {resources.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-16 text-center border border-slate-200">
              <div className="max-w-md mx-auto">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-orange-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
                  <div className="relative p-6 bg-gradient-to-br from-red-50 to-orange-50 rounded-full">
                    <FileText className="w-20 h-20 text-red-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-3">
                  {t("No Resources Available")}
                </h3>
                <p className="text-slate-600 text-lg">
                  {t(
                    "There are no PDF resources available for this course yet."
                  )}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {resources.map((resource, index) => {
                // Log the entire resource object to see its structure
                console.log(`=== Resource ${index} ===`);
                console.log(
                  "Full resource object:",
                  JSON.stringify(resource, null, 2)
                );
                console.log("All keys:", Object.keys(resource));

                // Try to find URL in any possible field
                let resourceUrl =
                  resource.url ||
                  resource.fileUrl ||
                  resource.file_url ||
                  resource.path ||
                  resource.file ||
                  resource.pdf ||
                  resource.pdfUrl ||
                  resource.pdf_url ||
                  resource.link ||
                  resource.src ||
                  "";

                // If it's an object, it might be nested
                if (typeof resource === "string") {
                  resourceUrl = resource;
                }

                // If URL doesn't start with http, prepend the API URL
                if (resourceUrl && !resourceUrl.startsWith("http")) {
                  resourceUrl = `${import.meta.env.VITE_API_URL}${
                    resourceUrl.startsWith("/") ? "" : "/"
                  }${resourceUrl}`;
                }

                console.log("Extracted Resource URL:", resourceUrl);
                console.log("===================");

                const handleOpenPDF = () => {
                  if (!resourceUrl) {
                    alert("PDF URL not available");
                    return;
                  }
                  // Set the viewing PDF to show it in embedded viewer
                  setViewingPdf({
                    url: resourceUrl,
                    title:
                      resource.title ||
                      resource.name ||
                      `Document ${index + 1}`,
                  });
                };

                const handleDownloadPDF = () => {
                  if (!resourceUrl) {
                    alert("PDF URL not available");
                    return;
                  }

                  // Create a temporary link and trigger download
                  const link = document.createElement("a");
                  link.href = resourceUrl;
                  link.download = `${
                    resource.title || resource.name || `document-${index + 1}`
                  }.pdf`;
                  link.target = "_blank";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                };

                return (
                  <div
                    key={resource.id || index}
                    className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-200 hover:border-red-300 transform hover:-translate-y-2"
                  >
                    {/* Decorative gradient overlay */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500"></div>

                    {/* PDF Preview/Icon */}
                    <div className="relative bg-gradient-to-br from-red-50 via-orange-50 to-red-50 p-12 flex items-center justify-center overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-red-100/50 to-orange-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="relative">
                        <div className="absolute inset-0 bg-red-400 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                        <FileText className="relative w-24 h-24 text-red-600 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors duration-300">
                        {resource.title ||
                          resource.name ||
                          `Document ${index + 1}`}
                      </h3>

                      {resource.description && (
                        <p className="text-sm text-slate-600 mb-4 line-clamp-3">
                          {resource.description}
                        </p>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-3 mt-6">
                        <button
                          onClick={handleOpenPDF}
                          disabled={!resourceUrl}
                          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-105"
                        >
                          <ExternalLink className="w-5 h-5" />
                          <span>{t("Open")}</span>
                        </button>
                        <button
                          onClick={handleDownloadPDF}
                          disabled={!resourceUrl}
                          className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 disabled:from-gray-100 disabled:to-gray-200 disabled:cursor-not-allowed text-slate-700 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-105"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                      </div>

                      {/* File Info */}
                      {resource.size && (
                        <div className="mt-4 pt-4 border-t border-slate-100">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <p className="text-xs text-slate-500 font-medium">
                              {t("Size")}: {resource.size}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
