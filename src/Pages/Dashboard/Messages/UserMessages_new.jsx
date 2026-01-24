import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeftIcon,
    PaperAirplaneIcon,
    ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import { useAppContext } from "../../../AppContext";
import ContactForm from "../../../components/contact/ContactForm";
import Swal from "sweetalert2";

function UserMessages_new() {
    const { t, i18n } = useTranslation();
    const { user } = useAppContext();
    const navigate = useNavigate();

    const isRTL = i18n.language === "ar";

    const handleSuccess = () => {
        // Navigate back to messages list after successful submission
        Swal.fire({
            title: t(
                "alerts.messages.sentTitle",
                t("messages.sent", "Message Sent"),
            ),
            text: t(
                "alerts.messages.sentText",
                t(
                    "messages.sentText",
                    "Your message has been sent successfully.",
                ),
            ),
            icon: "success",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
        }).then(() => {
            navigate("/dashboard/messages");
        });
    };

    const handleCancel = () => {
        navigate("/dashboard/messages");
    };

    return (
        <div className={`min-h-screen p-6 ${isRTL ? "rtl" : "ltr"}`}>
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <button
                            onClick={handleCancel}
                            className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                            title={t("common.back", "Back")}
                        >
                            <ArrowLeftIcon className="h-5 w-5" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                                <PaperAirplaneIcon className="h-7 w-7 text-blue-600 mr-3" />
                                {t("messages.newMessage", "New Message")}
                            </h1>
                            <p className="mt-1 text-gray-600">
                                {t(
                                    "messages.newMessageSubtitle",
                                    "Send a message to our support team",
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* New Message Form */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="mb-6">
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                        <ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-500 mr-2" />
                        <span>
                            {t(
                                "messages.contactSupport",
                                "Contact our support team for assistance",
                            )}
                        </span>
                    </div>

                    {user && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <h3 className="text-sm font-medium text-blue-900 mb-2">
                                {t("messages.yourInfo", "Your Information")}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-blue-700 font-medium">
                                        {t("profile.name", "Name")}:
                                    </span>
                                    <span className="text-blue-900 ml-1">
                                        {user.firstName || user.FirstName}{" "}
                                        {user.lastName || user.LastName}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-blue-700 font-medium">
                                        {t("profile.email", "Email")}:
                                    </span>
                                    <span className="text-blue-900 ml-1">
                                        {user.email || user.Email}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <ContactForm
                    context="dashboard"
                    title=""
                    showTitle={false}
                    onSuccess={handleSuccess}
                    className="max-w-none"
                />

                {/* Help Section */}
                <div className="mt-8 border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        {t("messages.helpTitle", "How can we help?")}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">
                                {t("messages.technical", "Technical Support")}
                            </h4>
                            <p className="text-sm text-gray-600">
                                {t(
                                    "messages.technicalDesc",
                                    "Issues with courses, videos, or platform functionality",
                                )}
                            </p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">
                                {t("messages.billing", "Billing & Payments")}
                            </h4>
                            <p className="text-sm text-gray-600">
                                {t(
                                    "messages.billingDesc",
                                    "Questions about payments, refunds, or subscriptions",
                                )}
                            </p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">
                                {t("messages.account", "Account Management")}
                            </h4>
                            <p className="text-sm text-gray-600">
                                {t(
                                    "messages.accountDesc",
                                    "Profile settings, password reset, or account issues",
                                )}
                            </p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">
                                {t("messages.general", "General Inquiry")}
                            </h4>
                            <p className="text-sm text-gray-600">
                                {t(
                                    "messages.generalDesc",
                                    "Other questions or feedback about our services",
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Response Time Info */}
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg
                                className="h-5 w-5 text-yellow-600"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-800">
                                <strong>
                                    {t(
                                        "messages.responseTime",
                                        "Response Time",
                                    )}
                                    :
                                </strong>{" "}
                                {t(
                                    "messages.responseTimeDesc",
                                    "We typically respond within 24 hours during business days.",
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserMessages_new;
