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
    return redirect('/admin/users?err=' + encodeURIComponent('No se seleccionaron usuarios'));
  }

  // Guardar oponentes para recalcular puntos tras borrar
  const { data: battles } = await supabase
    .from('battles')
    .select('player1_id, player2_id')
    .or(ids.map(id => `player1_id.eq.${id},player2_id.eq.${id}`).join(','));

  const opponentIds = [...new Set(
    (battles ?? []).flatMap(b => [b.player1_id, b.player2_id])
  )].filter(id => !ids.includes(id));

  const db = supabaseAdmin ?? supabase;
  const { error } = await db.from('profiles').delete().in('id', ids);
  if (error) return redirect('/admin/users?err=' + encodeURIComponent(error.message));

  if (opponentIds.length > 0) await recalculatePointsFor(...opponentIds);

  return redirect('/admin/users?msg=' + encodeURIComponent(`${ids.length} usuario(s) eliminado(s)`));
};
