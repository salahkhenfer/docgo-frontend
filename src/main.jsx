import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Routers from "./Router.jsx";
import MainLoading from "./MainLoading.jsx";
import { RouterProvider } from "react-router-dom";

import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { HeroUIProvider } from "@heroui/react";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <HeroUIProvider>
        <Suspense fallback={<MainLoading />}>
          <RouterProvider router={Routers} />
        </Suspense>
      </HeroUIProvider>
    </I18nextProvider>
  </StrictMode>
);
