import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Reveal from "./components/Reveal";
import HelpSection from "./LandingPage/Layout/Helpsection";
import Footer from "./LandingPage/Layout/Footer";
import Navigation from "./LandingPage/Layout/Navigation";

function Default() {
  // Uncomment and replace with actual authentication logic when needed.
  // const { isAuth, userType } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    // Example of authentication-based redirection
    // if (!isAuth || !userType) {
    //   navigate("/Home");
    // } else if (userType === "teacher") {
    //   navigate("/Teacher");
    // } else if (userType === "student") {
    //   navigate("/Student");
    // } else {
    //   navigate("/Home");
    // }
  }, [navigate]); // Added `navigate` to dependencies

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
