import { P as ensure_array_like, M as head, O as attr, Q as maybe_selected, K as escape_html, E as attr_class, F as stringify, B as pop, z as push } from "../../../../chunks/index2.js";
import { f as facilitiesData } from "../../../../chunks/facilities.js";
function _page($$payload, $$props) {
  push();
  let filteredReservations;
  let reservations = [
    {
      id: 1,
      facilityName: "Club Room",
      residentName: "John Doe",
      residentEmail: "john.doe@example.com",
      roomNumber: "4B",
      startDate: "2025-09-15",
      endDate: "2025-09-15",
      status: "PENDING",
      createdAt: "2025-09-12T10:30:00Z",
      notes: ""
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
      createdAt: "2025-09-11T15:45:00Z",
      notes: "Birthday party for 10 people"
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
      createdAt: "2025-09-12T09:15:00Z",
      notes: ""
    },
    {
      id: 4,
      facilityName: "Club Room",
      residentName: "Sarah Wilson",
      residentEmail: "sarah.w@example.com",
      roomNumber: "5D",
      startDate: "2025-09-18",
      endDate: "2025-09-19",
      status: "CONFIRMED",
      createdAt: "2025-09-10T14:20:00Z",
      notes: "Team meeting and workshop"
    },
    {
      id: 5,
      facilityName: "BBQ Area",
      residentName: "Tom Brown",
      residentEmail: "tom.brown@example.com",
      roomNumber: "3A",
      startDate: "2025-09-20",
      endDate: "2025-09-20",
      status: "CONFIRMED",
      createdAt: "2025-09-13T11:00:00Z",
      notes: ""
    }
  ];
  let searchTerm = "";
  let statusFilter = "ALL";
  let facilityFilter = "ALL";
  let sortBy = "createdAt";
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
  filteredReservations = reservations.filter((r) => {
    const matchesFacility = facilityFilter === "ALL";
    return matchesFacility;
  }).sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    }
    {
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
    }
  });
  const each_array = ensure_array_like(
    // In real app, this would make an API call
    // In real app, this would make an API call
    // In real app, this would make an API call
    facilitiesData
  );
  const each_array_1 = ensure_array_like(filteredReservations);
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Reservations - Admin - ViennaBase19</title>`;
  });
  $$payload.out.push(`<div class="space-y-6"><div class="flex justify-between items-center"><div><h1 class="text-3xl font-bold text-vb19-text">Reservations</h1> <p class="mt-2 text-vb19-muted">Manage facility bookings and approvals</p></div> <button class="btn-primary"><svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg> Create Reservation</button></div> <div class="card"><div class="grid grid-cols-1 md:grid-cols-4 gap-4"><div><label class="form-label">Search</label> <input type="text" class="form-input" placeholder="Name, email, or room..."${attr("value", searchTerm)}/></div> <div><label class="form-label">Status</label> <select class="form-input">`);
  $$payload.select_value = statusFilter;
  $$payload.out.push(`<option value="ALL"${maybe_selected($$payload, "ALL")}>All Statuses</option><option value="PENDING"${maybe_selected($$payload, "PENDING")}>Pending</option><option value="CONFIRMED"${maybe_selected($$payload, "CONFIRMED")}>Confirmed</option><option value="DECLINED"${maybe_selected($$payload, "DECLINED")}>Declined</option><option value="CANCELLED"${maybe_selected($$payload, "CANCELLED")}>Cancelled</option>`);
  $$payload.select_value = void 0;
  $$payload.out.push(`</select></div> <div><label class="form-label">Facility</label> <select class="form-input">`);
  $$payload.select_value = facilityFilter;
  $$payload.out.push(`<option value="ALL"${maybe_selected($$payload, "ALL")}>All Facilities</option><!--[-->`);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let facility = each_array[$$index];
    $$payload.out.push(`<option${attr("value", facility.displayName)}${maybe_selected($$payload, facility.displayName)}>${escape_html(facility.displayName)}</option>`);
  }
  $$payload.out.push(`<!--]-->`);
  $$payload.select_value = void 0;
  $$payload.out.push(`</select></div> <div><label class="form-label">Sort By</label> <select class="form-input">`);
  $$payload.select_value = sortBy;
  $$payload.out.push(`<option value="createdAt"${maybe_selected($$payload, "createdAt")}>Created Date</option><option value="startDate"${maybe_selected($$payload, "startDate")}>Booking Date</option><option value="residentName"${maybe_selected($$payload, "residentName")}>Resident Name</option><option value="facilityName"${maybe_selected($$payload, "facilityName")}>Facility</option><option value="status"${maybe_selected($$payload, "status")}>Status</option>`);
  $$payload.select_value = void 0;
  $$payload.out.push(`</select></div></div></div> <div class="flex justify-between items-center text-sm text-vb19-muted"><span>Showing ${escape_html(filteredReservations.length)} of ${escape_html(reservations.length)} reservations</span> <div class="flex items-center space-x-4"><span>Sort: ${escape_html("↓")}</span></div></div> <div class="card"><div class="overflow-x-auto"><table class="min-w-full divide-y divide-gray-200"><thead class="bg-gray-50"><tr><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">Resident `);
  {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">Facility `);
  {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">Date `);
  {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">Status `);
  {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">Created `);
  {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<span class="ml-1">${escape_html("↓")}</span>`);
  }
  $$payload.out.push(`<!--]--></th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th></tr></thead><tbody class="bg-white divide-y divide-gray-200"><!--[-->`);
  for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
    let reservation = each_array_1[$$index_1];
    $$payload.out.push(`<tr class="hover:bg-gray-50"><td class="px-6 py-4 whitespace-nowrap"><div><div class="text-sm font-medium text-vb19-text">${escape_html(reservation.residentName)}</div> <div class="text-sm text-vb19-muted">${escape_html(reservation.residentEmail)}</div> <div class="text-xs text-vb19-muted">Room ${escape_html(reservation.roomNumber)}</div></div></td><td class="px-6 py-4 whitespace-nowrap text-sm text-vb19-text">${escape_html(reservation.facilityName)}</td><td class="px-6 py-4 whitespace-nowrap text-sm text-vb19-text">${escape_html(formatDate(reservation.startDate))} `);
    if (reservation.startDate !== reservation.endDate) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<br/><span class="text-xs text-vb19-muted">to ${escape_html(formatDate(reservation.endDate))}</span>`);
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--></td><td class="px-6 py-4 whitespace-nowrap"><span${attr_class(`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${stringify(getStatusColor(reservation.status))}`)}>${escape_html(reservation.status)}</span></td><td class="px-6 py-4 text-sm text-vb19-muted max-w-xs"><div class="truncate"${attr("title", reservation.notes)}>${escape_html(reservation.notes || "-")}</div></td><td class="px-6 py-4 whitespace-nowrap text-sm text-vb19-muted">${escape_html(formatDateTime(reservation.createdAt))}</td><td class="px-6 py-4 whitespace-nowrap text-sm font-medium">`);
    if (reservation.status === "PENDING") {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<div class="flex space-x-2"><button class="text-green-600 hover:text-green-900">Approve</button> <button class="text-red-600 hover:text-red-900">Decline</button></div>`);
    } else {
      $$payload.out.push("<!--[!-->");
      if (reservation.status === "CONFIRMED") {
        $$payload.out.push("<!--[-->");
        $$payload.out.push(`<div class="flex space-x-2"><button class="text-vb19-primary hover:text-blue-700">Edit</button> <button class="text-red-600 hover:text-red-900">Cancel</button></div>`);
      } else {
        $$payload.out.push("<!--[!-->");
        $$payload.out.push(`<button class="text-vb19-primary hover:text-blue-700">View</button>`);
      }
      $$payload.out.push(`<!--]-->`);
    }
    $$payload.out.push(`<!--]--></td></tr>`);
  }
  $$payload.out.push(`<!--]--></tbody></table> `);
  if (filteredReservations.length === 0) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="text-center py-12"><svg class="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg> <h3 class="text-lg font-medium text-vb19-text mb-2">No reservations found</h3> <p class="text-vb19-muted">Try adjusting your search or filter criteria.</p></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div></div></div>`);
  pop();
}
export {
  _page as default
};
