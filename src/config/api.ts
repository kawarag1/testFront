const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) || '';

export function apiUrl(path: string): string {
  if (!path.startsWith('/')) {
    throw new Error('API path must start with "/"');
  }

  return `${API_BASE_URL}${path}`;
}
