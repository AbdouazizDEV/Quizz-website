/** Origine web pour les liens d’invitation ami. */
export function inviteWebBaseFromApiUrl(apiBaseUrl: string): string {
  return apiBaseUrl.replace(/\/api\/v1\/?$/, '');
}
