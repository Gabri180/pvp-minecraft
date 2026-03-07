import { e as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, h as createAstro, m as maybeRenderHead, g as addAttribute } from '../chunks/astro/server_BRHZ-eMj.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_Hz4wgOGa.mjs';
import { S as SESSION_COOKIE } from '../chunks/session_7xTNhxbx.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Login = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Login;
  if (Astro2.cookies.get(SESSION_COOKIE)?.value) return Astro2.redirect("/");
  const reason = Astro2.url.searchParams.get("reason");
  const err = Astro2.url.searchParams.get("err");
  const step = Astro2.url.searchParams.get("step");
  const user = Astro2.url.searchParams.get("user") ?? "";
  const reasonMsg = {
    auth: "Debes iniciar sesion para acceder.",
    expired: "Tu sesion ha expirado. Vuelve a iniciar sesion.",
    forbidden: "No tienes permisos para acceder a esa pagina."
  };
  const startOnStep2 = step === "2";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Login de PvP", "showNav": false }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div style="
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: radial-gradient(ellipse at center, rgba(90,172,68,0.06) 0%, transparent 70%);
  "> <div style="width: 100%; max-width: 400px;"> <!-- Logo --> <div class="text-center" style="margin-bottom: 32px;"> <div style="
          font-size: 36px;
          color: var(--mc-gold);
          text-shadow: 4px 4px 0 rgba(0,0,0,0.9), 6px 6px 0 var(--mc-gold-dk);
          letter-spacing: 4px;
          margin-bottom: 10px;
        ">&#9876;</div> <div style="
          font-size: 18px;
          color: var(--mc-gold);
          text-shadow: 3px 3px 0 rgba(0,0,0,0.8);
          letter-spacing: 3px;
        ">PvP ARENA</div> <div style="font-size: 9px; color: var(--mc-stone); margin-top: 8px; letter-spacing: 2px;">
SISTEMA DE BATALLAS
</div> </div> <div class="mc-card"> <!-- Alerta --> <div id="alert-box" class="mc-alert mc-alert-error"${addAttribute(`display: ${reason && reasonMsg[reason] || err ? "block" : "none"};`, "style")}> ${reason && reasonMsg[reason] ? reasonMsg[reason] : err ? decodeURIComponent(err) : ""} </div> <!-- PASO 1: usuario + contraseña --> <div id="step-1"${addAttribute(startOnStep2 ? "display:none" : "", "style")}> <div class="mc-card-title text-center">LOGIN DE PVP</div> <label class="mc-label">Nombre de jugador</label> <input id="s1-username" type="text" class="mc-input" placeholder="TuNickPvP" autocomplete="username"> <label class="mc-label">Contraseña</label> <input id="s1-password" type="password" class="mc-input" placeholder="••••••••" autocomplete="current-password"> <button id="btn-step1" class="btn btn-green btn-full btn-lg" style="margin-top: 8px;">
SIGUIENTE &#8594;
</button> </div> <!-- PASO 2: codigo del admin --> <div id="step-2"${addAttribute(startOnStep2 ? "" : "display:none", "style")}> <div class="mc-card-title text-center" style="color: var(--mc-diamond);">CODIGO DE ACCESO</div> <div style="
            background: var(--mc-black);
            border: 2px solid var(--mc-green-dk);
            padding: 10px 14px;
            font-size: 9px;
            color: var(--mc-green-lt);
            margin-bottom: 16px;
            text-align: center;
            letter-spacing: 1px;
          ">
&#10003; Contraseña verificada. Introduce el codigo que te dio el admin.
</div> <form method="POST" action="/api/auth/login" id="form-login"> <input type="hidden" name="username" id="hidden-username"${addAttribute(user, "value")}> <input type="hidden" name="password" id="hidden-password"> <label class="mc-label">Codigo de acceso</label> <input name="codigo" id="s2-codigo" type="text" class="mc-input" placeholder="Ej: MC-67LFLW" autocomplete="off" autofocus required> <button type="submit" class="btn btn-gold btn-full btn-lg" style="margin-top: 8px;">
ENTRAR AL SISTEMA
</button> </form> <button id="btn-back" class="btn btn-gray btn-full" style="margin-top: 10px; font-size: 9px;">
&#8592; Volver
</button> </div> </div> <div class="text-center mt-16" style="display: flex; justify-content: center; gap: 24px;"> <a href="/register" style="font-size: 9px; color: var(--mc-light);">Crear cuenta</a> <a href="/" style="font-size: 9px; color: var(--mc-stone);">&#8592; Inicio</a> </div> </div> </div> ` })} ${renderScript($$result, "C:/Users/marti/Desktop/Proyectos/web-pvp/src/pages/login.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/marti/Desktop/Proyectos/web-pvp/src/pages/login.astro", void 0);

const $$file = "C:/Users/marti/Desktop/Proyectos/web-pvp/src/pages/login.astro";
const $$url = "/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
