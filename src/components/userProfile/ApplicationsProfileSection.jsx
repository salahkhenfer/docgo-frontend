import { AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import SliderButtonProfile from "./SliderButtonProfile";

const ApplicationsProfileSection = ({
  applications,
  currentSlide,
  setSlide,
}) => {
  const { t } = useTranslation();
  const itemsPerSlide = 3;

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "under_review":
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "under_review":
        return "bg-blue-100 text-blue-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-800">
          {t("applications.title")}
        </h2>
        <div className="flex items-center gap-4">
          <SliderButtonProfile
            direction="prev"
            onClick={() =>
              setSlide(
                currentSlide > 0
                  ? currentSlide - 1
                  : Math.ceil(applications.length / itemsPerSlide) - 1
              )
            }
          />
          <SliderButtonProfile
            direction="next"
            onClick={() =>
              setSlide(
                currentSlide <
                  Math.ceil(applications.length / itemsPerSlide) - 1
                  ? currentSlide + 1
                  : 0
              )
            }
          />
        </div>
      </div>
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {Array.from({
            length: Math.ceil(applications.length / itemsPerSlide),
          }).map((_, slideIndex) => (
            <div key={slideIndex} className="w-full flex-shrink-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {applications
                  .slice(
                    slideIndex * itemsPerSlide,
                    (slideIndex + 1) * itemsPerSlide
                  )
                  .map((application) => (
                    <ApplicationCard
                      key={application.id}
                      application={application}
                      getStatusIcon={getStatusIcon}
                      getStatusColor={getStatusColor}
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* <div className="mt-8 text-right">
        <button className="text-blue-500 hover:text-blue-600 font-semibold underline">
          {t("applications.view_all")}
        </button>
      </div> */}
    </div>
  );
};

const ApplicationCard = ({ application, getStatusIcon, getStatusColor }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          {getStatusIcon(application.status)}
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
              application.status
            )}`}
          >
            {t(`applications.status.${application.status}`)}
          </span>
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        {application.program}
      </h3>
      <p className="text-gray-600 mb-1">{application.university}</p>
      <p className="text-sm text-gray-500 mb-4">{application.country}</p>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">{t("applications.submitted")}</span>
          <span>
            {new Date(application.submissionDate).toLocaleDateString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">{t("applications.deadline")}</span>
          <span>{new Date(application.deadline).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default ApplicationsProfileSection;
