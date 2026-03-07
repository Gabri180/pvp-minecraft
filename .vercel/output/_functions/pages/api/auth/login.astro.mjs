import { s as supabase } from '../../../chunks/supabase_C2eohQQp.mjs';
import { h as hashPassword } from '../../../chunks/crypto_CZKsPJq4.mjs';
import { c as createSession, S as SESSION_COOKIE } from '../../../chunks/session_7xTNhxbx.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request, cookies, redirect }) => {
  const body = await request.formData();
  const username = body.get("username")?.trim();
  const password = body.get("password");
  const codigo = body.get("codigo")?.trim() || null;
  if (!username || !password) {
    return redirect("/login?err=" + encodeURIComponent("Completa todos los campos"));
  }
  const { data: profile } = await supabase.from("profiles").select("id, role, password, codigo").eq("username", username).single();
  if (!profile || profile.password !== hashPassword(password)) {
    return redirect("/login?err=" + encodeURIComponent("Usuario o contraseña incorrectos"));
  }
  if (profile.codigo && profile.codigo !== codigo) {
    return redirect("/login?err=" + encodeURIComponent("Codigo de acceso incorrecto") + "&step=2&user=" + encodeURIComponent(username));
  }
  const token = await createSession(profile.id);
  cookies.set(SESSION_COOKIE, token, {
    path: "/",
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3),
    httpOnly: true,
    sameSite: "lax"
  });
  return redirect(profile.role === "admin" ? "/admin" : "/");
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
