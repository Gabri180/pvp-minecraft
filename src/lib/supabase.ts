import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase env vars. Check .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : null;

export type UserRole = 'admin' | 'moderator' | 'player';

export interface Profile {
  id: string;
  user_id: string;
  username: string | null;
  email: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
}

export interface Battle {
  id: string;
  player1_id: string;
  player2_id: string;
  winner_id: string | null;
  date: string;
  notes: string | null;
  created_at: string;
  player1?: Profile;
  player2?: Profile;
  winner?: Profile;
}

export interface Challenge {
  id: string;
  challenger_id: string;
  challenged_id: string;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled';
  battle_id: string | null;
  created_at: string;
  challenger?: Pick<Profile, 'id' | 'username'>;
  challenged?: Pick<Profile, 'id' | 'username'>;
  battle?: Battle;
}

export interface PlayerStats {
  profile_id: string;
  username: string | null;
  total: number;
  wins: number;
  losses: number;
  draws: number;
  winrate: number;
}
