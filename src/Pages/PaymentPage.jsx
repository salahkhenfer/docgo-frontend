import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../AppContext";
import { FaArrowLeft, FaLock, FaCheckCircle } from "react-icons/fa";
import PaymentMethodSelector from "../components/Payment/PaymentMethodSelector";
import PayPalPayment from "../components/Payment/PayPalPayment";
import CCPPayment from "../components/Payment/CCPPayment";
import MainLoading from "../MainLoading";

const PaymentPage = () => {
    const { courseId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuth, user } = useAppContext();

    const [selectedMethod, setSelectedMethod] = useState("paypal");
    const [loading, setLoading] = useState(false);
    const [courseData, setCourseData] = useState(null);

    // Get course data from navigation state or fetch it
    useEffect(() => {
        if (location.state?.course) {
            setCourseData(location.state.course);
        } else if (courseId) {
            // If no course data in state, we might need to fetch it
            // For now, redirect back to course page
            navigate(`/course/${courseId}`);
        }
    }, [location.state, courseId, navigate]);

    // Check authentication
    useEffect(() => {
        if (!isAuth || !user) {
            navigate(
                `/login?from=${encodeURIComponent(window.location.pathname)}`
            );
        }
    }, [isAuth, user, navigate]);

    if (!courseData) {
        return <MainLoading />;
    }

    const price = parseFloat(courseData.discountPrice || courseData.Price);
    const originalPrice = parseFloat(courseData.Price);
    const currency = courseData.Currency || "USD";
    const hasDiscount =
        courseData.discountPrice && courseData.discountPrice < courseData.Price;

    const paymentMethods = [
        {
            id: "paypal",
            name: "PayPal",
            description: "Pay securely with PayPal",
            icon: "/api/placeholder/40/40", // You can replace with actual PayPal icon
            available: true,
        },
        {
            id: "ccp",
            name: "Algeria CCP",
            description: "Pay with Algeria CCP transfer",
            icon: "/api/placeholder/40/40", // You can replace with actual CCP icon
            available: true,
        },
    ];

    const handleGoBack = () => {
        navigate(-1);
    };

    const handlePaymentSuccess = (paymentData) => {
        console.log("Payment successful:", paymentData);
        // Navigate to success page or course access
        navigate(`/payment/success/${courseId}`, {
            state: {
                paymentData,
                course: courseData,
            },
        });
    };

    const handlePaymentError = (error) => {
        console.error("Payment error:", error);
        // Handle payment error
        alert("Payment failed. Please try again.");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <button
                        onClick={handleGoBack}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors mb-4"
                    >
                        <FaArrowLeft />
                        <span>Back to Course</span>
                    </button>

                    <div className="flex items-center gap-3">
                        <FaLock className="text-blue-600" />
                        <h1 className="text-2xl font-bold text-gray-900">
                            Secure Payment
                        </h1>
                    </div>
                    <p className="text-gray-600 mt-2">
                        Complete your enrollment for this course
                    </p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Payment Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">
                                Choose Payment Method
                            </h2>

                            <PaymentMethodSelector
                                methods={paymentMethods}
                                selectedMethod={selectedMethod}
                                onMethodChange={setSelectedMethod}
                            />

                            <div className="mt-8">
                                {selectedMethod === "paypal" && (
                                    <PayPalPayment
                                        courseData={courseData}
                                        amount={price}
                                        currency={currency}
                                        onSuccess={handlePaymentSuccess}
                                        onError={handlePaymentError}
                                        loading={loading}
                                        setLoading={setLoading}
                                    />
                                )}

                                {selectedMethod === "ccp" && (
                                    <CCPPayment
                                        courseData={courseData}
                                        amount={price}
                                        currency={currency}
                                        onSuccess={handlePaymentSuccess}
                                        onError={handlePaymentError}
                                        loading={loading}
                                        setLoading={setLoading}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Order Summary
                            </h3>

                            {/* Course Info */}
                            <div className="mb-6">
                                <div className="flex items-start gap-3">
                                    {courseData.ImageUrl && (
                                        <img
                                            src={courseData.ImageUrl}
                                            alt={courseData.Title}
                                            className="w-16 h-16 object-cover rounded-lg"
                                        />
                                    )}
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-900 line-clamp-2">
                                            {courseData.Title}
                                        </h4>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {courseData.Level} •{" "}
                                            {courseData.language}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Pricing */}
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">
                                        Course Price
                                    </span>
                                    <span
                                        className={
                                            hasDiscount
                                                ? "line-through text-gray-400"
                                                : "font-medium"
                                        }
                                    >
                                        {originalPrice} {currency}
                                    </span>
                                </div>

                                {hasDiscount && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-green-600">
                                            Discounted Price
                                        </span>
                                        <span className="font-medium text-green-600">
                                            {price} {currency}
                                        </span>
                                    </div>
                                )}

                                <div className="border-t pt-3">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-gray-900">
                                            Total
                                        </span>
                                        <span className="font-bold text-xl text-blue-600">
                                            {price} {currency}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Security Features */}
                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <FaCheckCircle className="text-green-500" />
                                    <span>Secure SSL encrypted payment</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaCheckCircle className="text-green-500" />
                                    <span>Instant access after payment</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaCheckCircle className="text-green-500" />
                                    <span>30-day money-back guarantee</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
