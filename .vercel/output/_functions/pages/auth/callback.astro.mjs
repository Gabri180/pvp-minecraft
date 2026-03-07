import { e as createComponent, o as renderHead, l as renderScript, r as renderTemplate } from '../../chunks/astro/server_BRHZ-eMj.mjs';
import 'piccolore';
import 'clsx';
/* empty css                                       */
export { renderers } from '../../renderers.mjs';

const $$Callback = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`<html lang="es" data-astro-cid-qbporkgn> <head><meta charset="UTF-8"><title>Autenticando...</title>${renderHead()}</head> <body data-astro-cid-qbporkgn> <div class="loader" data-astro-cid-qbporkgn></div> <p data-astro-cid-qbporkgn>VERIFICANDO SESION...</p> ${renderScript($$result, "C:/Users/marti/Desktop/Proyectos/web-pvp/src/pages/auth/callback.astro?astro&type=script&index=0&lang.ts")} </body> </html>`;
}, "C:/Users/marti/Desktop/Proyectos/web-pvp/src/pages/auth/callback.astro", void 0);

const $$file = "C:/Users/marti/Desktop/Proyectos/web-pvp/src/pages/auth/callback.astro";
const $$url = "/auth/callback";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Callback,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
