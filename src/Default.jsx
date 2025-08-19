import { Outlet } from "react-router-dom";
import Reveal from "./components/Reveal";
import HelpSection from "./LandingPage/Layout/Helpsection";
import Footer from "./LandingPage/Layout/Footer";
import Navigation from "./LandingPage/Layout/Navbar/Navigation";
import { useAppContext } from "./AppContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
function Default() {
    const { user } = useAppContext();
    const navigate = useNavigate();
    useEffect(() => {
        if (user) {
            navigate("/dashboard");
        }
    }, [user]);
    return (
        <div>
            {/* <Navigation />  */}
            <Outlet />
            {/* <HelpSection />
            <Reveal>
                <Footer />
            </Reveal> */}
        </div>
    );
}

export default Default;
