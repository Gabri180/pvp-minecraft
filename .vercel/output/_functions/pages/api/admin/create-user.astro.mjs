import { s as supabase } from '../../../chunks/supabase_C2eohQQp.mjs';
import { S as SESSION_COOKIE, g as getSessionProfile } from '../../../chunks/session_7xTNhxbx.mjs';
import { h as hashPassword } from '../../../chunks/crypto_CZKsPJq4.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request, cookies, redirect }) => {
  const token = cookies.get(SESSION_COOKIE)?.value;
  const profile = token ? await getSessionProfile(token) : null;
  if (profile?.role !== "admin") return redirect("/login?reason=auth");
  const body = await request.formData();
  const username = body.get("username")?.trim();
  const email = body.get("email")?.trim() || null;
  const password = body.get("password");
  const codigo = body.get("codigo")?.trim();
  const role = body.get("role") ?? "player";
  if (!username || !password || !codigo) {
    return redirect("/admin/users?err=" + encodeURIComponent("Nombre, contraseña y codigo son requeridos"));
  }
  const { data: existing } = await supabase.from("profiles").select("id").eq("username", username).single();
  if (existing) {
    return redirect("/admin/users?err=" + encodeURIComponent("Ya existe un usuario con ese nombre"));
  }
  const { error } = await supabase.from("profiles").insert({
    user_id: crypto.randomUUID(),
    username,
    email,
    password: hashPassword(password),
    codigo,
    role
  });
  if (error) return redirect("/admin/users?err=" + encodeURIComponent(error.message));
  return redirect("/admin/users?msg=" + encodeURIComponent(`Usuario "${username}" creado correctamente`));
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
