import {
  Award,
  Calendar,
  CheckCircle,
  ClipboardList,
  Clock,
  DollarSign,
  FileText,
  Gift,
  Globe,
  MapPin,
  Target,
  Users,
} from "lucide-react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { TbTargetArrow } from "react-icons/tb";
import RichTextDisplay from "../Common/RichTextEditor/RichTextDisplay";

const ProgramContent = ({ program }) => {
  const { t, i18n } = useTranslation("", { keyPrefix: "programs" });

  // Get localized full description
  const programDescription =
    i18n.language === "ar" && program.description_ar
      ? program.description_ar
      : program.description;

  // Get localized content for new fields
  const eligibilityCriteria =
    i18n.language === "ar" && program.eligibilityCriteria_ar
      ? program.eligibilityCriteria_ar
      : program.eligibilityCriteria;

  const benefits =
    i18n.language === "ar" && program.benefits_ar
      ? program.benefits_ar
      : program.benefits;

  const applicationProcess =
    i18n.language === "ar" && program.applicationProcess_ar
      ? program.applicationProcess_ar
      : program.applicationProcess;

  const requiredDocuments =
    i18n.language === "ar" && program.requiredDocuments_ar
      ? program.requiredDocuments_ar
      : program.requiredDocuments;

  // Get organization info
  const organization =
    i18n.language === "ar" && program.organization_ar
      ? program.organization_ar
      : program.organization;

  const category =
    i18n.language === "ar" && program.category_ar
      ? program.category_ar
      : program.category;

  const location =
    i18n.language === "ar" && program.location_ar
      ? program.location_ar
      : program.location;

  // Helper function to check if content is empty
  const hasContent = (content) => {
    if (!content) return false;

    // Handle non-string values
    if (typeof content !== "string") {
      // If it's an object or array, check if it has content
      if (typeof content === "object") {
        return Object.keys(content).length > 0;
      }
      return false;
    }

    // Remove HTML tags and check if there's actual text
    const textOnly = content.replace(/<[^>]*>/g, "").trim();
    return textOnly.length > 0;
  };

  return (
    <div className="space-y-8">
      {/* About This Program - Full Description */}
      {hasContent(programDescription) && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              {t("About this program")}
            </h3>
          </div>
          <RichTextDisplay
            textClassName="text-gray-700"
            content={programDescription}
          />
        </div>
      )}

      {/* Program Type & Organization Info */}
      {(program.programType || organization || category) && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Award className="text-purple-600 w-6 h-6" />
            <h3 className="text-xl font-bold text-gray-900">
              {t("Program Information")}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {program.programType && (
              <div className="flex items-start gap-3 bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-4 h-4 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">
                    {t("Type")}
                  </p>
                  <p className="text-gray-700 capitalize">
                    {program.programType}
                  </p>
                </div>
              </div>
            )}

            {organization && (
              <div className="flex items-start gap-3 bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-lg border border-emerald-200">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-4 h-4 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">
                    {t("Organization")}
                  </p>
                  <p className="text-gray-700">{organization}</p>
                </div>
              </div>
            )}

            {category && (
              <div className="flex items-start gap-3 bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-lg border border-amber-200">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-4 h-4 text-amber-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">
                    {t("Category")}
                  </p>
                  <p className="text-gray-700">{category}</p>
                </div>
              </div>
            )}

            {program.language && (
              <div className="flex items-start gap-3 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">
                    {t("Language")}
                  </p>
                  <p className="text-gray-700">{program.language}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Financial Information */}
      {(program.Price || program.scholarshipAmount) && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="text-emerald-600 w-6 h-6" />
            <h3 className="text-xl font-bold text-gray-900">
              {t("Financial Information") || "Financial Information"}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {program.Price && (
              <div className="flex items-start gap-3 bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-lg border border-emerald-200">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">
                    {t("Program Fee") || "Program Fee"}
                  </p>
                  <p className="text-gray-700 text-lg font-semibold">
                    {program.Price} {program.currency || "USD"}
                    {program.paymentFrequency && (
                      <span className="text-sm text-gray-600 ml-2">
                        / {program.paymentFrequency}
                      </span>
                    )}
                  </p>
                  {program.discountPrice && (
                    <p className="text-sm text-emerald-600 mt-1">
                      {t("Discount Price") || "Discount Price"}:{" "}
                      {program.discountPrice} {program.currency || "USD"}
                    </p>
                  )}
                </div>
              </div>
            )}

            {program.scholarshipAmount && (
              <div className="flex items-start gap-3 bg-gradient-to-br from-amber-50 to-yellow-50 p-4 rounded-lg border border-amber-200">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Award className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">
                    {t("Scholarship Available") || "Scholarship Available"}
                  </p>
                  <p className="text-gray-700 text-lg font-semibold">
                    {program.scholarshipAmount} {program.currency || "USD"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Important Dates & Location */}
      {(program.applicationStartDate ||
        program.applicationDeadline ||
        program.programStartDate ||
        program.programEndDate ||
        location ||
        program.country) && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="text-blue-600 w-6 h-6" />
            <h3 className="text-xl font-bold text-gray-900">
              {t("Program Highlights") || "Program Highlights"}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {program.applicationStartDate && (
              <div className="flex items-start gap-3 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <Calendar className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900 text-sm">
                    {t("Application Opens") || "Application Opens"}
                  </p>
                  <p className="text-gray-700">
                    {new Date(
                      program.applicationStartDate
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}

            {program.applicationDeadline && (
              <div className="flex items-start gap-3 bg-gradient-to-br from-red-50 to-rose-50 p-4 rounded-lg border border-red-200">
                <Clock className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900 text-sm">
                    {t("Application Deadline") || "Application Deadline"}
                  </p>
                  <p className="text-gray-700">
                    {new Date(program.applicationDeadline).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}

            {program.programStartDate && (
              <div className="flex items-start gap-3 bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                <Calendar className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900 text-sm">
                    {t("Program Starts") || "Program Starts"}
                  </p>
                  <p className="text-gray-700">
                    {new Date(program.programStartDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}

            {program.programEndDate && (
              <div className="flex items-start gap-3 bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-lg border border-orange-200">
                <Calendar className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900 text-sm">
                    {t("Program Ends") || "Program Ends"}
                  </p>
                  <p className="text-gray-700">
                    {new Date(program.programEndDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}

            {location && (
              <div className="flex items-start gap-3 bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                <MapPin className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900 text-sm">
                    {t("Location") || "Location"}
                  </p>
                  <p className="text-gray-700">{location}</p>
                  {program.country && (
                    <p className="text-sm text-gray-600 mt-0.5">
                      {program.country}
                    </p>
                  )}
                </div>
              </div>
            )}

            {program.isRemote !== undefined && (
              <div className="flex items-start gap-3 bg-gradient-to-br from-cyan-50 to-blue-50 p-4 rounded-lg border border-cyan-200">
                <Globe className="w-5 h-5 text-cyan-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900 text-sm">
                    {t("Format") || "Format"}
                  </p>
                  <p className="text-gray-700">
                    {program.isRemote
                      ? t("Remote") || "Remote"
                      : t("On-site") || "On-site"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Program Highlights */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-100 p-6">
        <div className="flex items-center mb-4">
          <Award className="text-blue-600 w-6 h-6 mr-3" />
          <h3 className="text-xl font-bold text-gray-900">
            {t("Program Highlights") || "Program Highlights"}
          </h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {program.startDate && (
            <div className="flex items-start bg-white rounded-lg p-4">
              <Calendar className="text-blue-600 w-5 h-5 mr-3 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">
                  {t("Start Date") || "Start Date"}
                </p>
                <p className="text-gray-600 text-sm">
                  {new Date(program.startDate).toLocaleDateString(
                    i18n.language === "ar" ? "ar-DZ" : "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
              </div>
            </div>
          )}
          {program.duration && (
            <div className="flex items-start bg-white rounded-lg p-4">
              <Clock className="text-blue-600 w-5 h-5 mr-3 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">
                  {t("Duration") || "Duration"}
                </p>
                <p className="text-gray-600 text-sm">{program.duration}</p>
              </div>
            </div>
          )}
          {program.isRemote !== null && (
            <div className="flex items-start bg-white rounded-lg p-4">
              <MapPin className="text-blue-600 w-5 h-5 mr-3 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">
                  {t("Location") || "Location"}
                </p>
                <p className="text-gray-600 text-sm">
                  {program.isRemote
                    ? t("Remote") || "Remote"
                    : t("On-site") || "On-site"}
                </p>
              </div>
            </div>
          )}
          {program.Users_count && (
            <div className="flex items-start bg-white rounded-lg p-4">
              <Users className="text-blue-600 w-5 h-5 mr-3 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">
                  {t("Participants") || "Participants"}
                </p>
                <p className="text-gray-600 text-sm">
                  {program.Users_count} {t("enrolled") || "enrolled"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Eligibility Criteria */}
      {hasContent(eligibilityCriteria) && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center mb-4">
            <Target className="text-blue-600 w-6 h-6 mr-3" />
            <h3 className="text-xl font-bold text-gray-900">
              {t("Eligibility Criteria") || "Eligibility Criteria"}
            </h3>
          </div>
          <RichTextDisplay
            textClassName="text-gray-700"
            content={eligibilityCriteria}
          />
        </div>
      )}

      {/* Benefits */}
      {hasContent(benefits) && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-sm border border-green-100 p-6">
          <div className="flex items-center mb-4">
            <Gift className="text-green-600 w-6 h-6 mr-3" />
            <h3 className="text-xl font-bold text-gray-900">
              {t("Program Benefits") || "Program Benefits"}
            </h3>
          </div>
          <RichTextDisplay textClassName="text-gray-700" content={benefits} />
        </div>
      )}

      {/* Application Process */}
      {hasContent(applicationProcess) && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center mb-4">
            <ClipboardList className="text-purple-600 w-6 h-6 mr-3" />
            <h3 className="text-xl font-bold text-gray-900">
              {t("Application Process") || "Application Process"}
            </h3>
          </div>
          <RichTextDisplay
            textClassName="text-gray-700"
            content={applicationProcess}
          />
        </div>
      )}

      {/* Required Documents */}
      {hasContent(requiredDocuments) && (
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl shadow-sm border border-orange-100 p-6">
          <div className="flex items-center mb-4">
            <FileText className="text-orange-600 w-6 h-6 mr-3" />
            <h3 className="text-xl font-bold text-gray-900">
              {t("Required Documents") || "Required Documents"}
            </h3>
          </div>
          <RichTextDisplay
            textClassName="text-gray-700"
            content={requiredDocuments}
          />
        </div>
      )}

      {/* What You'll Learn (keeping for backward compatibility) */}
      {hasContent(program.benefits) && !hasContent(benefits) && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center mb-4">
            <TbTargetArrow className="text-green-500 text-2xl mr-3" />
            <h3 className="text-xl font-bold text-gray-900">
              {t("What you'll learn") || "What you'll learn"}
            </h3>
          </div>
          <RichTextDisplay
            textClassName="text-gray-700"
            content={program.benefits}
          />
        </div>
      )}

      {/* Requirements (keeping for backward compatibility) */}
      {hasContent(program.requirements) && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center mb-4">
            <CheckCircle className="text-orange-500 w-6 h-6 mr-3" />
            <h3 className="text-xl font-bold text-gray-900">
              {t("Requirements") || "Requirements"}
            </h3>
          </div>
          <RichTextDisplay
            textClassName="text-gray-700"
            content={program.requirements}
          />
        </div>
      )}

      {/* Program Structure */}
      {hasContent(program.structure) && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            {t("Program Structure") || "Program Structure"}
          </h3>
          <RichTextDisplay
            textClassName="text-gray-700"
            content={program.structure}
          />
        </div>
      )}

      {/* Contact & Additional Information */}
      {(program.contactEmail || program.contactPhone || program.website) && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-sm border border-indigo-100 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            {t("Contact Information") || "Contact Information"}
          </h3>
          <div className="space-y-3">
            {program.contactEmail && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <svg
                    className="w-5 h-5 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">
                    {t("Email") || "Email"}
                  </p>
                  <a
                    href={`mailto:${program.contactEmail}`}
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    {program.contactEmail}
                  </a>
                </div>
              </div>
            )}
            {program.contactPhone && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <svg
                    className="w-5 h-5 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">
                    {t("Phone") || "Phone"}
                  </p>
                  <a
                    href={`tel:${program.contactPhone}`}
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    {program.contactPhone}
                  </a>
                </div>
              </div>
            )}
            {program.website && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <svg
                    className="w-5 h-5 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">
                    {t("Website") || "Website"}
                  </p>
                  <a
                    href={program.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    {program.website}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

ProgramContent.propTypes = {
  program: PropTypes.object.isRequired,
};

export default ProgramContent;
