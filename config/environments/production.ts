import { resolveWsBaseUrl } from '../apiBaseUrl';
import { getSupabaseEnvFromProcess } from '../supabaseEnv';
import { inviteWebBaseFromApiUrl } from '../inviteWebBase';

const API_BASE_URL =
  import.meta.env.VITE_API_URL?.trim()?.replace(/\/$/, '') ??
  'https://quizz-p4ze.onrender.com/api/v1';

export const productionConfig = {
  ENV: 'production' as const,
  API_BASE_URL,
  INVITE_WEB_BASE_URL: inviteWebBaseFromApiUrl(API_BASE_URL),
  WS_URL: resolveWsBaseUrl(API_BASE_URL),
  TIMEOUT_MS: 30_000,
  ENABLE_LOGS: false,
  ENABLE_DEVTOOLS: false,
  supabase: getSupabaseEnvFromProcess(),
};
