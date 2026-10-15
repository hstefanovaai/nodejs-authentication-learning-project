const API_URL = `${import.meta.env.VITE_API_URL}/auth`;

// Since the frontend and backend run on different ports during development, 
// include credentials: "include" in your requests so the browser sends and accepts the session cookie.

export interface AuthUser {
  id: number;
  name: string;
  email: string;
}

interface AuthResponse {
  message?: string;
  user: AuthUser;
}

// Methods that the browser (and the CSRF middleware) treat as "safe" do not
// need a CSRF token.
const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

// The current CSRF token, cached in memory. It is re-fetched on demand (e.g.
// after login/logout, when the server rotates the token).
let csrfToken: string | null = null;

async function fetchCsrfToken(): Promise<string> {
  const response = await fetch(`${API_URL}/csrf-token`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Could not obtain a CSRF token.");
  }

  const data = await response.json();
  csrfToken = data.csrfToken;
  return csrfToken!;
}

async function getCsrfToken(forceRefresh = false): Promise<string> {
  if (csrfToken && !forceRefresh) {
    return csrfToken;
  }
  return fetchCsrfToken();
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const method = (options.method ?? "GET").toUpperCase();
  const needsCsrf = !SAFE_METHODS.has(method);

  const send = (token?: string) =>
    fetch(`${API_URL}${endpoint}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { "x-csrf-token": token } : {}),
        ...options.headers,
      },
    });

  let response = await send(needsCsrf ? await getCsrfToken() : undefined);

  // The server rotates the CSRF token (for example after login changes the
  // session). If it rejects a stale token, refresh once and retry.
  if (needsCsrf && response.status === 403) {
    response = await send(await getCsrfToken(true));
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data as T;
}

export function signup(
  name: string,
  email: string,
  password: string,
): Promise<AuthResponse> {
  return request<AuthResponse>("/signup", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export async function login(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const result = await request<AuthResponse>("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  // Logging in changes the session, so the server issues a new CSRF token.
  csrfToken = null;
  return result;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const response = await fetch(`${API_URL}/user`, {
    credentials: "include",
  });

  if (response.status === 401) {
    return null;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Could not check login status.");
  }

  return data.user;
}

export async function logout(): Promise<void> {
  await request<{ message: string }>("/logout", {
    method: "POST",
  });
  // The session (and its CSRF binding) is gone, so drop the cached token.
  csrfToken = null;
}
