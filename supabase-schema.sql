-- ============================================================
-- PvP Arena - Supabase Schema
-- Ejecuta esto en el SQL Editor de tu proyecto Supabase
-- ============================================================

-- ── Tabla: profiles ──
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  username    TEXT,
  role        TEXT NOT NULL DEFAULT 'player'
                CHECK (role IN ('admin', 'moderator', 'player')),
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Tabla: battles ──
CREATE TABLE IF NOT EXISTS public.battles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player1_id  UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  player2_id  UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  winner_id   UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  date        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT  different_players CHECK (player1_id <> player2_id)
);

-- ── Funcion: get_player_stats() ──
CREATE OR REPLACE FUNCTION public.get_player_stats()
RETURNS TABLE (
  profile_id  UUID,
  username    TEXT,
  total       BIGINT,
  wins        BIGINT,
  losses      BIGINT,
  draws       BIGINT,
  winrate     NUMERIC
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
    END                                            AS winrate
  FROM public.profiles p
  LEFT JOIN public.battles b
    ON b.player1_id = p.id OR b.player2_id = p.id
  GROUP BY p.id, p.username
  HAVING COUNT(b.id) > 0
  ORDER BY wins DESC, winrate DESC;
$$;

-- ── Row Level Security ──
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.battles  ENABLE ROW LEVEL SECURITY;

-- profiles: cualquiera puede leer
CREATE POLICY "profiles_select_all"
  ON public.profiles FOR SELECT USING (true);

-- profiles: solo admin puede insertar/actualizar/borrar via service role
-- (el service role bypasa RLS automaticamente)
CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "profiles_update_admin"
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid() AND p.role = 'admin'
    )
    OR auth.uid() = user_id
  );

CREATE POLICY "profiles_delete_admin"
  ON public.profiles FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid() AND p.role = 'admin'
    )
  );

-- battles: cualquiera puede leer
CREATE POLICY "battles_select_all"
  ON public.battles FOR SELECT USING (true);

-- battles: solo admin puede insertar/actualizar/borrar
CREATE POLICY "battles_insert_admin"
  ON public.battles FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "battles_update_admin"
  ON public.battles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "battles_delete_admin"
  ON public.battles FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid() AND p.role = 'admin'
    )
  );

-- ── Trigger: auto-crear perfil al registrarse ──
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    ),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── NOTA: Para hacer admin a un usuario, ejecuta: ──
-- UPDATE public.profiles SET role = 'admin' WHERE username = 'TU_NOMBRE';
