import { useState, useEffect, useMemo } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../AppContext";
import { FaArrowLeft, FaLock, FaCheckCircle } from "react-icons/fa";
import PaymentMethodSelector from "../components/Payment/PaymentMethodSelector";
import PayPalPayment from "../components/Payment/PayPalPayment";
import CCPPayment from "../components/Payment/CCPPayment";
import MainLoading from "../MainLoading";
import PaymentAPI from "../API/PaymentInfo";
import { PaymentAPI as ActualPaymentAPI } from "../API/Payment";
import { clientCoursesAPI } from "../API/Courses";
import { clientProgramsAPI } from "../API/Programs";
import paypalIcon from "../assets/paypal.png";
import ccpIcon from "../assets/ccp.png";
import Swal from "sweetalert2";
const PaymentPage = () => {
    const params = useParams();
    const courseId = params.courseId;
    const programId = params.programId;
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuth, user } = useAppContext();

    const [selectedMethod, setSelectedMethod] = useState("ccp");
    const [loading, setLoading] = useState(false);
    const [itemData, setItemData] = useState(null);
    const [itemType, setItemType] = useState(null); // 'course' or 'program'
    const [itemLoading, setItemLoading] = useState(false);
    const [paymentConfig, setPaymentConfig] = useState(null);
    const [configLoading, setConfigLoading] = useState(true);
    const [error, setError] = useState(false);
    const [filteredMethods, setFilteredMethods] = useState([]);
    

    // Fetch payment configuration
    useEffect(() => {
        const fetchPaymentConfig = async () => {
            try {
                setConfigLoading(true);
                const response = await PaymentAPI.getPaymentInfo();
                if (response.success) {
                    setPaymentConfig(response.data);

                    // Set default payment method based on what's available
                    if (response.data.paypal.available) {
                        setSelectedMethod("paypal");
                    } else if (response.data.ccp.available) {
                        setSelectedMethod("ccp");
                    }
                }
            } catch (error) {
                console.error("Error fetching payment config:", error);
                // Use fallback configuration
                setPaymentConfig({
                    paypal: { enabled: false, available: false },
                    ccp: { enabled: false, available: false },
                    general: {
                        defaultCurrency: "DZD",
                        supportedCurrencies: ["USD", "DZD", "EUR"],
                    },
                });
                setError(
                    "Failed to fetch payment configuration , please try later or contact the support team"
                );
            } finally {
                setConfigLoading(false);
            }
        };

        fetchPaymentConfig();
    }, []);

    // Get item data from navigation state or fetch from API
    useEffect(() => {
        const fetchItemData = async () => {
            try {
                setItemLoading(true);

                if (courseId) {
                    setItemType("course");

                    // Fetch course data from API
                    const response = await clientCoursesAPI.getCourseDetails(
                        courseId
                    );

                    if (response.success && response.data) {
                        setItemData(response.data.course || response.data);
                    } else {
                        console.error("Failed to fetch course data:", response);
                        navigate(`/Courses/${courseId}`);
                        return;
                    }
                } else if (programId) {
                    setItemType("program");

                    // Fetch program data from API
                    const response = await clientProgramsAPI.getProgramDetails(
                        programId
                    );
                    if (response.success && response.data) {
                        setItemData(response.data.program || response.data);
                    } else {
                        console.error(
                            "Failed to fetch program data:",
                            response
                        );
                        navigate(`/Programs/${programId}`);
                        return;
                    }
                } else {
                    // No valid data or ID, redirect to home
                    navigate("/");
                }
            } catch (error) {
                console.error("Error fetching item data:", error);
                const currentItemType = courseId
                    ? "course"
                    : programId
                    ? "program"
                    : "item";
                setError(
                    `Failed to fetch ${currentItemType} data. Please try again.`
                );
            } finally {
                setItemLoading(false);
            }
        };

        fetchItemData();
    }, [location.state, courseId, programId, navigate]);

    // Check authentication
    useEffect(() => {
        if (!isAuth || !user) {
            navigate(
                `/login?from=${encodeURIComponent(window.location.pathname)}`
            );
        }
    }, [isAuth, user, navigate]);

    // Cleanup payment on page unload (when user navigates away or refreshes)
    useEffect(() => {
        const handleBeforeUnload = () => {
            // Only cleanup if we're in the middle of a CCP payment process
            if (loading && selectedMethod === "ccp" && itemData?.id) {
                try {
                    // Send cleanup request - this will be sent even if page is closing
                    navigator.sendBeacon(
                        `/api/upload/Payment/${
                            itemType === "course" ? "Courses" : "Programs"
                        }/${itemData.id}`,
                        JSON.stringify({ method: "DELETE" })
                    );
                } catch (error) {
                    console.warn("Cleanup on unload failed:", error);
                }
            }
        };

        // Add event listener for page unload
        window.addEventListener("beforeunload", handleBeforeUnload);

        // Cleanup function to remove event listener
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [loading, selectedMethod, itemData, itemType]);

    // Extract pricing information based on item type
    const getItemPrice = () => {
        if (!itemData) return 0;

        if (itemType === "course") {
            const discountPrice = parseFloat(itemData.discountPrice || 0);
            const regularPrice = parseFloat(itemData.Price || 0);
            return discountPrice > 0 ? discountPrice : regularPrice;
        } else if (itemType === "program") {
            const price = parseFloat(itemData.price || 0);
            const scholarshipAmount = parseFloat(
                itemData.scholarshipAmount || 0
            );
            return price > 0 ? price : scholarshipAmount;
        }
        return 0;
    };

    const getOriginalPrice = () => {
        if (!itemData) return 0;

        // if (itemType === "course") {
        return parseFloat(itemData.Price || 0);
        // } else if (itemType === "program") {
        //     const originalPrice = parseFloat(itemData.originalPrice || 0);
        //     const price = parseFloat(itemData.price || 0);
        //     const scholarshipAmount = parseFloat(
        //         itemData.scholarshipAmount || 0
        //     );
        //     return originalPrice > 0
        //         ? originalPrice
        //         : price > 0
        //         ? price
        //         : scholarshipAmount;
        // }
        //     return 0;
    };

    const price = getItemPrice();
    const originalPrice = getOriginalPrice();

    // Improved currency handling with proper fallbacks
    const getCurrency = () => {
        // Try to get currency from item data
        if (itemData?.Currency) return itemData.Currency;
        if (itemData?.currency) return itemData.currency;

        // Try to get from payment config
        if (paymentConfig?.general?.defaultCurrency) {
            return paymentConfig.general.defaultCurrency;
        }

        // Default fallback based on item type and location
        if (itemType === "course") {
            return "USD"; // Most courses are in USD
        } else if (itemType === "program") {
            return "DZD"; // Most programs are in DZD (Algeria)
        }

        return "DZD"; // Final fallback
    };

    const currency = getCurrency();

    const hasDiscount = null;
    // itemData.discountPrice && itemData.discountPrice < itemData.Price;
    // itemType === "course"
    //     ? itemData.discountPrice && itemData.discountPrice < itemData.Price
    //     : itemData.originalPrice &&
    //       itemData.price &&
    //       itemData.originalPrice > itemData.price;

    const getItemTitle = () => {
        if (itemType === "course") {
            return itemData.Title;
        } else if (itemType === "program") {
            return itemData.Title || itemData.title;
        }
        return "Unknown Item";
    };

    const getItemImage = () => {
        return itemData.Image || itemData.image;
    };

    const getItemLevel = () => {
        if (itemType === "course") {
            return `${itemData.Level} • ${itemData.language}`;
        } else if (itemType === "program") {
            return `${itemData.Category || itemData.category || "Program"} • ${
                itemData.language || "Multiple"
            }`;
        }
        return "";
    };

    const paymentMethods = useMemo(() => {
        if (!paymentConfig) return [];

        return [
            {
                id: "paypal",
                name: "PayPal",
                description: "Pay securely with PayPal",
                detailedInstructions: paymentConfig.paypal?.instructions,
                icon: paypalIcon,
                available: paymentConfig.paypal?.available,
                enabled: paymentConfig.paypal?.enabled,
                isEnabled: paymentConfig.paypal?.isEnabled,
            },
            {
                id: "ccp",
                name: "Algeria CCP",
                description: "Pay with Algeria CCP transfer",
                detailedInstructions: paymentConfig.ccp?.instructions,
                icon: ccpIcon,
                available: paymentConfig.ccp?.available,
                enabled: paymentConfig.ccp?.enabled,
                isEnabled: paymentConfig.ccp?.isEnabled,
            },
        ];
    }, [paymentConfig]);

    // Filter and update available payment methods when config changes
    useEffect(() => {
        if (!paymentConfig) {
            setFilteredMethods([]);
            return;
        }

        const availableMethods = paymentMethods.filter((method) => {
            // Check if method is both enabled and available
            const isEnabled = method.enabled && method.isEnabled !== false;
            const isAvailable = method.available;

            return isEnabled && isAvailable;
        });

        setFilteredMethods(availableMethods);

        // Set default payment method if none selected or current selection is not available
        if (availableMethods.length > 0) {
            const currentMethodAvailable = availableMethods.some(
                (method) => method.id === selectedMethod
            );

            if (!currentMethodAvailable) {
                // Set to first available method
                setSelectedMethod(availableMethods[0].id);
            }
        }
    }, [paymentConfig, paymentMethods, selectedMethod]);

    const handleGoBack = () => {
        navigate(-1);
    };

    const handlePaymentSuccess = (paymentData) => {

        let successMessage = "Payment Successful!";
        let redirectMessage = "Redirecting to your dashboard...";

        if (paymentData.method === "ccp") {
            successMessage = "Payment Submitted!";
            redirectMessage =
                "Your CCP payment has been submitted for verification. You will be notified once it's approved.";
        } else if (paymentData.method === "paypal") {
            successMessage = "Payment Successful!";
            redirectMessage =
                "Your PayPal payment has been processed. Your application is pending admin approval.";
        }

        Swal.fire({
            title: successMessage,
            text: redirectMessage,
            icon: "success",
            timer: paymentData.method === "ccp" ? 5000 : 3000,
            timerProgressBar: true,
            showConfirmButton: true,
            confirmButtonText: "Go to Dashboard",
            allowOutsideClick: false,
            allowEscapeKey: false,
        }).then((result) => {
            // Navigate to dashboard
            if (
                result.isConfirmed ||
                result.dismiss === Swal.DismissReason.timer
            ) {
                if (itemType === "course") {
                    navigate("/dashboard/MyCourses");
                } else {
                    navigate("/dashboard/MyPrograms");
                }
            }
        });
    };

    const handlePaymentError = async (error) => {
        console.error("Payment error:", error);

        // If this was a CCP payment error, try to cleanup any uploaded file
        if (selectedMethod === "ccp" && itemData?.id) {
            try {
                const { PaymentAPI } = await import("../API/Payment");
                await PaymentAPI.cleanupCCPPayment({
                    itemType,
                    itemId: itemData.id,
                });
            } catch (cleanupError) {
                console.warn(
                    "Payment cleanup failed (may be normal):",
                    cleanupError.message
                );
            }
        }

        let errorTitle = "Payment Failed!";
        let errorMessage =
            "Unable to process your payment. Please check your details and try again.";

        if (error.message) {
            errorMessage = error.message;
        }

        if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
        }

        Swal.fire({
            title: errorTitle,
            text: errorMessage,
            icon: "error",
            showConfirmButton: true,
            confirmButtonText: "Try Again",
            confirmButtonColor: "#ef4444",
            showCancelButton: true,
            cancelButtonText: "Go Back",
            cancelButtonColor: "#6b7280",
            allowOutsideClick: true,
            allowEscapeKey: true,
        }).then((result) => {
            if (result.isConfirmed) {
                // User wants to try again - stay on the page
                setLoading(false);
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                // User wants to go back
                navigate(-1);
            }
        });
    };

    if (!itemData || configLoading || itemLoading) {
        return <MainLoading />;
    } else if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
                <div className="max-w-lg mx-auto">
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-red-100">
                        {/* Error Icon */}
                        <div className="w-20 h-20 bg-gradient-to-r from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <svg
                                className="w-10 h-10 text-red-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>

                        {/* Error Title */}
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">
                            Payment Page Unavailable
                        </h2>

                        {/* Error Description */}
                        <p className="text-gray-600 mb-2 leading-relaxed">
                            We&apos;re experiencing technical difficulties
                            loading the payment page.
                        </p>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            Please try again later or contact our support team
                            for assistance.
                        </p>

                        {/* Error Details (if available) */}
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
                                onClick={() => window.location.reload()}
                                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={handleGoBack}
                                className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 border border-gray-200"
                            >
                                Go Back
                            </button>
                        </div>

                        {/* Support Contact */}
                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <p className="text-sm text-gray-500">
                                Need help? Contact our support team on the
                                footer of this page
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
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
                            <span>
                                Back to{" "}
                                {itemType === "course" ? "Course" : "Program"}
                            </span>
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
                                    methods={filteredMethods}
                                    selectedMethod={selectedMethod}
                                    onMethodChange={setSelectedMethod}
                                />

                                <div className="mt-8">
                                    {selectedMethod === "paypal" && (
                                        <PayPalPayment
                                            itemData={itemData}
                                            itemType={itemType}
                                            amount={price}
                                            currency={currency}
                                            paymentConfig={
                                                paymentConfig?.paypal
                                            }
                                            onSuccess={handlePaymentSuccess}
                                            onError={handlePaymentError}
                                            loading={loading}
                                            setLoading={setLoading}
                                        />
                                    )}

                                    {selectedMethod === "ccp" && (
                                        <CCPPayment
                                            itemData={itemData}
                                            itemType={itemType}
                                            amount={price}
                                            currency={currency}
                                            paymentConfig={paymentConfig?.ccp}
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

                                {/* Item Info */}
                                <div className="mb-6">
                                    <div className="flex items-start gap-3">
                                        {getItemImage() && (
                                            <img
                                                src={getItemImage()}
                                                alt={getItemTitle()}
                                                className="w-16 h-16 object-cover rounded-lg"
                                            />
                                        )}
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900 line-clamp-2">
                                                {getItemTitle()}
                                            </h4>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {getItemLevel()}
                                            </p>
                                            <p className="text-xs text-blue-600 mt-1 capitalize">
                                                {itemType}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Pricing */}
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">
                                            {itemType === "course"
                                                ? "Course Price"
                                                : "Program Fee"}
                                        </span>
                                        {/* <span
                                        className={
                                            hasDiscount
                                                ? "line-through text-gray-400"
                                                : "font-medium"
                                        }
                                    >
                                        {originalPrice} {currency}
                                    </span> */}
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
                                        <span>
                                            Secure SSL encrypted payment
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaCheckCircle className="text-green-500" />
                                        <span>
                                            Instant access after payment
                                        </span>
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
    }
};

export default PaymentPage;
