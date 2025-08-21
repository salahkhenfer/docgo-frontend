import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../AppContext";
import { FaArrowLeft, FaLock, FaCheckCircle } from "react-icons/fa";
import PaymentMethodSelector from "../components/Payment/PaymentMethodSelector";
import PayPalPayment from "../components/Payment/PayPalPayment";
import CCPPayment from "../components/Payment/CCPPayment";
import MainLoading from "../MainLoading";

const PaymentPage = () => {
    const params = useParams();
    const courseId = params.courseId;
    const programId = params.programId;
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuth, user } = useAppContext();

    const [selectedMethod, setSelectedMethod] = useState("paypal");
    const [loading, setLoading] = useState(false);
    const [itemData, setItemData] = useState(null);
    const [itemType, setItemType] = useState(null); // 'course' or 'program'

    // Get item data from navigation state or determine type from URL
    useEffect(() => {
        if (location.state?.course) {
            setItemData(location.state.course);
            setItemType("course");
        } else if (location.state?.program) {
            setItemData(location.state.program);
            setItemType("program");
        } else if (courseId) {
            setItemType("course");
            // If no course data in state, redirect back to course page
            navigate(`/course/${courseId}`);
        } else if (programId) {
            setItemType("program");
            // If no program data in state, redirect back to program page
            navigate(`/program/${programId}`);
        }
    }, [location.state, courseId, programId, navigate]);

    // Check authentication
    useEffect(() => {
        if (!isAuth || !user) {
            navigate(
                `/login?from=${encodeURIComponent(window.location.pathname)}`
            );
        }
    }, [isAuth, user, navigate]);

    if (!itemData) {
        return <MainLoading />;
    }

    // Extract pricing information based on item type
    const getItemPrice = () => {
        if (itemType === "course") {
            return parseFloat(itemData.discountPrice || itemData.Price);
        } else if (itemType === "program") {
            return parseFloat(
                itemData.price || itemData.scholarshipAmount || 0
            );
        }
        return 0;
    };

    const getOriginalPrice = () => {
        if (itemType === "course") {
            return parseFloat(itemData.Price);
        } else if (itemType === "program") {
            return parseFloat(
                itemData.originalPrice ||
                    itemData.price ||
                    itemData.scholarshipAmount ||
                    0
            );
        }
        return 0;
    };

    const price = getItemPrice();
    const originalPrice = getOriginalPrice();
    const currency = itemData.Currency || itemData.currency || "USD";
    const hasDiscount =
        itemType === "course"
            ? itemData.discountPrice && itemData.discountPrice < itemData.Price
            : itemData.originalPrice &&
              itemData.price &&
              itemData.originalPrice > itemData.price;

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
        // Navigate to success page based on item type
        const successRoute =
            itemType === "course"
                ? `/payment/success/course/${courseId || programId}`
                : `/payment/success/program/${programId || courseId}`;

        navigate(successRoute, {
            state: {
                paymentData,
                item: itemData,
                itemType,
            },
        });
    };

    const handlePaymentError = (error) => {
        console.error("Payment error:", error);
        // Handle payment error with nice animation
        const errorElement = document.createElement('div');
        errorElement.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 ease-in-out z-50';
        errorElement.innerHTML = `
            <div class="flex items-center gap-3">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
            <span class="font-medium">Payment failed. Please try again.</span>
            </div>
        `;
        
        document.body.appendChild(errorElement);
        
        // Animate in
        setTimeout(() => {
            errorElement.style.transform = 'translateX(0)';
        }, 10);
        
        // Animate out after 5 seconds
        setTimeout(() => {
            errorElement.style.transform = 'translateX(full)';
            setTimeout(() => {
            document.body.removeChild(errorElement);
            }, 300);
        }, 5000);
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
                                methods={paymentMethods}
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
