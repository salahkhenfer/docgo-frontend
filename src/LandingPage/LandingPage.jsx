import { useEffect, useState } from "react";
import FeaturedPrograms from "../components/Programs/FeaturedPrograms";
import Reveal from "../components/Reveal";
import MainLoading from "../MainLoading";
import homeService from "../services/homeService";
import AboutUsSection from "./Layout/AboutUsSection";
import CoursesSection from "./Layout/CoursesSection";
import FrequentlyAskedQuestions from "./Layout/FrequentlyAskedQuestions";
import HelpSection from "./Layout/Helpsection";
import HereoSection from "./Layout/HereoSection";
import OurServices from "./Layout/OurServices";
import WhatToDoSection from "./Layout/WhatToDoSection";

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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Gradient Orbs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-3000"></div>

        {/* Floating Shapes */}
        <div className="absolute top-1/4 left-1/4 w-16 h-16 border-4 border-blue-400/20 rounded-lg rotate-45 animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-12 h-12 border-4 border-purple-400/20 rounded-full animate-float animation-delay-2000"></div>
        <div className="absolute top-1/2 right-1/3 w-8 h-8 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-lg animate-float animation-delay-4000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-20 h-20 border-4 border-indigo-400/20 rounded-full animate-float animation-delay-3000"></div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

        {/* Gradient Mesh */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-blue-400/10 to-transparent rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-purple-400/10 to-transparent rounded-full filter blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
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
    </div>
  );
}

export default LandingPage;
