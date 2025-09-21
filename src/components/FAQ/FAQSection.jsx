import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useAppContext } from "../../AppContext";
import RichTextDisplay from "../Common/RichTextDisplay";

import apiClient from "../../services/apiClient";
import { useTranslation } from "react-i18next";

const FAQSection = ({ type = "home", courseId = null, programId = null }) => {
    const { t, i18n } = useTranslation();

    const { user, isAuth } = useAppContext();
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [openItems, setOpenItems] = useState({});
    const [selectedCategory, setSelectedCategory] = useState("");
    const [voteStates, setVoteStates] = useState({}); // Track vote states for each FAQ
    const [votingInProgress, setVotingInProgress] = useState({}); // Track voting progress

    useEffect(() => {
        fetchFAQs();
    }, [type, courseId, programId]);

    // Fetch vote statuses for authenticated users
    useEffect(() => {
        if (isAuth && faqs.length > 0) {
            checkVoteStatuses();
        }
    }, [isAuth, faqs]);

    const fetchFAQs = useCallback(async () => {
        try {
            setLoading(true);
            let url = `/faqs/public/${type}`;
            const params = new URLSearchParams();

            if (courseId) params.append("courseId", courseId);
            if (programId) params.append("programId", programId);

            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const response = await apiClient.get(url);
            if (response.data.success) {
                setFaqs(response.data.faqs);
            }
        } catch (error) {
            console.error("Error fetching FAQs:", error);
            setError("Failed to load FAQs");
        } finally {
            setLoading(false);
        }
    }, [type, courseId, programId]);

    const checkVoteStatuses = useCallback(async () => {
        if (!isAuth) return;

        try {
            const votePromises = faqs.map(async (faq) => {
                try {
                    const response = await apiClient.get(
                        `/faqs/${faq.id}/vote-status`
                    );
                    return {
                        faqId: faq.id,
                        hasVoted: response.data.hasVoted,
                        voteType: response.data.voteType,
                    };
                } catch (error) {
                    // If there's an error (like 401 for unauthenticated), return false
                    return {
                        faqId: faq.id,
                        hasVoted: false,
                        voteType: null,
                    };
                }
            });

            const voteResults = await Promise.all(votePromises);
            const newVoteStates = {};
            voteResults.forEach((result) => {
                newVoteStates[result.faqId] = {
                    hasVoted: result.hasVoted,
                    voteType: result.voteType,
                };
            });
            setVoteStates(newVoteStates);
        } catch (error) {
            console.error("Error checking vote statuses:", error);
        }
    }, [isAuth, faqs]);

    const toggleFAQ = (id) => {
        setOpenItems((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const markAsHelpful = async (faqId) => {
        if (!isAuth) {
            alert(t("faq.pleaseLoginToVote"));
            return;
        }

        // Check if already voted
        if (voteStates[faqId]?.hasVoted) {
            alert(t("faq.alreadyVoted"));
            return;
        }

        // Check if voting is in progress
        if (votingInProgress[faqId]) {
            return;
        }

        try {
            // Set voting in progress
            setVotingInProgress((prev) => ({ ...prev, [faqId]: true }));

            const response = await apiClient.post(`/faqs/${faqId}/helpful`);

            if (response.data.success) {
                // Update the local state to reflect the change
                setFaqs((prev) =>
                    prev.map((faq) =>
                        faq.id === faqId
                            ? {
                                  ...faq,
                                  helpfulCount: response.data.helpfulCount,
                              }
                            : faq
                    )
                );

                // Update vote state
                setVoteStates((prev) => ({
                    ...prev,
                    [faqId]: {
                        hasVoted: true,
                        voteType: "helpful",
                    },
                }));
            }
        } catch (error) {
            console.error("Error marking FAQ as helpful:", error);

            if (error.response?.status === 401) {
                alert(t("faq.pleaseLoginToVote"));
            } else if (
                error.response?.status === 400 &&
                error.response?.data?.alreadyVoted
            ) {
                alert(t("faq.alreadyVoted"));
                // Update local state to reflect that user has voted
                setVoteStates((prev) => ({
                    ...prev,
                    [faqId]: {
                        hasVoted: true,
                        voteType: "helpful",
                    },
                }));
            } else {
                alert(t("faq.failedToVote"));
            }
        } finally {
            // Clear voting in progress
            setVotingInProgress((prev) => ({ ...prev, [faqId]: false }));
        }
    };

    // Get unique categories with localized names
    const categories = [
        ...new Set(
            faqs
                .map((faq) => {
                    if (i18n.language === "ar" && faq.category_ar) {
                        return faq.category_ar;
                    } else if (i18n.language === "fr" && faq.category_fr) {
                        return faq.category_fr;
                    } else {
                        return faq.category;
                    }
                })
                .filter(Boolean)
        ),
    ];

    // Filter FAQs by selected category
    const filteredFaqs = selectedCategory
        ? faqs.filter((faq) => {
              const faqCategory =
                  i18n.language === "ar" && faq.category_ar
                      ? faq.category_ar
                      : i18n.language === "fr" && faq.category_fr
                      ? faq.category_fr
                      : faq.category;
              return faqCategory === selectedCategory;
          })
        : faqs;

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="border border-gray-200 rounded-lg p-4"
                            >
                                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="text-center text-red-600">
                    <svg
                        className="mx-auto h-12 w-12 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (faqs.length == 0) {
        return (
            <div className="bg-white rounded-lg shadow-lg p-6">
                {/* <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {t("faq_title")}
                </h2> */}
                <div className="text-center text-gray-500">
                    <svg
                        className="mx-auto h-12 w-12 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <p>{t("no_faq_now")}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {t("faq_title")}
            </h2>

            {/* Category Filter */}
            {categories.length > 0 && (
                <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedCategory("")}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                selectedCategory === ""
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            {t("faq.all")}
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                    selectedCategory === category
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* FAQ List */}
            <div className="space-y-4">
                {filteredFaqs.map((faq) => (
                    <div
                        key={faq.id}
                        className="border border-gray-200 rounded-lg"
                    >
                        <button
                            onClick={() => toggleFAQ(faq.id)}
                            className="w-full text-left p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                        >
                            <div className="flex justify-between items-center">
                                <div className="text-lg font-medium text-gray-900 pr-4 flex-1">
                                    <RichTextDisplay
                                        content={
                                            i18n.language === "ar" &&
                                            faq.question_ar
                                                ? faq.question_ar
                                                : i18n.language === "fr" &&
                                                  faq.question_fr
                                                ? faq.question_fr
                                                : faq.question
                                        }
                                        className="text-gray-900"
                                    />
                                </div>
                                <svg
                                    className={`w-5 h-5 text-gray-500 transform transition-transform ${
                                        openItems[faq.id] ? "rotate-180" : ""
                                    }`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </div>
                            {faq.category && (
                                <div className="inline-block mt-2">
                                    <RichTextDisplay
                                        content={
                                            i18n.language === "ar" &&
                                            faq.category_ar
                                                ? faq.category_ar
                                                : i18n.language === "fr" &&
                                                  faq.category_fr
                                                ? faq.category_fr
                                                : faq.category
                                        }
                                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded inline-block"
                                    />
                                </div>
                            )}
                        </button>

                        {openItems[faq.id] && (
                            <div className="px-4 pb-4">
                                <RichTextDisplay
                                    content={
                                        i18n.language === "ar" && faq.answer_ar
                                            ? faq.answer_ar
                                            : i18n.language === "fr" &&
                                              faq.answer_fr
                                            ? faq.answer_fr
                                            : faq.answer
                                    }
                                    className="text-gray-700 mb-4"
                                />

                                {/* Helpful Button */}
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-500">
                                        {faq.helpfulCount > 0 && (
                                            <span>
                                                {faq.helpfulCount}{" "}
                                                {t("faq.peopleFoundHelpful")}
                                            </span>
                                        )}
                                    </div>

                                    {isAuth ? (
                                        <button
                                            onClick={() =>
                                                markAsHelpful(faq.id)
                                            }
                                            disabled={
                                                voteStates[faq.id]?.hasVoted ||
                                                votingInProgress[faq.id]
                                            }
                                            className={`text-sm flex items-center gap-1 transition-colors ${
                                                voteStates[faq.id]?.hasVoted
                                                    ? "text-green-600 cursor-not-allowed"
                                                    : votingInProgress[faq.id]
                                                    ? "text-gray-400 cursor-not-allowed"
                                                    : "text-blue-600 hover:text-blue-800"
                                            }`}
                                        >
                                            <svg
                                                className={`w-4 h-4 ${
                                                    voteStates[faq.id]?.hasVoted
                                                        ? "fill-green-600"
                                                        : ""
                                                }`}
                                                fill={
                                                    voteStates[faq.id]?.hasVoted
                                                        ? "currentColor"
                                                        : "none"
                                                }
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V9a2 2 0 00-2-2H4.5a1.5 1.5 0 000 3h2a2 2 0 012 2v.5m7-10V7a2 2 0 00-2-2H9M7 20v-2c0-.554.446-1 1-1h3.5a1.5 1.5 0 001.5-1.5v-.5m-7 3.5V20"
                                                />
                                            </svg>
                                            {voteStates[faq.id]?.hasVoted
                                                ? t("faq.voted")
                                                : votingInProgress[faq.id]
                                                ? t("faq.voting")
                                                : t("faq.helpful")}
                                        </button>
                                    ) : (
                                        <span className="text-sm text-gray-400 flex items-center gap-1">
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V9a2 2 0 00-2-2H4.5a1.5 1.5 0 000 3h2a2 2 0 012 2v.5m7-10V7a2 2 0 00-2-2H9M7 20v-2c0-.554.446-1 1-1h3.5a1.5 1.5 0 001.5-1.5v-.5m-7 3.5V20"
                                                />
                                            </svg>
                                            {t("faq.loginToVote")}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

FAQSection.propTypes = {
    type: PropTypes.string,
    courseId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    programId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
};

export default FAQSection;
