import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CiW67j5A.mjs';
import { manifest } from './manifest_7xVU-Fpc.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/admin/battles.astro.mjs');
const _page2 = () => import('./pages/admin/stats.astro.mjs');
const _page3 = () => import('./pages/admin/users.astro.mjs');
const _page4 = () => import('./pages/admin.astro.mjs');
const _page5 = () => import('./pages/api/admin/add-battle.astro.mjs');
const _page6 = () => import('./pages/api/admin/create-user.astro.mjs');
const _page7 = () => import('./pages/api/admin/delete-battle.astro.mjs');
const _page8 = () => import('./pages/api/admin/delete-user.astro.mjs');
const _page9 = () => import('./pages/api/admin/set-codigo.astro.mjs');
const _page10 = () => import('./pages/api/admin/set-password.astro.mjs');
const _page11 = () => import('./pages/api/admin/update-battle.astro.mjs');
const _page12 = () => import('./pages/api/admin/update-role.astro.mjs');
const _page13 = () => import('./pages/api/auth/check-password.astro.mjs');
const _page14 = () => import('./pages/api/auth/login.astro.mjs');
const _page15 = () => import('./pages/api/auth/register.astro.mjs');
const _page16 = () => import('./pages/auth/callback.astro.mjs');
const _page17 = () => import('./pages/auth/signout.astro.mjs');
const _page18 = () => import('./pages/login.astro.mjs');
const _page19 = () => import('./pages/register.astro.mjs');
const _page20 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/admin/battles.astro", _page1],
    ["src/pages/admin/stats.astro", _page2],
    ["src/pages/admin/users.astro", _page3],
    ["src/pages/admin/index.astro", _page4],
    ["src/pages/api/admin/add-battle.ts", _page5],
    ["src/pages/api/admin/create-user.ts", _page6],
    ["src/pages/api/admin/delete-battle.ts", _page7],
    ["src/pages/api/admin/delete-user.ts", _page8],
    ["src/pages/api/admin/set-codigo.ts", _page9],
    ["src/pages/api/admin/set-password.ts", _page10],
    ["src/pages/api/admin/update-battle.ts", _page11],
    ["src/pages/api/admin/update-role.ts", _page12],
    ["src/pages/api/auth/check-password.ts", _page13],
    ["src/pages/api/auth/login.ts", _page14],
    ["src/pages/api/auth/register.ts", _page15],
    ["src/pages/auth/callback.astro", _page16],
    ["src/pages/auth/signout.astro", _page17],
    ["src/pages/login.astro", _page18],
    ["src/pages/register.astro", _page19],
    ["src/pages/index.astro", _page20]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = {
    "middlewareSecret": "19213ba3-71fc-4da7-bae3-0a870dd29852",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
