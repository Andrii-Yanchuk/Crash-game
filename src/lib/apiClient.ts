import { API_URL } from "@/config/api";

type ApiOptions = RequestInit & {
  username?: string;
};

function buildHeaders(initHeaders: HeadersInit | undefined, username: string | undefined) {
  const headers = new Headers(initHeaders);

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (username) {
    headers.set("X-API-Key", username);
  }

  return headers;
}

export async function api<T>(path: string, { username, ...init }: ApiOptions = {}) {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: buildHeaders(init.headers, username),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    const message =
      data && typeof data === "object" && "error" in data
        ? String(data.error)
        : response.statusText;

    throw new Error(message || "Request failed");
  }

  return (await response.json()) as T;
}
