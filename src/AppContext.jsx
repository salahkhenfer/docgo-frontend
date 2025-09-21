import { createContext, useContext, useReducer, useEffect } from "react";
import axios from "axios";

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

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

    // Configure axios defaults
    axios.defaults.withCredentials = true;

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
            // Use consistent endpoint name (check_Auth)
            const response = await axios.get(API_URL + "/check_Auth", {
                withCredentials: true,
                validateStatus: () => true, // Don't throw on any status
            });


            if (response.status === 200 && response.data.user) {
                set_user(response.data.user);
                localStorage.setItem(
                    "user",
                    JSON.stringify(response.data.user)
                );
                sessionStorage.setItem(
                    "user",
                    JSON.stringify(response.data.user)
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
                set_user(response.data.user);
                localStorage.setItem(
                    "user",
                    JSON.stringify(response.data.user)
                );
                sessionStorage.setItem(
                    "user",
                    JSON.stringify(response.data.user)
                );
                set_Auth(true);
                return { success: true, user: response.data.user };
            } else {
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
