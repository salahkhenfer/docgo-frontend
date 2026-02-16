import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";
import MainLoading from "../MainLoading";
import { useAppContext } from "../AppContext";
import apiClient from "../services/apiClient";

const statusBadgeClass = (status) => {
    const base =
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold";

    switch (String(status || "").toLowerCase()) {
        case "approved":
        case "completed":
        case "active":
            return `${base} bg-green-100 text-green-800`;
        case "rejected":
            return `${base} bg-red-100 text-red-800`;
        case "pending":
        case "opened":
        default:
            return `${base} bg-yellow-100 text-yellow-800`;
    }
};

const formatDateTime = (value) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleString();
};

export default function ProgramApplicationStatus() {
    const { t, i18n } = useTranslation();
    const { programId } = useParams();
    const navigate = useNavigate();
    const { user } = useAppContext();

    const [loading, setLoading] = useState(true);
    const [application, setApplication] = useState(null);
    const [enrollment, setEnrollment] = useState(null);

    const programIdStr = String(programId || "");
    const isRTL = i18n.language === "ar";

    const loadStatus = async () => {
        if (!user?.id) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await apiClient.get(`/Users/${user.id}/Profile`);
            const data = response.data?.data;

            const programApplications = data?.applications?.programs || [];
            const programEnrollments = data?.enrollments?.programs || [];

            let foundApplication = programApplications.find(
                (a) => String(a?.ProgramId) === programIdStr,
            );
            const foundEnrollment = programEnrollments.find(
                (e) => String(e?.ProgramId) === programIdStr,
            );

            // Profile currently filters out rejected applications on the backend.
            // Fallback to the dedicated endpoint so status pages still work.
            if (!foundApplication) {
                try {
                    const appsResp = await apiClient.get(
                        `/Users/programs/my-applications`,
                    );
                    const apps = appsResp.data?.data || [];
                    foundApplication = apps.find(
                        (a) => String(a?.ProgramId) === programIdStr,
                    );
                } catch (e) {
                    // ignore; page will render without application details
                }
            }

            setApplication(foundApplication || null);
            setEnrollment(foundEnrollment || null);
        } catch (error) {
            console.error("Failed to load program status:", error);
            setApplication(null);
            setEnrollment(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStatus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id, programIdStr]);

    const program = useMemo(() => {
        return (
            application?.Program ||
            application?.Programs ||
            enrollment?.Program ||
            null
        );
    }, [application, enrollment]);

    const title = useMemo(() => {
        if (!program) return "";
        if (i18n.language === "ar" && (program.title_ar || program.Title_ar)) {
            return program.title_ar || program.Title_ar;
        }
        return program.title || program.Title || "";
    }, [program, i18n.language]);

    if (loading) return <MainLoading />;

    const currentStatus =
        application?.status || enrollment?.status || "unknown";

    return (
        <div className={`p-4 sm:p-6 ${isRTL ? "rtl" : "ltr"}`}>
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                                {t(
                                    "programStatus.title",
                                    "Program Application Status",
                                )}
                            </h1>
                            <span className={statusBadgeClass(currentStatus)}>
                                {String(currentStatus)}
                            </span>
                        </div>
                        <p className="text-gray-700 mt-2 truncate">
                            {title ||
                                t("programStatus.unknownProgram", "Program")}
                        </p>
                        <div className="text-sm text-gray-500 mt-1">
                            {t("programStatus.programId", "Program ID")}:{" "}
                            {programIdStr}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                        <Link
                            to={`/Programs/${programIdStr}`}
                            className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50"
                        >
                            {t("programStatus.viewProgram", "View Program")}
                        </Link>
                        <button
                            type="button"
                            onClick={() =>
                                navigate("/dashboard/messages/new", {
                                    state: {
                                        context: "program",
                                        programId: programIdStr,
                                        programTitle: title,
                                    },
                                })
                            }
                            className="px-4 py-2 rounded-lg bg-[#0086C9] text-white hover:bg-[#0072ab]"
                        >
                            {t(
                                "programStatus.messageSupport",
                                "Message Support",
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {!application && !enrollment ? (
                <div className="bg-white rounded-lg shadow-sm p-10 text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {t(
                            "programStatus.noRecordTitle",
                            "No application found for this program",
                        )}
                    </h3>
                    <p className="text-gray-600 mb-6">
                        {t(
                            "programStatus.noRecordBody",
                            "If you believe this is a mistake, contact support.",
                        )}
                    </p>
                    <div className="flex items-center justify-center gap-3">
                        <Link
                            to="/programs"
                            className="px-5 py-2.5 rounded-lg border text-gray-700 hover:bg-gray-50"
                        >
                            {t(
                                "programStatus.browsePrograms",
                                "Browse Programs",
                            )}
                        </Link>
                        <Link
                            to="/dashboard/messages"
                            className="px-5 py-2.5 rounded-lg bg-gray-900 text-white hover:bg-black"
                        >
                            {t("programStatus.openMessages", "Open Messages")}
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-4 sm:p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">
                            {t("programStatus.details", "Details")}
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <div className="text-xs uppercase text-gray-500">
                                    {t("programStatus.status", "Status")}
                                </div>
                                <div className="mt-1 font-medium text-gray-900">
                                    {String(currentStatus)}
                                </div>
                            </div>

                            <div>
                                <div className="text-xs uppercase text-gray-500">
                                    {t("programStatus.paymentType", "Payment")}
                                </div>
                                <div className="mt-1 font-medium text-gray-900 capitalize">
                                    {application?.paymentType || "—"}
                                </div>
                            </div>

                            <div>
                                <div className="text-xs uppercase text-gray-500">
                                    {t("programStatus.appliedAt", "Applied At")}
                                </div>
                                <div className="mt-1 font-medium text-gray-900">
                                    {formatDateTime(application?.createdAt)}
                                </div>
                            </div>

                            <div>
                                <div className="text-xs uppercase text-gray-500">
                                    {t(
                                        "programStatus.enrollDate",
                                        "Enroll Date",
                                    )}
                                </div>
                                <div className="mt-1 font-medium text-gray-900">
                                    {formatDateTime(
                                        application?.enrollDate ||
                                            enrollment?.enrollmentDate,
                                    )}
                                </div>
                            </div>

                            <div>
                                <div className="text-xs uppercase text-gray-500">
                                    {t("programStatus.price", "Price")}
                                </div>
                                <div className="mt-1 font-medium text-gray-900">
                                    {application?.Price != null
                                        ? String(application.Price)
                                        : application?.price != null
                                          ? String(application.price)
                                          : "—"}
                                </div>
                            </div>

                            <div>
                                <div className="text-xs uppercase text-gray-500">
                                    {t(
                                        "programStatus.organization",
                                        "Organization",
                                    )}
                                </div>
                                <div className="mt-1 font-medium text-gray-900">
                                    {(i18n.language === "ar" &&
                                    program?.organization_ar
                                        ? program.organization_ar
                                        : program?.organization) || "—"}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-sm font-bold text-gray-900 mb-2">
                                {t(
                                    "programStatus.communication",
                                    "Communication",
                                )}
                            </h3>
                            <div className="rounded-lg border bg-gray-50 p-4 text-sm text-gray-700">
                                {application?.notes
                                    ? application.notes
                                    : t(
                                          "programStatus.noNotes",
                                          "No messages yet. If you need help, message support.",
                                      )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">
                            {t("programStatus.quickActions", "Quick Actions")}
                        </h2>
                        <div className="flex flex-col gap-3">
                            <button
                                type="button"
                                onClick={loadStatus}
                                className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50"
                            >
                                {t("programStatus.refresh", "Refresh")}
                            </button>
                            <Link
                                to="/dashboard/applications/program"
                                className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50 text-center"
                            >
                                {t(
                                    "programStatus.allApplications",
                                    "All Applications",
                                )}
                            </Link>
                            <Link
                                to="/dashboard/messages"
                                className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-black text-center"
                            >
                                {t(
                                    "programStatus.openMessages",
                                    "Open Messages",
                                )}
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
