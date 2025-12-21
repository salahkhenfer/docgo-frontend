import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
    BellIcon,
    EnvelopeIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    EyeIcon,
    TrashIcon,
    InformationCircleIcon,
    ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { useAppContext } from "../../AppContext";
import notificationService from "../../services/notificationService";

const UserNotifications = () => {
    const { t, i18n } = useTranslation();
    const { user } = useAppContext();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    const isRTL = i18n.language === "ar";

    useEffect(() => {
        if (user?.id) {
            fetchNotifications();
        }
        // eslint-disable-next-line
    }, [user?.id, filter]);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const allNotifications = await notificationService.getNotifications(user.id);
            // Filter based on selected filter
            let filteredNotifications = allNotifications;
            if (filter === "unread") {
                filteredNotifications = allNotifications.filter((n) => !n.read);
            } else if (filter === "read") {
                filteredNotifications = allNotifications.filter((n) => n.read);
            }
            setNotifications(filteredNotifications);
        } catch (error) {
            console.error("Error fetching notifications:", error);
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (notificationId) => {
        try {
            await notificationService.markAsRead(notificationId);
            setNotifications((prev) =>
                prev.map((n) =>
                    n.id === notificationId ? { ...n, read: true } : n
                )
            );
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead(user.id);
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        } catch (error) {
            console.error("Error marking all notifications as read:", error);
        }
    };

    const handleDelete = async (notificationId) => {
        if (
            window.confirm(
                t(
                    "notifications.confirmDelete",
                    "Are you sure you want to delete this notification?"
                )
            )
        ) {
            try {
                await notificationService.deleteNotification(notificationId);
                setNotifications((prev) =>
                    prev.filter((n) => n.id !== notificationId)
                );
            } catch (error) {
                console.error("Error deleting notification:", error);
            }
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case "success":
                return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
            case "warning":
                return (
                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
                );
            case "error":
                return <XCircleIcon className="h-5 w-5 text-red-500" />;
            case "info":
            default:
                return (
                    <InformationCircleIcon className="h-5 w-5 text-blue-500" />
                );
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case "success":
                return "border-l-green-500 bg-green-50";
            case "warning":
                return "border-l-yellow-500 bg-yellow-50";
            case "error":
                return "border-l-red-500 bg-red-50";
            case "info":
            default:
                return "border-l-blue-500 bg-blue-50";
        }
    };

    return (
        <div className={`max-w-6xl mx-auto p-6 ${isRTL ? "rtl" : "ltr"}`}>
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                            <BellIcon className="h-7 w-7 text-blue-600 mr-3" />
                            {t("notifications.title", "Notifications")}
                        </h1>
                        <p className="mt-1 text-gray-600">
                            {t(
                                "notifications.subtitle",
                                "Stay updated with your latest activities"
                            )}
                        </p>
                    </div>

                    {notifications.some((n) => !n.read) && (
                        <button
                            onClick={handleMarkAllAsRead}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            <CheckCircleIcon className="h-4 w-4 mr-2" />
                            {t("notifications.markAllRead", "Mark All as Read")}
                        </button>
                    )}
                </div>

                {/* Filter Tabs */}
                <div className="mt-6 border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        {["all", "unread", "read"].map((filterType) => (
                            <button
                                key={filterType}
                                onClick={() => setFilter(filterType)}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                    filter === filterType
                                        ? "border-blue-500 text-blue-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                            >
                                {t(
                                    `notifications.filter.${filterType}`,
                                    filterType.charAt(0).toUpperCase() +
                                        filterType.slice(1)
                                )}
                                {filterType === "unread" &&
                                    notifications.filter((n) => !n.read)
                                        .length > 0 && (
                                        <span className="ml-2 bg-blue-100 text-blue-600 py-0.5 px-2 rounded-full text-xs">
                                            {
                                                notifications.filter(
                                                    (n) => !n.read
                                                ).length
                                            }
                                        </span>
                                    )}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Notifications List */}
            <div className="bg-white rounded-lg shadow-sm">
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-2 text-gray-600">
                            {t(
                                "notifications.loading",
                                "Loading notifications..."
                            )}
                        </p>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="p-8 text-center">
                        <BellIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {t(
                                "notifications.noNotifications",
                                "No notifications"
                            )}
                        </h3>
                        <p className="text-gray-600">
                            {t(
                                "notifications.noNotificationsText",
                                "You're all caught up! No new notifications to show."
                            )}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`p-6 border-l-4 hover:bg-gray-50 transition-colors ${
                                    !notification.read
                                        ? getTypeColor(notification.type)
                                        : "border-l-gray-300"
                                }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-3 flex-1">
                                        {getNotificationIcon(notification.type)}
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2">
                                                <h3
                                                    className={`text-sm font-medium ${
                                                        !notification.read
                                                            ? "text-gray-900"
                                                            : "text-gray-700"
                                                    }`}
                                                >
                                                    {notification.title}
                                                </h3>
                                                {!notification.read && (
                                                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                                )}
                                            </div>
                                            <p
                                                className={`mt-1 text-sm ${
                                                    !notification.read
                                                        ? "text-gray-800"
                                                        : "text-gray-600"
                                                }`}
                                            >
                                                {notification.message}
                                            </p>
                                            <div className="mt-2 flex items-center text-xs text-gray-500">
                                                <ClockIcon className="h-3 w-3 mr-1" />
                                                {new Date(
                                                    notification.createdAt
                                                ).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2 ml-4">
                                        {!notification.read && (
                                            <button
                                                onClick={() =>
                                                    handleMarkAsRead(
                                                        notification.id
                                                    )
                                                }
                                                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                                title={t(
                                                    "notifications.markAsRead",
                                                    "Mark as read"
                                                )}
                                            >
                                                <EyeIcon className="h-4 w-4" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() =>
                                                handleDelete(notification.id)
                                            }
                                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                            title={t(
                                                "notifications.delete",
                                                "Delete"
                                            )}
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserNotifications;
