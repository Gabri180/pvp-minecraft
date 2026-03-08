import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { getSessionProfile, SESSION_COOKIE } from '../../../lib/session';
import { hashPassword } from '../../../lib/crypto';
import type { UserRole } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const token   = cookies.get(SESSION_COOKIE)?.value;
  const profile = token ? await getSessionProfile(token) : null;
  if (profile?.role !== 'admin') return redirect('/login?reason=auth');

  const body     = await request.formData();
  const username = (body.get('username') as string)?.trim();
  const email    = (body.get('email') as string)?.trim() || null;
  const password = body.get('password') as string;
  const codigo   = (body.get('codigo') as string)?.trim();
  const role     = (body.get('role') as UserRole) ?? 'player';
  const tier     = (body.get('tier') as string)?.trim() || 'lt2';

  if (!username || !password || !codigo) {
    return redirect('/admin/users?err=' + encodeURIComponent('Nombre, contraseña y codigo son requeridos'));
  }

  const { data: existing } = await supabase
    .from('profiles').select('id').eq('username', username).single();
  if (existing) {
    return redirect('/admin/users?err=' + encodeURIComponent('Ya existe un usuario con ese nombre'));
  }

  const { error } = await supabase.from('profiles').insert({
    user_id: crypto.randomUUID(),
    username,
    email,
    password: hashPassword(password),
    codigo,
    role,
    tier,
  });

  if (error) return redirect('/admin/users?err=' + encodeURIComponent(error.message));

  return redirect('/admin/users?msg=' + encodeURIComponent(`Usuario "${username}" creado correctamente`));
};
