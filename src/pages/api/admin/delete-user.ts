import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { getSessionProfile, SESSION_COOKIE } from '../../../lib/session';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const token   = cookies.get(SESSION_COOKIE)?.value;
  const profile = token ? await getSessionProfile(token) : null;
  if (profile?.role !== 'admin') return redirect('/login?reason=auth');

  const body = await request.formData();
  const id   = body.get('id') as string;
  if (!id) return redirect('/admin/users?err=' + encodeURIComponent('ID requerido'));

  // Borrar sesiones activas del usuario
  await supabase.from('sessions').delete().eq('profile_id', id);

  const { error } = await supabase.from('profiles').delete().eq('id', id);
  if (error) return redirect('/admin/users?err=' + encodeURIComponent(error.message));

  return redirect('/admin/users?msg=' + encodeURIComponent('Usuario eliminado correctamente'));
};
