import { useEffect, useState } from "react";
import Logo from "../src/assets/Logo.png";
import "./index.css";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "./LandingPage/Layout/Footer";
import Reveal from "./components/Reveal";
import Navigation from "./components/Navbar/Navigation";
import visitService from "./services/VisitTrackerService";
import homeService from "./services/homeService";
import { useAppContext } from "./AppContext";
import { UserNavigationProvider } from "./context/UserNavigationContext";
import MainLoading from "./MainLoading";

function App() {
    const [loading, setLoading] = useState(true);
    const [contactInfo, setContactInfo] = useState(null);
    const location = useLocation();
    const { loading: authLoading } = useAppContext(); // Use auth loading from context

    // Check if we're in auth routes that shouldn't have navbar/footer
    const isAuthRoute = ["/login", "/register"].includes(location.pathname);
    const shouldHideNavAndFooter = isAuthRoute;

    useEffect(() => {
        // Track page visit whenever location changes
        visitService.registerVisit(location.pathname);

        // Clean up function
        return () => {
            visitService.updateDuration();
        };
    }, [location.pathname]);

    useEffect(() => {
        // Fetch contact info for footer
        const fetchContactInfo = async () => {
            try {
                const response = await homeService.getHomePageData();
                if (response.success) {
                    setContactInfo(response.data.contactInfo);
                }
            } catch (error) {
                console.error("Error fetching contact info:", error);
            }
        };

        fetchContactInfo();
    }, []);

    useEffect(() => {
        setLoading(true);

        const fetch_Images = () => {
            return new Promise((resolve) => {
                const Images = [Logo];
                let loadedCount = 0;

                if (Images.length === 0) {
                    resolve();
                    return;
                }

                Images.forEach((ImageSrc) => {
                    const img = new Image();
                    img.onload = img.onerror = () => {
                        loadedCount++;
                        if (loadedCount === Images.length) {
                            resolve();
                        }
                    };
                    img.src = ImageSrc;
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

        Promise.all([fetch_Images(), fetch_fonts()]).finally(() => {
            setLoading(false);
        });
    }, []);

    // Show loading while assets are loading OR authentication is checking
    if (loading || authLoading) {
        return <MainLoading />;
    }

    return (
        <UserNavigationProvider>
            <div className="relative">
                {!shouldHideNavAndFooter && <Navigation />}
                <Outlet />
                {!shouldHideNavAndFooter && (
                    <Reveal>
                        <Footer contactInfo={contactInfo} />
                    </Reveal>
                )}
            </div>
        </UserNavigationProvider>
    );
}

export default App;
