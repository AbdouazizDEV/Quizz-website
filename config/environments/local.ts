import { resolveApiBaseUrl, resolveWsBaseUrl } from '../apiBaseUrl';
import { getSupabaseEnvFromProcess } from '../supabaseEnv';
import { inviteWebBaseFromApiUrl } from '../inviteWebBase';

const API_BASE_URL = resolveApiBaseUrl();

export const localConfig = {
  ENV: 'local' as const,
  API_BASE_URL,
  INVITE_WEB_BASE_URL: inviteWebBaseFromApiUrl(API_BASE_URL),
  WS_URL: resolveWsBaseUrl(API_BASE_URL),
  TIMEOUT_MS: 30_000,
  ENABLE_LOGS: true,
  ENABLE_DEVTOOLS: true,
  supabase: getSupabaseEnvFromProcess(),
};
