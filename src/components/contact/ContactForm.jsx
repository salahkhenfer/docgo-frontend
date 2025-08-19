import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../../AppContext";
import apiClient from "../../services/apiClient";
import { RichTextEditor } from "../Common/RichTextEditor";
import PropTypes from "prop-types";

const ContactForm = ({
    context = "landing",
    courseId = null,
    programId = null,
    title = null,
    className = "",
    showTitle = true,
    onSuccess = null,
}) => {
    const { t, i18n } = useTranslation();
    const { user } = useAppContext();
    const [formData, setFormData] = useState({
        name: user ? `${user.firstName} ${user.lastName}` : "",
        email: user?.email || "",
        message: "",
        priority: "medium",
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const isRTL = i18n.language === "ar";

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const payload = {
                name: formData.name,
                email: formData.email,
                message: formData.message,
                context,
                priority: formData.priority,
            };

            // For authenticated users with rich text, also send plain text version
            if (user && formData.message.includes("<")) {
                payload.messageHtml = formData.message;
                payload.messagePlain = formData.message
                    .replace(/<[^>]*>/g, "")
                    .trim();
            }

            if (context === "course" && courseId) {
                payload.courseId = courseId;
            }
            if (context === "program" && programId) {
                payload.programId = programId;
            }
            console.log("Payload for contact form:", payload);

            const response = await apiClient.post("/contact", payload);
            console.log("Response from contact form:", response.data);

            setSuccess(true);
            setFormData({
                name: user ? `${user.firstName} ${user.lastName}` : "",
                email: user?.email || "",
                message: "",
                priority: "medium",
            });

            // Call onSuccess callback if provided
            if (onSuccess) {
                onSuccess();
            }

            // Hide success message after 5 seconds
            setTimeout(() => setSuccess(false), 5000);
        } catch (error) {
            console.error("Error sending contact message:", error);
            setError(
                error.response?.data?.message ||
                    t(
                        "contact.errorSending",
                        "Failed to send message. Please try again."
                    )
            );
        } finally {
            setLoading(false);
        }
    };

    const getContextTitle = () => {
        switch (context) {
            case "course":
                return (
                    title ||
                    t("contact.courseHelp", "Need help with this course?")
                );
            case "program":
                return (
                    title ||
                    t(
                        "contact.programHelp",
                        "Have questions about this program?"
                    )
                );
            case "dashboard":
                return title || t("contact.generalSupport", "Contact Support");
            default:
                return title || t("contact.getInTouch", "Get in Touch");
        }
    };

    const getContextSubtitle = () => {
        switch (context) {
            case "course":
                return t(
                    "contact.courseSubtitle",
                    "Ask about course content, prerequisites, or any other questions you have."
                );
            case "program":
                return t(
                    "contact.programSubtitle",
                    "Get answers about program requirements, application process, or scholarships."
                );
            case "dashboard":
                return t(
                    "contact.dashboardSubtitle",
                    "Our support team is here to help you with any questions or issues."
                );
            default:
                return t(
                    "contact.landingSubtitle",
                    "We'd love to hear from you. Send us a message and we'll respond as soon as possible."
                );
        }
    };

    if (success) {
        return (
            <div
                className={`bg-transparent rounded-lg shadow-sm p-6 ${className}`}
            >
                <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                            className="w-8 h-8 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {t("contact.messageSent", "Message Sent Successfully!")}
                    </h3>
                    <p className="text-gray-600 mb-4">
                        {t(
                            "contact.thankYou",
                            "Thank you for your message. We'll get back to you as soon as possible."
                        )}
                    </p>
                    <button
                        onClick={() => setSuccess(false)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                        {t("contact.sendAnother", "Send Another Message")}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`bg-transparent rounded-lg shadow-sm p-6 ${className}`}
            dir={isRTL ? "rtl" : "ltr"}
        >
            {showTitle && (
                <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {getContextTitle()}
                    </h3>
                    <p className="text-gray-600">{getContextSubtitle()}</p>
                </div>
            )}

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            {t("contact.name", "Full Name")}{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder={t(
                                "contact.namePlaceholder",
                                "Enter your full name"
                            )}
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            {t("contact.email", "Email Address")}{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder={t(
                                "contact.emailPlaceholder",
                                "Enter your email address"
                            )}
                            disabled={loading}
                        />
                    </div>
                </div>

                {(context === "dashboard" ||
                    context === "course" ||
                    context === "program") && (
                    <div>
                        <label
                            htmlFor="priority"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            {t("contact.priority", "Priority")}
                        </label>
                        <select
                            id="priority"
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={loading}
                        >
                            <option value="low">
                                {t("contact.priorityLow", "Low")}
                            </option>
                            <option value="medium">
                                {t("contact.priorityMedium", "Medium")}
                            </option>
                            <option value="high">
                                {t("contact.priorityHigh", "High")}
                            </option>
                            <option value="urgent">
                                {t("contact.priorityUrgent", "Urgent")}
                            </option>
                        </select>
                    </div>
                )}

                <div>
                    <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        {t("contact.message", "Your Message")}{" "}
                        <span className="text-red-500">*</span>
                    </label>

                    {user ? (
                        // Rich Text Editor for authenticated users
                        <div className="rich-text-contact-wrapper">
                            <RichTextEditor
                                value={formData.message}
                                onChange={(value) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        message: value,
                                    }))
                                }
                                placeholder={t(
                                    "contact.messagePlaceholder",
                                    "Please describe your question or issue in detail..."
                                )}
                                height="150px"
                                className="contact-rich-editor"
                                disabled={loading}
                            />
                            <style>{`
                                .rich-text-contact-wrapper .ql-editor {
                                    min-height: 120px;
                                    font-size: 14px;
                                }
                                .rich-text-contact-wrapper .ql-container {
                                    border-bottom-left-radius: 8px;
                                    border-bottom-right-radius: 8px;
                                }
                                .rich-text-contact-wrapper .ql-toolbar {
                                    border-top-left-radius: 8px;
                                    border-top-right-radius: 8px;
                                    border-color: #d1d5db;
                                }
                                .rich-text-contact-wrapper .ql-container {
                                    border-color: #d1d5db;
                                }
                                .rich-text-contact-wrapper .ql-editor:focus {
                                    outline: 2px solid #3b82f6;
                                    outline-offset: -2px;
                                }
                                .contact-rich-editor.disabled .ql-toolbar {
                                    opacity: 0.5;
                                    pointer-events: none;
                                }
                                .contact-rich-editor.disabled .ql-editor {
                                    background-color: #f9fafb;
                                    color: #6b7280;
                                    cursor: not-allowed;
                                }
                            `}</style>
                        </div>
                    ) : (
                        // Regular textarea for guests
                        <textarea
                            id="message"
                            name="message"
                            required
                            rows={5}
                            value={formData.message}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            placeholder={t(
                                "contact.messagePlaceholder",
                                "Please describe your question or issue in detail..."
                            )}
                            disabled={loading}
                        />
                    )}

                    <div className="flex justify-between items-center mt-1">
                        <p className="text-xs text-gray-500">
                            {user ? (
                                // For rich text, we need to strip HTML to count characters
                                <>
                                    {
                                        formData.message.replace(/<[^>]*>/g, "")
                                            .length
                                    }
                                    /1000{" "}
                                    {t("contact.characters", "characters")}
                                </>
                            ) : (
                                // For regular text
                                <>
                                    {formData.message.length}/1000{" "}
                                    {t("contact.characters", "characters")}
                                </>
                            )}
                        </p>
                        {user && (
                            <p className="text-xs text-blue-600">
                                {t(
                                    "contact.richTextEnabled",
                                    "Rich text formatting available"
                                )}
                            </p>
                        )}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={
                        loading ||
                        !formData.name ||
                        !formData.email ||
                        !formData.message ||
                        (user &&
                            formData.message.replace(/<[^>]*>/g, "").trim()
                                .length === 0)
                    }
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? (
                        <div className="flex items-center justify-center">
                            <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            {t("contact.sending", "Sending...")}
                        </div>
                    ) : (
                        t("contact.sendMessage", "Send Message")
                    )}
                </button>
            </form>

            {context === "landing" && (
                <div className="mt-4 text-center text-sm text-gray-500">
                    <p>
                        {t(
                            "contact.responseTime",
                            "We typically respond within 24 hours"
                        )}
                    </p>
                </div>
            )}
        </div>
    );
};

ContactForm.propTypes = {
    context: PropTypes.oneOf(["landing", "dashboard", "course", "program"]),
    courseId: PropTypes.number,
    programId: PropTypes.number,
    title: PropTypes.string,
    className: PropTypes.string,
    showTitle: PropTypes.bool,
};

export default ContactForm;
