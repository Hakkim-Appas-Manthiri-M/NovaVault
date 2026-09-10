const API_URL = import.meta.env.VITE_API_URL;

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export async function getGames(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      searchParams.set(key, value);
    }
  });

  const query = searchParams.toString();

  return request(`/games${query ? `?${query}` : ""}`);
}

export async function getGameById(gameId) {
  return request(`/games/${gameId}`);
}

export async function getFeaturedGames() {
  return getGames({
    featured: true,
  });
}

export async function getTrendingGames() {
  return getGames({
    trending: true,
  });
}

export async function getNewReleaseGames() {
  return getGames({
    newRelease: true,
  });
}