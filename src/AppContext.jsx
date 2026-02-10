import { createContext, useContext, useReducer, useEffect } from "react";
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

    // Dev-only bypass: allows testing dashboard without real auth.
    // Must be enabled explicitly in Vite env and only works in dev builds.
    const DEV_AUTH_ENABLED =
        import.meta.env.DEV &&
        ["1", "true", "yes"].includes(
            String(
                import.meta.env.VITE_USER_AUTH_TRUE_WHILE_DEV || "",
            ).toLowerCase(),
        );
    const DEV_USER_ID = Number(import.meta.env.VITE_DEV_USER_ID || 1);

    // Configure axios defaults
    axios.defaults.withCredentials = true;
    if (DEV_AUTH_ENABLED) {
        axios.defaults.headers.common["X-Dev-Auth-UserId"] =
            String(DEV_USER_ID);
    }

    const set_Auth = (isAuth) => {
        dispatch({ type: "SET_AUTH", payload: isAuth });
    };

    const store_logout = async () => {
        try {
            await axios.post(API_URL + "/Logout");
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            dispatch({ type: "LOGOUT" });
        }
    };

    const set_user = (user) => {
        dispatch({ type: "SET_USER", payload: user });
    };

    const set_Notifications = (Notifications) => {
        dispatch({
            type: "SET_NOTIFICATIONS",
            payload: Notifications,
        });
    };

    const setLoading = (loading) => {
        dispatch({ type: "SET_LOADING", payload: loading });
    };

    const checkAuthStatus = async () => {
        try {
            setLoading(true);

            if (DEV_AUTH_ENABLED) {
                const devUser = {
                    id: DEV_USER_ID,
                    userType: "user",
                    firstName: "Dev",
                    lastName: "User",
                    email: "dev@example.com",
                };
                set_user(devUser);
                localStorage.setItem("user", JSON.stringify(devUser));
                sessionStorage.setItem("user", JSON.stringify(devUser));
                return true;
            }

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
    };

    const login = async (credentials) => {
        try {
            const response = await axios.post(API_URL + "/Login", credentials, {
                withCredentials: true,
                validateStatus: () => true,
            });

            if (response.status === 200 && response.data.user) {
                // Normalize user shape: backend returns userId/userType at the top level.
                const normalizedUser = {
                    ...response.data.user,
                    id: response.data.user?.id ?? response.data.userId,
                    userType:
                        response.data.user?.userType ?? response.data.userType,
                };
                set_user(normalizedUser);
                localStorage.setItem("user", JSON.stringify(normalizedUser));
                sessionStorage.setItem("user", JSON.stringify(normalizedUser));
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
    };

    const register = async (userData) => {
        try {
            const response = await axios.post(API_URL + "/Register", userData, {
                withCredentials: true,
                validateStatus: () => true,
            });

            if (response.status === 200) {
                return { success: true, data: response.data };
            } else {
                return {
                    success: false,
                    message: response.data?.message || "Registration failed",
                };
            }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Registration failed",
            };
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const AppContextValue = {
        // All your existing values
        ...state,
        set_Notifications,
        store_logout,
        set_Auth,
        set_user,

        // New authentication methods
        checkAuthStatus,
        login,
        register,
        isAuthenticated: state.isAuth,
    };

    return (
        <AppContext.Provider value={AppContextValue}>
            {children}
        </AppContext.Provider>
    );
};
