import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { hashPassword } from '../../../lib/crypto';
import { createSession, SESSION_COOKIE } from '../../../lib/session';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const body     = await request.formData();
  const username = (body.get('username') as string)?.trim();
  const email    = (body.get('email') as string)?.trim() || null;
  const password = body.get('password') as string;
  const confirm  = body.get('confirm') as string;
  const tier     = (body.get('tier') as string)?.trim() || 'lt2';

  if (!username || !password) {
    return redirect('/register?err=' + encodeURIComponent('El nombre y la contraseña son requeridos'));
  }
  if (password !== confirm) {
    return redirect('/register?err=' + encodeURIComponent('Las contraseñas no coinciden'));
  }
  if (password.length < 6) {
    return redirect('/register?err=' + encodeURIComponent('La contraseña debe tener al menos 6 caracteres'));
  }

  // Comprobar que el username no exista ya
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .single();

  if (existing) {
    return redirect('/register?err=' + encodeURIComponent('Ese nombre de jugador ya está en uso'));
  }

  const { data: newProfile, error } = await supabase
    .from('profiles')
    .insert({
      user_id: crypto.randomUUID(),
      username,
      email,
      password: hashPassword(password),
      role: 'player',
      tier,
    })
    .select('id, role')
    .single();

  if (error || !newProfile) {
    return redirect('/register?err=' + encodeURIComponent(error?.message ?? 'Error al crear la cuenta'));
  }

  // Auto-login tras el registro
  const token = await createSession(newProfile.id);
  cookies.set(SESSION_COOKIE, token, {
    path: '/',
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: 'lax',
  });

  return redirect('/');
};
