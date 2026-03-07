import { s as supabase } from '../../../chunks/supabase_C2eohQQp.mjs';
import { h as hashPassword } from '../../../chunks/crypto_CZKsPJq4.mjs';
import { c as createSession, S as SESSION_COOKIE } from '../../../chunks/session_7xTNhxbx.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request, cookies, redirect }) => {
  const body = await request.formData();
  const username = body.get("username")?.trim();
  const email = body.get("email")?.trim() || null;
  const password = body.get("password");
  const confirm = body.get("confirm");
  if (!username || !password) {
    return redirect("/register?err=" + encodeURIComponent("El nombre y la contraseña son requeridos"));
  }
  if (password !== confirm) {
    return redirect("/register?err=" + encodeURIComponent("Las contraseñas no coinciden"));
  }
  if (password.length < 6) {
    return redirect("/register?err=" + encodeURIComponent("La contraseña debe tener al menos 6 caracteres"));
  }
  const { data: existing } = await supabase.from("profiles").select("id").eq("username", username).single();
  if (existing) {
    return redirect("/register?err=" + encodeURIComponent("Ese nombre de jugador ya está en uso"));
  }
  const { data: newProfile, error } = await supabase.from("profiles").insert({
    user_id: crypto.randomUUID(),
    username,
    email,
    password: hashPassword(password),
    role: "player"
  }).select("id, role").single();
  if (error || !newProfile) {
    return redirect("/register?err=" + encodeURIComponent(error?.message ?? "Error al crear la cuenta"));
  }
  const token = await createSession(newProfile.id);
  cookies.set(SESSION_COOKIE, token, {
    path: "/",
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3),
    httpOnly: true,
    sameSite: "lax"
  });
  return redirect("/");
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
