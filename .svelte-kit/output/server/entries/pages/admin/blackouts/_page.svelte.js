import { M as head, K as escape_html, P as ensure_array_like, E as attr_class, O as attr, F as stringify, B as pop, z as push } from "../../../../chunks/index2.js";
import "../../../../chunks/facilities.js";
function _page($$payload, $$props) {
  push();
  let sortedBlackouts;
  let blackouts = [
    {
      id: 1,
      facilityName: "Club Room",
      startDate: "2025-09-22",
      endDate: "2025-09-23",
      reason: "Scheduled maintenance and cleaning",
      createdAt: "2025-09-10T14:30:00Z"
    },
    {
      id: 2,
      facilityName: "BBQ Area",
      startDate: "2025-09-25",
      endDate: "2025-09-25",
      reason: "Equipment repair",
      createdAt: "2025-09-12T09:15:00Z"
    },
    {
      id: 3,
      facilityName: "Games Room",
      startDate: "2025-10-01",
      endDate: "2025-10-02",
      reason: "Furniture replacement",
      createdAt: "2025-09-08T16:45:00Z"
    }
  ];
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
  function isActive(blackout) {
    const today = /* @__PURE__ */ new Date();
    const startDate = new Date(blackout.startDate);
    const endDate = new Date(blackout.endDate);
    return today >= startDate && today <= endDate;
  }
  function isUpcoming(blackout) {
    const today = /* @__PURE__ */ new Date();
    const startDate = new Date(blackout.startDate);
    return startDate > today;
  }
  function getStatusBadge(blackout) {
    if (isActive(blackout)) {
      return "bg-red-100 text-red-800";
    } else if (isUpcoming(blackout)) {
      return "bg-blue-100 text-blue-800";
    } else {
      return "bg-gray-100 text-gray-800";
    }
  }
  function getStatusText(blackout) {
    if (isActive(blackout)) {
      return "Active";
    } else if (isUpcoming(blackout)) {
      return "Upcoming";
    } else {
      return "Past";
    }
  }
  sortedBlackouts = blackouts.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Blackouts - Admin - ViennaBase19</title>`;
  });
  $$payload.out.push(`<div class="space-y-6"><div class="flex justify-between items-center"><div><h1 class="text-3xl font-bold text-vb19-text">Blackout Management</h1> <p class="mt-2 text-vb19-muted">Block facility availability for maintenance and events</p></div> <button class="btn-primary"><svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg> Create Blackout</button></div> `);
  {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> <div class="grid grid-cols-1 md:grid-cols-3 gap-6"><div class="card text-center"><div class="text-2xl font-bold text-red-600 mb-2">${escape_html(sortedBlackouts.filter(isActive).length)}</div> <div class="text-sm text-vb19-muted">Active Now</div></div> <div class="card text-center"><div class="text-2xl font-bold text-blue-600 mb-2">${escape_html(sortedBlackouts.filter(isUpcoming).length)}</div> <div class="text-sm text-vb19-muted">Upcoming</div></div> <div class="card text-center"><div class="text-2xl font-bold text-vb19-text mb-2">${escape_html(sortedBlackouts.length)}</div> <div class="text-sm text-vb19-muted">Total Blackouts</div></div></div> <div class="card"><div class="flex items-center justify-between mb-6"><h2 class="text-xl font-semibold text-vb19-text">All Blackouts</h2> <div class="text-sm text-vb19-muted">${escape_html(sortedBlackouts.length)} blackout${escape_html(sortedBlackouts.length !== 1 ? "s" : "")}</div></div> `);
  if (sortedBlackouts.length > 0) {
    $$payload.out.push("<!--[-->");
    const each_array_1 = ensure_array_like(sortedBlackouts);
    $$payload.out.push(`<div class="overflow-x-auto"><table class="min-w-full divide-y divide-gray-200"><thead class="bg-gray-50"><tr><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Facility</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Range</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th></tr></thead><tbody class="bg-white divide-y divide-gray-200"><!--[-->`);
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let blackout = each_array_1[$$index_1];
      $$payload.out.push(`<tr class="hover:bg-gray-50"><td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-vb19-text">${escape_html(blackout.facilityName)}</td><td class="px-6 py-4 whitespace-nowrap text-sm text-vb19-text">${escape_html(formatDate(blackout.startDate))} `);
      if (blackout.startDate !== blackout.endDate) {
        $$payload.out.push("<!--[-->");
        $$payload.out.push(`<br/><span class="text-xs text-vb19-muted">to ${escape_html(formatDate(blackout.endDate))}</span>`);
      } else {
        $$payload.out.push("<!--[!-->");
      }
      $$payload.out.push(`<!--]--></td><td class="px-6 py-4 whitespace-nowrap"><span${attr_class(`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${stringify(getStatusBadge(blackout))}`)}>${escape_html(getStatusText(blackout))}</span></td><td class="px-6 py-4 text-sm text-vb19-text max-w-xs"><div class="truncate"${attr("title", blackout.reason)}>${escape_html(blackout.reason)}</div></td><td class="px-6 py-4 whitespace-nowrap text-sm text-vb19-muted">${escape_html(formatDateTime(blackout.createdAt))}</td><td class="px-6 py-4 whitespace-nowrap text-sm font-medium"><div class="flex space-x-2"><button class="text-vb19-primary hover:text-blue-700">Edit</button> <button class="text-red-600 hover:text-red-900">Delete</button></div></td></tr>`);
    }
    $$payload.out.push(`<!--]--></tbody></table></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
    $$payload.out.push(`<div class="text-center py-12"><svg class="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"></path></svg> <h3 class="text-lg font-medium text-vb19-text mb-2">No blackouts scheduled</h3> <p class="text-vb19-muted mb-4">Create your first blackout to block facility availability.</p> <button class="btn-primary">Create Blackout</button></div>`);
  }
  $$payload.out.push(`<!--]--></div></div>`);
  pop();
}
export {
  _page as default
};
