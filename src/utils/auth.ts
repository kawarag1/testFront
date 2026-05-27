import { apiUrl } from '../config/api';

export type SessionUser = {
  id?: string | number;
  username?: string;
  global_name?: string;
  display_name?: string;
  avatar?: string | null;
  [key: string]: unknown;
};

type SessionResponse = SessionUser | { user?: SessionUser; owner?: SessionUser } | null;

let cachedSessionUser: SessionUser | null | undefined;
let cachedSessionPromise: Promise<SessionUser | null> | null = null;

function getAccessTokenFromCookie(): string | null {
  const cookies = document.cookie.split(';');
  console.log('[Auth] All cookies:', cookies);
  
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'access_token') {
      console.log('[Auth] Found access_token:', value.substring(0, 20) + '...');
      return decodeURIComponent(value);
    }
  }
  
  console.log('[Auth] access_token not found in cookies');
  return null;
}

export function getAuthHeaders(): HeadersInit {
  const token = getAccessTokenFromCookie();
  const headers: HeadersInit = {
    Accept: 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    console.log('[Auth] Authorization header set with Bearer token');
  } else {
    console.log('[Auth] No token found, Authorization header not set');
  }
  return headers;
}

function normalizeSessionUser(payload: SessionResponse): SessionUser | null {
  if (!payload) {
    return null;
  }

  if (typeof payload === 'object' && 'user' in payload) {
    const sessionPayload = payload as { user?: SessionUser };

    if (sessionPayload.user) {
      return sessionPayload.user;
    }
  }

  if (typeof payload === 'object' && 'owner' in payload) {
    const sessionPayload = payload as { owner?: SessionUser };

    if (sessionPayload.owner) {
      return sessionPayload.owner;
    }
  }

  return payload as SessionUser;
}

export function getCachedSessionUser(): SessionUser | null | undefined {
  return cachedSessionUser;
}

export function clearCachedSessionUser(): void {
  cachedSessionUser = undefined;
  cachedSessionPromise = null;
}

export async function getSessionUser(): Promise<SessionUser | null> {
  if (cachedSessionUser !== undefined) {
    return cachedSessionUser;
  }

  if (cachedSessionPromise) {
    return cachedSessionPromise;
  }

  cachedSessionPromise = fetch(apiUrl('/api/v1/auth/me'), {
    method: 'GET',
    credentials: 'include',
    headers: getAuthHeaders(),
  })
    .then(async (response) => {
      console.log('[Auth] /v1/auth/me response status:', response.status);
      if (!response.ok) {
        console.error('[Auth] Authentication failed with status', response.status);
        cachedSessionUser = null;
        return null;
      }

      const payload = (await response.json()) as SessionResponse;
      cachedSessionUser = normalizeSessionUser(payload);
      console.log('[Auth] Session user loaded:', cachedSessionUser?.username || 'unknown');
      return cachedSessionUser;
    })
    .catch((error) => {
      console.error('[Auth] Fetch error:', error);
      cachedSessionUser = null;
      return null;
    })
    .finally(() => {
      cachedSessionPromise = null;
    });

  return cachedSessionPromise;
}

export async function isAuthorizedClient(): Promise<boolean> {
  return (await getSessionUser()) !== null;
}

export async function logoutSession(): Promise<void> {
  await fetch(apiUrl('/api/v1/auth/logout'), {
    method: 'POST',
    credentials: 'include',
    headers: getAuthHeaders(),
  }).catch(() => {
    // Ignore network errors here; the caller will handle UI state.
  });

  clearCachedSessionUser();
}
