import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Default from "./Default";
import ErrorElement from "./erorrhandle/ErrorElement";
import Login from "./Auth/login/Login";
import Register from "./Auth/register/Register";
import LandingPage from "./LandingPage/LandingPage";
import { SearchProgram } from "./Pages/SearchProgram";
import { ProgramDetails } from "./Pages/ProgramDetailes";
import MyApplications from "./Pages/MyApplications";
import AllCourses from "./Pages/AllCourses";
import CourseDetails from "./Pages/CourseDetails";
import AllContentVideosCourse from "./components/course/courseVideosContent/AllContentVideosCourse";

const Routers = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorElement />, // Error handling applied to the main layout
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "searchProgram",
        element: <SearchProgram />,
      },
      {
        path: "searchProgram/:programId", // Ensure consistency in URL param casing
        element: <ProgramDetails />,
      },
      {
        path: "MyApplications", // Ensure consistency in URL param casing
        element: <MyApplications />,
      },
      {
        path: "AllCourses", // Ensure consistency in URL param casing
        element: <AllCourses />,
      },
      {
        path: "CourseDetails", // Ensure consistency in URL param casing
        element: <CourseDetails />,
      },

      {
        path: "CourseDetails/AllContentVideosCourse", // ✅ fixed (no leading slash)
        element: <AllContentVideosCourse />,
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
