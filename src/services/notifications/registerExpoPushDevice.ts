import { useAuthStore } from '@stores/authStore';

/** Push web optionnelle (phase 2). No-op pour ne pas casser le flux online. */
export async function registerExpoPushDevice(): Promise<{ ok: boolean; reason?: string }> {
  const authToken = useAuthStore.getState().token?.trim();
  if (!authToken) return { ok: false, reason: 'unauthenticated' };
  return { ok: false, reason: 'web_unsupported' };
}
