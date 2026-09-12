const API_URL = import.meta.env.VITE_API_URL;

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to load your library.",
    );
  }

  return data;
}

export async function getMyLibrary() {
  const response = await fetch(`${API_URL}/ownership`, {
    method: "GET",
    credentials: "include",
  });

  return parseResponse(response);
}