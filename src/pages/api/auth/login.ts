import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { hashPassword } from '../../../lib/crypto';
import { createSession, SESSION_COOKIE } from '../../../lib/session';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const body     = await request.formData();
  const username = (body.get('username') as string)?.trim();
  const password = body.get('password') as string;
  const codigo   = (body.get('codigo') as string)?.trim();

  if (!username || !password || !codigo) {
    return redirect('/login?err=' + encodeURIComponent('Completa todos los campos'));
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role, password_hash, codigo')
    .eq('username', username)
    .single();

  if (!profile || profile.password_hash !== hashPassword(password)) {
    return redirect('/login?err=' + encodeURIComponent('Usuario o contraseña incorrectos'));
  }

  if (profile.codigo !== codigo) {
    return redirect('/login?err=' + encodeURIComponent('Codigo de acceso incorrecto') + '&step=2&user=' + encodeURIComponent(username));
  }

  const token = await createSession(profile.id);
  cookies.set(SESSION_COOKIE, token, {
    path: '/',
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: 'lax',
  });

  return redirect(profile.role === 'admin' ? '/admin' : '/');
};
