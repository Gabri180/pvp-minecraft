import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, g as addAttribute } from '../chunks/astro/server_BRHZ-eMj.mjs';
import 'piccolore';
import { $ as $$AdminLayout } from '../chunks/AdminLayout_R-Azu4Gb.mjs';
import { s as supabase } from '../chunks/supabase_C2eohQQp.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const [{ count: totalUsers }, { count: totalBattles }, { data: recentBattles }] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("battles").select("*", { count: "exact", head: true }),
    supabase.from("battles").select(`
      id, date, notes,
      player1:profiles!battles_player1_id_fkey(username),
      player2:profiles!battles_player2_id_fkey(username),
      winner:profiles!battles_winner_id_fkey(username)
    `).order("created_at", { ascending: false }).limit(5)
  ]);
  const { data: topStats } = await supabase.rpc("get_player_stats").limit(3);
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Dashboard", "activeSection": "dashboard" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mc-card-title" style="font-size: 16px;">&#127968; DASHBOARD</div>  <div class="grid-4 mb-16"> <div class="stat-card"> <span class="stat-value">${totalUsers ?? 0}</span> <span class="stat-label">Usuarios</span> </div> <div class="stat-card"> <span class="stat-value">${totalBattles ?? 0}</span> <span class="stat-label">Batallas</span> </div> <div class="stat-card"> <span class="stat-value" style="color: var(--mc-green-lt);"> ${topStats?.[0]?.wins ?? 0} </span> <span class="stat-label">Max Victorias</span> </div> <div class="stat-card"> <span class="stat-value" style="color: var(--mc-diamond);"> ${topStats?.[0]?.winrate?.toFixed(0) ?? 0}%
</span> <span class="stat-label">Mejor Win Rate</span> </div> </div> <div class="grid-2"> <!-- Recent battles --> <div class="mc-card"> <div class="mc-card-title">&#9876; ULTIMAS BATALLAS</div> ${recentBattles && recentBattles.length > 0 ? renderTemplate`<table class="mc-table"> <thead> <tr><th>J1</th><th>J2</th><th>Ganador</th><th>Fecha</th></tr> </thead> <tbody> ${recentBattles.map((b) => renderTemplate`<tr> <td style="color: var(--mc-green-lt);">${b.player1?.username ?? "?"}</td> <td style="color: var(--mc-red);">${b.player2?.username ?? "?"}</td> <td> ${b.winner ? renderTemplate`<span class="badge badge-win">${b.winner.username}</span>` : renderTemplate`<span class="badge badge-draw">Draw</span>`} </td> <td style="color: var(--mc-light); font-size: 9px;"> ${new Date(b.date).toLocaleDateString("es")} </td> </tr>`)} </tbody> </table>` : renderTemplate`<p style="color: var(--mc-stone); font-size: 10px; text-align: center; padding: 20px;">
No hay batallas aun. <a href="/admin/battles">Agregar</a> </p>`} </div> <!-- Top players --> <div class="mc-card"> <div class="mc-card-title">&#127942; TOP JUGADORES</div> ${topStats && topStats.length > 0 ? renderTemplate`<table class="mc-table"> <thead> <tr><th>Jugador</th><th>W</th><th>L</th><th>%</th></tr> </thead> <tbody> ${topStats.map((s, i) => renderTemplate`<tr> <td> <span${addAttribute(`color: ${i === 0 ? "var(--mc-gold)" : i === 1 ? "#C0C0C0" : "#CD7F32"}`, "style")}> ${i === 0 ? "\u2605 " : i === 1 ? "\u2726 " : "\u25C6 "} </span> ${s.username ?? "?"} </td> <td style="color: var(--mc-green-lt);">${s.wins}</td> <td style="color: var(--mc-red);">${s.losses}</td> <td> <span${addAttribute(`badge ${s.winrate >= 60 ? "badge-win" : s.winrate >= 40 ? "badge-draw" : "badge-loss"}`, "class")}> ${s.winrate.toFixed(0)}%
</span> </td> </tr>`)} </tbody> </table>` : renderTemplate`<p style="color: var(--mc-stone); font-size: 10px; text-align: center; padding: 20px;">
Sin datos aun.
</p>`} </div> </div>  <div class="mc-card mt-16"> <div class="mc-card-title">&#9881; ACCIONES RAPIDAS</div> <div style="display: flex; gap: 12px; flex-wrap: wrap;"> <a href="/admin/users" class="btn btn-blue">Gestionar Usuarios</a> <a href="/admin/battles" class="btn btn-green">Registrar Batalla</a> <a href="/admin/stats" class="btn btn-gold">Ver Estadisticas</a> </div> </div> ` })}`;
}, "C:/Users/marti/Desktop/Proyectos/web-pvp/src/pages/admin/index.astro", void 0);

const $$file = "C:/Users/marti/Desktop/Proyectos/web-pvp/src/pages/admin/index.astro";
const $$url = "/admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
