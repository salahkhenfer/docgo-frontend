import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Routers from "./Router.jsx";

import MainLoading from "./MainLoading.jsx";
import { RouterProvider } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Suspense fallback={<MainLoading />}>
      <RouterProvider router={Routers} />
    </Suspense>
  </StrictMode>
);
