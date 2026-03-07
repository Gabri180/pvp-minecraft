import { s as supabase } from '../../../chunks/supabase_C2eohQQp.mjs';
import { h as hashPassword } from '../../../chunks/crypto_CZKsPJq4.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request }) => {
  const body = await request.json();
  const username = body.username?.trim();
  const password = body.password;
  if (!username || !password) {
    return new Response(JSON.stringify({ ok: false, error: "Completa todos los campos" }), { status: 400 });
  }
  const { data: profile } = await supabase.from("profiles").select("id, password, codigo").eq("username", username).single();
  if (!profile || profile.password !== hashPassword(password)) {
    return new Response(JSON.stringify({ ok: false, error: "Usuario o contraseña incorrectos" }), { status: 401 });
  }
  const needsCodigo = !!profile.codigo;
  return new Response(JSON.stringify({ ok: true, needsCodigo }), { status: 200 });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
