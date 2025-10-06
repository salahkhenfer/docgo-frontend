import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import {
    Calendar,
    Clock,
    MapPin,
    Users,
    Award,
    CheckCircle,
} from "lucide-react";
import { TbTargetArrow } from "react-icons/tb";
import RichTextDisplay from "../Common/RichTextEditor/RichTextDisplay";

const ProgramContent = ({ program }) => {
    const { t, i18n } = useTranslation();

    const programDescription =
        i18n.language === "ar" && program.Description_ar
            ? program.Description_ar
            : program.Description;

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
                                    {new Date(
                                        program.startDate
                                    ).toLocaleDateString(
                                        i18n.language === "ar"
                                            ? "ar-DZ"
                                            : "en-US",
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
                                <p className="text-gray-600 text-sm">
                                    {program.Duration}
                                </p>
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
                                    {program.Users_count}{" "}
                                    {t("enrolled") || "enrolled"}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* What You'll Learn */}
            {program.benefits && (
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

            {/* Requirements */}
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
        </div>
    );
};

ProgramContent.propTypes = {
    program: PropTypes.object.isRequired,
};

export default ProgramContent;
