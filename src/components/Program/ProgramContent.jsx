import {
  Award,
  Calendar,
  CheckCircle,
  ClipboardList,
  Clock,
  FileText,
  Gift,
  MapPin,
  Target,
  Users,
} from "lucide-react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { TbTargetArrow } from "react-icons/tb";
import RichTextDisplay from "../Common/RichTextEditor/RichTextDisplay";

const ProgramContent = ({ program }) => {
  const { t, i18n } = useTranslation();

  const programDescription =
    i18n.language === "ar" && program.Description_ar
      ? program.Description_ar
      : program.Description;

  // Get localized content
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

  return (
    <div className="space-y-8">
      {/* About This Program */}
      {programDescription && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            {t("About this program") || "About this program"}
          </h3>
          <RichTextDisplay
            textClassName="text-gray-700"
            content={programDescription}
          />
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
          {program.Duration && (
            <div className="flex items-start bg-white rounded-lg p-4">
              <Clock className="text-blue-600 w-5 h-5 mr-3 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">
                  {t("Duration") || "Duration"}
                </p>
                <p className="text-gray-600 text-sm">{program.Duration}</p>
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
      {eligibilityCriteria && (
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
      {benefits && (
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
      {applicationProcess && (
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
      {requiredDocuments && (
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
      {program.benefits && !benefits && (
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
      {program.requirements && (
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
      {program.structure && (
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
