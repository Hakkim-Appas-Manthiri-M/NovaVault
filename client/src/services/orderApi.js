const API_URL = import.meta.env.VITE_API_URL;

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message || "Something went wrong with the order request.",
    );
  }

  return data;
}

// ==========================================
// CREATE ORDER
// ==========================================
export async function createOrder(items) {
  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      items,
    }),
  });

  return parseResponse(response);
}

// ==========================================
// GET CURRENT USER ORDERS
// ==========================================
export async function getMyOrders() {
  const response = await fetch(`${API_URL}/orders`, {
    method: "GET",
    credentials: "include",
  });

  return parseResponse(response);
}

// ==========================================
// GET ONE ORDER
// ==========================================
export async function getOrderById(orderId) {
  if (!orderId) {
    throw new Error("Order ID is required.");
  }

  const response = await fetch(
    `${API_URL}/orders/${encodeURIComponent(orderId)}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  return parseResponse(response);
}