import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimesCircle } from "react-icons/fa";

const PaymentCancelPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Clear any pending payment data
        localStorage.removeItem("pendingPayment");
    }, []);

    const handleGoBack = () => {
        window.history.back();
    };

    const handleRetry = () => {
        // Try to get the item data from localStorage or navigate to courses/programs
        const pendingPaymentData = localStorage.getItem("pendingPayment");
        if (pendingPaymentData) {
            const paymentInfo = JSON.parse(pendingPaymentData);
            const itemType = paymentInfo.itemType;
            const itemId = paymentInfo.itemData?.id;

            if (itemType && itemId) {
                navigate(`/payment/${itemType}/${itemId}`, {
                    state: {
                        [itemType]: paymentInfo.itemData,
                    },
                });
                return;
            }
        }

        // Fallback navigation
        navigate("/courses");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
            <div className="max-w-lg mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-red-100">
                    {/* Cancel Icon */}
                    <div className="w-20 h-20 bg-gradient-to-r from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <FaTimesCircle className="w-10 h-10 text-red-500" />
                    </div>

                    {/* Cancel Title */}
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                        Payment Cancelled
                    </h2>

                    {/* Cancel Description */}
                    <p className="text-gray-600 mb-6 leading-relaxed">
                        Your payment was cancelled. No charges have been made to
                        your account.
                    </p>

                    {/* Information Box */}
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                        <h4 className="font-medium text-orange-900 mb-2">
                            What happened?
                        </h4>
                        <ul className="text-sm text-orange-800 space-y-1 text-left">
                            <li>
                                • You cancelled the payment on the PayPal page
                            </li>
                            <li>• The payment process was interrupted</li>
                            <li>• No money was charged from your account</li>
                            <li>
                                • You can try again or choose a different
                                payment method
                            </li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={handleRetry}
                            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md"
                        >
                            Try Payment Again
                        </button>
                        <button
                            onClick={handleGoBack}
                            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 border border-gray-200"
                        >
                            Go Back
                        </button>
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="w-full text-gray-600 py-2 px-4 rounded-lg font-medium hover:text-gray-800 transition-colors duration-200"
                        >
                            Go to Dashboard
                        </button>
                    </div>

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

export default PaymentCancelPage;
