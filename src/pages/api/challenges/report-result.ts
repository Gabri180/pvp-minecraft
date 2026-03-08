import type { APIRoute } from 'astro';
import { supabase, supabaseAdmin } from '../../../lib/supabase';
import { getSessionProfile, SESSION_COOKIE } from '../../../lib/session';
import { recalculatePointsFor } from '../../../lib/points';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const token   = cookies.get(SESSION_COOKIE)?.value;
  const profile = token ? await getSessionProfile(token) : null;
  if (!profile) return redirect('/login?reason=auth');

  const body      = await request.formData();
  const battle_id = body.get('battle_id') as string;
  // winner_id: el ID del ganador, o 'draw' para empate
  const winnerId  = (body.get('winner_id') as string) || 'draw';

  if (!battle_id) {
    return redirect('/challenges?err=' + encodeURIComponent('Datos invalidos'));
  }

  // Verificar que la batalla existe y este usuario es uno de los jugadores
  const { data: battle } = await supabase
    .from('battles')
    .select('id, player1_id, player2_id, winner_id')
    .eq('id', battle_id)
    .single();

  if (!battle) {
    return redirect('/challenges?err=' + encodeURIComponent('Batalla no encontrada'));
  }

  const isParticipant = battle.player1_id === profile.id || battle.player2_id === profile.id;
  if (!isParticipant) {
    return redirect('/challenges?err=' + encodeURIComponent('No eres parte de esta batalla'));
  }

  if (battle.winner_id !== null) {
    return redirect('/challenges?err=' + encodeURIComponent('El resultado ya fue reportado'));
  }

  const winner_id = winnerId === 'draw' ? null : winnerId;

  // Validar que el ganador es uno de los jugadores
  if (winner_id !== null && winner_id !== battle.player1_id && winner_id !== battle.player2_id) {
    return redirect('/challenges?err=' + encodeURIComponent('Ganador invalido'));
  }

  const db = supabaseAdmin ?? supabase;
  const { error } = await db
    .from('battles')
    .update({ winner_id })
    .eq('id', battle_id);

  if (error) return redirect('/challenges?err=' + encodeURIComponent(error.message));

  await recalculatePointsFor(battle.player1_id, battle.player2_id);

  return redirect('/challenges?msg=' + encodeURIComponent('Resultado registrado correctamente'));
};
