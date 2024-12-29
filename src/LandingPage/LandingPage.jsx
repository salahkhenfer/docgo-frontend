import AboutUsSection from "./Layout/AboutUsSection";
import CoursesSection from "./Layout/CoursesSection";
import Footer from "./Layout/Footer";
import FrequentlyAskedQuestions from "./Layout/FrequentlyAskedQuestions";
import Helpsection from "./Layout/Helpsection";
import HereoSection from "./Layout/HereoSection";
import Navigation from "./Layout/Navigation";
import OurServices from "./Layout/OurServices";
import StudySection from "./Layout/StudySection";
import WhatToDoSection from "./Layout/WhatToDoSection";

function LendingPage() {
  return (
    <div>
      <Navigation />
      <HereoSection />
      <StudySection />
      <WhatToDoSection />
      <AboutUsSection />
      <OurServices />
      <CoursesSection />
      <FrequentlyAskedQuestions />
      <Helpsection />
      <Footer />
    </div>
  );
}

export default LendingPage;
