import { S as ensure_array_like, P as head, F as attr_class, G as attr, M as escape_html, O as stringify, B as pop, z as push } from "../../../chunks/index2.js";
import { b as base } from "../../../chunks/paths.js";
const events = [
  {
    id: 1,
    poster: "/posters/1.webp",
    title: "Beach Night",
    shortDescription: "Tropical decorations, summer beats, and beach-themed fun to wrap up the semester.",
    location: "ViennaBase19",
    upcoming: false
  },
  {
    id: 2,
    poster: "/posters/2.webp",
    title: "Games Night",
    shortDescription: "Cards, board games, pool, and friendly competition in a relaxed social atmosphere.",
    location: "ViennaBase19",
    upcoming: false
  },
  {
    id: 3,
    poster: "/posters/3.webp",
    title: "90s Opening Party",
    shortDescription: "Travel back to the 90s with retro music, colorful outfits, and nostalgic games.",
    location: "ViennaBase19",
    upcoming: false
  },
  {
    id: 4,
    poster: "/posters/4.webp",
    title: "Halloween Fright Night",
    shortDescription: "Costumes, spooky decorations, music, and Halloween-themed activities at the Club Room.",
    location: "Club Room",
    upcoming: false
  },
  {
    id: 5,
    poster: "/posters/5.webp",
    title: "Gluhwein Booth",
    shortDescription: "Warm drinks, winter atmosphere, and festive conversations to celebrate the holiday season together.",
    location: "ViennaBase19",
    upcoming: false
  },
  {
    id: 6,
    poster: "/posters/6.webp",
    title: "Semester Closing Party",
    shortDescription: "Celebrate the end of the semester with costumes, music, and one final night together before the break.",
    location: "ViennaBase19",
    upcoming: false
  },
  {
    id: 7,
    poster: "/posters/7.webp",
    title: "Semester Opening",
    shortDescription: "Kick off the new semester by meeting fellow residents, making friends, and enjoying a fun evening together.",
    location: "ViennaBase19",
    upcoming: false
  },
  {
    id: 8,
    poster: "/posters/8.webp",
    title: "Flea Market",
    shortDescription: "Residents sold, swapped, and discovered hidden treasures while enjoying a relaxed afternoon together.",
    location: "ViennaBase19",
    upcoming: false
  },
  {
    id: 9,
    poster: "/posters/9.webp",
    title: "BBQ Together",
    shortDescription: "An afternoon of grilled food, good conversations, and community in the ViennaBase19 garden.",
    location: "ViennaBase19 Garden",
    upcoming: false
  },
  {
    id: 10,
    poster: "/posters/10.webp",
    title: "Volleyball Tournament",
    shortDescription: "A friendly outdoor volleyball tournament bringing residents together for some healthy competition.",
    location: "ViennaBase19",
    upcoming: false
  },
  {
    id: 11,
    poster: "/posters/11.webp",
    title: "Latino Night",
    shortDescription: "An evening of Latin music, dancing, and summer vibes to celebrate the end of the semester.",
    location: "ViennaBase19",
    upcoming: false
  }
];
function _page($$payload, $$props) {
  push();
  let databaseDisplayEvents, databasePosterKeys, fallbackArchiveEvents, pastEvents;
  let databaseEvents = [];
  let flippedCards = /* @__PURE__ */ new Set();
  const todayIso = toISO(/* @__PURE__ */ new Date());
  const archiveEvents = [...events].sort((a, b) => b.id - a.id).map((event) => ({
    id: `archive-${event.id}`,
    poster: event.poster,
    title: event.title,
    shortDescription: event.shortDescription,
    eventDate: null,
    date: event.date,
    location: event.location
  }));
  function asset(path) {
    if (/^(https?:|data:|blob:)/i.test(path)) return path;
    if (path.startsWith(base + "/")) return path;
    if (path.startsWith("/")) return `${base}${path}`;
    return `${base}/${path}`;
  }
  function posterKey(path) {
    return path.replace(/\.(jpe?g|png|webp)$/i, "");
  }
  function toISO(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }
  function formatDisplayDate(iso) {
    return (/* @__PURE__ */ new Date(`${iso}T00:00:00`)).toLocaleDateString("en-GB");
  }
  databaseDisplayEvents = databaseEvents.map((event) => ({
    id: event.id,
    poster: event.posterUrl,
    title: event.title,
    shortDescription: event.description,
    eventDate: event.eventDate,
    date: formatDisplayDate(event.eventDate),
    location: "ViennaBase19"
  }));
  databasePosterKeys = new Set(databaseDisplayEvents.map((event) => posterKey(event.poster)));
  fallbackArchiveEvents = archiveEvents.filter((event) => !databasePosterKeys.has(posterKey(event.poster)));
  databaseDisplayEvents.filter((event) => event.eventDate !== null && event.eventDate >= todayIso).sort((a, b) => (a.eventDate ?? "").localeCompare(b.eventDate ?? ""));
  pastEvents = [
    ...databaseDisplayEvents.filter((event) => event.eventDate !== null && event.eventDate < todayIso),
    ...fallbackArchiveEvents
  ].sort((a, b) => {
    if (!a.eventDate && !b.eventDate) return 0;
    if (!a.eventDate) return 1;
    if (!b.eventDate) return -1;
    return b.eventDate.localeCompare(a.eventDate);
  });
  const each_array_1 = ensure_array_like(pastEvents);
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Events - ViennaBase19 Reps</title>`;
    $$payload2.out.push(`<meta name="description" content="Explore upcoming and past ViennaBase19 events from the Reps community."/>`);
  });
  $$payload.out.push(`<section class="px-4 py-12 md:py-16"><div class="max-w-7xl mx-auto"><div class="text-center mb-12 animate-slide-up"><p class="text-sm font-semibold uppercase tracking-wider text-vb19-primary mb-3">ViennaBase19 Reps</p> <h1 class="text-4xl md:text-5xl font-bold gradient-text mb-4">Events</h1> <p class="text-lg text-vb19-muted max-w-2xl mx-auto">Discover what is coming up next and flip through memories from our community events.</p></div> <section class="mb-16"><div class="flex items-end justify-between gap-4 mb-6"><div><h2 class="text-3xl font-bold text-vb19-text">Upcoming Events</h2> <p class="text-sm text-vb19-muted mt-1">New events will appear here once they are announced.</p></div></div> `);
  {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> `);
  {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="card text-center max-w-2xl mx-auto py-12"><h3 class="text-2xl font-bold text-vb19-text mb-2">Loading events...</h3> <p class="text-vb19-muted">Checking what is coming up next.</p></div>`);
  }
  $$payload.out.push(`<!--]--></section> <section><div class="mb-6"><h2 class="text-3xl font-bold text-vb19-text">Past Events</h2> <p class="text-sm text-vb19-muted mt-1">Past events and poster archive, newest first.</p></div> <div class="events-grid svelte-13hsgdq"><!--[-->`);
  for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
    let event = each_array_1[$$index_1];
    $$payload.out.push(`<button type="button"${attr_class(`event-card ${stringify(flippedCards.has(event.id) ? "is-flipped" : "")}`, "svelte-13hsgdq")}${attr("aria-label", `Flip details for ${event.title}`)}><span class="event-card-inner svelte-13hsgdq"><span class="event-card-face event-card-front svelte-13hsgdq"><img${attr("src", asset(event.poster))}${attr("alt", `${event.title} poster`)} loading="lazy" class="svelte-13hsgdq"/></span> <span class="event-card-face event-card-back svelte-13hsgdq"><span class="text-xl font-bold text-vb19-text mb-2">${escape_html(event.title)}</span> `);
    if (event.date) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<span class="text-sm font-semibold text-vb19-primary mb-3">${escape_html(event.date)}</span>`);
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--> <span class="text-sm text-vb19-muted leading-relaxed">${escape_html(event.shortDescription)}</span> `);
    if (event.location) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<span class="mt-4 text-xs font-semibold uppercase tracking-wider text-purple-500">${escape_html(event.location)}</span>`);
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--></span></span></button>`);
  }
  $$payload.out.push(`<!--]--></div></section></div></section>`);
  pop();
}
export {
  _page as default
};
