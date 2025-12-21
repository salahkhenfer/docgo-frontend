import {
  AcademicCapIcon,
  BellIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  ExclamationCircleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { useAppContext } from "../../AppContext";
import apiClient from "../../services/apiClient";

const UserSidebar = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { user } = useAppContext();
  const [contactStats, setContactStats] = useState({
    total: 0,
    unread: 0,
    pending: 0,
  });

  const isRTL = i18n.language === "ar";

  const fetchContactStats = useCallback(async () => {
    try {
      // This would be a new endpoint to get user's contact message stats
      const response = await apiClient.get(`/contact/user/${user.id}/stats`);
      if (response.data.success) {
        setContactStats(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching contact stats:", error);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchContactStats();
    }
  }, [user?.id, fetchContactStats]);

  const sidebarItems = [
    {
      id: "overview",
      name: t("dashboard.sidebar.overview", "Overview"),
      icon: UserIcon,
      path: "/dashboard",
      badge: null,
    },
    {
      id: "messages",
      name: t("dashboard.sidebar.messages", "My Messages"),
      icon: ChatBubbleLeftRightIcon,
      path: "/dashboard/messages",
      badge: contactStats.unread > 0 ? contactStats.unread : null,
      badgeColor: "bg-blue-500",
    },
    {
      id: "notifications",
      name: t("dashboard.sidebar.notifications", "Notifications"),
      icon: BellIcon,
      path: "/dashboard/notifications",
      badge: 0, // This would come from notifications API
      badgeColor: "bg-red-500",
    },
    // {
    //     id: "favorites",
    //     name: t("dashboard.sidebar.favorites", "Favorites"),
    //     icon: HeartIcon,
    //     path: "/dashboard/favorites",
    //     badge: null,
    // },
    {
      id: "applications-programs",
      name: t("dashboard.sidebar.programApplications", "Program Applications"),
      icon: AcademicCapIcon,
      path: "/dashboard/applications/programs",
      badge: null,
    },
    {
      id: "applications-courses",
      name: t("dashboard.sidebar.courseApplications", "Course Applications"),
      icon: DocumentTextIcon,
      path: "/dashboard/applications/courses",
      badge: null,
    },
    // {
    //     id: "settings",
    //     name: t("dashboard.sidebar.settings", "Settings"),
    //     icon: CogIcon,
    //     path: "/dashboard/settings",
    //     badge: null,
    // },
  ];

  const isActiveItem = (path) => {
    if (path === "/dashboard") {
      return (
        location.pathname === "/dashboard" ||
        location.pathname === "/dashboard/"
      );
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 lg:hidden "
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={` sticky top-0 ${
          isRTL ? "right-0" : "left-0"
        } flex flex-col w-64 bg-white border-r border-gray-200
            z-40 transform transition-transform duration-300 ease-in-out  overflow-auto
            lg:translate-x-0   ${
              isOpen
                ? "translate-x-0"
                : isRTL
                ? "translate-x-full"
                : "-translate-x-full"
            }  max-h-[100vh] `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <Link
            to={"/dashboard"}
            className="flex items-center py-2"
            onClick={() => {
              // Close sidebar on mobile after navigation
              if (window.innerWidth < 1024) {
                onClose();
              }
            }}
          >
            <UserIcon className="h-8 w-8 text-blue-600 mr-3" />
            <h2 className="text-lg font-semibold text-gray-900">
              {t("dashboard.sidebar.title", "Dashboard")}
            </h2>
          </Link>
          {/* Close button - only visible on mobile */}
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-gray-600"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <Link to={`/profile`} className="flex items-center">
            {user?.profile_pic_link ? (
              <img
                src={import.meta.env.VITE_API_URL + user.profile_pic_link}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
            ) : null}
            <div
              className={`w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center ${
                user?.profile_pic_link ? "hidden" : "flex"
              }`}
            >
              <UserIcon className="w-5 h-5 text-gray-500" />
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveItem(item.path);

            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => {
                  // Close sidebar on mobile after navigation
                  if (window.innerWidth < 1024) {
                    onClose();
                  }
                }}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  isActive
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon
                  className={`${
                    isRTL ? "ml-3" : "mr-3"
                  } h-5 w-5 flex-shrink-0 ${
                    isActive
                      ? "text-blue-600"
                      : "text-gray-400 group-hover:text-gray-500"
                  }`}
                />
                <span className="flex-1">{item.name}</span>
                {item.badge !== null && item.badge > 0 && (
                  <span
                    className={`${
                      item.badgeColor || "bg-gray-500"
                    } text-white text-xs font-medium px-2 py-0.5 rounded-full`}
                  >
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Support Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex items-center">
              <ExclamationCircleIcon className="h-5 w-5 text-blue-600 mr-2" />
              <p className="text-xs text-blue-700 font-medium">
                {t("dashboard.sidebar.support", "Need Help?")}
              </p>
            </div>
            <p className="text-xs text-blue-600 mt-1">
              {t("dashboard.sidebar.supportText", "Contact our support team")}
            </p>
            <Link
              to="/dashboard/messages/new"
              onClick={() => {
                // Close sidebar on mobile after navigation
                if (window.innerWidth < 1024) {
                  onClose();
                }
              }}
              className="mt-2 inline-flex items-center text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              {t("dashboard.sidebar.sendMessage", "Send Message")}
              <EnvelopeIcon className="ml-1 h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

UserSidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default UserSidebar;
