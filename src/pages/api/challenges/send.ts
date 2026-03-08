import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { getSessionProfile, SESSION_COOKIE } from '../../../lib/session';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const token   = cookies.get(SESSION_COOKIE)?.value;
  const profile = token ? await getSessionProfile(token) : null;
  if (!profile) return redirect('/login?reason=auth');

  const body         = await request.formData();
  const challenged_id = body.get('challenged_id') as string;

  if (!challenged_id) {
    return redirect('/challenges?err=' + encodeURIComponent('Selecciona un jugador'));
  }
  if (challenged_id === profile.id) {
    return redirect('/challenges?err=' + encodeURIComponent('No puedes retarte a ti mismo'));
  }

  // Verificar que no haya un reto pendiente entre estos dos jugadores (en cualquier direccion)
  const { data: existing } = await supabase
    .from('challenges')
    .select('id')
    .eq('status', 'pending')
    .or(
      `and(challenger_id.eq.${profile.id},challenged_id.eq.${challenged_id}),` +
      `and(challenger_id.eq.${challenged_id},challenged_id.eq.${profile.id})`
    )
    .limit(1);

  if (existing && existing.length > 0) {
    return redirect('/challenges?err=' + encodeURIComponent('Ya existe un reto pendiente entre estos jugadores'));
  }

  const { error } = await supabase.from('challenges').insert({
    challenger_id: profile.id,
    challenged_id,
  });

  if (error) return redirect('/challenges?err=' + encodeURIComponent(error.message));

  return redirect('/challenges?msg=' + encodeURIComponent('Reto enviado correctamente'));
};
