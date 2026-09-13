const API_URL = import.meta.env.VITE_API_URL;

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to send the gift.",
    );
  }

  return data;
}

export async function sendGameGift({ recipient, gameId }) {
  if (!recipient?.trim()) {
    throw new Error("Recipient email is required.");
  }

  if (!gameId) {
    throw new Error("Game ID is required.");
  }

  const response = await fetch(`${API_URL}/gifts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      recipient: recipient.trim(),
      gameId,
    }),
  });

  return parseResponse(response);
}