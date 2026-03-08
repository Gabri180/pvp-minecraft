import type { APIRoute } from 'astro';
import { supabase, supabaseAdmin } from '../../../lib/supabase';
import { getSessionProfile, SESSION_COOKIE } from '../../../lib/session';
import { recalculatePointsFor } from '../../../lib/points';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const token   = cookies.get(SESSION_COOKIE)?.value;
  const profile = token ? await getSessionProfile(token) : null;
  if (profile?.role !== 'admin') return redirect('/login?reason=auth');

  const body = await request.formData();
  const ids  = (body.get('ids') as string ?? '').split(',').map(s => s.trim()).filter(Boolean);

  if (ids.length === 0) {
    return redirect('/admin/battles?err=' + encodeURIComponent('No se seleccionaron batallas'));
  }

  // Obtener jugadores antes de borrar para recalcular puntos
  const { data: battles } = await supabase
    .from('battles').select('player1_id, player2_id').in('id', ids);

  const playerIds = [...new Set(
    (battles ?? []).flatMap(b => [b.player1_id, b.player2_id])
  )];

  const db = supabaseAdmin ?? supabase;
  const { error } = await db.from('battles').delete().in('id', ids);
  if (error) return redirect('/admin/battles?err=' + encodeURIComponent(error.message));

  if (playerIds.length > 0) await recalculatePointsFor(...playerIds);

  return redirect('/admin/battles?msg=' + encodeURIComponent(`${ids.length} batalla(s) eliminada(s)`));
};
