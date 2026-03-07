import { s as supabase } from './supabase_C2eohQQp.mjs';

const SESSION_COOKIE = "pvp-session";
const SESSION_DAYS = 7;
async function createSession(profileId) {
  const token = crypto.randomUUID() + crypto.randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1e3);
  await supabase.from("sessions").insert({
    profile_id: profileId,
    token,
    expires_at: expiresAt.toISOString()
  });
  return token;
}
async function getSessionProfile(token) {
  const { data } = await supabase.from("sessions").select("profile_id, expires_at, profiles(id, username, email, role)").eq("token", token).gt("expires_at", (/* @__PURE__ */ new Date()).toISOString()).single();
  if (!data) return null;
  return data.profiles;
}
async function deleteSession(token) {
  await supabase.from("sessions").delete().eq("token", token);
}

export { SESSION_COOKIE as S, createSession as c, deleteSession as d, getSessionProfile as g };
