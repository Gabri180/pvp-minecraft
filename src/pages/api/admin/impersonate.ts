import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { getSessionProfile, createSession, SESSION_COOKIE, IMPERSONATE_COOKIE } from '../../../lib/session';

const COOKIE_OPTS = { path: '/', maxAge: 60 * 60 * 24 * 7, httpOnly: true, sameSite: 'lax' } as const;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const adminToken = cookies.get(SESSION_COOKIE)?.value;
  const admin      = adminToken ? await getSessionProfile(adminToken) : null;
  if (admin?.role !== 'admin') return redirect('/login?reason=auth');

  const body       = await request.formData();
  const profile_id = body.get('profile_id') as string;
  if (!profile_id) return redirect('/admin/users?err=' + encodeURIComponent('ID requerido'));
  if (profile_id === admin.id) return redirect('/admin/users?err=' + encodeURIComponent('No puedes impersonarte a ti mismo'));

  // Verificar que el usuario existe
  const { data: target } = await supabase
    .from('profiles')
    .select('id, username')
    .eq('id', profile_id)
    .single();
  if (!target) return redirect('/admin/users?err=' + encodeURIComponent('Usuario no encontrado'));

  // Crear sesión temporal para el usuario impersonado
  const newToken = await createSession(profile_id);

  // Guardar token real del admin y reemplazar sesión activa
  cookies.set(IMPERSONATE_COOKIE, adminToken!, COOKIE_OPTS);
  cookies.set(SESSION_COOKIE, newToken, COOKIE_OPTS);

  return redirect('/');
};
