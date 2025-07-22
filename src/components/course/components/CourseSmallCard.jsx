import { FaDollarSign, FaPlay, FaCheckCircle } from "react-icons/fa";
import { IoMdRefresh } from "react-icons/io";
import PropTypes from "prop-types";

const CourseSmallCard = ({
    course,
    userStatus,
    courseProgress,
    certificate,
    isEnrolled,
    isFree,
    coursePrice,
    currency,
    enrolling,
    handleEnrollClick,
}) => {
    return (
        <div className="bg-white rounded-2xl shadow-2xl p-8 sticky top-6 border border-gray-100">
            {/* Course Thumbnail */}
            <div className="relative mb-6 group">
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center overflow-hidden">
                    {course.thumbnail ? (
                        <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="text-6xl text-blue-300">📹</div>
                    )}
                </div>
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/30 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                        <FaPlay className="text-blue-600 text-xl ml-1" />
                    </div>
                </div>
            </div>

            {/* Price Section */}
            <div className="text-center mb-6">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                    {isFree ? (
                        <span className="text-green-600">Free</span>
                    ) : (
                        <span className="flex items-center justify-center">
                            <FaDollarSign className="text-2xl mr-1" />
                            {coursePrice} {currency}
                        </span>
                    )}
                </div>
                {!isFree && (
                    <div className="text-sm text-gray-500">
                        One-time payment • Lifetime access
                    </div>
                )}
            </div>

            {/* Enrollment Status / Button */}
            <div className="mb-6">
                {isEnrolled ? (
                    <div className="space-y-4">
                        {/* Enrollment Success */}
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                            <div className="flex items-center text-green-700 mb-2">
                                <FaCheckCircle className="mr-2" />
                                <span className="font-semibold">
                                    Enrolled Successfully!
                                </span>
                            </div>
                            <div className="text-sm text-green-600">
                                You have full access to this course
                            </div>
                        </div>

                        {/* Progress Bar */}
                        {courseProgress && (
                            <div className="bg-gray-50 rounded-xl p-4">
                                <div className="flex justify-between text-sm text-gray-600 mb-2">
                                    <span>Progress</span>
                                    <span>
                                        {courseProgress.completionPercentage ||
                                            0}
                                        %
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                                        style={{
                                            width: `${
                                                courseProgress.completionPercentage ||
                                                0
                                            }%`,
                                        }}
                                    ></div>
                                </div>
                                <div className="text-xs text-gray-500 mt-2">
                                    {courseProgress.completedVideos || 0} of{" "}
                                    {course.videos?.length || 0} videos
                                    completed
                                </div>
                            </div>
                        )}

                        {/* Certificate Status */}
                        {certificate && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                                <div className="flex items-center text-yellow-700 mb-1">
                                    <span className="mr-2">🏆</span>
                                    <span className="font-semibold">
                                        Certificate Available
                                    </span>
                                </div>
                                <div className="text-sm text-yellow-600">
                                    Congratulations! You can download your
                                    certificate.
                                </div>
                            </div>
                        )}

                        {/* Continue Learning Button */}
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center">
                            <FaPlay className="mr-2" />
                            Continue Learning
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={handleEnrollClick}
                        disabled={enrolling}
                        className={`
                            w-full font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center
                            ${
                                enrolling
                                    ? "bg-gray-400 cursor-not-allowed text-white"
                                    : isFree
                                    ? "bg-green-600 hover:bg-green-700 text-white"
                                    : "bg-blue-600 hover:bg-blue-700 text-white"
                            }
                        `}
                    >
                        {enrolling ? (
                            <>
                                <IoMdRefresh className="animate-spin mr-2" />
                                Enrolling...
                            </>
                        ) : (
                            <>
                                <span className="mr-2">
                                    {isFree ? "🎉" : "💳"}
                                </span>
                                {isFree
                                    ? "Enroll for Free"
                                    : `Enroll for ${coursePrice} ${currency}`}
                            </>
                        )}
                    </button>
                )}
            </div>

            {/* Course Features */}
            <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center">
                    <span className="mr-3">✓</span>
                    <span>Lifetime access</span>
                </div>
                <div className="flex items-center">
                    <span className="mr-3">✓</span>
                    <span>Mobile and desktop access</span>
                </div>
                <div className="flex items-center">
                    <span className="mr-3">✓</span>
                    <span>Certificate of completion</span>
                </div>
                <div className="flex items-center">
                    <span className="mr-3">✓</span>
                    <span>30-day money-back guarantee</span>
                </div>
                {userStatus?.hasDownloadAccess && (
                    <div className="flex items-center">
                        <span className="mr-3">✓</span>
                        <span>Downloadable resources</span>
                    </div>
                )}
            </div>
        </div>
    );
};

CourseSmallCard.propTypes = {
    course: PropTypes.object.isRequired,
    userStatus: PropTypes.object,
    courseProgress: PropTypes.object,
    certificate: PropTypes.object,
    isEnrolled: PropTypes.bool.isRequired,
    isFree: PropTypes.bool.isRequired,
    coursePrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    currency: PropTypes.string,
    enrolling: PropTypes.bool.isRequired,
    handleEnrollClick: PropTypes.func.isRequired,
};

export default CourseSmallCard;
