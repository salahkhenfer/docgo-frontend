import { createBrowserRouter, ScrollRestoration } from "react-router-dom";
import App from "./App";
import ProtectedRoute from "./components/ProtectedRoute";

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
                <App />
                <ScrollRestoration />
            </>
        ),
        errorElement: <ErrorElement />,
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
                path: "searchProgram/:programId",
                element: <ProgramDetails />,
            },
            // Protected routes that require authentication
            {
                path: "MyApplications",
                element: (
                    <ProtectedRoute>
                        <MyApplications />
                    </ProtectedRoute>
                ),
            },
            {
                path: "AllCourses",
                element: <AllCourses />,
            },
            {
                path: "Notifications",
                element: (
                    <ProtectedRoute>
                        <NotificationsPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "CourseDetails/:courseId",
                element: <Course />,
                children: [
                    {
                        index: true,
                        element: <CourseDetails />,
                    },
                    {
                        path: "videos",
                        element: (
                            <ProtectedRoute>
                                <AllContentVideosCourse />
                            </ProtectedRoute>
                        ),
                        children: [
                            {
                                index: true,
                                element: <CourseVideosContent />,
                            },
                            {
                                path: ":videoId",
                                element: <CourseVideosContent />,
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
                element: (
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                ),
            },
        ],
    },
    // Auth routes that redirect if already logged in
    {
        path: "login",
        element: (
            <ProtectedRoute requireAuth={false}>
                <Login />
            </ProtectedRoute>
        ),
    },
    {
        path: "register",
        element: (
            <ProtectedRoute requireAuth={false}>
                <Register />
            </ProtectedRoute>
        ),
    },
]);

export default Routers;
