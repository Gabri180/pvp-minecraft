import { s as supabase } from '../../../chunks/supabase_C2eohQQp.mjs';
import { S as SESSION_COOKIE, g as getSessionProfile } from '../../../chunks/session_7xTNhxbx.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request, cookies, redirect }) => {
  const token = cookies.get(SESSION_COOKIE)?.value;
  const profile = token ? await getSessionProfile(token) : null;
  if (profile?.role !== "admin") return redirect("/login?reason=auth");
  const body = await request.formData();
  const id = body.get("id");
  if (!id) return redirect("/admin/users?err=" + encodeURIComponent("ID requerido"));
  await supabase.from("sessions").delete().eq("profile_id", id);
  const { error } = await supabase.from("profiles").delete().eq("id", id);
  if (error) return redirect("/admin/users?err=" + encodeURIComponent(error.message));
  return redirect("/admin/users?msg=" + encodeURIComponent("Usuario eliminado correctamente"));
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
