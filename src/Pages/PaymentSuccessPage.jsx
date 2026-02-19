import { useEffect, useState } from "react";
import {
    FaArrowRight,
    FaCheckCircle,
    FaClock,
    FaDownload,
    FaPhone,
    FaEnvelope,
    FaComment,
    FaTimes,
} from "react-icons/fa";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import ContactForm from "../components/contact/ContactForm";
import apiClient from "../services/apiClient";

const PaymentSuccessPage = () => {
    const params = useParams();
    const courseId = params.courseId;
    const programId = params.programId;
    const location = useLocation();
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(10);
    const [adminContact, setAdminContact] = useState({
        phone: null,
        email: null,
    });
    const [showContactModal, setShowContactModal] = useState(false);

    const paymentData = location.state?.paymentData;
    const itemData =
        location.state?.item ||
        location.state?.course ||
        location.state?.program;
    const itemType =
        location.state?.itemType || (courseId ? "course" : "program");

    // Fetch admin contact info from public endpoint
    useEffect(() => {
        const fetchAdminContact = async () => {
            try {
                const res = await apiClient.get("/public/site-settings");
                if (res.data?.settings?.contact) {
                    const c = res.data.settings.contact;
                    setAdminContact({
                        phone: c.phone || c.whatsapp || null,
                        email: c.email || null,
                    });
                }
            } catch {
                // fail silently — contact info is optional
            }
        };
        fetchAdminContact();
    }, []);

    useEffect(() => {
        // Redirect to item if no payment data
        if (!paymentData || !itemData) {
            const redirectPath =
                itemType === "course"
                    ? `/Courses/${courseId}`
                    : `/Programs/${programId}`;
            navigate(redirectPath);
            return;
        }

        // Countdown timer for auto-redirect
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    // Redirect based on item type
                    const redirectPath =
                        itemType === "course"
                            ? `/MyCourses/${courseId}`
                            : `/my-applications`;
                    navigate(redirectPath);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [paymentData, itemData, courseId, programId, itemType, navigate]);

    if (!paymentData || !itemData) {
        return null; // Will redirect
    }

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

                    {/* Item Info */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <h3 className="font-medium text-gray-900 mb-2">
                            {itemType === "course"
                                ? "Course Enrolled"
                                : "Program Applied"}
                        </h3>
                        <div className="flex items-center gap-3">
                            {itemData.Image && (
                                <img
                                    src={itemData.Image}
                                    alt={itemData.Title || itemData.title}
                                    className="w-12 h-12 object-cover rounded"
                                />
                            )}
                            <div className="flex-1 text-left">
                                <h4 className="font-medium text-gray-900">
                                    {itemData.Title || itemData.title}
                                </h4>
                                <p className="text-sm text-gray-600">
                                    {paymentData.amount} DZD
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
                                <span>CCP</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Amount:</span>
                                <span>{paymentData.amount} DZD</span>
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
                        {itemType === "course" ? (
                            paymentData.status === "completed" ? (
                                <>
                                    <Link
                                        to={`/MyCourses/${courseId}`}
                                        className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                                    >
                                        <span className="flex items-center justify-center gap-2">
                                            <span>Start Learning</span>
                                            <FaArrowRight />
                                        </span>
                                    </Link>

                                    <div className="text-sm text-gray-500">
                                        Auto-redirecting in {countdown}{" "}
                                        seconds...
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to={`/Courses/${courseId}`}
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
                            )
                        ) : (
                            <>
                                <Link
                                    to="/my-applications"
                                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        <span>View My Applications</span>
                                        <FaArrowRight />
                                    </span>
                                </Link>
                                <div className="text-sm text-gray-500">
                                    Auto-redirecting in {countdown} seconds...
                                </div>
                            </>
                        )}

                        <Link
                            to={
                                itemType === "course" ? "/courses" : "/programs"
                            }
                            className="block w-full text-gray-600 hover:text-gray-800 py-2 transition-colors duration-200"
                        >
                            {itemType === "course"
                                ? "Browse More Courses"
                                : "Browse More Programs"}
                        </Link>
                    </div>

                    {/* Support Info */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-500 mb-3">
                            Besoin d'aide ? Contactez notre équipe de support :
                        </p>
                        <div className="space-y-2">
                            {adminContact.phone && (
                                <a
                                    href={`tel:${adminContact.phone}`}
                                    className="flex items-center justify-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition-colors"
                                >
                                    <FaPhone className="text-green-500" />
                                    {adminContact.phone}
                                </a>
                            )}
                            {adminContact.email && (
                                <a
                                    href={`mailto:${adminContact.email}`}
                                    className="flex items-center justify-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition-colors"
                                >
                                    <FaEnvelope className="text-blue-500" />
                                    {adminContact.email}
                                </a>
                            )}
                            {!adminContact.phone && !adminContact.email && (
                                <a
                                    href="mailto:support@docgo.com"
                                    className="flex items-center justify-center gap-2 text-sm text-blue-600 hover:underline"
                                >
                                    <FaEnvelope />
                                    support@docgo.com
                                </a>
                            )}
                        </div>
                        <button
                            onClick={() => setShowContactModal(true)}
                            className="mt-3 flex items-center justify-center gap-2 w-full text-sm text-white bg-gray-700 hover:bg-gray-800 py-2.5 px-4 rounded-lg transition-colors"
                        >
                            <FaComment />
                            Envoyer un message de support
                        </button>
                    </div>
                </div>
            </div>

            {/* Contact Support Modal */}
            {showContactModal && (
                <div
                    className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
                    onClick={() => setShowContactModal(false)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Contacter le support
                            </h3>
                            <button
                                onClick={() => setShowContactModal(false)}
                                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500"
                            >
                                <FaTimes />
                            </button>
                        </div>
                        <div className="px-6 pb-6 pt-4">
                            <p className="text-sm text-gray-500 mb-4">
                                {itemType === "course"
                                    ? "Votre message sera marqué comme support paiement pour le cours."
                                    : "Votre message sera marqué comme support paiement pour le programme."}
                            </p>
                            <ContactForm
                                context="payment"
                                courseId={courseId ? parseInt(courseId) : null}
                                programId={
                                    programId ? parseInt(programId) : null
                                }
                                showTitle={false}
                                onSuccess={() => setShowContactModal(false)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentSuccessPage;
