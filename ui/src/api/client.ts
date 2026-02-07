import type { AuthToken, Movie, Metadata, User } from "../types";

const TOKEN_KEY = "greenlight_token";
const EXPIRY_KEY = "greenlight_token_expiry";

// --- Token storage ---

export function getStoredToken(): string | null {
  const token = localStorage.getItem(TOKEN_KEY);
  const expiry = localStorage.getItem(EXPIRY_KEY);
  if (!token || !expiry) return null;
  if (new Date(expiry) <= new Date()) {
    clearStoredToken();
    return null;
  }
  return token;
}

export function storeToken(auth: AuthToken) {
  localStorage.setItem(TOKEN_KEY, auth.token);
  localStorage.setItem(EXPIRY_KEY, auth.expiry);
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EXPIRY_KEY);
}

// --- Error class ---

export class ApiClientError extends Error {
  status: number;
  errors: Record<string, string> | null;

  constructor(
    status: number,
    message: string,
    errors: Record<string, string> | null
  ) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

// --- Fetch wrapper ---

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  const token = getStoredToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(path, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const err = body.error;
    if (typeof err === "object" && err !== null) {
      throw new ApiClientError(res.status, "Validation error", err);
    }
    throw new ApiClientError(
      res.status,
      typeof err === "string" ? err : "an unexpected error occurred",
      null
    );
  }

  return res.json();
}

// --- Endpoint functions ---

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
}): Promise<User> {
  const data = await request<{ user: User }>("/v1/users", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return data.user;
}

export async function activateUser(token: string): Promise<User> {
  const data = await request<{ user: User }>("/v1/users/activated", {
    method: "PUT",
    body: JSON.stringify({ token }),
  });
  return data.user;
}

export async function createAuthToken(input: {
  email: string;
  password: string;
}): Promise<AuthToken> {
  const data = await request<{ authentication_token: AuthToken }>(
    "/v1/tokens/authentication",
    {
      method: "POST",
      body: JSON.stringify(input),
    }
  );
  return data.authentication_token;
}

export async function listMovies(params?: {
  title?: string;
  genres?: string;
  page?: number;
  page_size?: number;
  sort?: string;
}): Promise<{ movies: Movie[]; metadata: Metadata }> {
  const qs = new URLSearchParams();
  if (params?.title) qs.set("title", params.title);
  if (params?.genres) qs.set("genres", params.genres);
  if (params?.page) qs.set("page", String(params.page));
  if (params?.page_size) qs.set("page_size", String(params.page_size));
  if (params?.sort) qs.set("sort", params.sort);

  const query = qs.toString();
  const path = `/v1/movies${query ? `?${query}` : ""}`;
  return request<{ movies: Movie[]; metadata: Metadata }>(path);
}
