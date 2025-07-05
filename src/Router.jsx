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

import AllContentVideosCourse from "./components/course/courseVideosContent/AllContentVideosCourse";
import QuizContent from "./Pages/QuizContent";
import CourseVideosContent from "./components/course/courseVideosContent/CourseVideosContent";
import Course from "./Pages/Course";
import { CourseDetails } from "./components/course/CourseDetails";
import Certificate from "./Pages/Certificate";

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
        path: "CourseDetails/:courseId",
        element: <Course />,
        children: [
          {
            index: true, // Default route for CourseDetails
            element: <CourseDetails />, // Render CourseDetails component by default
          },

          {
            path: "videos",
            element: <AllContentVideosCourse />,
            children: [
              {
                index: true,
                element: <CourseVideosContent />, // default if no video selected
              },
              {
                path: ":videoId", // ✅ match video ID from URL
                element: <CourseVideosContent />, // reuse same component with ID
              },
              {
                path: "quiz",
                element: <QuizContent />,
              },
              {
                path: "Certificate",
                element: <Certificate />,
              },
            ],
          },
        ],
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
