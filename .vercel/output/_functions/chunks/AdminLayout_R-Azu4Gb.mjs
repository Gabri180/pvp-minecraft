import { e as createComponent, k as renderComponent, r as renderTemplate, h as createAstro, m as maybeRenderHead, g as addAttribute, n as renderSlot } from './astro/server_BRHZ-eMj.mjs';
import 'piccolore';
import { $ as $$Layout } from './Layout_Hz4wgOGa.mjs';
import { S as SESSION_COOKIE, g as getSessionProfile } from './session_7xTNhxbx.mjs';

const $$Astro = createAstro();
const $$AdminLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$AdminLayout;
  const { title = "Admin", activeSection = "" } = Astro2.props;
  const token = Astro2.cookies.get(SESSION_COOKIE)?.value ?? "";
  const profile = token ? await getSessionProfile(token) : null;
  const username = profile?.username ?? "Admin";
  const navItems = [
    { href: "/admin", label: "[ Dashboard ]", key: "dashboard" },
    { href: "/admin/users", label: "[ Usuarios ]", key: "users" },
    { href: "/admin/battles", label: "[ Batallas ]", key: "battles" },
    { href: "/admin/stats", label: "[ Stats ]", key: "stats" }
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Admin: ${title}` }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="admin-layout"> <aside class="admin-sidebar"> <div class="admin-sidebar-section">Panel de Control</div> ${navItems.map((item) => renderTemplate`<a${addAttribute(item.href, "href")}${addAttribute(["admin-sidebar-item", { active: activeSection === item.key }], "class:list")}> ${item.label} </a>`)} <div class="admin-sidebar-section" style="margin-top: auto;">Sesion</div> <div style="padding: 8px 20px; font-size: 9px; color: var(--mc-light);"> ${username} </div> <a href="/auth/signout" class="admin-sidebar-item" style="color: var(--mc-red);">[ Cerrar Sesion ]</a> </aside> <main class="admin-main"> ${renderSlot($$result2, $$slots["default"])} </main> </div> ` })}`;
}, "C:/Users/marti/Desktop/Proyectos/web-pvp/src/layouts/AdminLayout.astro", void 0);

export { $$AdminLayout as $ };
