import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import Container from "../../components/Container";
import ContactForm from "../../components/contact/ContactForm";
import contactus from "../../../src/assets/beautiful girl contact us.png";
import { Mail, MessageSquare, Phone } from "lucide-react";

function HelpSection({ contactInfo }) {
    return (
        <section id="contact" className="scroll-mt-20">
            <Container style="w-full max-w-7xl mx-auto p-4 md:p-8 lg:p-12">
                <div className="mb-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Entrer en Contact
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Vous avez des questions ? Notre équipe est là pour vous
                        aider. Envoyez-nous un message et nous vous répondrons
                        dans les plus brefs délais.
                    </p>
                </div>

                <div className="rounded-2xl shadow-xl overflow-hidden bg-white">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                        {/* Left side - Image and Contact Info */}
                        <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 md:p-12 flex flex-col justify-between min-h-[600px]">
                            {/* Contact Information */}
                            <div className="space-y-6 mb-8">
                                <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
                                    faites-nous savoir si vous avez des
                                    questions
                                </h3>

                                {contactInfo?.emails &&
                                    contactInfo.emails.length > 0 && (
                                        <div className="flex items-start space-x-4 text-white">
                                            <div className="bg-blue-500 p-3 rounded-lg">
                                                <Mail className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-semibold mb-1">
                                                    Email
                                                </p>
                                                <a
                                                    href={`mailto:${contactInfo.emails[0].value}`}
                                                    className="text-blue-100 hover:text-white transition-colors"
                                                >
                                                    {
                                                        contactInfo.emails[0]
                                                            .value
                                                    }
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                {contactInfo?.phones &&
                                    contactInfo.phones.length > 0 && (
                                        <div className="flex items-start space-x-4 text-white">
                                            <div className="bg-blue-500 p-3 rounded-lg">
                                                <Phone className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-semibold mb-1">
                                                    Téléphone
                                                </p>
                                                <a
                                                    href={`tel:${contactInfo.phones[0].value}`}
                                                    className="text-blue-100 hover:text-white transition-colors"
                                                >
                                                    {
                                                        contactInfo.phones[0]
                                                            .value
                                                    }
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                <div className="flex items-start space-x-4 text-white">
                                    <div className="bg-blue-500 p-3 rounded-lg">
                                        <MessageSquare className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold mb-1">
                                            Support
                                        </p>
                                        <p className="text-blue-100">
                                            Disponible 7j/7 pour répondre à vos
                                            questions
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Image - Made larger and positioned at bottom */}
                            <div className="mt-auto">
                                <img
                                    src={contactus}
                                    alt="contact us"
                                    className="w-full h-auto max-h-[400px] object-contain rounded-lg"
                                />
                            </div>
                        </div>

                        {/* Right side - Contact Form */}
                        <div className="p-2 md:p-12 bg-gray-50">
                            <ContactForm
                                context="landing"
                                showTitle={false}
                                className="bg-transparent shadow-none p-0"
                            />
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}

HelpSection.propTypes = {
    contactInfo: PropTypes.shape({
        emails: PropTypes.arrayOf(PropTypes.object),
        phones: PropTypes.arrayOf(PropTypes.object),
    }),
};

export default HelpSection;
