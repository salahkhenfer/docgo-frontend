import { useEffect, useState } from "react";
import "./index.css";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "./LandingPage/Layout/Footer";
import Reveal from "./components/Reveal";
import Navigation from "./components/Navbar/Navigation";
import visitService from "./services/VisitTrackerService";
import { useAppContext } from "./AppContext";
import { UserNavigationProvider } from "./context/UserNavigationContext";
import MainLoading from "./MainLoading";
import Seo from "./components/SEO/Seo";
import { useTranslation } from "react-i18next";

function App() {
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    // Auth state + pre-fetched site data (fetched in parallel on startup by AppContext)
    const { loading: authLoading, siteSettings, contactInfo } = useAppContext();
    const { i18n } = useTranslation();

    // Check if we're in auth routes that shouldn't have navbar/footer
    const pathname = location.pathname.toLowerCase();
    const isAuthRoute = ["/login", "/register"].includes(pathname);
    const shouldHideNavAndFooter = isAuthRoute;

    const isProtectedArea =
        pathname.startsWith("/dashboard") ||
        pathname.startsWith("/profile") ||
        pathname.startsWith("/myapplications") ||
        pathname.startsWith("/my-applications") ||
        pathname.startsWith("/notifications") ||
        pathname.startsWith("/payment") ||
        pathname.includes("/watch") ||
        pathname.includes("/videos") ||
        pathname.includes("/resources") ||
        pathname.includes("/certificate");

    const noIndex = isAuthRoute || isProtectedArea;

    const seoLang = (i18n.language || "en").toLowerCase().startsWith("ar")
        ? "ar"
        : "en";
    const seoLocale = seoLang === "ar" ? "ar_DZ" : "en_US";

    // Dynamic brand name — falls back to "DocGo" until site settings load
    const brand = siteSettings?.brandName || "DocGo";

    const seo = (() => {
        if (pathname === "/") {
            return {
                title: "Home",
                description: `${brand}: explore courses and programs, enroll, and learn online.`,
            };
        }

        if (pathname === "/courses") {
            return {
                title: "Courses",
                description: `Browse all available courses on ${brand}.`,
            };
        }

        if (pathname.startsWith("/courses/")) {
            return {
                title: pathname.includes("/watch") ? "Watch Course" : "Course",
                description: `Course details and learning content on ${brand}.`,
            };
        }

        if (pathname === "/programs") {
            return {
                title: "Programs",
                description: `Browse all available programs on ${brand}.`,
            };
        }

        if (pathname.startsWith("/programs/")) {
            return {
                title: "Program",
                description: `Program details and enrollment on ${brand}.`,
            };
        }

        if (pathname === "/faq") {
            return {
                title: "FAQ",
                description: `Frequently asked questions about ${brand}.`,
            };
        }

        if (pathname === "/favorites") {
            return {
                title: "Favorites",
                description: `Your saved courses and programs on ${brand}.`,
            };
        }

        if (pathname === "/login") {
            return {
                title: "Login",
                description: `Login to your ${brand} account.`,
            };
        }

        if (pathname === "/register") {
            return {
                title: "Register",
                description: `Create your ${brand} account.`,
            };
        }

        if (pathname.startsWith("/dashboard")) {
            return {
                title: "Dashboard",
                description: `Your ${brand} dashboard.`,
            };
        }

        return {
            title: brand,
            description: `${brand}: explore courses and programs, enroll, and learn online.`,
        };
    })();

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

        const fetch_Images = () => {
            return new Promise((resolve) => {
                const Images = [];
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
                <Seo
                    title={seo.title}
                    description={seo.description}
                    canonicalPath={location.pathname}
                    noIndex={noIndex}
                    lang={seoLang}
                    locale={seoLocale}
                    siteName={brand}
                />
                {!shouldHideNavAndFooter && (
                    <Navigation branding={siteSettings} />
                )}
                <Outlet />
                {!shouldHideNavAndFooter && (
                    <Reveal>
                        <Footer
                            contactInfo={contactInfo}
                            branding={siteSettings}
                        />
                    </Reveal>
                )}
            </div>
        </UserNavigationProvider>
    );
}

export default App;
