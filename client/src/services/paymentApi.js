const API_URL = import.meta.env.VITE_API_URL;

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message || "Something went wrong with the payment request.",
    );
  }

  return data;
}

export async function completeDemoPayment(orderId) {
  if (!orderId) {
    throw new Error("Order ID is required.");
  }

  const response = await fetch(
    `${API_URL}/payments/demo/complete`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        orderId,
      }),
    },
  );

  return parseResponse(response);
}