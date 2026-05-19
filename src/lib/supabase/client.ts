import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _supabaseBrowser: SupabaseClient | null = null;

export function getSupabaseBrowser(): SupabaseClient {
  if (_supabaseBrowser) return _supabaseBrowser;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    throw new Error("Missing Supabase environment variables");
  }

  _supabaseBrowser = createClient(supabaseUrl, anonKey);
  return _supabaseBrowser;
}
