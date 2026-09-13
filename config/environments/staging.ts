import { resolveWsBaseUrl } from '../apiBaseUrl';
import { getSupabaseEnvFromProcess } from '../supabaseEnv';
import { resolveInviteWebBaseUrl } from '../inviteWebBase';

const API_BASE_URL =
  import.meta.env.VITE_API_URL?.trim()?.replace(/\/$/, '') ??
  'https://quizz-p4ze.onrender.com/api/v1';

export const stagingConfig = {
  ENV: 'staging' as const,
  API_BASE_URL,
  INVITE_WEB_BASE_URL: resolveInviteWebBaseUrl(API_BASE_URL),
  WS_URL: resolveWsBaseUrl(API_BASE_URL),
  TIMEOUT_MS: 30_000,
  ENABLE_LOGS: true,
  ENABLE_DEVTOOLS: false,
  supabase: getSupabaseEnvFromProcess(),
};
