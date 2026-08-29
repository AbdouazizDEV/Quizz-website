const DEFAULT_LOCAL = 'http://localhost:3000/api/v1';
const DEFAULT_PRODUCTION = 'https://api.quizzp.com/api/v1';

export function resolveApiBaseUrl(): string {
  const fromEnv = import.meta.env.VITE_API_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, '');
  if (import.meta.env.VITE_APP_ENV === 'production') return DEFAULT_PRODUCTION;
  return DEFAULT_LOCAL;
}

export function resolveWsBaseUrl(apiBaseUrl: string): string {
  try {
    const url = new URL(apiBaseUrl);
    url.pathname = '';
    url.search = '';
    url.hash = '';
    const protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${url.host}`;
  } catch {
    return 'ws://localhost:3000';
  }
}
