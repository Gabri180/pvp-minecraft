import type { APIRoute } from 'astro';
import { supabase, supabaseAdmin } from '../../../lib/supabase';
import { getSessionProfile, SESSION_COOKIE } from '../../../lib/session';
import { hashPassword } from '../../../lib/crypto';
import type { UserRole } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const token   = cookies.get(SESSION_COOKIE)?.value;
  const profile = token ? await getSessionProfile(token) : null;
  if (profile?.role !== 'admin') return redirect('/login?reason=auth');

  const body     = await request.formData();
  const id       = (body.get('id') as string)?.trim();
  const username = (body.get('username') as string)?.trim();
  const email    = (body.get('email') as string)?.trim() || null;
  const password = (body.get('password') as string)?.trim() || null;
  const role     = (body.get('role') as UserRole) ?? 'player';
  const codigo   = (body.get('codigo') as string)?.trim() || null;
  const tier     = (body.get('tier') as string)?.trim() || 'lt2';

  if (!id || !username) {
    return redirect('/admin/users?err=' + encodeURIComponent('ID y nombre son requeridos'));
  }

  // Verificar que el username no lo use otro usuario
  const { data: dup } = await supabase
    .from('profiles').select('id').eq('username', username).neq('id', id).single();
  if (dup) {
    return redirect('/admin/users?err=' + encodeURIComponent('Ese nombre de jugador ya está en uso'));
  }

  const updates: Record<string, unknown> = { username, email, role, codigo, tier };
  if (password) updates.password = hashPassword(password);

  const db = supabaseAdmin ?? supabase;
  const { error } = await db.from('profiles').update(updates).eq('id', id);
  if (error) return redirect('/admin/users?err=' + encodeURIComponent(error.message));

  return redirect('/admin/users?msg=' + encodeURIComponent(`Usuario "${username}" actualizado`));
};
