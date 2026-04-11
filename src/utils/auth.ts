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
    headers: {
      Accept: 'application/json',
    },
  })
    .then(async (response) => {
      if (!response.ok) {
        cachedSessionUser = null;
        return null;
      }

      const payload = (await response.json()) as SessionResponse;
      cachedSessionUser = normalizeSessionUser(payload);
      return cachedSessionUser;
    })
    .catch(() => {
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
    headers: {
      Accept: 'application/json',
    },
  }).catch(() => {
    // Ignore network errors here; the caller will handle UI state.
  });

  clearCachedSessionUser();
}
