import { defineMiddleware } from 'astro:middleware';
import { getSessionProfile, SESSION_COOKIE } from './lib/session';

const PROTECTED_ROUTES = ['/admin'];

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));

  if (!isProtected) return next();

  const token = context.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return context.redirect('/login?reason=auth');

  const profile = await getSessionProfile(token);
  if (!profile) {
    context.cookies.delete(SESSION_COOKIE, { path: '/' });
    return context.redirect('/login?reason=expired');
  }

  if (profile.role !== 'admin') {
    return context.redirect('/?reason=forbidden');
  }

  return next();
});
