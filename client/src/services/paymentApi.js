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

// Create Razorpay order for an existing NovaVault order
export async function createRazorpayOrder(orderId) {
  if (!orderId) {
    throw new Error("Order ID is required.");
  }

  const response = await fetch(`${API_URL}/payments/razorpay/order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      orderId,
    }),
  });

  return parseResponse(response);
}

// Verify Razorpay payment after Checkout succeeds
export async function verifyRazorpayPayment(paymentData) {
  const response = await fetch(`${API_URL}/payments/razorpay/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(paymentData),
  });

  return parseResponse(response);
}

export async function retryRazorpayPayment(orderId) {
  if (!orderId) {
    throw new Error("Order ID is required.");
  }

  return createRazorpayOrder(orderId);
}