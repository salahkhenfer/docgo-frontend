import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import FaqElement from "../../components/FaqElement";
import BackgroundImage from "../../../src/assets/three monochrome plastic spheres.png";
import Container from "../../components/Container";
import GeometricShapes from "../../../src/assets/geometric shapes.png";

function FrequentlyAskedQuestions({ faqs }) {
    const { t, i18n } = useTranslation();
    const currentLanguage = i18n.language;

    // Use dynamic FAQs or fallback to static translations
    const displayFAQs =
        faqs && faqs.length > 0
            ? faqs.slice(0, 3) // Display first 3 FAQs
            : [
                  { question: t("faqQuestion1"), answer: t("faqAnswer1") },
                  { question: t("faqQuestion2"), answer: t("faqAnswer2") },
                  { question: t("faqQuestion3"), answer: t("faqAnswer3") },
              ];

    /**
     * Smart language fallback logic for FAQ text
     * Priority:
     * 1. Try selected language (ar, fr, en)
     * 2. If not available, try English as default
     * 3. If not available, try French
     * 4. If not available, try Arabic
     * 5. Finally, try the base field without suffix
     */
    const getFAQText = (faq, field) => {
        // Handle static translations (strings)
        if (typeof faq[field] === "string") return faq[field];

        // Define language priority based on current selection
        let languagePriority = [];

        if (currentLanguage === "ar") {
            languagePriority = [
                `${field}_ar`,
                field,
                `${field}_fr`,
                `${field}_en`,
            ];
        } else if (currentLanguage === "fr") {
            languagePriority = [
                `${field}_fr`,
                field,
                `${field}_en`,
                `${field}_ar`,
            ];
        } else {
            // Default to English
            languagePriority = [
                field,
                `${field}_en`,
                `${field}_fr`,
                `${field}_ar`,
            ];
        }

        // Find first available translation
        for (const langField of languagePriority) {
            if (faq[langField] && faq[langField].trim() !== "") {
                return faq[langField];
            }
        }

        // Final fallback - return empty string
        return "";
    };

    return (
        <div
            id="FAQ"
            style={{
                backgroundImage: `url(${BackgroundImage})`,
                backgroundAttachment: "fixed",
                backgroundPosition: "right",
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain",
            }}
            className="w-full flex justify-center items-center bg-sky-50 mt-10 md:mt-20 relative"
        >
            <Container style="flex flex-col sm-sm:gap-4 bg-sky-50 opacity-95 md:gap-6 p-4 md:p-16 w-full md:w-[90%] lg:w-[80%] xl:w-[70%] max-w-7xl relative z-10">
                <img
                    className="w-full h-full object-contain"
                    src={GeometricShapes}
                    alt={t("geometricShapes")}
                />

                <h1 className="text-xl md:text-2xl text-center font-medium text-customGray">
                    {t("faqTitle")}
                </h1>

                <p className="text-customGray text-center leading-normal font-normal text-sm md:text-base px-4">
                    {t("faqDescription")}
                </p>

                <div className="flex flex-col gap-3 md:gap-6">
                    {displayFAQs.map((faq, index) => (
                        <FaqElement
                            key={faq.id || index}
                            question={getFAQText(faq, "question")}
                            answer={getFAQText(faq, "answer")}
                        />
                    ))}
                </div>
            </Container>
        </div>
    );
}

FrequentlyAskedQuestions.propTypes = {
    faqs: PropTypes.arrayOf(PropTypes.object),
};

export default FrequentlyAskedQuestions;
