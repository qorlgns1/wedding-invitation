import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const supabase =
  supabaseUrl && supabasePublishableKey
    ? createClient(supabaseUrl, supabasePublishableKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      })
    : null;

export function isSupabaseConfigured() {
  return Boolean(supabase);
}

export function getSupabaseClient() {
  if (!supabase) {
    throw new Error('Supabase 환경변수(VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY)가 설정되지 않았습니다.');
  }
  return supabase;
}
