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
import Home from "./Pages/Home";
import { Programs } from "./Pages/Programs";
import { ProgramDetails } from "./Pages/ProgramDetails";
import MyApplications from "./Pages/MyApplications";
import Courses from "./Pages/Courses";
import FavoritesPage from "./Pages/FavoritesPage";
import PaymentPage from "./Pages/PaymentPage";
import PaymentSuccessPage from "./Pages/PaymentSuccessPage";
import FAQPage from "./Pages/FAQPage";

import AllContentVideosCourse from "./components/course/courseVideosContent/AllContentVideosCourse";
import QuizContent from "./Pages/QuizContent";
import CourseVideosContent from "./components/course/courseVideosContent/CourseVideosContent";
import Course from "./Pages/Course";
import { CourseDetails } from "./components/course/CourseDetails";
import Certificate from "./Pages/Certificate";
import Profile from "./Pages/Profile/Profile";
import EditProfile from "./Pages/Profile/EditProfile";
import NotificationsPage from "./Pages/NotificationsPage";
import NotFound from "./pages/NotFound";
import UserDashboard from "./Pages/Dashboard/UserDashboard";

import UserMessages from "./Pages/Dashboard/Messages/UserMessages";
import UserMessages_new from "./Pages/Dashboard/Messages/UserMessages_new";
import UserMessages_Default from "./Pages/Dashboard/Messages/Default";

import UserSettings from "./Pages/Dashboard/UserSettings";
import UserFavorites from "./Pages/Dashboard/UserFavorites";
import UserApplications from "./Pages/Dashboard/UserApplications";
import UserCertificates from "./Pages/Dashboard/UserCertificates";
import UserNotifications from "./Pages/Dashboard/UserNotifications";
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
                element: <Home />,
            },
            {
                path: "Programs",
                element: <Programs />,
            },
            {
                path: "Programs/:programId",
                element: <ProgramDetails />,
            },
            {
                path: "myapplications",
                loader: protectedCaseInsensitiveLoader,
                element: <MyApplications />,
            },
            {
                path: "my-applications",
                loader: protectedCaseInsensitiveLoader,
                element: <MyApplications />,
            },
            {
                path: "Courses",
                element: <Courses />,
            },
            {
                path: "faq",
                element: <FAQPage />,
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
                path: "Courses/:courseId",
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
                path: "payment/program/:programId",
                loader: protectedCaseInsensitiveLoader,
                element: <PaymentPage />,
            },
            {
                path: "payment/success/course/:courseId",
                loader: protectedCaseInsensitiveLoader,
                element: <PaymentSuccessPage />,
            },
            {
                path: "payment/success/program/:programId",
                loader: protectedCaseInsensitiveLoader,
                element: <PaymentSuccessPage />,
            },
            {
                path: "dashboard",
                loader: protectedCaseInsensitiveLoader,
                element: <UserDashboard />,
                children: [
                    {
                        index: true,
                        element: <div />, // This will be handled by the UserDashboard component
                    },
                    {
                        path: "messages",
                        element: <UserMessages_Default />,
                        children: [
                            {
                                index: true,
                                element: <UserMessages />,
                            },
                            {
                                path: "new",
                                element: <UserMessages_new />,
                            },
                        ],
                    },

                    {
                        path: "notifications",
                        element: <UserNotifications />,
                    },

                    {
                        path: "settings",
                        element: <UserSettings />,
                    },
                    {
                        path: "favorites",
                        element: <UserFavorites />,
                    },
                    {
                        path: "applications",
                        element: <UserApplications />,
                    },
                    {
                        path: "certificates",
                        element: <UserCertificates />,
                    },
                ],
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
    { path: "*", element: <NotFound /> },
]);

export default Routers;
