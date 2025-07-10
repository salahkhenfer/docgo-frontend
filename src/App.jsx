import { useEffect, useState } from "react";
import Logo from "../src/assets/Logo.png";
import "./index.css";
import { Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import HelpSection from "./LandingPage/Layout/Helpsection";
import Footer from "./LandingPage/Layout/Footer";
import Reveal from "./components/Reveal";
import Navigation from "./LandingPage/Layout/Navbar/Navigation";
import visitService from "./services/VisitTrackerService";
import { useAppContext } from "./AppContext";
import MainLoading from "./MainLoading";
import axios from "axios";
function App() {
    const [loading, setLoading] = useState(true);
    const { i18n } = useTranslation();
    const [selectedLanguage, setSelectedLanguage] = useState(
        i18n.language || "fr"
    );
    const location = useLocation();
    const { user, set_user, set_Auth } = useAppContext();
    useEffect(() => {
        console.log("Current data:", user);
    }, [user]);

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
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3000/Check_Auth",
                    {
                        withCredentials: true,
                        validateStatus: () => true,
                    }
                );
                console.log("Response from Check_Auth:", response);
                
                if (response.status == 200) {
                    set_Auth(true);
                    set_user(response.data.user);
                } else {
                    set_Auth(false);
                }
            } catch (error) {
                set_Auth(false);
            }
            // Uncomment the following lines if you wanna test the authentication flow
            // finally {
            //     set_Auth(true);
            //     set_user(true);
            // }
        };
        const fetch_images = () => {
            return new Promise((resolve, reject) => {
                const images = [Logo];

                images.forEach((imageSrc) => {
                    const img = new Image();
                    img.onload = () => {
                        resolve();
                    };
                    img.onerror = () => {
                        resolve();
                    };
                    img.src = imageSrc;
                });
            });
        };

        const fetch_fonts = () => {
            return new Promise((resolve, reject) => {
                const fontURL =
                    "https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&display=swap";

                const loadFont = (url) => {
                    return new Promise((resolve, reject) => {
                        const link = document.createElement("link");
                        link.href = url;
                        link.rel = "stylesheet";
                        link.onload = () => {
                            resolve();
                        };
                        link.onerror = () => {
                            document.getElementById("root").style.fontFamily =
                                "sans-serif";
                            resolve();
                        };
                        document.head.appendChild(link);
                        document.getElementById("root").style.fontFamily =
                            "Rubik";
                    });
                };

                // Load the Rubik font
                loadFont(fontURL)
                    .then(resolve)
                    .catch(() => {
                        document.getElementById("root").style.fontFamily =
                            "sans-serif";
                        resolve();
                    });
            });
        };

        Promise.all([fetchData(), fetch_fonts(), fetch_images()]).finally(
            () => {
                setLoading(false);
            }
        );
    }, []);
    if (loading) {
        return (
            // <div className=" w-screen h-screen flex flex-col items-center justify-center">
            //     <img src={Logo} alt="Logo" className=" w-32 mb-1 " />
            //     <span className="loader"></span>
            // </div>
            <MainLoading />
        );
    } else
        return (
            <div>
                {" "}
                <Navigation /> {/* Ensure this is the correct component */}
                <Outlet />
                <Reveal>
                    <Footer />
                </Reveal>
            </div>
        );
}

export default App;
