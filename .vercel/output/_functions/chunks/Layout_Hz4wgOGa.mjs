import { e as createComponent, g as addAttribute, o as renderHead, r as renderTemplate, n as renderSlot, h as createAstro } from './astro/server_BRHZ-eMj.mjs';
import 'piccolore';
import 'clsx';
/* empty css                           */
import { S as SESSION_COOKIE, g as getSessionProfile } from './session_7xTNhxbx.mjs';

const $$Astro = createAstro();
const $$Layout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title = "PvP Arena", description = "Sistema de evaluacion PvP", showNav = true } = Astro2.props;
  const token = Astro2.cookies.get(SESSION_COOKIE)?.value;
  const profile = token ? await getSessionProfile(token) : null;
  const isLoggedIn = !!profile;
  const isAdmin = profile?.role === "admin";
  const pathname = Astro2.url.pathname;
  return renderTemplate`<html lang="es"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title} | PvP Arena</title><meta name="description"${addAttribute(description, "content")}><link rel="icon" href="/favicon.ico">${renderHead()}</head> <body> ${showNav && renderTemplate`<nav class="mc-nav"> <a href="/" class="mc-nav-logo">&#9888; PvP Arena</a> <div class="mc-nav-links"> <a href="/"${addAttribute([{ active: pathname === "/" }], "class:list")}>Inicio</a> ${isAdmin && renderTemplate`<a href="/admin"${addAttribute([{ active: pathname.startsWith("/admin") }], "class:list")}>Admin</a>`} ${isLoggedIn ? renderTemplate`<a href="/auth/signout" class="btn btn-red btn-sm">Salir</a>` : renderTemplate`<a href="/login" class="btn btn-green btn-sm">Entrar</a>`} </div> </nav>`} ${renderSlot($$result, $$slots["default"])} </body></html>`;
}, "C:/Users/marti/Desktop/Proyectos/web-pvp/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
