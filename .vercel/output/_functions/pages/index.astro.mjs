import { e as createComponent, k as renderComponent, r as renderTemplate, h as createAstro, m as maybeRenderHead, p as Fragment, g as addAttribute } from '../chunks/astro/server_BRHZ-eMj.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_Hz4wgOGa.mjs';
import { s as supabase } from '../chunks/supabase_C2eohQQp.mjs';
import { S as SESSION_COOKIE, g as getSessionProfile } from '../chunks/session_7xTNhxbx.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const token = Astro2.cookies.get(SESSION_COOKIE)?.value;
  const profile = token ? await getSessionProfile(token) : null;
  const isAdmin = profile?.role === "admin";
  const { data: statsRaw } = await supabase.rpc("get_player_stats").limit(10);
  const stats = statsRaw ?? [];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Inicio" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section style="
    min-height: 55vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 60px 24px 40px;
    background: radial-gradient(ellipse at center, rgba(90,172,68,0.08) 0%, transparent 70%);
    border-bottom: 4px solid var(--mc-green-dk);
  "> <div style="
      font-size: clamp(24px, 5vw, 48px);
      color: var(--mc-gold);
      text-shadow: 4px 4px 0 rgba(0,0,0,0.9), 6px 6px 0 var(--mc-gold-dk);
      letter-spacing: 4px;
      margin-bottom: 16px;
      line-height: 1.4;
    ">&#9876; PvP ARENA</div> <div style="font-size: 11px; color: var(--mc-light); max-width: 500px; line-height: 2; margin-bottom: 36px;">
Sistema oficial de seguimiento y evaluacion de batallas PvP.
      Registra tus victorias. Domina el ranking.
</div> <div style="display: flex; gap: 16px; flex-wrap: wrap; justify-content: center;"> ${profile ? isAdmin ? renderTemplate`<a href="/admin" class="btn btn-gold btn-lg">Panel Admin</a>` : renderTemplate`<span class="btn btn-green btn-lg" style="cursor:default;">Bienvenido, ${profile.username}</span>` : renderTemplate`<a href="/login" class="btn btn-green btn-lg">Iniciar Sesion</a>`} <a href="#leaderboard" class="btn btn-gray btn-lg">Ver Ranking</a> </div> </section> <section class="container page-content"> ${stats.length > 0 ? renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <div id="leaderboard" class="mc-card-title" style="margin-bottom: 16px; border: none; padding: 0; font-size: 14px;">
&#127942; RANKING GLOBAL
</div> <div class="mc-card" style="padding: 0; overflow: hidden;"> <table class="mc-table"> <thead> <tr> <th>#</th> <th>Jugador</th> <th>Batallas</th> <th>Victorias</th> <th>Derrotas</th> <th>Draws</th> <th>Win Rate</th> </tr> </thead> <tbody> ${stats.map((s, i) => renderTemplate`<tr> <td> <span${addAttribute(`color: ${i === 0 ? "var(--mc-gold)" : i === 1 ? "#C0C0C0" : i === 2 ? "#CD7F32" : "var(--mc-light)"}`, "style")}> ${i === 0 ? "\u2605" : i === 1 ? "\u2726" : i === 2 ? "\u25C6" : `#${i + 1}`} </span> </td> <td style="color: var(--mc-green-lt);">${s.username ?? "?"}</td> <td>${s.total}</td> <td style="color: var(--mc-green-lt);">${s.wins}</td> <td style="color: var(--mc-red);">${s.losses}</td> <td style="color: var(--mc-light);">${s.draws}</td> <td> <span${addAttribute(`badge ${s.winrate >= 60 ? "badge-win" : s.winrate >= 40 ? "badge-draw" : "badge-loss"}`, "class")}> ${s.winrate.toFixed(0)}%
</span> </td> </tr>`)} </tbody> </table> </div> ` })}` : renderTemplate`<div class="mc-card text-center" style="padding: 60px;"> <div style="font-size: 40px; margin-bottom: 20px;">&#9876;</div> <div style="color: var(--mc-light); font-size: 11px; line-height: 2.2;">
Aun no hay batallas registradas.<br> ${isAdmin ? renderTemplate`<a href="/admin/battles">Agrega la primera batalla desde el panel admin</a>` : "El admin debe registrar las primeras batallas."} </div> </div>`} </section> ` })}`;
}, "C:/Users/marti/Desktop/Proyectos/web-pvp/src/pages/index.astro", void 0);

const $$file = "C:/Users/marti/Desktop/Proyectos/web-pvp/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
