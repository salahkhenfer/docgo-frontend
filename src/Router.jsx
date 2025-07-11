import { createBrowserRouter, ScrollRestoration } from "react-router-dom";
import App from "./App";

import ErrorElement from "./erorrhandle/ErrorElement";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
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
import Profile from "./Pages/Profile";
import NotificationsPage from "./Pages/NotificationsPage";

const Routers = createBrowserRouter([
    {
        path: "/",
        element: (
            <>
                <App />,
                <ScrollRestoration />
            </>
        ),

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
                path: "Notifications", // Ensure consistency in URL param casing
                element: <NotificationsPage />, // Assuming you have a NotificationsPage component
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
            {
                path: "Profile",
                element: <Profile />,
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
