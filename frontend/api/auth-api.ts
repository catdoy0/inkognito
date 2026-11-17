import type { AuthSession, SignUpPayload } from "@/types/auth";
import { API_URL } from "./config";

let refreshInFlight: Promise<AuthSession | null> | null = null;

async function readError(response: Response, fallback: string) {
  try {
    const result: { detail?: unknown } = await response.json();
    if (typeof result.detail === "string") return result.detail;
    if (Array.isArray(result.detail)) {
      return result.detail
        .map((item: { msg?: unknown }) => typeof item?.msg === "string" ? item.msg : "")
        .filter(Boolean)
        .join(" ") || fallback;
    }
  } catch {
    // Use the fallback when the server does not return JSON.
  }
  return fallback;
}

export async function signIn(email: string, password: string): Promise<AuthSession> {
  const response = await fetch(`${API_URL}/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok)
    throw new Error(await readError(response, "Unable to sign in. Please try again."));
  return response.json();
}

export async function signUp(payload: SignUpPayload): Promise<AuthSession> {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  if (!response.ok)
    throw new Error(await readError(response, "Unable to create your account. Please try again."));
  return response.json();
}

export async function signInWithGoogle(credential: string): Promise<AuthSession> {
  const response = await fetch(`${API_URL}/auth/google-signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ credential }),
  });
  if (!response.ok)
    throw new Error(await readError(response, "Google sign-in failed."));
  return response.json();
}

export async function refreshSession(): Promise<AuthSession | null> {
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      try {
        const response = await fetch(`${API_URL}/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });
        if (!response.ok) return null;
        return await response.json();
      } catch {
        return null;
      }
    })();
  }

  const currentRefresh = refreshInFlight;
  return currentRefresh.finally(() => {
    if (refreshInFlight === currentRefresh) refreshInFlight = null;
  });
}

export async function logout(): Promise<void> {
  await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}

export async function checkEmailTaken(email: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/auth/check-email-taken`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email }),
    });
    if (!response.ok) return false;
    const result: { taken?: unknown } = await response.json();
    return Boolean(result.taken);
  } catch {
    // The signup endpoint remains authoritative if this convenience check is unavailable.
    return false;
  }
}
