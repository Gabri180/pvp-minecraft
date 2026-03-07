import { e as createComponent, k as renderComponent, l as renderScript, r as renderTemplate, h as createAstro, m as maybeRenderHead } from '../chunks/astro/server_BRHZ-eMj.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_Hz4wgOGa.mjs';
import { S as SESSION_COOKIE } from '../chunks/session_7xTNhxbx.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Register = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Register;
  if (Astro2.cookies.get(SESSION_COOKIE)?.value) return Astro2.redirect("/");
  const err = Astro2.url.searchParams.get("err");
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Registrarse", "showNav": false }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div style="
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
CREAR CUENTA
</div> </div> <div class="mc-card"> <div class="mc-card-title text-center">NUEVO JUGADOR</div> ${err && renderTemplate`<div class="mc-alert mc-alert-error">${decodeURIComponent(err)}</div>`} <form method="POST" action="/api/auth/register"> <label class="mc-label">Nombre de jugador *</label> <input name="username" type="text" class="mc-input" placeholder="TuNickPvP" maxlength="30" required autocomplete="username"> <label class="mc-label">Correo (opcional)</label> <input name="email" type="email" class="mc-input" placeholder="usuario@outlook.com" autocomplete="email"> <label class="mc-label">Contraseña *</label> <input name="password" id="password" type="password" class="mc-input" placeholder="Min. 6 caracteres" minlength="6" required autocomplete="new-password"> <label class="mc-label">Confirmar contraseña *</label> <input name="confirm" id="confirm" type="password" class="mc-input" placeholder="Repite la contraseña" minlength="6" required autocomplete="new-password"> <div id="pass-mismatch" style="
            display: none;
            font-size: 9px;
            color: var(--mc-red);
            margin-bottom: 10px;
            margin-top: -6px;
          ">Las contraseñas no coinciden</div> <button type="submit" id="btn-register" class="btn btn-green btn-full btn-lg" style="margin-top: 8px;">
CREAR CUENTA
</button> </form> <div class="pixel-divider" style="margin: 18px 0;"></div> <div style="font-size: 9px; color: var(--mc-stone); text-align: center; line-height: 2;">
Tu cuenta se creara con rol <span style="color: var(--mc-green-lt);">player</span>.<br>
El admin puede asignarte un codigo adicional.
</div> </div> <div class="text-center mt-16" style="display: flex; justify-content: center; gap: 24px;"> <a href="/login" style="font-size: 9px; color: var(--mc-light);">Ya tengo cuenta</a> <a href="/" style="font-size: 9px; color: var(--mc-stone);">&#8592; Inicio</a> </div> </div> </div> ` })} ${renderScript($$result, "C:/Users/marti/Desktop/Proyectos/web-pvp/src/pages/register.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/marti/Desktop/Proyectos/web-pvp/src/pages/register.astro", void 0);

const $$file = "C:/Users/marti/Desktop/Proyectos/web-pvp/src/pages/register.astro";
const $$url = "/register";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Register,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
