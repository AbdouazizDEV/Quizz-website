import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '@app-types/supabase/database.types';
import { webStorage } from '@platform/webStorage';

export function createSupabaseClient(url: string, anonKey: string): SupabaseClient<Database> {
  return createClient<Database>(url, anonKey, {
    auth: {
      storage: webStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
}
