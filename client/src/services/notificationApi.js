const API_URL = import.meta.env.VITE_API_URL;

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to load notifications.",
    );
  }

  return data;
}

export async function getNotifications() {
  const response = await fetch(`${API_URL}/notifications`, {
    method: "GET",
    credentials: "include",
  });

  return parseResponse(response);
}

export async function getUnreadNotificationCount() {
  const response = await fetch(
    `${API_URL}/notifications/unread-count`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  return parseResponse(response);
}

export async function markNotificationAsRead(
  notificationId,
) {
  if (!notificationId) {
    throw new Error("Notification ID is required.");
  }

  const response = await fetch(
    `${API_URL}/notifications/${notificationId}/read`,
    {
      method: "PATCH",
      credentials: "include",
    },
  );

  return parseResponse(response);
}