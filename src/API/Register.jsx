import axios from "axios";
import handleLogin from "./Login";

export const validateFirstStep = async (userData) => {
    const { firstName, lastName, email, password } = userData;

    try {
        const API_URL = import.meta.env.VITE_API_URL;
        const response = await axios.post(
            `${API_URL}/Register/validate-step1`,
            { firstName, lastName, email, password },
            {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
                validateStatus: () => true,
            }
        );

        return {
            success: response.status === 200,
            message: response.data?.message || "Validation successful",
            status: response.status,
            data: response.data,
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || "Validation failed",
            error,
        };
    }
};

const handleRegister = async ({
    userData,
    setAuth,
    setUser,
    onSuccess = null,
    onError = null,
}) => {
    const API_URL = import.meta.env.VITE_API_URL;

    try {
        const response = await axios.post(`${API_URL}/Register`, userData, {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
            validateStatus: () => true,
        });

        // If registration was successful
        if (response.status === 201 || response.status === 200) {
            // Automatically login after successful registration
            const loginData = {
                email: userData.email,
                password: userData.password,
            };
            // Attempt to login after successful registration
            const loginResult = await handleLogin({
                userData: loginData,
                setAuth,
                setUser,
                onSuccess,
                onError,
            });

            // If login is not successful, redirect to the login page
            if (!loginResult?.success) {
                window.location.href = "/login";
            }
            localStorage.setItem(
                "user",
                JSON.stringify(loginResult?.data?.user || {})
            );
            sessionStorage.setItem(
                "user",
                JSON.stringify(loginResult?.data?.user || {})
            );

            return loginResult;
        } else {
            // Handle unsuccessful registration
            const errorMessage =
                response.data?.message || "Registration failed";

            if (onError) {
                onError({
                    message: errorMessage,
                    status: response.status,
                    data: response.data,
                });
            }

            return {
                success: false,
                message: errorMessage,
                status: response.status,
                data: response.data,
            };
        }
    } catch (error) {
        console.error("Registration error:", error);

        const errorMessage =
            error.response?.data?.message ||
            "Registration failed. Please try again.";

        if (onError) {
            onError({
                message: errorMessage,
                error,
            });
        }

        return {
            success: false,
            message: errorMessage,
            error,
        };
    }
};

export default handleRegister;
