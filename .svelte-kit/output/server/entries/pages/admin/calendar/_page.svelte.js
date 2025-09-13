import { P as ensure_array_like, M as head, K as escape_html, Q as maybe_selected, O as attr, E as attr_class, F as stringify, B as pop, z as push } from "../../../../chunks/index2.js";
import { f as facilitiesData } from "../../../../chunks/facilities.js";
function _page($$payload, $$props) {
  push();
  let currentMonth, currentYear, monthName, calendarDays;
  const mockReservations = [
    {
      id: 1,
      facilityName: "Club Room",
      residentName: "John Doe",
      startDate: "2025-09-15",
      endDate: "2025-09-15",
      status: "PENDING"
    },
    {
      id: 2,
      facilityName: "BBQ Area",
      residentName: "Jane Smith",
      startDate: "2025-09-14",
      endDate: "2025-09-14",
      status: "CONFIRMED"
    },
    {
      id: 3,
      facilityName: "Games Room",
      residentName: "Mike Johnson",
      startDate: "2025-09-16",
      endDate: "2025-09-16",
      status: "PENDING"
    },
    {
      id: 4,
      facilityName: "Club Room",
      residentName: "Sarah Wilson",
      startDate: "2025-09-18",
      endDate: "2025-09-19",
      status: "CONFIRMED"
    },
    {
      id: 5,
      facilityName: "BBQ Area",
      residentName: "Tom Brown",
      startDate: "2025-09-20",
      endDate: "2025-09-20",
      status: "CONFIRMED"
    }
  ];
  const mockBlackouts = [
    {
      id: 1,
      facilityName: "Club Room",
      startDate: "2025-09-22",
      endDate: "2025-09-23",
      reason: "Maintenance"
    }
  ];
  let currentDate = /* @__PURE__ */ new Date();
  let selectedFacility = "ALL";
  function generateCalendarDays(year, month) {
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    const days = [];
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateString = date.toISOString().split("T")[0];
      const dayReservations = getReservationsForDate(dateString);
      const dayBlackouts = getBlackoutsForDate(dateString);
      days.push({
        date,
        dateString,
        day: date.getDate(),
        isCurrentMonth: date.getMonth() === month,
        isToday: date.getTime() === today.getTime(),
        isPast: date < today,
        reservations: dayReservations,
        blackouts: dayBlackouts
      });
    }
    return days;
  }
  function getReservationsForDate(dateString) {
    return mockReservations.filter((r) => {
      const startDate = new Date(r.startDate);
      const endDate = new Date(r.endDate);
      const checkDate = new Date(dateString);
      return checkDate >= startDate && checkDate <= endDate && selectedFacility === "ALL";
    });
  }
  function getBlackoutsForDate(dateString) {
    return mockBlackouts.filter((b) => {
      const startDate = new Date(b.startDate);
      const endDate = new Date(b.endDate);
      const checkDate = new Date(dateString);
      return checkDate >= startDate && checkDate <= endDate && selectedFacility === "ALL";
    });
  }
  function getStatusColor(status) {
    switch (status) {
      case "PENDING":
        return "bg-yellow-200 text-yellow-800";
      case "CONFIRMED":
        return "bg-green-200 text-green-800";
      case "DECLINED":
        return "bg-red-200 text-red-800";
      case "CANCELLED":
        return "bg-gray-200 text-gray-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  }
  function getFacilityColor(facilityName) {
    switch (facilityName) {
      case "Club Room":
        return "bg-blue-100 border-blue-300";
      case "Games Room":
        return "bg-purple-100 border-purple-300";
      case "BBQ Area":
        return "bg-orange-100 border-orange-300";
      default:
        return "bg-gray-100 border-gray-300";
    }
  }
  currentMonth = currentDate.getMonth();
  currentYear = currentDate.getFullYear();
  monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  calendarDays = generateCalendarDays(currentYear, currentMonth);
  const each_array = ensure_array_like(facilitiesData);
  const each_array_1 = ensure_array_like(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]);
  const each_array_2 = ensure_array_like(calendarDays);
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Calendar - Admin - ViennaBase19</title>`;
  });
  $$payload.out.push(`<div class="space-y-6"><div class="flex justify-between items-center"><div><h1 class="text-3xl font-bold text-vb19-text">Calendar View</h1> <p class="mt-2 text-vb19-muted">Overview of all facility bookings and blackouts</p></div> <div class="flex space-x-3"><button class="btn-secondary">Today</button> <button class="btn-primary"><svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg> Create Booking</button></div></div> <div class="card"><div class="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0"><div class="flex items-center space-x-4"><div class="flex items-center space-x-2"><button type="button" class="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"><svg class="w-5 h-5 text-vb19-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg></button> <h2 class="text-xl font-semibold text-vb19-text min-w-[200px] text-center">${escape_html(monthName)}</h2> <button type="button" class="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"><svg class="w-5 h-5 text-vb19-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></button></div></div> <div class="flex items-center space-x-4"><div><label class="form-label text-sm">Filter by Facility</label> <select class="form-input text-sm">`);
  $$payload.select_value = selectedFacility;
  $$payload.out.push(`<option value="ALL"${maybe_selected($$payload, "ALL")}>All Facilities</option><!--[-->`);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let facility = each_array[$$index];
    $$payload.out.push(`<option${attr("value", facility.displayName)}${maybe_selected($$payload, facility.displayName)}>${escape_html(facility.displayName)}</option>`);
  }
  $$payload.out.push(`<!--]-->`);
  $$payload.select_value = void 0;
  $$payload.out.push(`</select></div></div></div></div> <div class="card"><h3 class="text-sm font-semibold text-vb19-text mb-3">Legend</h3> <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs"><div class="flex items-center space-x-2"><div class="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div> <span class="text-vb19-muted">Club Room</span></div> <div class="flex items-center space-x-2"><div class="w-3 h-3 bg-purple-100 border border-purple-300 rounded"></div> <span class="text-vb19-muted">Games Room</span></div> <div class="flex items-center space-x-2"><div class="w-3 h-3 bg-orange-100 border border-orange-300 rounded"></div> <span class="text-vb19-muted">BBQ Area</span></div> <div class="flex items-center space-x-2"><div class="w-3 h-3 bg-red-100 border border-red-300 rounded"></div> <span class="text-vb19-muted">Blackout</span></div></div> <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs mt-2"><div class="flex items-center space-x-2"><div class="w-3 h-3 bg-green-200 rounded"></div> <span class="text-vb19-muted">Confirmed</span></div> <div class="flex items-center space-x-2"><div class="w-3 h-3 bg-yellow-200 rounded"></div> <span class="text-vb19-muted">Pending</span></div> <div class="flex items-center space-x-2"><div class="w-3 h-3 bg-gray-200 rounded"></div> <span class="text-vb19-muted">Cancelled</span></div> <div class="flex items-center space-x-2"><div class="w-1 h-3 bg-vb19-accent rounded"></div> <span class="text-vb19-muted">Today</span></div></div></div> <div class="card"><div class="grid grid-cols-7 gap-1"><!--[-->`);
  for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
    let dayName = each_array_1[$$index_1];
    $$payload.out.push(`<div class="p-3 text-center text-sm font-medium text-vb19-muted bg-gray-50">${escape_html(dayName)}</div>`);
  }
  $$payload.out.push(`<!--]--> <!--[-->`);
  for (let $$index_4 = 0, $$length = each_array_2.length; $$index_4 < $$length; $$index_4++) {
    let day = each_array_2[$$index_4];
    const each_array_3 = ensure_array_like(day.reservations);
    const each_array_4 = ensure_array_like(day.blackouts);
    $$payload.out.push(`<div${attr_class(`min-h-[120px] p-2 border border-gray-100 ${stringify(!day.isCurrentMonth ? "bg-gray-50 opacity-50" : "bg-white")} relative`)}><div class="flex items-center justify-between mb-1"><span${attr_class(`text-sm font-medium ${stringify(day.isToday ? "text-vb19-primary" : day.isCurrentMonth ? "text-vb19-text" : "text-vb19-muted")}`)}>${escape_html(day.day)}</span> `);
    if (day.isToday) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<div class="w-1 h-4 bg-vb19-accent rounded"></div>`);
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--></div> <div class="space-y-1"><!--[-->`);
    for (let $$index_2 = 0, $$length2 = each_array_3.length; $$index_2 < $$length2; $$index_2++) {
      let reservation = each_array_3[$$index_2];
      $$payload.out.push(`<div${attr_class(`text-xs p-1 rounded border ${stringify(getFacilityColor(reservation.facilityName))} ${stringify(getStatusColor(reservation.status))} truncate`)}><div class="font-medium">${escape_html(reservation.facilityName)}</div> <div class="opacity-75">${escape_html(reservation.residentName)}</div></div>`);
    }
    $$payload.out.push(`<!--]--> <!--[-->`);
    for (let $$index_3 = 0, $$length2 = each_array_4.length; $$index_3 < $$length2; $$index_3++) {
      let blackout = each_array_4[$$index_3];
      $$payload.out.push(`<div class="text-xs p-1 rounded bg-red-100 border border-red-300 text-red-800 truncate"><div class="font-medium">Blackout</div> <div class="opacity-75">${escape_html(blackout.reason)}</div></div>`);
    }
    $$payload.out.push(`<!--]--></div> `);
    if (day.reservations.length + day.blackouts.length > 2) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<div class="absolute bottom-1 right-1 text-xs text-vb19-muted">+${escape_html(day.reservations.length + day.blackouts.length - 2)} more</div>`);
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--></div>`);
  }
  $$payload.out.push(`<!--]--></div></div> <div class="grid grid-cols-1 md:grid-cols-3 gap-6"><div class="card text-center"><div class="text-2xl font-bold text-vb19-text mb-2">${escape_html(mockReservations.filter((r) => r.status === "PENDING").length)}</div> <div class="text-sm text-vb19-muted">Pending Approvals</div></div> <div class="card text-center"><div class="text-2xl font-bold text-vb19-text mb-2">${escape_html(mockReservations.filter((r) => {
    const startDate = new Date(r.startDate);
    const today = /* @__PURE__ */ new Date();
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1e3);
    return startDate >= today && startDate <= weekFromNow && r.status === "CONFIRMED";
  }).length)}</div> <div class="text-sm text-vb19-muted">This Week</div></div> <div class="card text-center"><div class="text-2xl font-bold text-vb19-text mb-2">${escape_html(mockBlackouts.length)}</div> <div class="text-sm text-vb19-muted">Active Blackouts</div></div></div></div>`);
  pop();
}
export {
  _page as default
};
