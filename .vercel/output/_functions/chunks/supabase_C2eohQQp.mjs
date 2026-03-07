import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://tcqyazygrlacakwfwijn.supabase.co";
const supabaseAnonKey = "sb_publishable_JKG0vpkqTnCgR-FxzLGXvg_yOTIXJQF";
const supabaseServiceKey = "TU-SERVICE-ROLE-KEY";
const supabase = createClient(supabaseUrl, supabaseAnonKey);
createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
}) ;

export { supabase as s };
