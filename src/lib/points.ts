import { supabase, supabaseAdmin } from './supabase';

/**
 * Recalcula los puntos de un jugador desde cero basándose en su historial de batallas.
 * Fórmula: cada victoria vale 5 pts base + bonus por racha consecutiva.
 * Racha N >= 2: bonus = max(0, 7 - N). Ej: racha 2 → +5, racha 3 → +4, racha 4 → +3...
 */
export async function recalculatePoints(profileId: string): Promise<void> {
  // Obtener todas las batallas del jugador ordenadas por fecha
  const { data: battles } = await supabase
    .from('battles')
    .select('id, player1_id, player2_id, winner_id, date')
    .or(`player1_id.eq.${profileId},player2_id.eq.${profileId}`)
    .order('date', { ascending: true });

  let points = 0;
  let streak = 0;

  for (const b of battles ?? []) {
    if (b.winner_id === profileId) {
      streak++;
      const bonus = streak > 1 ? Math.max(0, 7 - streak) : 0;
      points += 5 + bonus;
    } else {
      // Derrota o empate: resetea la racha
      streak = 0;
    }
  }

  const db = supabaseAdmin ?? supabase;
  await db.from('profiles').update({ points, current_streak: streak }).eq('id', profileId);
}

/** Recalcula puntos para múltiples jugadores (deduplica IDs). */
export async function recalculatePointsFor(...profileIds: (string | null | undefined)[]): Promise<void> {
  const ids = [...new Set(profileIds.filter(Boolean))] as string[];
  await Promise.all(ids.map(id => recalculatePoints(id)));
}
