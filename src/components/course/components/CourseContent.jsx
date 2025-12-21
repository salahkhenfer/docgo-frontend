import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { FaClock, FaListUl, FaLock, FaPlay } from "react-icons/fa";
import { TbTargetArrow } from "react-icons/tb";
import RichTextDisplay from "../../Common/RichTextEditor/RichTextDisplay";
import CourseInfo from "./CourseInfo";

const CourseContent = ({
  course,
  userStatus,
  isEnrolled,
  handleVideoClick,
  formatDuration,
  courseStats,
  upcomingMeets,
  certificate,
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      {/* Prerequisites */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          {t("course_data.prerequisites") || "Prerequisites"}
        </h3>
        {course.Prerequisites ? (
          <RichTextDisplay
            textClassName=""
            content={course.Prerequisites || course.prerequisites}
          />
        ) : (
          <p className="text-gray-500">
            {t("course_data.no_prerequisites") || "No prerequisites"}
          </p>
        )}
      </div>

      {/* Learning Objectives */}
      {course.objectives && course.objectives.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center mb-4">
            <TbTargetArrow className="text-green-500 text-xl mr-3" />
            <h3 className="text-xl font-bold text-gray-900">
              {t("course_data.whatYouLearn") || "What You'll Learn"}
            </h3>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {course.objectives.map((objective, index) => (
              <div key={index} className="flex items-start">
                <span className="text-green-500 mr-3 mt-1">✓</span>
                <span className="text-gray-700">{objective}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Learning Objectives */}
      <CourseInfo
        courseStats={courseStats}
        upcomingMeets={upcomingMeets}
        certificate={certificate}
        course={course}
        userStatus={userStatus}
      />

      {/* Course Content / Videos */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <FaListUl className="text-blue-500 text-xl mr-3" />
            <h3 className="text-xl font-bold text-gray-900">
              {t("course_data.content")}
            </h3>
          </div>
          <div className="text-sm text-gray-500">
            {course.videos?.length || 0} {t("course_data.videos") || "videos"}
          </div>
        </div>

        {course.videos && course.videos.length > 0 ? (
          <div className="space-y-3">
            {course.videos.map((video, index) => {
              const isAccessible =
                isEnrolled ||
                userStatus?.hasVideoAccess ||
                video.isFree ||
                index === 0; // First video often free preview

              return (
                <div
                  key={video.id || index}
                  className={`
                                        border rounded-lg p-4 transition-all duration-200 cursor-pointer
                                        ${
                                          isAccessible
                                            ? "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
                                            : "border-gray-100 bg-gray-50 cursor-not-allowed"
                                        }
                                    `}
                  onClick={() => isAccessible && handleVideoClick(video)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <div
                        className={`
                                                w-10 h-10 rounded-lg flex items-center justify-center mr-4
                                                ${
                                                  isAccessible
                                                    ? "bg-blue-100 text-blue-600"
                                                    : "bg-gray-200 text-gray-400"
                                                }
                                            `}
                      >
                        {isAccessible ? (
                          <FaPlay className="text-sm ml-0.5" />
                        ) : (
                          <FaLock className="text-sm" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center">
                          <span
                            className={`
                                                        text-xs px-2 py-1 rounded-full mr-3
                                                        ${
                                                          isAccessible
                                                            ? "bg-blue-100 text-blue-700"
                                                            : "bg-gray-200 text-gray-500"
                                                        }
                                                    `}
                          >
                            {index + 1}
                          </span>
                          <h4
                            className={`
                                                        font-medium flex-1
                                                        ${
                                                          isAccessible
                                                            ? "text-gray-900"
                                                            : "text-gray-500"
                                                        }
                                                    `}
                          >
                            {video.title}
                          </h4>
                          {video.isFree && (
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full ml-2">
                              {t("course.freePreview") || "Free Preview"}
                            </span>
                          )}
                        </div>

                        {video.description && (
                          <p
                            className={`
                                                        text-sm mt-1
                                                        ${
                                                          isAccessible
                                                            ? "text-gray-600"
                                                            : "text-gray-400"
                                                        }
                                                    `}
                          >
                            {video.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center ml-4">
                      {video.duration && (
                        <div
                          className={`
                                                    flex items-center text-sm
                                                    ${
                                                      isAccessible
                                                        ? "text-gray-500"
                                                        : "text-gray-400"
                                                    }
                                                `}
                        >
                          <FaClock className="mr-1 text-xs" />
                          {formatDuration(video.duration)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-4">📹</div>
            <p className="text-gray-500">
              {t("course_data.noVideos") || "No videos available yet"}
            </p>
          </div>
        )}
      </div>

      {/* Course Materials */}
      {course.materials && course.materials.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center mb-4">
            <span className="text-purple-500 text-xl mr-3">📚</span>
            <h3 className="text-xl font-bold text-gray-900">
              {t("course_data.materials") || "Course Materials"}
            </h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {course.materials.map((material, index) => (
              <div
                key={index}
                className="flex items-center p-3 border border-gray-200 rounded-lg"
              >
                <span className="text-purple-500 mr-3">📄</span>
                <span className="text-gray-700">{material}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

CourseContent.propTypes = {
  course: PropTypes.object.isRequired,
  userStatus: PropTypes.object,
  isEnrolled: PropTypes.bool.isRequired,
  handleVideoClick: PropTypes.func.isRequired,
  formatDuration: PropTypes.func.isRequired,
};

export default CourseContent;
