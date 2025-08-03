import Reveal from "../components/Reveal";
import AboutUsSection from "./Layout/AboutUsSection";
import CoursesSection from "./Layout/CoursesSection";
import FrequentlyAskedQuestions from "./Layout/FrequentlyAskedQuestions";
import HelpSection from "./Layout/Helpsection";
import HereoSection from "./Layout/HereoSection";
import OurServices from "./Layout/OurServices";
import FeaturedPrograms from "../components/Programs/FeaturedPrograms";

import WhatToDoSection from "./Layout/WhatToDoSection";

function LandingPage() {
    return (
        <div>
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
                <FeaturedPrograms limit={3} />
            </Reveal>
            <Reveal>
                <FrequentlyAskedQuestions />
            </Reveal>
            <Reveal>
                <HelpSection />
            </Reveal>
        </div>
    );
}

export default LandingPage;
