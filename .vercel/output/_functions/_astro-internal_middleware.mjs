import { d as defineMiddleware, s as sequence } from './chunks/index_CCMxDy-Y.mjs';
import { S as SESSION_COOKIE, g as getSessionProfile } from './chunks/session_7xTNhxbx.mjs';
import 'es-module-lexer';
import './chunks/astro-designed-error-pages_OAEgz86n.mjs';
import 'piccolore';
import './chunks/astro/server_BRHZ-eMj.mjs';
import 'clsx';

const PROTECTED_ROUTES = ["/admin"];
const onRequest$1 = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  if (!isProtected) return next();
  const token = context.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return context.redirect("/login?reason=auth");
  const profile = await getSessionProfile(token);
  if (!profile) {
    context.cookies.delete(SESSION_COOKIE, { path: "/" });
    return context.redirect("/login?reason=expired");
  }
  if (profile.role !== "admin") {
    return context.redirect("/?reason=forbidden");
  }
  return next();
});

const onRequest = sequence(
	
	onRequest$1
	
);

export { onRequest };
