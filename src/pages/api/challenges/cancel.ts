import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { getSessionProfile, SESSION_COOKIE } from '../../../lib/session';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const token   = cookies.get(SESSION_COOKIE)?.value;
  const profile = token ? await getSessionProfile(token) : null;
  if (!profile) return redirect('/login?reason=auth');

  const body         = await request.formData();
  const challenge_id = body.get('challenge_id') as string;

  if (!challenge_id) {
    return redirect('/challenges?err=' + encodeURIComponent('Datos invalidos'));
  }

  const { data: challenge } = await supabase
    .from('challenges')
    .select('id')
    .eq('id', challenge_id)
    .eq('challenger_id', profile.id)
    .eq('status', 'pending')
    .single();

  if (!challenge) {
    return redirect('/challenges?err=' + encodeURIComponent('Reto no encontrado o no valido'));
  }

  await supabase.from('challenges').update({ status: 'cancelled' }).eq('id', challenge_id);

  return redirect('/challenges?msg=' + encodeURIComponent('Reto cancelado'));
};
