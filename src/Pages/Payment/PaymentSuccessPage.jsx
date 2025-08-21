import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaSpinner, FaTimesCircle } from "react-icons/fa";
import { PaymentAPI } from "../../API/Payment";
import MainLoading from "../..//MainLoading";

const PaymentSuccessPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [processing, setProcessing] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [paymentData, setPaymentData] = useState(null);

    useEffect(() => {
        const processPayment = async () => {
            try {
                // Get PayPal parameters from URL
                const token = searchParams.get("token");
                const payerId = searchParams.get("PayerID");

                if (!token) {
                    throw new Error("Invalid payment parameters");
                }

                console.log("Processing PayPal return:", { token, payerId });

                // Get pending payment data from localStorage
                const pendingPaymentData =
                    localStorage.getItem("pendingPayment");
                if (pendingPaymentData) {
                    const paymentInfo = JSON.parse(pendingPaymentData);
                    console.log("Found pending payment:", paymentInfo);
                    setPaymentData(paymentInfo);
                }

                // Capture the payment
                const captureResult = await PaymentAPI.capturePayPalPayment(
                    token
                );

                if (captureResult.success) {
                    setSuccess(true);
                    setPaymentData((prevData) => ({
                        ...prevData,
                        ...captureResult.data,
                        status: "completed",
                    }));

                    // Clear pending payment data
                    localStorage.removeItem("pendingPayment");

                    // Redirect to dashboard after 3 seconds
                    setTimeout(() => {
                        const itemType = paymentData?.itemType;
                        if (itemType === "course") {
                            navigate("/dashboard/MyCourses");
                        } else if (itemType === "program") {
                            navigate("/dashboard/MyPrograms");
                        } else {
                            navigate("/dashboard");
                        }
                    }, 3000);
                } else {
                    throw new Error(captureResult.message);
                }
            } catch (err) {
                console.error("Payment processing error:", err);
                setError(err.message);
                setSuccess(false);
            } finally {
                setProcessing(false);
            }
        };

        processPayment();
    }, [searchParams, navigate, paymentData?.itemType]);

    if (processing) {
        return <MainLoading />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
            <div className="max-w-lg mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-green-100">
                    {success ? (
                        <>
                            {/* Success Icon */}
                            <div className="w-20 h-20 bg-gradient-to-r from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                                <FaCheckCircle className="w-10 h-10 text-green-500" />
                            </div>

                            {/* Success Title */}
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">
                                Payment Successful!
                            </h2>

                            {/* Success Description */}
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Your payment has been processed successfully.
                                Your application has been submitted and is
                                pending admin approval.
                            </p>

                            {/* Payment Details */}
                            {paymentData && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-left">
                                    <h3 className="font-semibold text-green-900 mb-3">
                                        Payment Details
                                    </h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Amount:
                                            </span>
                                            <span className="font-medium">
                                                {paymentData.amount}{" "}
                                                {paymentData.currency}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Payment ID:
                                            </span>
                                            <span className="font-medium font-mono text-xs">
                                                {paymentData.paymentId}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Method:
                                            </span>
                                            <span className="font-medium">
                                                PayPal
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Action Button */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-center gap-2 text-blue-600">
                                    <FaSpinner className="animate-spin" />
                                    <span className="text-sm">
                                        Redirecting to dashboard...
                                    </span>
                                </div>
                                <button
                                    onClick={() => {
                                        const itemType = paymentData?.itemType;
                                        if (itemType === "course") {
                                            navigate("/dashboard/MyCourses");
                                        } else if (itemType === "program") {
                                            navigate("/dashboard/MyPrograms");
                                        } else {
                                            navigate("/dashboard");
                                        }
                                    }}
                                    className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 shadow-sm hover:shadow-md"
                                >
                                    Go to Dashboard
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Error Icon */}
                            <div className="w-20 h-20 bg-gradient-to-r from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                                <FaTimesCircle className="w-10 h-10 text-red-500" />
                            </div>

                            {/* Error Title */}
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">
                                Payment Processing Failed
                            </h2>

                            {/* Error Description */}
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                There was an issue processing your payment.
                                Please try again or contact support.
                            </p>

                            {/* Error Details */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                                    <p className="text-sm text-red-700 font-medium">
                                        Error Details:
                                    </p>
                                    <p className="text-sm text-red-600 mt-1">
                                        {error}
                                    </p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <button
                                    onClick={() => window.history.back()}
                                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md"
                                >
                                    Try Again
                                </button>
                                <button
                                    onClick={() => navigate("/dashboard")}
                                    className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 border border-gray-200"
                                >
                                    Go to Dashboard
                                </button>
                            </div>
                        </>
                    )}

                    {/* Support Contact */}
                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <p className="text-sm text-gray-500">
                            Need help? Contact our support team
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccessPage;
