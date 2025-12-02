import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Bell,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Calendar,
  User,
  FileText,
  Settings,
  Check,
  X,
  Filter,
  Search,
  MoreVertical,
  Trash2,
  Mail,
} from "lucide-react";
import NotificationItem from "../components/notifications/NotificationsItem";

// Mock notifications data
const notificationsData = [
  {
    id: 1,
    type: "application",
    title: "Application Approved",
    message:
      "Your application for France Study Program has been approved! Welcome to our program.",
    timestamp: "2024-07-07T10:30:00Z",
    read: false,
    icon: CheckCircle,
    color: "green",
    actionRequired: false,
  },
  {
    id: 2,
    type: "application",
    title: "Application Under Review",
    message:
      "Your application for Spain Cultural Exchange is currently under review. We'll notify you once a decision is made.",
    timestamp: "2024-07-06T14:15:00Z",
    read: false,
    icon: AlertCircle,
    color: "amber",
    actionRequired: false,
  },

  {
    id: 6,
    type: "application",
    title: "Application Rejected",
    message:
      "Unfortunately, your application for UK Business Program was not successful. You can apply again next semester.",
    timestamp: "2024-07-02T13:30:00Z",
    read: true,
    icon: XCircle,
    color: "red",
    actionRequired: false,
  },
  {
    id: 7,
    type: "system",
    title: "System Maintenance",
    message:
      "Our system will be under maintenance tomorrow from 2 AM to 4 AM. Some features may be temporarily unavailable.",
    timestamp: "2024-07-01T08:00:00Z",
    read: true,
    icon: Settings,
    color: "gray",
    actionRequired: false,
  },
  {
    id: 8,
    type: "info",
    title: "New Programs Available",
    message:
      "Check out our new exchange programs for the upcoming semester. Applications are now open!",
    timestamp: "2024-06-30T15:00:00Z",
    read: false,
    icon: Info,
    color: "blue",
    actionRequired: false,
  },
];

const NotificationsPage = () => {
  const { t } = useTranslation("", { keyPrefix: "notifications" });
  const [notifications, setNotifications] = useState(notificationsData);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((notification) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "unread" && !notification.read) ||
      (filter === "read" && notification.read) ||
      notification.type === filter;

    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleMarkAsRead = (id) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? { ...notification, read: !notification.read }
          : notification
      )
    );
  };

  const handleDelete = (id) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
  };

  const handleAction = (id) => {
    // Handle action required notifications
    handleMarkAsRead(id);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, read: true }))
    );
  };

  const filterOptions = [
    {
      value: "all",
      label: t("filter.all"),
      count: notifications.length,
    },
    {
      value: "unread",
      label: t("filter.unread"),
      count: unreadCount,
    },
    {
      value: "read",
      label: t("filter.read"),
      count: notifications.length - unreadCount,
    },
    {
      value: "application",
      label: t("filter.applications"),
      count: notifications.filter((n) => n.type === "application").length,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <Bell size={32} className="text-blue-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {t("title")}
              </h1>
              <p className="text-gray-600">{t("description")}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Check size={16} />
                  {t("markAllAsRead")}
                </button>
              )}
              <span className="text-sm text-gray-600">
                {t("unreadCount", {
                  unread: unreadCount,
                  total: notifications.length,
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={16} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              {t("filterBy")}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === option.value
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                {option.label}
                <span className="ml-2 text-xs opacity-75">
                  ({option.count})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t("noNotificationsFound")}
              </h3>
              <p className="text-gray-600">
                {searchTerm
                  ? t("tryAdjustingSearch")
                  : t("allCaughtUp")}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDelete}
                onAction={handleAction}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
