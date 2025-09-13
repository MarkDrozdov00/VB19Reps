import { F as attr, M as escape_html, G as attr_class, E as store_get, J as unsubscribe_stores, B as pop, z as push, O as stringify, P as head, Q as attr_style } from "../../chunks/index2.js";
import { w as writable } from "../../chunks/index.js";
import { b as base } from "../../chunks/paths.js";
function withBase(url) {
  if (!url) return "";
  if (/^(https?:|data:|blob:)/i.test(url)) return url;
  if (url.startsWith(base + "/")) return url;
  if (url.startsWith("/")) return `${base}${url}`;
  return `${base}/${url}`;
}
[
  {
    id: 1,
    name: "CLUB_ROOM",
    displayName: "Club Room",
    description: "Perfect for birthdays and celebrations, the Club Room features a bar, music system, and plenty of space for parties with friends.",
    maxDays: 2,
    requiresApproval: true,
    depositEur: 200,
    termsNote: "A €200 deposit is required when picking up the key. Terms of Use contract must be signed at key pickup.",
    images: [
      { url: withBase("/club-room.jpg"), alt: "Club Room - Main Area" }
    ]
  },
  {
    id: 2,
    name: "GAMES_ROOM",
    displayName: "Games Room",
    description: "Entertainment hub with gaming consoles, board games, a pool table, and more — perfect for relaxation and fun with friends.",
    maxDays: 1,
    requiresApproval: true,
    depositEur: 200,
    termsNote: "A €200 deposit is required when picking up the key. Terms of Use contract must be signed at key pickup.",
    images: [
      { url: withBase("/games-room.jpg"), alt: "Games Room - Gaming Setup" }
    ]
  },
  {
    id: 3,
    name: "BBQ_AREA",
    displayName: "BBQ Area",
    description: "Outdoor barbecue area with grill, seating, and dining space. Ideal for outdoor cooking and social gatherings.",
    maxDays: 1,
    requiresApproval: false,
    depositEur: null,
    termsNote: null,
    images: [
      { url: withBase("/bbq-area.jpg"), alt: "BBQ Area - Grilling Space" }
    ]
  }
];
const selectedFacility = writable(null);
function FacilityPicker($$payload, $$props) {
  push();
  var $$store_subs;
  let isOpen = false;
  $$payload.out.push(`<div class="facility-picker relative z-10" style="overflow: none;"><label class="form-label">Select Facility</label> <button type="button" class="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-vb19-primary focus:border-transparent transition-colors duration-200 flex items-center justify-between" aria-haspopup="listbox"${attr("aria-expanded", isOpen)}><span class="block truncate">${escape_html(store_get($$store_subs ??= {}, "$selectedFacility", selectedFacility) && store_get($$store_subs ??= {}, "$selectedFacility", selectedFacility).id ? store_get($$store_subs ??= {}, "$selectedFacility", selectedFacility).displayName : "Select...")}</span> <svg${attr_class(`h-5 w-5 text-gray-400 transition-transform duration-200 ${stringify("")}`)} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></button> `);
  {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div>`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function _page($$payload, $$props) {
  push();
  function asset(url) {
    if (/^(https?:|data:|blob:)/i.test(url)) return url;
    if (url.startsWith(base + "/")) return url;
    if (url.startsWith("/")) return `${base}${url}`;
    return `${base}/${url}`;
  }
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>ViennaBase19 - Book Your Facility</title>`;
    $$payload2.out.push(`<meta name="description" content="Book shared facilities at ViennaBase19. Choose from Club Room, Games Room, or BBQ Area for your next gathering."/>`);
  });
  $$payload.out.push(`<section class="relative min-h-screen flex items-center justify-center overflow-hidden"><div class="absolute inset-0 bg-cover bg-center bg-no-repeat"${attr_style(`background-image: url('${asset("/banner.png")}')`)}></div> <div class="absolute inset-0 bg-black/40"></div> <div class="relative z-10 text-center px-4 max-w-4xl mx-auto"><div class="animate-bounce-in"><h1 class="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">Welcome to ViennaBase19 <span class="block bg-gradient-to-r from-yellow-300 via-pink-300 to-orange-300 bg-clip-text text-transparent">Reps Portal</span></h1></div> <div class="animate-slide-up" style="animation-delay: 0.3s;"><p class="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">We’re working hard to make dorm life even better — upgrading current spaces, adding new facilities, and bringing you fun events to enjoy together!</p></div> <div class="animate-slide-up" style="animation-delay: 0.6s;"><p class="text-lg text-white/80 mb-12">Select a facility, choose your dates, and submit your booking request. Our representatives will review and confirm your request.</p></div> <div class="animate-slide-up" style="animation-delay: 0.9s;"><button class="btn-primary text-lg px-8 py-4 pulse-glow">🚀 Start Booking</button></div></div> <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"><div class="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"><div class="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div></div></div></section> <section id="booking-section" class="py-20 px-4"><div class="max-w-7xl mx-auto"><div class="text-center mb-16 animate-slide-up"><h2 class="text-4xl md:text-5xl font-bold gradient-text mb-6">Book Your Facility</h2> <p class="text-xl text-gray-600 max-w-3xl mx-auto">Select a facility, choose your dates, and submit your booking request. Our representatives will review and confirm your request.</p></div> <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"><div class="space-y-8 animate-slide-up" style="animation-delay: 0.2s;"><div class="card"><h3 class="text-2xl font-bold gradient-text mb-6 flex items-center"><span class="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">1</span> What would you like to book?</h3> `);
  FacilityPicker($$payload);
  $$payload.out.push(`<!----></div> `);
  {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div> <div class="space-y-8">`);
  {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> `);
  {
    $$payload.out.push("<!--[!-->");
    {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]-->`);
  }
  $$payload.out.push(`<!--]--></div></div></div></section> <section class="py-20 px-4 bg-gradient-to-br from-purple-50 to-pink-50"><div class="max-w-6xl mx-auto"><div class="text-center mb-16 animate-slide-up"><h2 class="text-4xl font-bold gradient-text mb-6">Community Guidelines</h2> <p class="text-xl text-gray-600">Simple rules to ensure everyone enjoys our shared spaces</p></div> <div class="grid grid-cols-1 md:grid-cols-3 gap-8"><div class="card text-center facility-card animate-slide-up" style="animation-delay: 0.1s;"><div class="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6"><svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div> <h3 class="text-xl font-bold gradient-text mb-4">Respect Time Limits</h3> <p class="text-gray-600">Club Room &amp; Games Room: Max 2 days • BBQ Area: Max 1 day per booking</p></div> <div class="card text-center facility-card animate-slide-up" style="animation-delay: 0.3s;"><div class="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6"><svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg></div> <h3 class="text-xl font-bold gradient-text mb-4">Clean Up After Use</h3> <p class="text-gray-600">Leave facilities clean and tidy for the next resident to enjoy</p></div> <div class="card text-center facility-card animate-slide-up" style="animation-delay: 0.5s;"><div class="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6"><svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div> <h3 class="text-xl font-bold gradient-text mb-4">Follow House Rules</h3> <p class="text-gray-600">Respect noise levels and building policies during your booking</p></div></div></div></section> `);
  {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]-->`);
  pop();
}
export {
  _page as default
};
