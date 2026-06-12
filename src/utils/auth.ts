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

  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'access_token') {
      return decodeURIComponent(value);
    }
  }

  return null;
}

export function getAuthHeaders(): HeadersInit {
  const token = getAccessTokenFromCookie();
  const headers: HeadersInit = {
    Accept: 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
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

async function refreshAuthSession(): Promise<boolean> {
  const response = await fetch(apiUrl('/api/v1/auth/refresh'), {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
    },
  }).catch((error) => {
    return null;
  });

  if (!response) {
    return false;
  }

  if (!response.ok) {
    return false;
  }

  return true;
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
      if (response.status === 401) {
        const refreshed = await refreshAuthSession();
        if (!refreshed) {
          cachedSessionUser = null;
          return null;
        }

        const retryResponse = await fetch(apiUrl('/api/v1/auth/me'), {
          method: 'GET',
          credentials: 'include',
          headers: getAuthHeaders(),
        });

        if (!retryResponse.ok) {
          cachedSessionUser = null;
          return null;
        }

        const retryPayload = (await retryResponse.json()) as SessionResponse;
        cachedSessionUser = normalizeSessionUser(retryPayload);
        return cachedSessionUser;
      }

      if (!response.ok) {
        cachedSessionUser = null;
        return null;
      }

      const payload = (await response.json()) as SessionResponse;
      cachedSessionUser = normalizeSessionUser(payload);
      return cachedSessionUser;
    })
    .catch((error) => {
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
  });

  clearCachedSessionUser();
}
