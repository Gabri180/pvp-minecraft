-- ============================================================
-- PvP Arena - Points Migration
-- Ejecuta esto en el SQL Editor de tu proyecto Supabase
-- ============================================================

-- ── Columna points en profiles ──
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS points INTEGER NOT NULL DEFAULT 0;

-- ── Actualizar get_player_stats() para incluir puntos y ordenar por ellos ──
CREATE OR REPLACE FUNCTION public.get_player_stats()
RETURNS TABLE (
  profile_id  UUID,
  username    TEXT,
  total       BIGINT,
  wins        BIGINT,
  losses      BIGINT,
  draws       BIGINT,
  winrate     NUMERIC,
  points      INTEGER
)
LANGUAGE sql STABLE AS $$
  SELECT
    p.id                                          AS profile_id,
    p.username,
    COUNT(b.id)                                   AS total,
    COUNT(b.id) FILTER (WHERE b.winner_id = p.id) AS wins,
    COUNT(b.id) FILTER (
      WHERE b.winner_id IS NOT NULL AND b.winner_id <> p.id
    )                                              AS losses,
    COUNT(b.id) FILTER (WHERE b.winner_id IS NULL) AS draws,
    CASE
      WHEN COUNT(b.id) = 0 THEN 0
      ELSE ROUND(
        COUNT(b.id) FILTER (WHERE b.winner_id = p.id)::NUMERIC
        / COUNT(b.id)::NUMERIC * 100, 2
      )
    END                                            AS winrate,
    p.points
  FROM public.profiles p
  LEFT JOIN public.battles b
    ON b.player1_id = p.id OR b.player2_id = p.id
  GROUP BY p.id, p.username, p.points
  HAVING COUNT(b.id) > 0
  ORDER BY p.points DESC, wins DESC, winrate DESC;
$$;
