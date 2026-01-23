import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import Container from "../../components/Container";
import ContactForm from "../../components/contact/ContactForm";
import contactus from "../../../src/assets/beautiful girl contact us.png";
import { Mail, MessageSquare, Phone, Sparkles } from "lucide-react";

function HelpSection({ contactInfo }) {
    return (
        <section id="contact" className="scroll-mt-20 relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-16 md:py-24">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Gradient Orbs */}
                <div className="absolute top-10 left-10 w-96 h-96 bg-blue-400/20 rounded-full filter blur-3xl animate-blob"></div>
                <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-400/20 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-purple-400/15 rounded-full filter blur-3xl animate-pulse"></div>
                
                {/* Floating Shapes */}
                <div className="absolute top-20 right-1/4 w-16 h-16 border-4 border-blue-300/30 rounded-lg rotate-45 animate-float"></div>
                <div className="absolute bottom-32 left-1/4 w-12 h-12 border-4 border-indigo-300/30 rounded-full animate-float animation-delay-3000"></div>
            </div>

            <Container style="relative z-10 w-full max-w-7xl mx-auto p-4 md:p-8 lg:p-12">
                <div className="mb-12 text-center space-y-4">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Sparkles className="w-6 h-6 text-blue-500 animate-pulse" />
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                            Entrer en Contact
                        </h2>
                        <Sparkles className="w-6 h-6 text-purple-500 animate-pulse animation-delay-2000" />
                    </div>
                    <div className="h-1.5 w-48 mx-auto bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full mb-6"></div>
                    <p className="text-base md:text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
                        Vous avez des questions ? Notre équipe est là pour vous
                        aider. Envoyez-nous un message et nous vous répondrons
                        dans les plus brefs délais.
                    </p>
                </div>

                <div className="rounded-3xl shadow-2xl overflow-hidden bg-white border border-gray-100 hover:shadow-3xl transition-shadow duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                        {/* Left side - Image and Contact Info */}
                        <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-8 md:p-12 flex flex-col justify-between min-h-[600px] overflow-hidden">
                            {/* Decorative Elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full filter blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full filter blur-2xl"></div>
                            
                            {/* Contact Information */}
                            <div className="relative z-10 space-y-6 mb-8">
                                <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 leading-tight">
                                    faites-nous savoir si vous avez des
                                    questions
                                </h3>

                                {contactInfo?.emails &&
                                    contactInfo.emails.length > 0 && (
                                        <div className="group flex items-start space-x-4 text-white bg-white/10 backdrop-blur-sm p-4 rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:translate-x-2">
                                            <div className="bg-gradient-to-br from-blue-400 to-indigo-500 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                                <Mail className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-semibold mb-1 text-blue-100">
                                                    Email
                                                </p>
                                                <a
                                                    href={`mailto:${contactInfo.emails[0].value}`}
                                                    className="text-white hover:text-blue-200 transition-colors font-medium"
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
                                        <div className="group flex items-start space-x-4 text-white bg-white/10 backdrop-blur-sm p-4 rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:translate-x-2">
                                            <div className="bg-gradient-to-br from-indigo-400 to-purple-500 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                                <Phone className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-semibold mb-1 text-blue-100">
                                                    Téléphone
                                                </p>
                                                <a
                                                    href={`tel:${contactInfo.phones[0].value}`}
                                                    className="text-white hover:text-blue-200 transition-colors font-medium"
                                                >
                                                    {
                                                        contactInfo.phones[0]
                                                            .value
                                                    }
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                <div className="group flex items-start space-x-4 text-white bg-white/10 backdrop-blur-sm p-4 rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:translate-x-2">
                                    <div className="bg-gradient-to-br from-purple-400 to-pink-500 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <MessageSquare className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold mb-1 text-blue-100">
                                            Support
                                        </p>
                                        <p className="text-white/90">
                                            Disponible 7j/7 pour répondre à vos
                                            questions
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Image - Enhanced */}
                            <div className="relative z-10 mt-auto">
                                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10 rounded-lg"></div>
                                <img
                                    src={contactus}
                                    alt="contact us"
                                    className="w-full h-auto max-h-[400px] object-contain rounded-lg transform hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        </div>

                        {/* Right side - Contact Form */}
                        <div className="relative p-8 md:p-12 bg-gradient-to-br from-gray-50 to-blue-50">
                            {/* Decorative corner gradient */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-transparent rounded-bl-full"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-indigo-400/10 to-transparent rounded-tr-full"></div>
                            
                            <div className="relative z-10">
                                <ContactForm
                                    context="landing"
                                    showTitle={false}
                                    className="bg-transparent shadow-none p-0"
                                />
                            </div>
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
