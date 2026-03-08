import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { getSessionProfile, SESSION_COOKIE } from '../../../lib/session';
import { recalculatePointsFor } from '../../../lib/points';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const token   = cookies.get(SESSION_COOKIE)?.value;
  const profile = token ? await getSessionProfile(token) : null;
  if (profile?.role !== 'admin') return redirect('/login?reason=auth');

  const body       = await request.formData();
  const id         = body.get('id') as string;
  const player1_id = body.get('player1_id') as string;
  const player2_id = body.get('player2_id') as string;
  const winner_id  = (body.get('winner_id') as string) || null;
  const date       = body.get('date') as string;
  const notes      = (body.get('notes') as string) || null;

  if (!id || !player1_id || !player2_id || !date) {
    return redirect('/admin/battles?err=' + encodeURIComponent('Faltan campos requeridos'));
  }
  if (player1_id === player2_id) {
    return redirect('/admin/battles?err=' + encodeURIComponent('Los jugadores no pueden ser el mismo'));
  }

  // Obtener jugadores anteriores para recalcular si cambiaron
  const { data: old } = await supabase.from('battles').select('player1_id, player2_id').eq('id', id).single();

  const { error } = await supabase.from('battles').update({ player1_id, player2_id, winner_id, date, notes }).eq('id', id);
  if (error) return redirect('/admin/battles?err=' + encodeURIComponent(error.message));

  await recalculatePointsFor(player1_id, player2_id, old?.player1_id, old?.player2_id);

  return redirect('/admin/battles?msg=' + encodeURIComponent('Batalla actualizada correctamente'));
};
