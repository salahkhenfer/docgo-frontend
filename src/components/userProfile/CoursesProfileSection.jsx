import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import SliderButtonProfile from "./SliderButtonProfile";
import { Link } from "react-router-dom";

const CoursesProfileSection = ({ courses, currentSlide, setSlide }) => {
    const { t } = useTranslation();
    const itemsPerSlide = 3;

    return (
        <div className="bg-white rounded-3xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-800">
                    {t("courses_data.title")}
                </h2>
                <div className="flex items-center gap-4">
                    <SliderButtonProfile
                        direction="prev"
                        onClick={() =>
                            setSlide(
                                currentSlide > 0
                                    ? currentSlide - 1
                                    : Math.ceil(
                                          courses.length / itemsPerSlide
                                      ) - 1
                            )
                        }
                    />
                    <SliderButtonProfile
                        direction="next"
                        onClick={() =>
                            setSlide(
                                currentSlide <
                                    Math.ceil(courses.length / itemsPerSlide) -
                                        1
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
                        length: Math.ceil(courses.length / itemsPerSlide),
                    }).map((_, slideIndex) => (
                        <div key={slideIndex} className="w-full flex-shrink-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {courses
                                    .slice(
                                        slideIndex * itemsPerSlide,
                                        (slideIndex + 1) * itemsPerSlide
                                    )
                                    .map((course) => (
                                        <CourseCard
                                            key={course.id}
                                            course={course}
                                        />
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* <div className="mt-8 text-right">
        <button className="text-blue-500 hover:text-blue-600 font-semibold underline">
          {t("courses_data.view_all")}
        </button>
      </div> */}
        </div>
    );
};

const CourseCard = ({ course }) => {
    const { t } = useTranslation();

    // Extract course data whether it's from enrollment or direct course object
    const courseData = course.Course || course;
    const enrollmentProgress = course.progress || 0;
    const enrollmentDate = course.enrolledAt || course.createdAt;
    const enrollmentStatus = course.status || "active";

    return (
        <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-md transition-shadow border border-gray-100">
            <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-semibold text-gray-800 flex-1">
                    {courseData.title}
                </h3>
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                        enrollmentStatus === "completed"
                            ? "bg-green-100 text-green-800"
                            : enrollmentStatus === "active"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                    }`}
                >
                    {t(`profile_data.${enrollmentStatus}`)}
                </span>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {courseData.description}
            </p>

            <div className="space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">
                        {t("courses_data.progress")}
                    </span>
                    <span className="font-medium">{enrollmentProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                            enrollmentProgress >= 100
                                ? "bg-green-500"
                                : "bg-blue-500"
                        }`}
                        style={{ width: `${enrollmentProgress}%` }}
                    ></div>
                </div>

                <div className="flex justify-between text-xs text-gray-500 mb-3">
                    <span>
                        {t("courses_data.enrolled")}:{" "}
                        {new Date(enrollmentDate).toLocaleDateString()}
                    </span>
                    {courseData.duration && <span>{courseData.duration}</span>}
                </div>

                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        {courseData.videos_count && (
                            <span className="text-xs text-gray-500">
                                {courseData.videos_count}{" "}
                                {t("courses_data.videos")}
                            </span>
                        )}
                        {enrollmentProgress >= 100 && (
                            <span className="text-xs text-green-600 font-medium">
                                ✓ {t("profile_data.completed")}
                            </span>
                        )}
                    </div>

                    <div className="flex space-x-2">
                        {enrollmentProgress >= 100 && (
                            <Link
                                to={`/courses/${courseData.id}/certificate`}
                                className="px-3 py-1 bg-green-500 text-white rounded-lg text-xs hover:bg-green-600 transition-colors"
                            >
                                {t("courses_data.certificate")}
                            </Link>
                        )}
                        <Link
                            to={`/Courses/${courseData.id}`}
                            className="px-4 py-2 bg-blue-500 text-white rounded-xl text-sm hover:bg-blue-600 transition-colors"
                        >
                            {enrollmentProgress >= 100
                                ? t("courses_data.review")
                                : t("courses_data.continue")}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

CoursesProfileSection.propTypes = {
    courses: PropTypes.array.isRequired,
    currentSlide: PropTypes.number.isRequired,
    setSlide: PropTypes.func.isRequired,
};

CourseCard.propTypes = {
    course: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        title: PropTypes.string,
        description: PropTypes.string,
        progress: PropTypes.number,
        enrolledAt: PropTypes.string,
        createdAt: PropTypes.string,
        status: PropTypes.string,
        duration: PropTypes.string,
        videos_count: PropTypes.number,
        Course: PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            title: PropTypes.string,
            description: PropTypes.string,
            duration: PropTypes.string,
            videos_count: PropTypes.number,
        }),
    }).isRequired,
};

export default CoursesProfileSection;
