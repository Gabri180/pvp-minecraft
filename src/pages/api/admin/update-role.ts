import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { getSessionProfile, SESSION_COOKIE } from '../../../lib/session';
import type { UserRole } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const token   = cookies.get(SESSION_COOKIE)?.value;
  const profile = token ? await getSessionProfile(token) : null;
  if (profile?.role !== 'admin') return redirect('/login?reason=auth');

  const body = await request.formData();
  const id   = body.get('id') as string;
  const role = body.get('role') as UserRole;

  if (!id || !['admin', 'moderator', 'player'].includes(role)) {
    return redirect('/admin/users?err=' + encodeURIComponent('Datos invalidos'));
  }

  const { error } = await supabase.from('profiles').update({ role }).eq('id', id);
  if (error) return redirect('/admin/users?err=' + encodeURIComponent(error.message));

  return redirect('/admin/users?msg=' + encodeURIComponent('Rol actualizado correctamente'));
};
