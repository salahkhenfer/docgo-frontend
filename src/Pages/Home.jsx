import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../AppContext";
import LandingPage from "../LandingPage/LandingPage";

const Home = () => {
    const { isAuth, user } = useAppContext();
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect authenticated users to dashboard
        if (isAuth && user) {
            navigate("/dashboard");
        }
    }, [isAuth, user, navigate]);

    // Show LandingPage for guests, redirect will handle authenticated users
    return <LandingPage />;
};

export default Home;
