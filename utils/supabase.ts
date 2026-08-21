import type { SupabaseClient } from '@supabase/supabase-js';

import { createSupabaseClient } from '../src/services/supabase/createSupabaseClient';
import { getSupabaseEnvFromProcess } from '../config/supabaseEnv';
import type { Database } from '../src/types/supabase/database.types';

let client: SupabaseClient<Database> | null = null;

export function getSupabaseSingleton(): SupabaseClient<Database> {
  if (!client) {
    const { url, anonKey } = getSupabaseEnvFromProcess();
    if (!url?.trim() || !anonKey?.trim()) {
      throw new Error(
        '[Supabase] Définir VITE_SUPABASE_URL et VITE_SUPABASE_KEY puis relancer Vite.',
      );
    }
    client = createSupabaseClient(url.trim(), anonKey.trim());
  }
  return client;
}

export function resetSupabaseSingletonForTests(): void {
  client = null;
}

export const supabase = new Proxy({} as SupabaseClient<Database>, {
  get(_target, prop, receiver) {
    const c = getSupabaseSingleton();
    const value = Reflect.get(c as object, prop, receiver);
    return typeof value === 'function' ? (value as (...a: unknown[]) => unknown).bind(c) : value;
  },
});
