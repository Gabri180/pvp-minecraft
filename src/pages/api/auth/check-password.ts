import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { hashPassword } from '../../../lib/crypto';

export const POST: APIRoute = async ({ request }) => {
  const body     = await request.json();
  const username = (body.username as string)?.trim();
  const password = body.password as string;

  if (!username || !password) {
    return new Response(JSON.stringify({ ok: false, error: 'Completa todos los campos' }), { status: 400 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, password, codigo')
    .eq('username', username)
    .single();

  if (!profile || profile.password !== hashPassword(password)) {
    return new Response(JSON.stringify({ ok: false, error: 'Usuario o contraseña incorrectos' }), { status: 401 });
  }

  // Indica si el usuario tiene codigo asignado
  const needsCodigo = !!profile.codigo;
  return new Response(JSON.stringify({ ok: true, needsCodigo }), { status: 200 });
};
