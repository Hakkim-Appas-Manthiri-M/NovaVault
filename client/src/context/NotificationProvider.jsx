import { useCallback, useEffect, useMemo, useState } from "react";

import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
} from "../services/notificationApi";

import useAuth from "./useAuth";
import { NotificationContext } from "./NotificationContext";

function NotificationProvider({ children }) {
  const { isAuthenticated, authLoading } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationLoading, setNotificationLoading] = useState(true);

  const refreshNotifications = useCallback(async () => {
    if (!isAuthenticated) {
      setNotifications([]);
      setUnreadCount(0);
      setNotificationLoading(false);
      return;
    }

    setNotificationLoading(true);

    try {
      const data = await getNotifications();

      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch {
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setNotificationLoading(false);
    }
  }, [isAuthenticated]);

  const refreshUnreadCount = useCallback(async () => {
    if (!isAuthenticated) {
      setUnreadCount(0);
      return;
    }

    try {
      const data = await getUnreadNotificationCount();
      setUnreadCount(data.unreadCount || 0);
    } catch {
      setUnreadCount(0);
    }
  }, [isAuthenticated]);

  const markAsRead = useCallback(async (notificationId) => {
    if (!notificationId) return;

    await markNotificationAsRead(notificationId);

    setNotifications((current) =>
      current.map((notification) =>
        notification._id === notificationId
          ? {
              ...notification,
              read: true,
              readAt: new Date().toISOString(),
            }
          : notification,
      ),
    );

    setUnreadCount((current) => Math.max(0, current - 1));
  }, []);

  useEffect(() => {
    if (authLoading) return;

    let cancelled = false;

    const loadNotifications = async () => {
      await Promise.resolve();

      if (cancelled) return;

      await refreshNotifications();
    };

    loadNotifications();

    return () => {
      cancelled = true;
    };
  }, [authLoading, refreshNotifications]);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      notificationLoading,
      refreshNotifications,
      refreshUnreadCount,
      markAsRead,
    }),
    [
      notifications,
      unreadCount,
      notificationLoading,
      refreshNotifications,
      refreshUnreadCount,
      markAsRead,
    ],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export default NotificationProvider;
