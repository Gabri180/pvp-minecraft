import type { APIRoute } from 'astro';
import { deleteSession, SESSION_COOKIE, IMPERSONATE_COOKIE } from '../../../lib/session';

const COOKIE_OPTS = { path: '/', maxAge: 60 * 60 * 24 * 7, httpOnly: true, sameSite: 'lax' } as const;

export const POST: APIRoute = async ({ cookies, redirect }) => {
  const adminToken       = cookies.get(IMPERSONATE_COOKIE)?.value;
  const impersonateToken = cookies.get(SESSION_COOKIE)?.value;

  if (!adminToken) return redirect('/admin/users');

  // Eliminar la sesión temporal del usuario impersonado
  if (impersonateToken) await deleteSession(impersonateToken);

  // Restaurar sesión del admin
  cookies.set(SESSION_COOKIE, adminToken, COOKIE_OPTS);
  cookies.delete(IMPERSONATE_COOKIE, { path: '/' });

  return redirect('/admin/users');
};
