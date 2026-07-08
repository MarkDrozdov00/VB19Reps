import { D as getContext, E as store_get, F as attr_class, G as attr, I as clsx, J as unsubscribe_stores, B as pop, z as push, K as slot } from "../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../chunks/exports.js";
import "../../chunks/utils.js";
import "clsx";
import "../../chunks/state.svelte.js";
import { b as base } from "../../chunks/paths.js";
const getStores = () => {
  const stores$1 = getContext("__svelte__");
  return {
    /** @type {typeof page} */
    page: {
      subscribe: stores$1.page.subscribe
    },
    /** @type {typeof navigating} */
    navigating: {
      subscribe: stores$1.navigating.subscribe
    },
    /** @type {typeof updated} */
    updated: stores$1.updated
  };
};
const page = {
  subscribe(fn) {
    const store = getStores().page;
    return store.subscribe(fn);
  }
};
function NavBar($$payload, $$props) {
  push();
  var $$store_subs;
  let currentPath;
  let mobileOpen = false;
  const href = (path = "/") => `${base}${path === "/" ? "/" : path}`;
  function normalizePath(path = "/") {
    let normalized = path || "/";
    if (base && normalized.startsWith(base)) {
      normalized = normalized.slice(base.length) || "/";
    }
    return normalized.replace(/\/+$/, "") || "/";
  }
  const isActive = (path = "/") => {
    const target = normalizePath(path);
    if (target === "/") {
      return currentPath === "/";
    }
    return currentPath === target || currentPath.startsWith(`${target}/`);
  };
  const desktopLinkClass = (active) => `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${active ? "text-vb19-primary bg-blue-50" : "text-vb19-muted hover:text-vb19-text hover:bg-gray-50"}`;
  currentPath = normalizePath(store_get($$store_subs ??= {}, "$page", page).url.pathname);
  $$payload.out.push(`<nav${attr_class(`sticky top-0 z-[10000] border-b backdrop-blur-md transition-[background-color,box-shadow,border-color,backdrop-filter] duration-300 ease-out supports-[backdrop-filter]:bg-white/85 ${"bg-white/95 border-gray-100 shadow-sm"}`)}><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex justify-between items-center h-16"><div class="flex items-center"><a${attr("href", href("/"))} class="flex items-center space-x-2"><div class="w-8 h-8 bg-vb19-primary rounded-lg flex items-center justify-center"><span class="text-white font-bold text-sm">VB</span></div> <span class="text-xl font-semibold text-vb19-text">ViennaBase19 Reps</span></a></div> <div class="hidden md:block"><div class="ml-10 flex items-baseline space-x-8"><a${attr("href", href("/"))}${attr_class(clsx(desktopLinkClass(isActive("/"))))}${attr("aria-current", isActive("/") ? "page" : void 0)}>Home</a> <a${attr("href", href("/events"))}${attr_class(clsx(desktopLinkClass(isActive("/events"))))}${attr("aria-current", isActive("/events") ? "page" : void 0)}>Events</a> <a${attr("href", href("/admin"))}${attr_class(clsx(desktopLinkClass(isActive("/admin"))))}${attr("aria-current", isActive("/admin") ? "page" : void 0)}>Admin</a></div></div> <div class="md:hidden"><button type="button" class="inline-flex items-center justify-center p-2 rounded-md text-vb19-muted hover:text-vb19-text hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-vb19-primary"${attr("aria-expanded", mobileOpen)} aria-controls="mobile-menu"><span class="sr-only">Open main menu</span> <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"${attr("d", "M4 6h16M4 12h16M4 18h16")}></path></svg></button></div></div></div> `);
  {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></nav>`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function Footer($$payload) {
  $$payload.out.push(`<footer class="bg-white border-t border-gray-100 mt-auto"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><div class="grid grid-cols-1 md:grid-cols-3 gap-8"><div class="col-span-1"><div class="flex items-center space-x-2 mb-4"><div class="w-8 h-8 bg-vb19-primary rounded-lg flex items-center justify-center"><span class="text-white font-bold text-sm">VB</span></div> <span class="text-xl font-semibold text-vb19-text">ViennaBase19 Reps</span></div> <p class="text-vb19-muted text-sm">Brought to live and hosted by your own ViennaBase19 Representatives.</p></div> <div class="col-span-1"><h3 class="text-sm font-semibold text-vb19-text uppercase tracking-wider mb-4">Quick Links</h3> <ul class="space-y-2"><li><a${attr("href", `${base}/`)} class="text-vb19-muted hover:text-vb19-primary text-sm transition-colors duration-200">Book Facilities</a></li> `);
  {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></ul></div> <div class="col-span-1"><h3 class="text-sm font-semibold text-vb19-text uppercase tracking-wider mb-4">Contact</h3> <div class="space-y-4"><p class="text-vb19-muted text-sm">For other inquiries:</p> <a href="mailto:base19.reps@outlook.com" class="text-vb19-primary hover:text-blue-700 text-sm font-medium transition-colors duration-200">base19.reps@outlook.com</a> <div><h4 class="text-xs font-semibold text-vb19-text uppercase tracking-wider mb-3">Stay Connected</h4> <div class="flex items-center justify-center md:justify-start gap-5"><a href="mailto:base19.reps@outlook.com" class="text-vb19-muted hover:text-vb19-primary hover:opacity-90 transition duration-200 hover:scale-105" aria-label="Email"><svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg></a> <a href="https://chat.whatsapp.com/KkefmfDcWRNCD2hNaAhEuW?mode=gi_t" class="text-vb19-muted hover:text-vb19-primary hover:opacity-90 transition duration-200 hover:scale-105" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer"><svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2a9.9 9.9 0 0 0-8.48 15.02L2.2 22l5.1-1.34A9.9 9.9 0 1 0 12.04 2Zm0 1.75a8.15 8.15 0 0 1 6.92 12.46 8.15 8.15 0 0 1-10.98 2.73l-.36-.21-3.02.79.8-2.94-.23-.38a8.15 8.15 0 0 1 6.87-12.45Zm-3.1 4.33c-.18 0-.47.07-.72.34-.25.28-.95.93-.95 2.26s.98 2.63 1.12 2.81c.14.18 1.92 3.07 4.76 4.18 2.36.93 2.84.74 3.35.7.51-.04 1.65-.67 1.88-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33-.28-.14-1.65-.81-1.9-.9-.26-.1-.44-.14-.63.14-.18.27-.72.9-.88 1.08-.16.19-.33.21-.61.07-.28-.14-1.17-.43-2.23-1.38-.82-.73-1.38-1.64-1.54-1.92-.16-.28-.02-.43.12-.57.13-.13.28-.33.42-.49.14-.16.18-.28.28-.46.09-.19.04-.35-.02-.49-.07-.14-.63-1.52-.86-2.08-.23-.55-.46-.47-.63-.48h-.54Z"></path></svg></a> <a href="https://www.instagram.com/viennabase19?utm_source=ig_web_button_share_sheet&amp;igsh=ZDNlZDc0MzIxNw==" class="text-vb19-muted hover:text-vb19-primary hover:opacity-90 transition duration-200 hover:scale-105" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z"></path><path d="M17.5 6.5h.01"></path></svg></a></div></div></div></div></div> <div class="mt-8 pt-8 border-t border-gray-100"><div class="flex flex-col md:flex-row justify-between items-center"><p class="text-vb19-muted text-sm">© 2025 ViennaBase19 Reps. All rights reserved.</p> <p class="text-vb19-muted text-sm mt-2 md:mt-0">Built with care for our community</p></div></div></div></footer>`);
}
function _layout($$payload, $$props) {
  push();
  $$payload.out.push(`<div class="min-h-screen flex flex-col">`);
  NavBar($$payload);
  $$payload.out.push(`<!----> <main class="flex-1"><!---->`);
  slot($$payload, $$props, "default", {});
  $$payload.out.push(`<!----></main> `);
  Footer($$payload);
  $$payload.out.push(`<!----></div>`);
  pop();
}
export {
  _layout as default
};
