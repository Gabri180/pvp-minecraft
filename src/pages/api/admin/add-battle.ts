import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { getSessionProfile, SESSION_COOKIE } from '../../../lib/session';
import { recalculatePointsFor } from '../../../lib/points';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const token   = cookies.get(SESSION_COOKIE)?.value;
  const profile = token ? await getSessionProfile(token) : null;
  if (profile?.role !== 'admin') return redirect('/login?reason=auth');

  const body       = await request.formData();
  const player1_id = body.get('player1_id') as string;
  const player2_id = body.get('player2_id') as string;
  const winner_id  = (body.get('winner_id') as string) || null;
  const date       = body.get('date') as string;
  const notes      = (body.get('notes') as string) || null;

  if (!player1_id || !player2_id || !date) {
    return redirect('/admin/battles?err=' + encodeURIComponent('Faltan campos requeridos'));
  }
  if (player1_id === player2_id) {
    return redirect('/admin/battles?err=' + encodeURIComponent('Los jugadores no pueden ser el mismo'));
  }
  if (winner_id && winner_id !== player1_id && winner_id !== player2_id) {
    return redirect('/admin/battles?err=' + encodeURIComponent('El ganador debe ser uno de los jugadores'));
  }

  const { error } = await supabase.from('battles').insert({ player1_id, player2_id, winner_id, date, notes });
  if (error) return redirect('/admin/battles?err=' + encodeURIComponent(error.message));

  await recalculatePointsFor(player1_id, player2_id);

  return redirect('/admin/battles?msg=' + encodeURIComponent('Batalla registrada correctamente'));
};
