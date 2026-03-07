import { e as createComponent, h as createAstro } from '../../chunks/astro/server_BRHZ-eMj.mjs';
import 'piccolore';
import 'clsx';
import { S as SESSION_COOKIE, d as deleteSession } from '../../chunks/session_7xTNhxbx.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const $$Signout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Signout;
  const token = Astro2.cookies.get(SESSION_COOKIE)?.value;
  if (token) await deleteSession(token);
  Astro2.cookies.delete(SESSION_COOKIE, { path: "/" });
  return Astro2.redirect("/login");
}, "C:/Users/marti/Desktop/Proyectos/web-pvp/src/pages/auth/signout.astro", void 0);

const $$file = "C:/Users/marti/Desktop/Proyectos/web-pvp/src/pages/auth/signout.astro";
const $$url = "/auth/signout";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Signout,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
