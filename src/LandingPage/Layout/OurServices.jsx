import { useTranslation } from "react-i18next";
import Container from "../../components/Container";
import Service from "../../components/Service";
import { Link } from "react-router-dom";
import Knwoledge1 from "../../assets/Knwoledge 1 (1) 1.png";
import Knwoledge2 from "../../assets/Knowledge 2 1.png";

function OurServices() {
    const { t } = useTranslation();

    return (
        <div className="relative w-full py-16 md:py-24 overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Animated Gradient Orbs */}
                <div className="absolute top-20 right-1/4 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full filter blur-3xl animate-blob"></div>
                <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-indigo-400/15 to-purple-400/15 rounded-full filter blur-3xl animate-pulse"></div>
                
                {/* Decorative Shapes */}
                <div className="absolute top-1/4 left-10 w-20 h-20 border-4 border-purple-300/30 rounded-lg rotate-12 animate-float"></div>
                <div className="absolute bottom-1/3 right-16 w-16 h-16 border-4 border-pink-300/30 rounded-full animate-float animation-delay-3000"></div>
            </div>

            <Container
                id={"ourServices"}
                style={
                    "relative z-10 flex flex-col gap-12 md:gap-16 items-center px-6 md:px-12 lg:px-20 max-w-7xl mx-auto"
                }
            >
                {/* Enhanced Title */}
                <div className="text-center space-y-4">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 leading-tight">
                        {t("OurServices")}
                    </h1>
                    <div className="h-1.5 w-40 mx-auto bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"></div>
                    <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
                        {t("ServicesSubtitle") || "Discover our comprehensive services designed to help you achieve your educational goals"}
                    </p>
                </div>

                <div className="flex items-stretch justify-center gap-8 md:gap-12 flex-col md:flex-row w-full">
                <Service
                    url={Knwoledge1}
                    h1={t("GuidanceForStudyingAbroad")}
                    h3={t("StudyingAbroadChangesPerspective")}
                    p={t("GuidanceDescription")}
                    btn={t("SignUpAndDiscover")}
                    to="/Programs"
                />

                <Service
                    url={Knwoledge2}
                    h1={t("OnlineCourses")}
                    h3={t("LearnAnything")}
                    p={t("OnlineCoursesDescription")}
                    btn={t("DiscoverAllCourses")}
                    to="/AllCourses"
                />
            </div>
        </Container>
        </div>
    );
}

export default OurServices;
