import AboutUsSection from "./Layout/AboutUsSection";
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
    </div>
  );
}

export default LendingPage;
