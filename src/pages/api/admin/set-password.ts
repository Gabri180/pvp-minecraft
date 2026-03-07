import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { getSessionProfile, SESSION_COOKIE } from '../../../lib/session';
import { hashPassword } from '../../../lib/crypto';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const token   = cookies.get(SESSION_COOKIE)?.value;
  const profile = token ? await getSessionProfile(token) : null;
  if (profile?.role !== 'admin') return redirect('/login?reason=auth');

  const body     = await request.formData();
  const id       = body.get('id') as string;
  const password = body.get('password') as string;

  if (!id || !password) {
    return redirect('/admin/users?err=' + encodeURIComponent('ID y contraseña son requeridos'));
  }

  const { error } = await supabase
    .from('profiles')
    .update({ password: hashPassword(password) })
    .eq('id', id);

  if (error) return redirect('/admin/users?err=' + encodeURIComponent(error.message));

  return redirect('/admin/users?msg=' + encodeURIComponent('Contraseña actualizada correctamente'));
};
