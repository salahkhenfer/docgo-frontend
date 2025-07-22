import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import {
    FaCheckCircle,
    FaClock,
    FaArrowRight,
    FaDownload,
} from "react-icons/fa";

const PaymentSuccessPage = () => {
    const { courseId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(10);

    const paymentData = location.state?.paymentData;
    const courseData = location.state?.course;

    useEffect(() => {
        // Redirect to course if no payment data
        if (!paymentData || !courseData) {
            navigate(`/course/${courseId}`);
            return;
        }

        // Countdown timer for auto-redirect
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate(`/course/${courseId}/content`);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [paymentData, courseData, courseId, navigate]);

    if (!paymentData || !courseData) {
        return null; // Will redirect
    }

    const isPayPal = paymentData.method === "paypal";
    const isCCP = paymentData.method === "ccp";

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    {/* Success Icon */}
                    <div className="mb-6">
                        {paymentData.status === "completed" ? (
                            <FaCheckCircle className="mx-auto text-6xl text-green-500" />
                        ) : (
                            <FaClock className="mx-auto text-6xl text-yellow-500" />
                        )}
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        {paymentData.status === "completed"
                            ? "Payment Successful!"
                            : "Payment Submitted!"}
                    </h1>

                    {/* Message */}
                    <div className="mb-6">
                        {isPayPal && (
                            <p className="text-gray-600">
                                Your PayPal payment has been processed
                                successfully. You now have access to the course
                                content.
                            </p>
                        )}

                        {isCCP && (
                            <div className="space-y-2">
                                <p className="text-gray-600">
                                    Your CCP payment has been submitted for
                                    verification.
                                </p>
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                    <p className="text-sm text-yellow-800">
                                        <strong>Important:</strong> We will
                                        verify your payment within 24 hours. You
                                        will receive an email confirmation once
                                        verified.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Course Info */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <h3 className="font-medium text-gray-900 mb-2">
                            Course Enrolled
                        </h3>
                        <div className="flex items-center gap-3">
                            {courseData.ImageUrl && (
                                <img
                                    src={courseData.ImageUrl}
                                    alt={courseData.Title}
                                    className="w-12 h-12 object-cover rounded"
                                />
                            )}
                            <div className="flex-1 text-left">
                                <h4 className="font-medium text-gray-900">
                                    {courseData.Title}
                                </h4>
                                <p className="text-sm text-gray-600">
                                    {paymentData.amount} {paymentData.currency}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Details */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                        <h3 className="font-medium text-gray-900 mb-2">
                            Payment Details
                        </h3>
                        <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex justify-between">
                                <span>Payment ID:</span>
                                <span className="font-mono">
                                    {paymentData.paymentId}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Method:</span>
                                <span className="capitalize">
                                    {paymentData.method}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Amount:</span>
                                <span>
                                    {paymentData.amount} {paymentData.currency}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Status:</span>
                                <span
                                    className={`capitalize ${
                                        paymentData.status === "completed"
                                            ? "text-green-600"
                                            : "text-yellow-600"
                                    }`}
                                >
                                    {paymentData.status.replace("_", " ")}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        {paymentData.status === "completed" ? (
                            <>
                                <Link
                                    to={`/course/${courseId}/content`}
                                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        <span>Start Learning</span>
                                        <FaArrowRight />
                                    </span>
                                </Link>

                                <div className="text-sm text-gray-500">
                                    Auto-redirecting in {countdown} seconds...
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    to={`/course/${courseId}`}
                                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        <span>View Course Details</span>
                                        <FaArrowRight />
                                    </span>
                                </Link>

                                <button
                                    onClick={() => window.print()}
                                    className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        <FaDownload />
                                        <span>Save Receipt</span>
                                    </span>
                                </button>
                            </>
                        )}

                        <Link
                            to="/courses"
                            className="block w-full text-gray-600 hover:text-gray-800 py-2 transition-colors duration-200"
                        >
                            Browse More Courses
                        </Link>
                    </div>

                    {/* Support Info */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-500">
                            Need help? Contact our support team at{" "}
                            <a
                                href="mailto:support@docgo.com"
                                className="text-blue-600 hover:underline"
                            >
                                support@docgo.com
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccessPage;
