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

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

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

export function login(email: string, password: string): Promise<AuthResponse> {
  return request<AuthResponse>("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
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
}
