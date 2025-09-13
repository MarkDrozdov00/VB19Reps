import { D as store_get, E as attr_class, F as stringify, G as unsubscribe_stores, B as pop, z as push, I as slot } from "../../chunks/index2.js";
import { p as page } from "../../chunks/stores.js";
import "clsx";
function NavBar($$payload, $$props) {
  push();
  var $$store_subs;
  let currentPath;
  currentPath = store_get($$store_subs ??= {}, "$page", page).url.pathname;
  $$payload.out.push(`<nav class="bg-white shadow-sm border-b border-gray-100"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex justify-between items-center h-16"><div class="flex items-center"><a href="/" class="flex items-center space-x-2"><div class="w-8 h-8 bg-vb19-primary rounded-lg flex items-center justify-center"><span class="text-white font-bold text-sm">VB</span></div> <span class="text-xl font-semibold text-vb19-text">ViennaBase19</span></a></div> <div class="hidden md:block"><div class="ml-10 flex items-baseline space-x-8"><a href="/"${attr_class(`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${stringify(currentPath === "/" ? "text-vb19-primary bg-blue-50" : "text-vb19-muted hover:text-vb19-text hover:bg-gray-50")}`)}>Home</a> <a href="/announcements"${attr_class(`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${stringify(currentPath.startsWith("/announcements") ? "text-vb19-primary bg-blue-50" : "text-vb19-muted hover:text-vb19-text hover:bg-gray-50")}`)}>Announcements</a> <a href="/about"${attr_class(`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${stringify(currentPath === "/about" ? "text-vb19-primary bg-blue-50" : "text-vb19-muted hover:text-vb19-text hover:bg-gray-50")}`)}>About Us</a></div></div> <div class="md:hidden"><button type="button" class="inline-flex items-center justify-center p-2 rounded-md text-vb19-muted hover:text-vb19-text hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-vb19-primary" aria-expanded="false"><span class="sr-only">Open main menu</span> <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg></button></div></div></div> <div class="md:hidden"><div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50"><a href="/"${attr_class(`block px-3 py-2 rounded-md text-base font-medium ${stringify(currentPath === "/" ? "text-vb19-primary bg-blue-50" : "text-vb19-muted hover:text-vb19-text hover:bg-white")}`)}>Home</a> <a href="/announcements"${attr_class(`block px-3 py-2 rounded-md text-base font-medium ${stringify(currentPath.startsWith("/announcements") ? "text-vb19-primary bg-blue-50" : "text-vb19-muted hover:text-vb19-text hover:bg-white")}`)}>Announcements</a> <a href="/about"${attr_class(`block px-3 py-2 rounded-md text-base font-medium ${stringify(currentPath === "/about" ? "text-vb19-primary bg-blue-50" : "text-vb19-muted hover:text-vb19-text hover:bg-white")}`)}>About Us</a></div></div></nav>`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function Footer($$payload) {
  $$payload.out.push(`<footer class="bg-white border-t border-gray-100 mt-auto"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><div class="grid grid-cols-1 md:grid-cols-3 gap-8"><div class="col-span-1"><div class="flex items-center space-x-2 mb-4"><div class="w-8 h-8 bg-vb19-primary rounded-lg flex items-center justify-center"><span class="text-white font-bold text-sm">VB</span></div> <span class="text-xl font-semibold text-vb19-text">ViennaBase19</span></div> <p class="text-vb19-muted text-sm">Modern co-living space in the heart of Vienna with shared facilities for residents.</p></div> <div class="col-span-1"><h3 class="text-sm font-semibold text-vb19-text uppercase tracking-wider mb-4">Quick Links</h3> <ul class="space-y-2"><li><a href="/" class="text-vb19-muted hover:text-vb19-primary text-sm transition-colors duration-200">Book Facilities</a></li> <li><a href="/announcements" class="text-vb19-muted hover:text-vb19-primary text-sm transition-colors duration-200">Announcements</a></li> <li><a href="/about" class="text-vb19-muted hover:text-vb19-primary text-sm transition-colors duration-200">About Us</a></li></ul></div> <div class="col-span-1"><h3 class="text-sm font-semibold text-vb19-text uppercase tracking-wider mb-4">Contact</h3> <div class="space-y-2"><p class="text-vb19-muted text-sm">For facility bookings and inquiries:</p> <a href="mailto:base19.reps@outlook.com" class="text-vb19-primary hover:text-blue-700 text-sm font-medium transition-colors duration-200">base19.reps@outlook.com</a></div></div></div> <div class="mt-8 pt-8 border-t border-gray-100"><div class="flex flex-col md:flex-row justify-between items-center"><p class="text-vb19-muted text-sm">© 2025 ViennaBase19. All rights reserved.</p> <p class="text-vb19-muted text-sm mt-2 md:mt-0">Built with care for our community</p></div></div></div></footer>`);
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
