const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

export async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers || {});
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  headers.set("Accept", "application/json");

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
      credentials: "include",
    });
  } catch (error) {
    throw new Error("The PasteMe service could not be reached. Please try again.", { cause: error });
  }

  if (response.status === 204) return null;

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || data.error || "The request could not be completed.");
  }
  return data;
}
