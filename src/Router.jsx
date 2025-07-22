import {
    createBrowserRouter,
    ScrollRestoration,
    redirect,
} from "react-router-dom";
import App from "./App";
import ProtectedRoute from "./ProtectedRoute";

import ErrorElement from "./erorrhandle/ErrorElement";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
import LandingPage from "./LandingPage/LandingPage";
import { SearchProgram } from "./Pages/SearchProgram";
import { ProgramDetails } from "./Pages/ProgramDetailes";
import MyApplications from "./Pages/MyApplications";
import AllCourses from "./Pages/AllCourses";
import FavoritesPage from "./Pages/FavoritesPage";
import PaymentPage from "./Pages/PaymentPage";
import PaymentSuccessPage from "./Pages/PaymentSuccessPage";

import AllContentVideosCourse from "./components/course/courseVideosContent/AllContentVideosCourse";
import QuizContent from "./Pages/QuizContent";
import CourseVideosContent from "./components/course/courseVideosContent/CourseVideosContent";
import Course from "./Pages/Course";
import { CourseDetails } from "./components/course/CourseDetails";
import Certificate from "./Pages/Certificate";
import Profile from "./Pages/Profile/Profile";
import EditProfile from "./Pages/Profile/EditProfile";
import NotificationsPage from "./Pages/NotificationsPage";

// Case-insensitive loader
const caseInsensitiveLoader = ({ request }) => {
    const url = new URL(request.url);
    const normalizedPath = url.pathname.toLowerCase();

    if (url.pathname !== normalizedPath) {
        return redirect(normalizedPath + url.search + url.hash);
    }
    return null;
};

// Auth protection loader
const protectedLoader = ({ request }) => {
    const user = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (!user) {
        const url = new URL(request.url);
        return redirect(`/login?from=${encodeURIComponent(url.pathname)}`);
    }
    return null;
};

// Combined loader for protected routes
const protectedCaseInsensitiveLoader = ({ request }) => {
    // First check case sensitivity
    const caseResult = caseInsensitiveLoader({ request });
    if (caseResult) return caseResult;

    // Then check authentication
    return protectedLoader({ request });
};

const Routers = createBrowserRouter([
    {
        path: "/",
        loader: caseInsensitiveLoader,
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
                path: "searchprogram",
                element: <SearchProgram />,
            },
            {
                path: "searchprogram/:programId",
                element: <ProgramDetails />,
            },
            {
                path: "myapplications",
                loader: protectedCaseInsensitiveLoader,
                element: <MyApplications />,
            },
            {
                path: "allcourses",
                element: <AllCourses />,
            },
            {
                path: "favorites",
                element: <FavoritesPage />,
            },
            {
                path: "notifications",
                loader: protectedCaseInsensitiveLoader,
                element: <NotificationsPage />,
            },
            {
                path: "coursedetails/:courseId",
                element: <Course />,
                children: [
                    {
                        index: true,
                        element: <CourseDetails />,
                    },
                    {
                        path: "videos",
                        loader: protectedCaseInsensitiveLoader,
                        element: <AllContentVideosCourse />,
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
                                path: "certificate",
                                element: <Certificate />,
                            },
                        ],
                    },
                ],
            },
            {
                path: "profile",
                loader: protectedCaseInsensitiveLoader,
                element: <Profile />,
            },
            {
                path: "profile/edit",
                loader: protectedCaseInsensitiveLoader,
                element: <EditProfile />,
            },
            {
                path: "payment/course/:courseId",
                loader: protectedCaseInsensitiveLoader,
                element: <PaymentPage />,
            },
            {
                path: "payment/success/:courseId",
                loader: protectedCaseInsensitiveLoader,
                element: <PaymentSuccessPage />,
            },
        ],
    },
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
