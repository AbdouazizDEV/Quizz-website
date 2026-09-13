/** Origine web pour les liens d’invitation ami (partage / QR). */
export function inviteWebBaseFromApiUrl(apiBaseUrl: string): string {
  const withoutApiPath = apiBaseUrl.replace(/\/api\/v1\/?$/, '');
  try {
    const url = new URL(withoutApiPath);
    if (url.hostname.startsWith('api.')) {
      url.hostname = url.hostname.replace(/^api\./, '');
    }
    return url.origin;
  } catch {
    return withoutApiPath;
  }
}

export function resolveInviteWebBaseUrl(apiBaseUrl: string): string {
  const explicit = import.meta.env.VITE_INVITE_WEB_BASE_URL?.trim()?.replace(/\/$/, '');
  if (explicit) return explicit;
  return inviteWebBaseFromApiUrl(apiBaseUrl);
}
