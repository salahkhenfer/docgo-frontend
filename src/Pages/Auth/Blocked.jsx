import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Blocked = () => {
    const { t } = useTranslation();
    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
            <div className="max-w-lg w-full bg-white border rounded-xl shadow p-6">
                <h1 className="text-2xl font-bold mb-2">
                    {t("blocked.title")}
                </h1>
                <p className="text-gray-700 mb-4">{t("blocked.message")}</p>
                <div className="flex gap-3">
                    <Link
                        to="/"
                        className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                    >
                        {t("blocked.goHome")}
                    </Link>
                    <Link
                        to="/login"
                        className="px-4 py-2 rounded-md border hover:bg-gray-50"
                    >
                        {t("blocked.backToLogin")}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Blocked;
