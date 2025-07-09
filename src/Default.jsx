import { Outlet } from "react-router-dom";
import Reveal from "./components/Reveal";
import HelpSection from "./LandingPage/Layout/Helpsection";
import Footer from "./LandingPage/Layout/Footer";
import Navigation from "./LandingPage/Layout/Navigation";

function Default() {
    return (
        <div>
            <Navigation /> {/* Ensure this is the correct component */}
            <Outlet />
            <HelpSection /> {/* Added if it's needed */}
            <Reveal>
                <Footer />
            </Reveal>
        </div>
    );
}

export default Default;
