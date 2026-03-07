import { s as supabase } from '../../../chunks/supabase_C2eohQQp.mjs';
import { S as SESSION_COOKIE, g as getSessionProfile } from '../../../chunks/session_7xTNhxbx.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request, cookies, redirect }) => {
  const token = cookies.get(SESSION_COOKIE)?.value;
  const profile = token ? await getSessionProfile(token) : null;
  if (profile?.role !== "admin") return redirect("/login?reason=auth");
  const body = await request.formData();
  const player1_id = body.get("player1_id");
  const player2_id = body.get("player2_id");
  const winner_id = body.get("winner_id") || null;
  const date = body.get("date");
  const notes = body.get("notes") || null;
  if (!player1_id || !player2_id || !date) {
    return redirect("/admin/battles?err=" + encodeURIComponent("Faltan campos requeridos"));
  }
  if (player1_id === player2_id) {
    return redirect("/admin/battles?err=" + encodeURIComponent("Los jugadores no pueden ser el mismo"));
  }
  if (winner_id && winner_id !== player1_id && winner_id !== player2_id) {
    return redirect("/admin/battles?err=" + encodeURIComponent("El ganador debe ser uno de los jugadores"));
  }
  const { error } = await supabase.from("battles").insert({ player1_id, player2_id, winner_id, date, notes });
  if (error) return redirect("/admin/battles?err=" + encodeURIComponent(error.message));
  return redirect("/admin/battles?msg=" + encodeURIComponent("Batalla registrada correctamente"));
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
