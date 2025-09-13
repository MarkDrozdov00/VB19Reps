import { D as getContext, E as store_get, F as attr, G as attr_class, I as clsx, J as unsubscribe_stores, B as pop, z as push, K as slot } from "../../chunks/index2.js";
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
  const isActive = (path = "/") => {
    const full = href(path);
    return currentPath === full || path !== "/" && currentPath.startsWith(full);
  };
  const desktopLinkClass = (active) => `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${active ? "text-vb19-primary bg-blue-50" : "text-vb19-muted hover:text-vb19-text hover:bg-gray-50"}`;
  currentPath = store_get($$store_subs ??= {}, "$page", page).url.pathname;
  $$payload.out.push(`<nav class="bg-white shadow-sm border-b border-gray-100"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex justify-between items-center h-16"><div class="flex items-center"><a${attr("href", href("/"))} class="flex items-center space-x-2"><div class="w-8 h-8 bg-vb19-primary rounded-lg flex items-center justify-center"><span class="text-white font-bold text-sm">VB</span></div> <span class="text-xl font-semibold text-vb19-text">ViennaBase19 Reps</span></a></div> <div class="hidden md:block"><div class="ml-10 flex items-baseline space-x-8"><a${attr("href", href("/"))}${attr_class(clsx(desktopLinkClass(isActive("/"))))}${attr("aria-current", isActive("/") ? "page" : void 0)}>Home</a></div></div> <div class="md:hidden"><button type="button" class="inline-flex items-center justify-center p-2 rounded-md text-vb19-muted hover:text-vb19-text hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-vb19-primary"${attr("aria-expanded", mobileOpen)} aria-controls="mobile-menu"><span class="sr-only">Open main menu</span> <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"${attr("d", "M4 6h16M4 12h16M4 18h16")}></path></svg></button></div></div></div> `);
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
  $$payload.out.push(`<!--]--></ul></div> <div class="col-span-1"><h3 class="text-sm font-semibold text-vb19-text uppercase tracking-wider mb-4">Contact</h3> <div class="space-y-2"><p class="text-vb19-muted text-sm">For other inquiries:</p> <a href="mailto:base19.reps@outlook.com" class="text-vb19-primary hover:text-blue-700 text-sm font-medium transition-colors duration-200">base19.reps@outlook.com</a></div></div></div> <div class="mt-8 pt-8 border-t border-gray-100"><div class="flex flex-col md:flex-row justify-between items-center"><p class="text-vb19-muted text-sm">© 2025 ViennaBase19 Reps. All rights reserved.</p> <p class="text-vb19-muted text-sm mt-2 md:mt-0">Built with care for our community</p></div></div></div></footer>`);
}
function _layout($$payload, $$props) {
  $$payload.out.push(`<div class="min-h-screen flex flex-col">`);
  NavBar($$payload);
  $$payload.out.push(`<!----> <main class="flex-1"><!---->`);
  slot($$payload, $$props, "default", {});
  $$payload.out.push(`<!----></main> `);
  Footer($$payload);
  $$payload.out.push(`<!----></div>`);
}
export {
  _layout as default
};
