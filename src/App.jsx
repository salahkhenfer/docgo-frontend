import { useEffect, useState } from "react";
import Logo from "../src/assets/Logo.png";
import "./index.css";
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import HelpSection from "./LandingPage/Layout/Helpsection";
import Footer from "./LandingPage/Layout/Footer";
import Reveal from "./components/Reveal";
import Navigation from "./LandingPage/Layout/Navigation";

function App() {
  const [setLoading] = useState(true);
  const { i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(
    i18n.language || "fr"
  );

  useEffect(() => {
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
              document.getElementById("root").style.fontFamily = "sans-serif";
              resolve();
            };
            document.head.appendChild(link);
            document.getElementById("root").style.fontFamily = "Rubik";
          });
        };

        // Load the Rubik font
        loadFont(fontURL)
          .then(resolve)
          .catch(() => {
            document.getElementById("root").style.fontFamily = "sans-serif";
            resolve();
          });
      });
    };

    Promise.all([fetch_fonts(), fetch_images()])
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

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
