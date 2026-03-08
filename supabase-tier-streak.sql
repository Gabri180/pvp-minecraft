-- ============================================================
-- PvP Arena - Tier & Streak Migration
-- Ejecuta esto en el SQL Editor de tu proyecto Supabase
-- ============================================================

-- ── Nuevas columnas en profiles ──
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS tier           TEXT    NOT NULL DEFAULT 'lt2';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS current_streak INTEGER NOT NULL DEFAULT 0;

-- ── Actualizar get_player_stats() con tier y racha ──
DROP FUNCTION IF EXISTS public.get_player_stats();
CREATE FUNCTION public.get_player_stats()
RETURNS TABLE (
  profile_id     UUID,
  username       TEXT,
  tier           TEXT,
  total          BIGINT,
  wins           BIGINT,
  losses         BIGINT,
  draws          BIGINT,
  winrate        NUMERIC,
  points         INTEGER,
  current_streak INTEGER
)
LANGUAGE sql STABLE AS $$
  SELECT
    p.id,
    p.username,
    p.tier,
    COUNT(b.id)                                                                    AS total,
    COUNT(b.id) FILTER (WHERE b.winner_id = p.id)                                 AS wins,
    COUNT(b.id) FILTER (WHERE b.winner_id IS NOT NULL AND b.winner_id <> p.id)    AS losses,
    COUNT(b.id) FILTER (WHERE b.winner_id IS NULL)                                AS draws,
    CASE
      WHEN COUNT(b.id) = 0 THEN 0
      ELSE ROUND(COUNT(b.id) FILTER (WHERE b.winner_id = p.id)::NUMERIC / COUNT(b.id)::NUMERIC * 100, 2)
    END                                                                            AS winrate,
    p.points,
    p.current_streak
  FROM public.profiles p
  LEFT JOIN public.battles b ON b.player1_id = p.id OR b.player2_id = p.id
  GROUP BY p.id, p.username, p.tier, p.points, p.current_streak
  HAVING COUNT(b.id) > 0
  ORDER BY p.points DESC, wins DESC, winrate DESC;
$$;
