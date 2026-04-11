export function isAuthorizedClient(): boolean {
  return document.cookie
    .split(';')
    .some((cookie) => cookie.trim().startsWith('session_token='));
}
