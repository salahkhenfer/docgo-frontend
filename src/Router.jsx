import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Default from "./Default";
import ErrorElement from "./erorrhandle/ErrorElement";
import Login from "./Auth/login/Login";
import Register from "./Auth/register/Register";

const Routers = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Default />,
        errorElement: <ErrorElement />,
      },
      {
        path: "/Home",
        // element: <LandingPage />,
        errorElement: <ErrorElement />,
      },
    ],
  },

  {
    path: "login",
    element: <Login />,
  },
  {
    path: "register",
    element: <Register />,
  },
]);

export default Routers;
