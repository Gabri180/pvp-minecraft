import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { getSessionProfile, SESSION_COOKIE } from '../../../lib/session';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const token   = cookies.get(SESSION_COOKIE)?.value;
  const profile = token ? await getSessionProfile(token) : null;
  if (profile?.role !== 'admin') return redirect('/login?reason=auth');

  const body   = await request.formData();
  const id     = body.get('id') as string;
  const codigo = (body.get('codigo') as string)?.trim();

  if (!id || !codigo) {
    return redirect('/admin/users?err=' + encodeURIComponent('ID y codigo son requeridos'));
  }

  const { error } = await supabase.from('profiles').update({ codigo }).eq('id', id);
  if (error) return redirect('/admin/users?err=' + encodeURIComponent(error.message));

  return redirect('/admin/users?msg=' + encodeURIComponent('Codigo actualizado correctamente'));
};
