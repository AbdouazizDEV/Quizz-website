/** Client ID OAuth web (Google Cloud Console). */
export function getGoogleClientId(): string {
  return import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim() ?? '';
}

export function isGoogleSignInConfigured(): boolean {
  return getGoogleClientId().length > 0;
}
