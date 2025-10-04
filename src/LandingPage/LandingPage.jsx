import { useState, useEffect } from "react";
import Reveal from "../components/Reveal";
import AboutUsSection from "./Layout/AboutUsSection";
import CoursesSection from "./Layout/CoursesSection";
import FrequentlyAskedQuestions from "./Layout/FrequentlyAskedQuestions";
import HelpSection from "./Layout/Helpsection";
import HereoSection from "./Layout/HereoSection";
import OurServices from "./Layout/OurServices";
import FeaturedPrograms from "../components/Programs/FeaturedPrograms";
import WhatToDoSection from "./Layout/WhatToDoSection";
import homeService from "../services/homeService";
import MainLoading from "../MainLoading";

function LandingPage() {
    const [homeData, setHomeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchHomeData();
    }, []);

    const fetchHomeData = async () => {
        try {
            setLoading(true);
            const response = await homeService.getHomePageData();
            if (response.success) {
                setHomeData(response.data);
            }
        } catch (err) {
            console.error("Error loading home page data:", err);
            setError("Failed to load page data");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <MainLoading />;
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">
                        Error Loading Page
                    </h2>
                    <p className="text-gray-600">{error}</p>
                    <button
                        onClick={fetchHomeData}
                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Reveal>
                <HereoSection statistics={homeData?.statistics} />
            </Reveal>
            <Reveal>
                <WhatToDoSection />
            </Reveal>
            <Reveal>
                <AboutUsSection />
            </Reveal>
            <Reveal>
                <OurServices statistics={homeData?.statistics} />
            </Reveal>
            <Reveal>
                <CoursesSection
                    featuredCourses={homeData?.featuredCourses}
                    latestCourses={homeData?.latestCourses}
                />
            </Reveal>
            <Reveal>
                <FeaturedPrograms
                    limit={3}
                    featuredPrograms={homeData?.featuredPrograms}
                    latestPrograms={homeData?.latestPrograms}
                />
            </Reveal>
            {/* Only show FAQ section if there are FAQs from the server */}
            {homeData?.faqs && homeData.faqs.length > 0 && (
                <Reveal>
                    <FrequentlyAskedQuestions faqs={homeData.faqs} />
                </Reveal>
            )}
            <Reveal>
                <HelpSection contactInfo={homeData?.contactInfo} />
            </Reveal>
        </div>
    );
}

export default LandingPage;
