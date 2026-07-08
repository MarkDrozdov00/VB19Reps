import { P as head, G as attr, M as escape_html, B as pop, z as push } from "../../../chunks/index2.js";
function _page($$payload, $$props) {
  push();
  let currentMonth, currentYear, gridStart;
  function atMidnight(d) {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  }
  function addDays(d, n) {
    const x = new Date(d);
    x.setDate(x.getDate() + n);
    return x;
  }
  function toISO(d) {
    const x = atMidnight(d);
    const y = x.getFullYear();
    const m = String(x.getMonth() + 1).padStart(2, "0");
    const day = String(x.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }
  function firstGridDay(year, month) {
    const first = new Date(year, month, 1);
    const start = new Date(first);
    const offset = (first.getDay() + 6) % 7;
    start.setDate(1 - offset);
    return atMidnight(start);
  }
  function lastGridDayExclusive(year, month) {
    return addDays(firstGridDay(year, month), 42);
  }
  function itemCoversDate(item, dateString) {
    return item.startDate <= dateString && dateString < item.endDate;
  }
  let password = "";
  let authLoading = false;
  let currentDate = /* @__PURE__ */ new Date();
  let items = [];
  const todayIso = toISO(/* @__PURE__ */ new Date());
  let events = [];
  currentMonth = currentDate.getMonth();
  currentYear = currentDate.getFullYear();
  currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  gridStart = firstGridDay(currentYear, currentMonth);
  lastGridDayExclusive(currentYear, currentMonth);
  Array.from({ length: 42 }, (_, index) => {
    const date = addDays(gridStart, index);
    const dateString = toISO(date);
    return {
      date,
      iso: dateString,
      day: date.getDate(),
      isToday: dateString === todayIso,
      isCurrentMonth: date.getMonth() === currentMonth,
      items: items.filter((item) => itemCoversDate(item, dateString))
    };
  });
  [...events].sort((a, b) => b.eventDate.localeCompare(a.eventDate));
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Admin - ViennaBase19 Reps</title>`;
  });
  {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<section class="admin-page min-h-[70vh] px-4 py-20 flex items-center justify-center svelte-1jef3w8"><div class="card w-full max-w-md"><h1 class="text-3xl font-bold gradient-text mb-3">Admin</h1> <p class="text-sm text-vb19-muted mb-6">Enter the admin password to manage Base Reps bookings.</p> <form class="space-y-4"><div><label class="form-label" for="admin-password">Password</label> <input id="admin-password" class="form-input" type="password"${attr("value", password)} autocomplete="current-password"/></div> `);
    {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--> <button class="btn-primary w-full" type="submit"${attr("disabled", authLoading, true)}>${escape_html("Unlock Admin")}</button></form></div></section>`);
  }
  $$payload.out.push(`<!--]-->`);
  pop();
}
export {
  _page as default
};
