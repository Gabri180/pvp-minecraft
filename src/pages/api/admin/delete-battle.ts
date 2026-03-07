import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { getSessionProfile, SESSION_COOKIE } from '../../../lib/session';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const token   = cookies.get(SESSION_COOKIE)?.value;
  const profile = token ? await getSessionProfile(token) : null;
  if (profile?.role !== 'admin') return redirect('/login?reason=auth');

  const body = await request.formData();
  const id   = body.get('id') as string;
  if (!id) return redirect('/admin/battles?err=' + encodeURIComponent('ID requerido'));

  const { error } = await supabase.from('battles').delete().eq('id', id);
  if (error) return redirect('/admin/battles?err=' + encodeURIComponent(error.message));

  return redirect('/admin/battles?msg=' + encodeURIComponent('Batalla eliminada correctamente'));
};
