import { useTranslation } from "react-i18next";
import Container from "../../components/Container";
import ContactForm from "../../components/contact/ContactForm";
import contactus from "../../../src/assets/beautiful girl contact us.png";

function HelpSection() {
    const { t } = useTranslation();

    return (
        <Container style="w-full max-w-7xl mx-auto p-4 md:p-8 lg:p-12">
            <div className="rounded-2xl shadow-lg overflow-hidden">
                <div className="flex flex-col items-center lg:flex-row bg-[#F4F4F5] backdrop-blur-[400px]">
                    <img
                        src={contactus}
                        alt="contact us"
                        className="lg:max-w-[500px] lg:max-h-[500px] sm:max-w-[400px] sm-sm:max-h-[350px] w-[500px] object-cover"
                    />

                    <div className="w-full lg:w-1/2 p-6 md:p-8 lg:p-12">
                        <div className="mb-6">
                            <p className="text-lg md:text-xl text-customGray font-medium">
                                {t("anyQuestions")}
                            </p>
                            <h1 className="text-xl md:text-xl lg:text-2xl text-customGray font-medium">
                                {t("loveToHelp")}
                            </h1>
                        </div>

                        <ContactForm
                            context="landing"
                            showTitle={false}
                            className="bg-transparent shadow-none p-0"
                        />
                    </div>
                </div>
            </div>
        </Container>
    );
}

export default HelpSection;
