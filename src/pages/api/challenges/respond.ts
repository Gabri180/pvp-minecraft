import type { APIRoute } from 'astro';
import { supabase, supabaseAdmin } from '../../../lib/supabase';
import { getSessionProfile, SESSION_COOKIE } from '../../../lib/session';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const token   = cookies.get(SESSION_COOKIE)?.value;
  const profile = token ? await getSessionProfile(token) : null;
  if (!profile) return redirect('/login?reason=auth');

  const body         = await request.formData();
  const challenge_id = body.get('challenge_id') as string;
  const action       = body.get('action') as string; // 'accept' | 'decline'

  if (!challenge_id || !['accept', 'decline'].includes(action)) {
    return redirect('/challenges?err=' + encodeURIComponent('Datos invalidos'));
  }

  // Verificar que el reto existe y es para este usuario
  const { data: challenge } = await supabase
    .from('challenges')
    .select('id, challenger_id, challenged_id, status')
    .eq('id', challenge_id)
    .eq('challenged_id', profile.id)
    .eq('status', 'pending')
    .single();

  if (!challenge) {
    return redirect('/challenges?err=' + encodeURIComponent('Reto no encontrado o no valido'));
  }

  if (action === 'decline') {
    await supabase.from('challenges').update({ status: 'declined' }).eq('id', challenge_id);
    return redirect('/challenges?msg=' + encodeURIComponent('Reto rechazado'));
  }

  // Aceptar: crear batalla automaticamente
  const db = supabaseAdmin ?? supabase;
  const { data: battle, error: battleError } = await db
    .from('battles')
    .insert({
      player1_id: challenge.challenger_id,
      player2_id: challenge.challenged_id,
      date:       new Date().toISOString(),
      winner_id:  null,
      notes:      'Batalla creada desde reto',
    })
    .select('id')
    .single();

  if (battleError || !battle) {
    return redirect('/challenges?err=' + encodeURIComponent('Error al crear la batalla: ' + (battleError?.message ?? 'desconocido')));
  }

  await supabase
    .from('challenges')
    .update({ status: 'accepted', battle_id: battle.id })
    .eq('id', challenge_id);

  return redirect('/challenges?msg=' + encodeURIComponent('Reto aceptado. Batalla creada. Reporta el resultado cuando terminen.'));
};
