-- ============================================================
-- PvP Arena - Challenges Migration
-- Ejecuta esto en el SQL Editor de tu proyecto Supabase
-- ============================================================

-- ── Tabla: challenges ──
CREATE TABLE IF NOT EXISTS public.challenges (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenger_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  challenged_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status        TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'accepted', 'declined', 'cancelled')),
  battle_id     UUID REFERENCES public.battles(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT challenges_different_players CHECK (challenger_id <> challenged_id)
);

ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

-- Cualquiera puede leer/escribir (la autorizacion se hace en el servidor via sesion)
CREATE POLICY "challenges_all"
  ON public.challenges FOR ALL
  USING (true)
  WITH CHECK (true);
