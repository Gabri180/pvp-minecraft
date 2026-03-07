import { e as createComponent, k as renderComponent, g as addAttribute, r as renderTemplate, l as renderScript, h as createAstro, m as maybeRenderHead } from '../../chunks/astro/server_BRHZ-eMj.mjs';
import 'piccolore';
import { $ as $$AdminLayout } from '../../chunks/AdminLayout_R-Azu4Gb.mjs';
import { s as supabase } from '../../chunks/supabase_C2eohQQp.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const $$Battles = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Battles;
  const { data: profiles } = await supabase.from("profiles").select("id, username").order("username");
  const { data: battlesRaw } = await supabase.from("battles").select(`
    id, date, notes, created_at,
    player1:profiles!battles_player1_id_fkey(id, username),
    player2:profiles!battles_player2_id_fkey(id, username),
    winner:profiles!battles_winner_id_fkey(id, username)
  `).order("date", { ascending: false });
  const battles = battlesRaw ?? [];
  const players = profiles ?? [];
  const msg = Astro2.url.searchParams.get("msg");
  const err = Astro2.url.searchParams.get("err");
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Batallas", "activeSection": "battles" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="flex-between mb-16"> <div class="mc-card-title" style="margin: 0; border: none; padding: 0; font-size: 16px;">
&#9876; REGISTRO DE BATALLAS
</div> <button id="btn-add-battle" class="btn btn-green">+ Nueva Batalla</button> </div> ${msg && renderTemplate`<div class="mc-alert mc-alert-success">${decodeURIComponent(msg)}</div>`}${err && renderTemplate`<div class="mc-alert mc-alert-error">${decodeURIComponent(err)}</div>`}<div class="mc-card" style="padding: 0; overflow: hidden;"> <table class="mc-table"> <thead> <tr> <th>Jugador 1</th> <th>Jugador 2</th> <th>Resultado</th> <th>Fecha</th> <th>Notas</th> <th>Acciones</th> </tr> </thead> <tbody> ${battles.length === 0 && renderTemplate`<tr> <td colspan="6" style="text-align: center; color: var(--mc-stone); padding: 32px;">
No hay batallas registradas. Agrega la primera.
</td> </tr>`} ${battles.map((b) => renderTemplate`<tr> <td style="color: var(--mc-green-lt);">${b.player1?.username ?? "?"}</td> <td style="color: var(--mc-red);">${b.player2?.username ?? "?"}</td> <td> ${b.winner ? renderTemplate`<span class="badge badge-win">&#9733; ${b.winner.username}</span>` : renderTemplate`<span class="badge badge-draw">Draw</span>`} </td> <td style="color: var(--mc-light); font-size: 9px;"> ${new Date(b.date).toLocaleDateString("es")} </td> <td style="color: var(--mc-light); font-size: 9px; max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"> ${b.notes ?? "\u2014"} </td> <td> <div style="display: flex; gap: 8px;"> <button class="btn btn-blue btn-sm btn-edit-battle"${addAttribute(b.id, "data-id")}${addAttribute(b.player1?.id, "data-p1")}${addAttribute(b.player2?.id, "data-p2")}${addAttribute(b.winner?.id ?? "", "data-winner")}${addAttribute(b.date?.split("T")[0], "data-date")}${addAttribute(b.notes ?? "", "data-notes")}>
Editar
</button> <button class="btn btn-red btn-sm btn-del-battle"${addAttribute(b.id, "data-id")}>
&#10005;
</button> </div> </td> </tr>`)} </tbody> </table> </div> ` })} <!-- Modal: Agregar/Editar Batalla --> <div id="modal-battle" class="mc-modal-backdrop" style="display: none;"> <div class="mc-modal"> <div id="modal-battle-title" class="mc-modal-title">+ NUEVA BATALLA</div> <form id="form-battle" method="POST" action="/api/admin/add-battle"> <input type="hidden" id="battle-id" name="id" value=""> <label class="mc-label">Jugador 1</label> <select name="player1_id" id="sel-p1" class="mc-select" required> <option value="">-- Seleccionar --</option> ${players.map((p) => renderTemplate`<option${addAttribute(p.id, "value")}>${p.username ?? p.id}</option>`)} </select> <label class="mc-label">Jugador 2</label> <select name="player2_id" id="sel-p2" class="mc-select" required> <option value="">-- Seleccionar --</option> ${players.map((p) => renderTemplate`<option${addAttribute(p.id, "value")}>${p.username ?? p.id}</option>`)} </select> <label class="mc-label">Resultado</label> <select name="winner_id" id="sel-winner" class="mc-select"> <option value="">Draw / Sin ganador</option> ${players.map((p) => renderTemplate`<option${addAttribute(p.id, "value")}>${p.username ?? p.id} gana</option>`)} </select> <label class="mc-label">Fecha</label> <input type="date" name="date" id="battle-date" class="mc-input" required> <label class="mc-label">Notas (opcional)</label> <input type="text" name="notes" id="battle-notes" class="mc-input" placeholder="Ej: Torneo semanal, round 2" maxlength="200"> <div style="display: flex; gap: 12px; margin-top: 8px;"> <button type="submit" class="btn btn-green" style="flex: 1;">Guardar</button> <button type="button" id="close-modal-battle" class="btn btn-gray" style="flex: 1;">Cancelar</button> </div> </form> </div> </div> <!-- Modal: Confirmar borrado batalla --> <div id="modal-del-battle" class="mc-modal-backdrop" style="display: none;"> <div class="mc-modal"> <div class="mc-modal-title" style="color: var(--mc-red);">&#9888; ELIMINAR BATALLA</div> <p style="font-size: 10px; color: var(--mc-light); line-height: 2; margin-bottom: 20px;">
Esta accion eliminara permanentemente la batalla y afectara las estadisticas.
</p> <form id="form-del-battle" method="POST" action="/api/admin/delete-battle"> <input type="hidden" id="del-battle-id" name="id"> <div style="display: flex; gap: 12px;"> <button type="submit" class="btn btn-red" style="flex: 1;">Eliminar</button> <button type="button" id="close-del-battle" class="btn btn-gray" style="flex: 1;">Cancelar</button> </div> </form> </div> </div> ${renderScript($$result, "C:/Users/marti/Desktop/Proyectos/web-pvp/src/pages/admin/battles.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/marti/Desktop/Proyectos/web-pvp/src/pages/admin/battles.astro", void 0);

const $$file = "C:/Users/marti/Desktop/Proyectos/web-pvp/src/pages/admin/battles.astro";
const $$url = "/admin/battles";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Battles,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
