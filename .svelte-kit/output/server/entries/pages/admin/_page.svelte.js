import { P as ensure_array_like, M as head, K as escape_html, E as attr_class, F as stringify, B as pop, z as push } from "../../../chunks/index2.js";
import "../../../chunks/facilities.js";
function _page($$payload, $$props) {
  push();
  let stats;
  const mockReservations = [
    {
      id: 1,
      facilityName: "Club Room",
      residentName: "John Doe",
      residentEmail: "john.doe@example.com",
      roomNumber: "4B",
      startDate: "2025-09-15",
      endDate: "2025-09-15",
      status: "PENDING",
      createdAt: "2025-09-12T10:30:00Z"
    },
    {
      id: 2,
      facilityName: "BBQ Area",
      residentName: "Jane Smith",
      residentEmail: "jane.smith@example.com",
      roomNumber: "7A",
      startDate: "2025-09-14",
      endDate: "2025-09-14",
      status: "CONFIRMED",
      createdAt: "2025-09-11T15:45:00Z"
    },
    {
      id: 3,
      facilityName: "Games Room",
      residentName: "Mike Johnson",
      residentEmail: "mike.j@example.com",
      roomNumber: "2C",
      startDate: "2025-09-16",
      endDate: "2025-09-16",
      status: "PENDING",
      createdAt: "2025-09-12T09:15:00Z"
    }
  ];
  function getStatusColor(status) {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CONFIRMED":
        return "bg-green-100 text-green-800";
      case "DECLINED":
        return "bg-red-100 text-red-800";
      case "CANCELLED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }
  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }
  function formatDateTime(dateString) {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }
  stats = {
    totalReservations: mockReservations.length,
    pendingApproval: mockReservations.filter((r) => r.status === "PENDING").length,
    confirmedToday: mockReservations.filter((r) => r.status === "CONFIRMED" && r.startDate === "2025-09-12").length,
    upcomingWeek: mockReservations.filter((r) => {
      const startDate = new Date(r.startDate);
      const today = /* @__PURE__ */ new Date();
      const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1e3);
      return startDate >= today && startDate <= weekFromNow;
    }).length
  };
  const each_array = ensure_array_like(mockReservations);
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Dashboard - Admin - ViennaBase19</title>`;
  });
  $$payload.out.push(`<div class="space-y-8"><div><h1 class="text-3xl font-bold text-vb19-text">Dashboard</h1> <p class="mt-2 text-vb19-muted">Overview of facility bookings and recent activity</p></div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"><div class="card"><div class="flex items-center"><div class="flex-shrink-0"><div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center"><svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg></div></div> <div class="ml-4"><p class="text-sm font-medium text-vb19-muted">Total Reservations</p> <p class="text-2xl font-bold text-vb19-text">${escape_html(stats.totalReservations)}</p></div></div></div> <div class="card"><div class="flex items-center"><div class="flex-shrink-0"><div class="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center"><svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div></div> <div class="ml-4"><p class="text-sm font-medium text-vb19-muted">Pending Approval</p> <p class="text-2xl font-bold text-vb19-text">${escape_html(stats.pendingApproval)}</p></div></div></div> <div class="card"><div class="flex items-center"><div class="flex-shrink-0"><div class="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center"><svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div></div> <div class="ml-4"><p class="text-sm font-medium text-vb19-muted">Confirmed Today</p> <p class="text-2xl font-bold text-vb19-text">${escape_html(stats.confirmedToday)}</p></div></div></div> <div class="card"><div class="flex items-center"><div class="flex-shrink-0"><div class="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center"><svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div></div> <div class="ml-4"><p class="text-sm font-medium text-vb19-muted">Upcoming Week</p> <p class="text-2xl font-bold text-vb19-text">${escape_html(stats.upcomingWeek)}</p></div></div></div></div> <div class="card"><div class="flex items-center justify-between mb-6"><h2 class="text-xl font-semibold text-vb19-text">Recent Reservations</h2> <a href="/admin/reservations" class="text-sm text-vb19-primary hover:text-blue-700 font-medium">View All →</a></div> <div class="overflow-x-auto"><table class="min-w-full divide-y divide-gray-200"><thead class="bg-gray-50"><tr><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resident</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Facility</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th></tr></thead><tbody class="bg-white divide-y divide-gray-200"><!--[-->`);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let reservation = each_array[$$index];
    $$payload.out.push(`<tr class="hover:bg-gray-50"><td class="px-6 py-4 whitespace-nowrap"><div><div class="text-sm font-medium text-vb19-text">${escape_html(reservation.residentName)}</div> <div class="text-sm text-vb19-muted">Room ${escape_html(reservation.roomNumber)}</div></div></td><td class="px-6 py-4 whitespace-nowrap text-sm text-vb19-text">${escape_html(reservation.facilityName)}</td><td class="px-6 py-4 whitespace-nowrap text-sm text-vb19-text">${escape_html(formatDate(reservation.startDate))} `);
    if (reservation.startDate !== reservation.endDate) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`- ${escape_html(formatDate(reservation.endDate))}`);
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--></td><td class="px-6 py-4 whitespace-nowrap"><span${attr_class(`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${stringify(getStatusColor(reservation.status))}`)}>${escape_html(reservation.status)}</span></td><td class="px-6 py-4 whitespace-nowrap text-sm text-vb19-muted">${escape_html(formatDateTime(reservation.createdAt))}</td><td class="px-6 py-4 whitespace-nowrap text-sm font-medium">`);
    if (reservation.status === "PENDING") {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<div class="flex space-x-2"><button class="text-green-600 hover:text-green-900">Approve</button> <button class="text-red-600 hover:text-red-900">Decline</button></div>`);
    } else {
      $$payload.out.push("<!--[!-->");
      $$payload.out.push(`<button class="text-vb19-primary hover:text-blue-700">View</button>`);
    }
    $$payload.out.push(`<!--]--></td></tr>`);
  }
  $$payload.out.push(`<!--]--></tbody></table></div></div> <div class="grid grid-cols-1 md:grid-cols-3 gap-6"><div class="card text-center"><div class="w-12 h-12 bg-vb19-primary rounded-lg flex items-center justify-center mx-auto mb-4"><svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg></div> <h3 class="text-lg font-semibold text-vb19-text mb-2">Create Reservation</h3> <p class="text-sm text-vb19-muted mb-4">Book facilities on behalf of residents</p> <button class="btn-primary">Create Booking</button></div> <div class="card text-center"><div class="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mx-auto mb-4"><svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"></path></svg></div> <h3 class="text-lg font-semibold text-vb19-text mb-2">Add Blackout</h3> <p class="text-sm text-vb19-muted mb-4">Block dates for maintenance or events</p> <a href="/admin/blackouts" class="btn-secondary">Manage Blackouts</a></div> <div class="card text-center"><div class="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4"><svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div> <h3 class="text-lg font-semibold text-vb19-text mb-2">View Calendar</h3> <p class="text-sm text-vb19-muted mb-4">See all bookings in calendar view</p> <a href="/admin/calendar" class="btn-secondary">Open Calendar</a></div></div></div>`);
  pop();
}
export {
  _page as default
};
