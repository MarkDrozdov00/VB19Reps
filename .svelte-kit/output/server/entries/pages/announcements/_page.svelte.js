import { M as head, P as ensure_array_like, O as attr, K as escape_html, E as attr_class, F as stringify, B as pop, z as push } from "../../../chunks/index2.js";
function _page($$payload, $$props) {
  push();
  const announcements = [
    {
      id: 1,
      title: "New BBQ Area Equipment",
      date: "2025-09-10",
      content: "We've upgraded our BBQ area with new grills and outdoor furniture. The space is now even better for your outdoor gatherings!",
      type: "update"
    },
    {
      id: 2,
      title: "Holiday Booking Schedule",
      date: "2025-09-08",
      content: "Please note that facility bookings during the holiday season (Dec 20 - Jan 5) require advance approval. Submit your requests early to secure your preferred dates.",
      type: "notice"
    },
    {
      id: 3,
      title: "Games Room Gaming Console Update",
      date: "2025-09-05",
      content: "The Games Room now features the latest gaming consoles and a selection of new board games. Perfect for your entertainment needs!",
      type: "update"
    },
    {
      id: 4,
      title: "Facility Booking Guidelines Reminder",
      date: "2025-09-01",
      content: "Remember to review our booking guidelines before making reservations. Club Room and Games Room require a €200 deposit and signed Terms of Use.",
      type: "reminder"
    }
  ];
  function getTypeColor(type) {
    switch (type) {
      case "update":
        return "bg-green-100 text-green-800 border-green-200";
      case "notice":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "reminder":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  }
  function getTypeIcon(type) {
    switch (type) {
      case "update":
        return "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15";
      case "notice":
        return "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z";
      case "reminder":
        return "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z";
      default:
        return "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z";
    }
  }
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  }
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Announcements - ViennaBase19</title>`;
    $$payload2.out.push(`<meta name="description" content="Stay updated with the latest announcements and news from ViennaBase19."/>`);
  });
  $$payload.out.push(`<section class="bg-white border-b border-gray-100 py-12"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="text-center"><h1 class="text-4xl font-bold text-vb19-text mb-4">Announcements</h1> <p class="text-lg text-vb19-muted max-w-2xl mx-auto">Stay informed about facility updates, important notices, and community news.</p></div></div></section> <section class="py-12"><div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">`);
  if (announcements.length > 0) {
    $$payload.out.push("<!--[-->");
    const each_array = ensure_array_like(announcements);
    $$payload.out.push(`<div class="space-y-8"><!--[-->`);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let announcement = each_array[$$index];
      $$payload.out.push(`<article class="card hover:shadow-md transition-shadow duration-200"><div class="flex items-start justify-between mb-4"><div class="flex items-center space-x-3"><div class="flex-shrink-0"><div class="w-10 h-10 rounded-full bg-vb19-primary bg-opacity-10 flex items-center justify-center"><svg class="w-5 h-5 text-vb19-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"${attr("d", getTypeIcon(announcement.type))}></path></svg></div></div> <div><h2 class="text-xl font-semibold text-vb19-text">${escape_html(announcement.title)}</h2> <p class="text-sm text-vb19-muted">${escape_html(formatDate(announcement.date))}</p></div></div> <span${attr_class(`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${stringify(getTypeColor(announcement.type))}`)}>${escape_html(announcement.type.charAt(0).toUpperCase() + announcement.type.slice(1))}</span></div> <div class="prose prose-gray max-w-none"><p class="text-vb19-text leading-relaxed">${escape_html(announcement.content)}</p></div></article>`);
    }
    $$payload.out.push(`<!--]--></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
    $$payload.out.push(`<div class="text-center py-12"><div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"><svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg></div> <h3 class="text-lg font-medium text-vb19-text mb-2">No announcements yet</h3> <p class="text-vb19-muted">Check back later for updates and news from ViennaBase19.</p></div>`);
  }
  $$payload.out.push(`<!--]--></div></section> <section class="bg-gray-50 py-12"><div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"><h2 class="text-2xl font-bold text-vb19-text mb-4">Ready to Book a Facility?</h2> <p class="text-vb19-muted mb-6">Browse our available facilities and make your reservation today.</p> <a href="/" class="btn-primary">Book Now</a></div></section>`);
  pop();
}
export {
  _page as default
};
