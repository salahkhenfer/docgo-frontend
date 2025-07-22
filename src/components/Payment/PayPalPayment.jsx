import { useState } from "react";
import { FaCreditCard, FaSpinner } from "react-icons/fa";

const PayPalPayment = ({
    courseData,
    amount,
    currency,
    onSuccess,
    onError,
    loading,
    setLoading,
}) => {
    const [paymentForm, setPaymentForm] = useState({
        email: "",
        confirmEmail: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPaymentForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePayPalPayment = async (e) => {
        e.preventDefault();

        if (paymentForm.email !== paymentForm.confirmEmail) {
            alert("Email addresses do not match");
            return;
        }

        setLoading(true);

        try {
            // Simulate PayPal payment process
            console.log("Processing PayPal payment...", {
                courseId: courseData.id,
                amount,
                currency,
                email: paymentForm.email,
            });

            // Here you would integrate with your backend PayPal API
            // For now, we'll simulate the process
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // Simulate successful payment
            const paymentResult = {
                paymentId: "PAYPAL_" + Date.now(),
                method: "paypal",
                amount,
                currency,
                status: "completed",
                courseId: courseData.id,
                email: paymentForm.email,
            };

            onSuccess(paymentResult);
        } catch (error) {
            console.error("PayPal payment error:", error);
            onError(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <FaCreditCard className="text-blue-600 text-xl" />
                <h3 className="text-lg font-medium text-gray-900">
                    PayPal Payment
                </h3>
            </div>

            <form onSubmit={handlePayPalPayment} className="space-y-4">
                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Email Address *
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={paymentForm.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your email address"
                    />
                </div>

                <div>
                    <label
                        htmlFor="confirmEmail"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        Confirm Email Address *
                    </label>
                    <input
                        type="email"
                        id="confirmEmail"
                        name="confirmEmail"
                        value={paymentForm.confirmEmail}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Confirm your email address"
                    />
                </div>

                {/* PayPal Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">
                        Payment Information
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>
                            • You will be redirected to PayPal to complete your
                            payment
                        </li>
                        <li>• PayPal provides secure payment processing</li>
                        <li>
                            • You can pay with your PayPal account or credit
                            card
                        </li>
                        <li>
                            • Access to the course will be granted immediately
                            after payment
                        </li>
                    </ul>
                </div>

                {/* Payment Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">
                            Total Amount:
                        </span>
                        <span className="font-bold text-xl text-blue-600">
                            {amount} {currency}
                        </span>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={
                        loading ||
                        !paymentForm.email ||
                        !paymentForm.confirmEmail
                    }
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <FaSpinner className="animate-spin" />
                            <span>Processing Payment...</span>
                        </>
                    ) : (
                        <>
                            <span>Continue to PayPal</span>
                        </>
                    )}
                </button>
            </form>

            {/* Security Notice */}
            <div className="text-xs text-gray-500 text-center">
                <p>🔒 Your payment information is encrypted and secure</p>
            </div>
        </div>
    );
};

export default PayPalPayment;
