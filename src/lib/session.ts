import { supabase } from './supabase';

export const SESSION_COOKIE = 'pvp-session';
const SESSION_DAYS = 7;

export async function createSession(profileId: string): Promise<string> {
  const token = crypto.randomUUID() + crypto.randomUUID(); // 72 chars aleatorios
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  await supabase.from('sessions').insert({
    profile_id: profileId,
    token,
    expires_at: expiresAt.toISOString(),
  });

  return token;
}

export async function getSessionProfile(token: string) {
  const { data } = await supabase
    .from('sessions')
    .select('profile_id, expires_at, profiles(id, username, email, role)')
    .eq('token', token)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (!data) return null;
  return data.profiles as { id: string; username: string; email: string; role: string } | null;
}

export async function deleteSession(token: string) {
  await supabase.from('sessions').delete().eq('token', token);
}
