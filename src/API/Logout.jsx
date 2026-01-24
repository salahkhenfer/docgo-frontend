import axios from "axios";
import Swal from "sweetalert2";
import i18n from "../i18n";

const handleLogout = async ({
    setAuth,
    setUser,
    storeLogout,
    setIsDropdownOpen = null,
}) => {
    const API_URL = import.meta.env.VITE_API_URL;
    const { t } = i18n;

    try {
        // Send a request to the logout endpoint on the server
        await axios.post(
            `${API_URL}/Logout`,
            {},
            {
                withCredentials: true,
                validateStatus: () => true,
            }
        );
    } catch (error) {
        console.error("Logout error:", error);
    } finally {
        // Close dropdown if function was provided
        if (setIsDropdownOpen) {
            setIsDropdownOpen(false);
        }

        // Clear user data and authentication state
        // storeLogout();
        // setAuth(false);
        // setUser(null);
        localStorage.removeItem("user");
        sessionStorage.removeItem("user");
        // Show success alert for 2 seconds then redirect
        Swal.fire({
            title: t("alerts.auth.logoutSuccessTitle", "Logged Out"),
            text: t("alerts.auth.logoutSuccessText", "You have been successfully logged out"),
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
            timerProgressBar: true,
        }).then(() => {
            window.location.href = "/";
        });
    }
};

export default handleLogout;
