import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, g as addAttribute } from '../../chunks/astro/server_BRHZ-eMj.mjs';
import 'piccolore';
import { $ as $$AdminLayout } from '../../chunks/AdminLayout_R-Azu4Gb.mjs';
import { s as supabase } from '../../chunks/supabase_C2eohQQp.mjs';
export { renderers } from '../../renderers.mjs';

const $$Stats = createComponent(async ($$result, $$props, $$slots) => {
  const { data: statsRaw } = await supabase.rpc("get_player_stats");
  const stats = statsRaw ?? [];
  const { data: battlesRaw } = await supabase.from("battles").select(`
    id, date,
    player1:profiles!battles_player1_id_fkey(username),
    player2:profiles!battles_player2_id_fkey(username),
    winner:profiles!battles_winner_id_fkey(username)
  `).order("date", { ascending: false });
  const battles = battlesRaw ?? [];
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Estadisticas", "activeSection": "stats" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mc-card-title" style="font-size: 16px;">&#128202; ESTADISTICAS COMPLETAS</div>  <div class="mc-card" style="padding: 0; overflow: hidden; margin-bottom: 24px;"> <div class="mc-card-title" style="padding: 16px 20px; border-bottom: 2px solid var(--mc-stone); margin: 0;">
&#127942; TABLA DE CLASIFICACION
</div> <table class="mc-table"> <thead> <tr> <th>#</th> <th>Jugador</th> <th>Total</th> <th>Victorias</th> <th>Derrotas</th> <th>Draws</th> <th>Win Rate</th> <th>Barra</th> </tr> </thead> <tbody> ${stats.length === 0 && renderTemplate`<tr> <td colspan="8" style="text-align: center; color: var(--mc-stone); padding: 32px;">
Sin datos aun. Registra batallas primero.
</td> </tr>`} ${stats.map((s, i) => renderTemplate`<tr> <td> <span${addAttribute(`color: ${i === 0 ? "var(--mc-gold)" : i === 1 ? "#C0C0C0" : i === 2 ? "#CD7F32" : "var(--mc-light)"}`, "style")}> ${i === 0 ? "\u2605" : i === 1 ? "\u2726" : i === 2 ? "\u25C6" : `#${i + 1}`} </span> </td> <td style="color: var(--mc-white); font-weight: bold;">${s.username ?? "?"}</td> <td>${s.total}</td> <td style="color: var(--mc-green-lt);">${s.wins}</td> <td style="color: var(--mc-red);">${s.losses}</td> <td style="color: var(--mc-light);">${s.draws}</td> <td> <span${addAttribute(`badge ${s.winrate >= 60 ? "badge-win" : s.winrate >= 40 ? "badge-draw" : "badge-loss"}`, "class")}> ${s.winrate.toFixed(1)}%
</span> </td> <td style="min-width: 100px;"> <div style="background: var(--mc-gray); height: 8px; width: 100%; border: 1px solid var(--mc-stone);"> <div${addAttribute(`height: 100%; width: ${Math.min(s.winrate, 100)}%; background: ${s.winrate >= 60 ? "var(--mc-green)" : s.winrate >= 40 ? "var(--mc-gold)" : "var(--mc-red)"};`, "style")}></div> </div> </td> </tr>`)} </tbody> </table> </div>  <div class="mc-card" style="padding: 0; overflow: hidden;"> <div class="mc-card-title" style="padding: 16px 20px; border-bottom: 2px solid var(--mc-stone); margin: 0;">
&#128200; HISTORIAL COMPLETO DE BATALLAS
</div> <table class="mc-table"> <thead> <tr><th>Fecha</th><th>Jugador 1</th><th>Jugador 2</th><th>Resultado</th></tr> </thead> <tbody> ${battles.length === 0 && renderTemplate`<tr> <td colspan="4" style="text-align: center; color: var(--mc-stone); padding: 32px;">
Sin batallas registradas.
</td> </tr>`} ${battles.map((b) => renderTemplate`<tr> <td style="color: var(--mc-light); font-size: 9px;"> ${new Date(b.date).toLocaleDateString("es", { year: "numeric", month: "short", day: "numeric" })} </td> <td style="color: var(--mc-green-lt);">${b.player1?.username ?? "?"}</td> <td style="color: var(--mc-red);">${b.player2?.username ?? "?"}</td> <td> ${b.winner ? renderTemplate`<span class="badge badge-win">&#9733; ${b.winner.username}</span>` : renderTemplate`<span class="badge badge-draw">Draw</span>`} </td> </tr>`)} </tbody> </table> </div> ` })}`;
}, "C:/Users/marti/Desktop/Proyectos/web-pvp/src/pages/admin/stats.astro", void 0);

const $$file = "C:/Users/marti/Desktop/Proyectos/web-pvp/src/pages/admin/stats.astro";
const $$url = "/admin/stats";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Stats,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
