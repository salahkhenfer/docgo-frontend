import { useEffect, useState } from "react";
import Logo from "../src/assets/Logo.png";
import "./index.css";
import { Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Footer from "./LandingPage/Layout/Footer";
import Reveal from "./components/Reveal";
import Navigation from "./LandingPage/Layout/Navbar/Navigation";
import visitService from "./services/VisitTrackerService";
import { useAppContext } from "./AppContext";
import MainLoading from "./MainLoading";

function App() {
    const [loading, setLoading] = useState(true);
    const { i18n } = useTranslation();
    const [selectedLanguage, setSelectedLanguage] = useState(
        i18n.language || "fr"
    );
    const location = useLocation();
    const { loading: authLoading } = useAppContext(); // Use auth loading from context

    useEffect(() => {
        // Track page visit whenever location changes
        visitService.registerVisit(location.pathname);

        // Clean up function
        return () => {
            visitService.updateDuration();
        };
    }, [location.pathname]);

    useEffect(() => {
        setLoading(true);

        const fetch_images = () => {
            return new Promise((resolve) => {
                const images = [Logo];
                let loadedCount = 0;

                if (images.length === 0) {
                    resolve();
                    return;
                }

                images.forEach((imageSrc) => {
                    const img = new Image();
                    img.onload = img.onerror = () => {
                        loadedCount++;
                        if (loadedCount === images.length) {
                            resolve();
                        }
                    };
                    img.src = imageSrc;
                });
            });
        };

        const fetch_fonts = () => {
            return new Promise((resolve) => {
                const fontURL =
                    "https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&display=swap";

                const loadFont = (url) => {
                    return new Promise((fontResolve) => {
                        const link = document.createElement("link");
                        link.href = url;
                        link.rel = "stylesheet";
                        link.onload = () => {
                            document.getElementById("root").style.fontFamily =
                                "Rubik";
                            fontResolve();
                        };
                        link.onerror = () => {
                            document.getElementById("root").style.fontFamily =
                                "sans-serif";
                            fontResolve();
                        };
                        document.head.appendChild(link);
                    });
                };

                loadFont(fontURL).then(resolve);
            });
        };

        Promise.all([fetch_images(), fetch_fonts()]).finally(() => {
            setLoading(false);
        });
    }, []);

    // Show loading while assets are loading OR authentication is checking
    if (loading || authLoading) {
        return <MainLoading />;
    }

    return (
        <div>
            <Navigation />
            <Outlet />
            <Reveal>
                <Footer />
            </Reveal>
        </div>
    );
}

export default App;
