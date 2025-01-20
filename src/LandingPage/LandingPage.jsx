import Reveal from "../components/Reveal";
import AboutUsSection from "./Layout/AboutUsSection";
import CoursesSection from "./Layout/CoursesSection";
import Footer from "./Layout/Footer";
import FrequentlyAskedQuestions from "./Layout/FrequentlyAskedQuestions";
import Helpsection from "./Layout/Helpsection";
import HereoSection from "./Layout/HereoSection";
import Navigation from "./Layout/Navigation";
import OurServices from "./Layout/OurServices";
import ProgrammePage from "./Layout/ProgrammePage";
import ProgramSearch from "./Layout/ProgramSearch";

import StudySection from "./Layout/StudySection";
import WhatToDoSection from "./Layout/WhatToDoSection";

function LandingPage() {
  return (
    <div>
      <Navigation />

      <Reveal>
        <HereoSection />
      </Reveal>

      <Reveal>
        <WhatToDoSection />
      </Reveal>
      <Reveal>
        <AboutUsSection />
      </Reveal>
      <Reveal>
        <OurServices />
      </Reveal>
      <Reveal>
        <CoursesSection />
      </Reveal>
      <Reveal>
        <FrequentlyAskedQuestions />
      </Reveal>
      <Reveal>
        <Helpsection />
        <Footer />
      </Reveal>
      {/*  <ProgramSearch /> */}
    </div>
  );
}

export default LandingPage;
