import {
    createContext,
    useContext,
    useReducer,
    useEffect,
    useCallback,
    useMemo,
} from "react";
import axios from "axios";
import { getApiBaseUrl } from "./utils/apiBaseUrl";

const AppContext = createContext();

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
};

const initialState = {
    isAuth: false,
    userId: null,
    userType: null,
    user: null,
    Notifications: null,
    loading: true,
};

const reducer = (state, action) => {
    switch (action.type) {
        case "LOGOUT":
            return {
                ...state,
                isAuth: false,
                userId: null,
                userType: null,
                user: null,
            };
        case "SET_AUTH":
            return {
                ...state,
                isAuth: action.payload,
            };
        case "SET_USER":
            return {
                ...state,
                user: action.payload,
                isAuth: !!action.payload,
                userId: action.payload?.id || null,
                userType: action.payload?.userType || null,
            };
        case "SET_NOTIFICATIONS":
            return {
                ...state,
                Notifications: action.payload,
            };
        case "SET_LOADING":
            return {
                ...state,
                loading: action.payload,
            };
        default:
            return state;
    }
};

export const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    // In dev, prefer same-origin requests so Vite proxy can keep cookies first-party.
    // In production, set VITE_API_URL to your real backend origin.
    const API_URL = getApiBaseUrl();

    // Configure axios defaults (avoid doing this on every render)
    useEffect(() => {
        axios.defaults.withCredentials = true;
        delete axios.defaults.headers.common["X-Dev-Auth-UserId"];
    }, []);

    const set_Auth = useCallback(
        (isAuth) => {
            dispatch({ type: "SET_AUTH", payload: isAuth });
        },
        [dispatch],
    );

    const store_logout = useCallback(async () => {
        try {
            await axios.post(API_URL + "/Logout");
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            try {
                localStorage.removeItem("user");
                sessionStorage.removeItem("user");
            } catch {
                // ignore storage errors
            }
            dispatch({ type: "LOGOUT" });
        }
    }, [API_URL, dispatch]);

    const set_user = useCallback(
        (user) => {
            dispatch({ type: "SET_USER", payload: user });
        },
        [dispatch],
    );

    const set_Notifications = useCallback(
        (Notifications) => {
            dispatch({
                type: "SET_NOTIFICATIONS",
                payload: Notifications,
            });
        },
        [dispatch],
    );

    const setLoading = useCallback(
        (loading) => {
            dispatch({ type: "SET_LOADING", payload: loading });
        },
        [dispatch],
    );

    const checkAuthStatus = useCallback(async () => {
        try {
            setLoading(true);

            // Use consistent endpoint name (check_Auth)
            const response = await axios.get(API_URL + "/check_Auth", {
                withCredentials: true,
                validateStatus: () => true, // Don't throw on any status
            });

            if (response.status === 200 && response.data.user) {
                set_user(response.data.user);
                localStorage.setItem(
                    "user",
                    JSON.stringify(response.data.user),
                );
                sessionStorage.setItem(
                    "user",
                    JSON.stringify(response.data.user),
                );
                return true;
            } else {
                set_user(null);
                localStorage.removeItem("user");
                sessionStorage.removeItem("user");
                return false;
            }
        } catch (error) {
            set_user(null);
            localStorage.removeItem("user");
            sessionStorage.removeItem("user");
            return false;
        } finally {
            setLoading(false);
        }
    }, [API_URL, setLoading, set_user]);

    const login = useCallback(
        async (credentials) => {
            try {
                const response = await axios.post(
                    API_URL + "/Login",
                    credentials,
                    {
                        withCredentials: true,
                        validateStatus: () => true,
                    },
                );

                if (response.status === 200 && response.data.user) {
                    // Normalize user shape: backend returns userId/userType at the top level.
                    const normalizedUser = {
                        ...response.data.user,
                        id: response.data.user?.id ?? response.data.userId,
                        userType:
                            response.data.user?.userType ??
                            response.data.userType,
                    };
                    set_user(normalizedUser);
                    localStorage.setItem(
                        "user",
                        JSON.stringify(normalizedUser),
                    );
                    sessionStorage.setItem(
                        "user",
                        JSON.stringify(normalizedUser),
                    );
                    set_Auth(true);
                    return { success: true, user: normalizedUser };
                } else {
                    if (
                        response.status === 403 &&
                        (response.data?.code === "USER_BLOCKED" ||
                            String(response.data?.message || "")
                                .toLowerCase()
                                .includes("blocked"))
                    ) {
                        return {
                            success: false,
                            blocked: true,
                            message:
                                response.data?.message ||
                                "Your account has been blocked",
                        };
                    }
                    return {
                        success: false,
                        message: response.data?.message || "Login failed",
                    };
                }
            } catch (error) {
                return {
                    success: false,
                    message: error.response?.data?.message || "Login failed",
                };
            }
        },
        [API_URL, set_Auth, set_user],
    );

    const register = useCallback(
        async (userData) => {
            try {
                const response = await axios.post(
                    API_URL + "/Register",
                    userData,
                    {
                        withCredentials: true,
                        validateStatus: () => true,
                    },
                );

                if (response.status === 200) {
                    return { success: true, data: response.data };
                } else {
                    return {
                        success: false,
                        message:
                            response.data?.message || "Registration failed",
                    };
                }
            } catch (error) {
                return {
                    success: false,
                    message:
                        error.response?.data?.message || "Registration failed",
                };
            }
        },
        [API_URL],
    );

    useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]);

    const AppContextValue = useMemo(
        () => ({
            ...state,
            set_Notifications,
            store_logout,
            set_Auth,
            set_user,
            checkAuthStatus,
            login,
            register,
            isAuthenticated: state.isAuth,
        }),
        [
            state,
            set_Notifications,
            store_logout,
            set_Auth,
            set_user,
            checkAuthStatus,
            login,
            register,
        ],
    );

    return (
        <AppContext.Provider value={AppContextValue}>
            {children}
        </AppContext.Provider>
    );
};
