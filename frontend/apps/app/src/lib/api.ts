const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/v1";

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
    credentials: "include", // sends httpOnly cookie
  });

  if (response.status === 401) {
    localStorage.removeItem("dino_user");
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${response.status}`);
  }

  return response.json();
}

export function get<T>(path: string): Promise<T> {
  return request<T>(path);
}

export function post<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });
}

/** Construct a full URL for dino file endpoints (images/audio) */
export function dinoFileUrl(slug: string, fileType: string): string {
  return `${BASE_URL}/dinos/${slug}/file/${fileType}`;
}
