export function getSupabaseEnvFromProcess(): { url: string; anonKey: string } {
  return {
    url: import.meta.env.VITE_SUPABASE_URL ?? '',
    anonKey: import.meta.env.VITE_SUPABASE_KEY ?? '',
  };
}
