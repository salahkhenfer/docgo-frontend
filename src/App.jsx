import { useEffect, useState } from "react";

import Logo from "../src/assets/Logo.png";

import "./index.css";

import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
const LanguageFontWrapper = ({ children }) => {
  const { i18n } = useTranslation();

  const getFontClass = () => {
    switch (i18n.language) {
      case "ar":
        return "font-readex";
      case "fr":
        return "font-poppins";
      default:
        return "font-roboto";
    }
  };

  return (
    <div
      className={`${getFontClass()} ${i18n.language === "ar" ? "rtl" : "ltr"}`}
    >
      {children}
    </div>
  );
};
function App() {
  const [setLoading] = useState(true);
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
          "https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap";
        const loadFont = (url) => {
          return new Promise((resolve, reject) => {
            const link = document.createElement("link");
            link.href = url;
            link.rel = "stylesheet";
            link.onload = () => {
              resolve(); // Resolve promise when font is loaded
            };
            link.onerror = () => {
              document.getElementById("root").style.fontFamily = "sans-serif";
              resolve(); // Resolve even if font fails to load
            };
            document.head.appendChild(link);
            document.getElementById("root").style.fontFamily = "Poppins";
          });
        };

        // Load the font
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

  return <LanguageFontWrapper>{<Outlet />}</LanguageFontWrapper>;
}

export default App;
