<script lang="ts">
  import { onMount, tick } from 'svelte';
  import {
    adminLogin,
    createAdminCalendarEntry,
    createAdminEvent,
    deleteAdminCalendarEntry,
    deleteAdminEvent,
    getEvents,
    getAdminCalendar,
    type AdminActionPayload,
    type AdminCalendarItem,
    type EventItem
  } from '$lib/api';

  const SESSION_KEY = 'baseRepsAdminToken';
  const facilities = [
    { name: 'CLUB_ROOM', label: 'Club Room' },
    { name: 'GAMES_ROOM', label: 'Games Room' }
  ] as const;

  function atMidnight(d: Date) {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  }

  function addDays(d: Date, n: number) {
    const x = new Date(d);
    x.setDate(x.getDate() + n);
    return x;
  }

  function toISO(d: Date) {
    const x = atMidnight(d);
    const y = x.getFullYear();
    const m = String(x.getMonth() + 1).padStart(2, '0');
    const day = String(x.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function toIsoDate(value: string | null | undefined) {
    const trimmed = value?.trim();
    if (!trimmed) return null;

    const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (isoMatch) return trimmed;

    const euMatch = trimmed.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
    if (!euMatch) return null;

    const [, day, month, year] = euMatch;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  function firstGridDay(year: number, month: number) {
    const first = new Date(year, month, 1);
    const start = new Date(first);
    const offset = (first.getDay() + 6) % 7;
    start.setDate(1 - offset);
    return atMidnight(start);
  }

  function lastGridDayExclusive(year: number, month: number) {
    return addDays(firstGridDay(year, month), 42);
  }

  function formatDisplayDate(iso: string) {
    return new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB');
  }

  function endInclusive(isoExclusive: string) {
    return toISO(addDays(new Date(`${isoExclusive}T00:00:00`), -1));
  }

  function itemCoversDate(item: AdminCalendarItem, dateString: string) {
    return item.startDate <= dateString && dateString < item.endDate;
  }

  function isSelectedStart(dayIso: string) {
    return toIsoDate(startDate) === dayIso;
  }

  function isSelectedEnd(dayIso: string) {
    return toIsoDate(endDate) === dayIso;
  }

  function isInSelectedRange(dayIso: string) {
    const start = toIsoDate(startDate);
    const end = toIsoDate(endDate);

    if (!start) return false;
    if (!end) return dayIso === start;

    const min = start <= end ? start : end;
    const max = start <= end ? end : start;

    return dayIso >= min && dayIso <= max;
  }

  function isSelectedEndpoint(dayIso: string) {
    return isSelectedStart(dayIso) || isSelectedEnd(dayIso);
  }

  function itemClass(item: AdminCalendarItem) {
    if (item.type === 'disabled') return 'bg-gray-700 text-white border-gray-800';
    if (item.status === 'PENDING') return 'bg-amber-100 text-amber-900 border-amber-300';
    if (item.facilityName === 'CLUB_ROOM') return 'bg-purple-100 text-purple-900 border-purple-300';
    return 'bg-sky-100 text-sky-900 border-sky-300';
  }

  function itemLabel(item: AdminCalendarItem) {
    if (item.type === 'disabled') return `${item.facilityDisplayName}: disabled`;
    const status = item.status === 'CONFIRMED' ? 'booked' : item.status.toLowerCase();
    return `${item.facilityDisplayName}: ${status}`;
  }

  function tooltipRows(item: AdminCalendarItem) {
    return [
      ['Facility', item.facilityDisplayName],
      ['Room', item.roomNumber || '-'],
      ['Name', item.residentName || '-'],
      ['Email', item.residentEmail || '-'],
      ['Dates', `${formatDisplayDate(item.startDate)} - ${formatDisplayDate(endInclusive(item.endDate))}`],
      ['Status', item.status],
      ['Note', item.adminNote || '-']
    ];
  }

  function eventStatus(eventDate: string) {
    return eventDate >= todayIso ? 'Upcoming' : 'Past';
  }

  let token = '';
  let password = '';
  let authError = '';
  let authLoading = false;
  let currentDate = new Date();
  let items: AdminCalendarItem[] = [];
  let loading = false;
  let calendarError = '';
  let successMessage = '';
  let formError = '';
  let activeTab: 'reservations' | 'events' = 'reservations';

  let facilityName: AdminActionPayload['facilityName'] = 'CLUB_ROOM';
  let action: AdminActionPayload['action'] = 'disable';
  const todayIso = toISO(new Date());
  let startDate = '';
  let endDate = '';
  let residentName = '';
  let residentEmail = '';
  let roomNumber = '';
  let adminNote = '';
  let events: EventItem[] = [];
  let eventsLoading = false;
  let eventsError = '';
  let eventsSuccess = '';
  let eventTitle = '';
  let eventDate = '';
  let eventDescription = '';
  let eventPoster: File | null = null;
  let posterInputKey = 0;

  $: currentMonth = currentDate.getMonth();
  $: currentYear = currentDate.getFullYear();
  $: monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  $: gridStart = firstGridDay(currentYear, currentMonth);
  $: gridEnd = lastGridDayExclusive(currentYear, currentMonth);
  $: calendarDays = Array.from({ length: 42 }, (_, index) => {
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
  $: sortedEvents = [...events].sort((a, b) => b.eventDate.localeCompare(a.eventDate));

  onMount(() => {
    token = sessionStorage.getItem(SESSION_KEY) || '';
    if (token) {
      refreshCalendar();
      refreshEvents();
    }
  });

  async function handleLogin() {
    authLoading = true;
    authError = '';
    try {
      token = await adminLogin(password);
      sessionStorage.setItem(SESSION_KEY, token);
      password = '';
      await Promise.all([refreshCalendar(), refreshEvents()]);
    } catch {
      authError = 'Incorrect password or admin login is unavailable.';
    } finally {
      authLoading = false;
    }
  }

  function logout() {
    token = '';
    sessionStorage.removeItem(SESSION_KEY);
  }

  async function selectTab(tab: 'reservations' | 'events') {
    activeTab = tab;
    if (tab === 'events' && token && events.length === 0) {
      await refreshEvents();
    }
  }

  async function refreshCalendar() {
    if (!token) return;
    loading = true;
    calendarError = '';
    try {
      items = await getAdminCalendar(token, toISO(gridStart), toISO(gridEnd));
    } catch (e: any) {
      if (e?.error === 'UNAUTHORIZED') logout();
      calendarError = 'Could not load admin bookings.';
    } finally {
      loading = false;
    }
  }

  async function refreshEvents() {
    if (!token) return;
    eventsLoading = true;
    eventsError = '';
    try {
      events = await getEvents();
    } catch (e: any) {
      if (e?.error === 'UNAUTHORIZED') logout();
      eventsError = 'Could not load events.';
    } finally {
      eventsLoading = false;
    }
  }

  function handlePosterInput(event: Event) {
    const files = (event.currentTarget as HTMLInputElement).files;
    eventPoster = files?.[0] ?? null;
  }

  async function submitEvent() {
    eventsError = '';
    eventsSuccess = '';

    if (!eventTitle.trim() || !eventDate || !eventDescription.trim() || !eventPoster) {
      eventsError = 'Event name, date, description, and poster are required.';
      return;
    }

    eventsLoading = true;
    try {
      await createAdminEvent(token, {
        title: eventTitle.trim(),
        description: eventDescription.trim(),
        eventDate,
        poster: eventPoster
      });
      eventTitle = '';
      eventDate = '';
      eventDescription = '';
      eventPoster = null;
      posterInputKey += 1;
      eventsSuccess = 'Event added.';
      await refreshEvents();
    } catch {
      eventsError = 'Could not add event.';
    } finally {
      eventsLoading = false;
    }
  }

  async function removeEvent(id: string) {
    eventsError = '';
    eventsSuccess = '';
    eventsLoading = true;
    try {
      await deleteAdminEvent(token, id);
      eventsSuccess = 'Event deleted.';
      await refreshEvents();
    } catch {
      eventsError = 'Could not delete event.';
    } finally {
      eventsLoading = false;
    }
  }

  async function changeMonth(offset: number) {
    currentDate = new Date(currentYear, currentMonth + offset, 1);
    await tick();
    await refreshCalendar();
  }

  function selectCalendarDate(dateString: string) {
    successMessage = '';
    formError = '';

    const start = toIsoDate(startDate);
    const end = toIsoDate(endDate);

    if (!start || end) {
      startDate = dateString;
      endDate = '';
      return;
    }

    if (dateString < start) {
      startDate = dateString;
      endDate = '';
      return;
    }

    endDate = dateString;
  }

  function handleCalendarDayKeydown(event: KeyboardEvent, dateString: string) {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    selectCalendarDate(dateString);
  }

  function handleStartDateInput() {
    successMessage = '';
    formError = '';
    const start = toIsoDate(startDate);
    const end = toIsoDate(endDate);

    if (!start) {
      endDate = '';
      return;
    }

    if (end && end < start) {
      endDate = '';
    }
  }

  function handleEndDateInput() {
    successMessage = '';
    formError = '';
    const start = toIsoDate(startDate);
    const end = toIsoDate(endDate);

    if (!end) {
      return;
    }

    if (!start || end < start) {
      startDate = end;
      endDate = '';
      return;
    }
  }

  function validateForm() {
    const start = toIsoDate(startDate);
    const end = toIsoDate(endDate);
    if (!start || !end || end < start) return 'Choose a valid date range.';
    if (action === 'book' && (!residentName.trim() || !residentEmail.trim() || !roomNumber.trim())) {
      return 'Resident name, email, and room number are required for admin bookings.';
    }
    return '';
  }

  async function submitAdminAction() {
    formError = validateForm();
    successMessage = '';
    if (formError) return;
    const start = toIsoDate(startDate);
    const end = toIsoDate(endDate);
    if (!start || !end) return;

    const payload: AdminActionPayload = {
      facilityName,
      startDate: start,
      endDate: end,
      action,
      adminNote: adminNote.trim() || undefined
    };

    if (action === 'book') {
      payload.residentName = residentName.trim();
      payload.residentEmail = residentEmail.trim();
      payload.roomNumber = roomNumber.trim();
    }

    try {
      await createAdminCalendarEntry(token, payload);
      successMessage = action === 'book' ? 'Admin booking created.' : 'Days marked unavailable.';
      adminNote = '';
      if (action === 'book') {
        residentName = '';
        residentEmail = '';
        roomNumber = '';
      }
      await refreshCalendar();
      window.dispatchEvent(new CustomEvent('vb19:refresh-availability'));
    } catch {
      formError = 'Could not save the admin action.';
    }
  }

  async function removeCalendarItem(event: MouseEvent, item: AdminCalendarItem) {
    event.stopPropagation();

    const confirmed = window.confirm(
      item.type === 'booking'
        ? 'Are you sure you want to delete this booking?'
        : 'Are you sure you want to remove this blocked date range?'
    );

    if (!confirmed) return;

    formError = '';
    successMessage = '';
    loading = true;
    try {
      await deleteAdminCalendarEntry(token, { id: item.id, type: item.type });
      successMessage = item.type === 'booking' ? 'Booking deleted.' : 'Blocked date range removed.';
      await refreshCalendar();
      window.dispatchEvent(new CustomEvent('vb19:refresh-availability'));
    } catch {
      formError = item.type === 'booking' ? 'Could not delete booking.' : 'Could not remove blocked date range.';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Admin - ViennaBase19 Reps</title>
</svelte:head>

{#if !token}
  <section class="admin-page min-h-[70vh] px-4 py-20 flex items-center justify-center">
    <div class="card w-full max-w-md">
      <h1 class="text-3xl font-bold gradient-text mb-3">Admin</h1>
      <p class="text-sm text-vb19-muted mb-6">Enter the admin password to manage Base Reps bookings.</p>

      <form class="space-y-4" on:submit|preventDefault={handleLogin}>
        <div>
          <label class="form-label" for="admin-password">Password</label>
          <input
            id="admin-password"
            class="form-input"
            type="password"
            bind:value={password}
            autocomplete="current-password"
          />
        </div>

        {#if authError}
          <p class="text-sm text-red-600">{authError}</p>
        {/if}

        <button class="btn-primary w-full" type="submit" disabled={authLoading}>
          {authLoading ? 'Checking...' : 'Unlock Admin'}
        </button>
      </form>
    </div>
  </section>
{:else}
  <section class="admin-page px-4 py-10">
    <div class="max-w-7xl mx-auto space-y-8">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-4xl font-bold gradient-text">Admin</h1>
          <p class="text-vb19-muted mt-2">Manage Club Room and Games Room bookings.</p>
        </div>
        <button class="btn-secondary" type="button" on:click={logout}>Log out</button>
      </div>

      <div class="card">
        <h2 class="text-xl font-semibold text-vb19-text mb-2">How to use this page</h2>
        <p class="text-vb19-muted">
          Use this page to view all bookings, manually reserve dates, or disable days. Select a facility,
          choose a date range, then select whether you want to create an admin booking or mark the days as unavailable.
        </p>
      </div>

      <div class="flex flex-wrap gap-2 rounded-2xl border border-purple-100 bg-white/60 p-2">
        <button
          type="button"
          class="rounded-xl px-5 py-2.5 text-sm font-semibold transition {activeTab === 'reservations' ? 'bg-vb19-muted text-white shadow-md' : 'text-vb19-primary hover:bg-purple-50'}"
          on:click={() => selectTab('reservations')}
        >
          Reservations
        </button>
        <button
          type="button"
          class="rounded-xl px-5 py-2.5 text-sm font-semibold transition {activeTab === 'events' ? 'bg-vb19-muted text-white shadow-md' : 'text-vb19-primary hover:bg-purple-50'}"
          on:click={() => selectTab('events')}
        >
          Events
        </button>
      </div>

      {#if activeTab === 'reservations'}
      <div class="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8 items-start">
        <div class="card">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 class="text-2xl font-bold text-vb19-text">{monthName}</h2>
              <p class="text-sm text-vb19-muted">Hover over any item to see resident and status details.</p>
              <p class="text-sm text-vb19-muted mt-1">
                Click a start date, then an end date on the calendar, or use the fields on the right.
              </p>
            </div>
            <div class="flex items-center gap-2">
              <button class="btn-secondary py-2 px-4" type="button" on:click={() => changeMonth(-1)}>Previous</button>
              <button class="btn-secondary py-2 px-4" type="button" on:click={() => changeMonth(1)}>Next</button>
            </div>
          </div>

          {#if loading}
            <p class="text-sm text-vb19-muted mb-4">Loading admin calendar...</p>
          {:else if calendarError}
            <p class="text-sm text-red-600 mb-4">{calendarError}</p>
          {/if}

          <div class="grid grid-cols-7 gap-1 mb-3">
            {#each ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as day}
              <div class="text-center text-xs font-semibold text-vb19-muted py-2">{day}</div>
            {/each}

            {#each calendarDays as day (day.iso)}
              <div
                role="button"
                tabindex="0"
                class="admin-calendar-day min-h-[118px] rounded-lg border p-2 text-left transition-all duration-200 {day.isCurrentMonth ? '' : 'opacity-40'}"
                class:admin-calendar-day-selected={isSelectedEndpoint(day.iso)}
                class:admin-calendar-day-range={!isSelectedEndpoint(day.iso) && isInSelectedRange(day.iso)}
                aria-pressed={isInSelectedRange(day.iso)}
                aria-label={`Select ${formatDisplayDate(day.iso)}`}
                on:click={() => selectCalendarDate(day.iso)}
                on:keydown={(keyboardEvent) => handleCalendarDayKeydown(keyboardEvent, day.iso)}
              >
                <div class="mb-2 flex items-center justify-between gap-2">
                  <div class="flex items-center gap-1.5">
                    <span class="admin-calendar-day-number text-xs font-semibold {isSelectedEndpoint(day.iso) ? 'text-white' : isInSelectedRange(day.iso) ? 'text-current' : 'text-gray-500'}">
                      {day.day}
                    </span>
                    {#if day.isToday && !isInSelectedRange(day.iso)}
                      <span class="rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-gray-500">
                        Today
                      </span>
                    {/if}
                  </div>
                  {#if isSelectedStart(day.iso) || isSelectedEnd(day.iso)}
                    <span class="rounded-full bg-purple-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                      {isSelectedStart(day.iso) && isSelectedEnd(day.iso) ? 'Selected' : isSelectedStart(day.iso) ? 'Start' : 'End'}
                    </span>
                  {/if}
                </div>
                <div class="space-y-1">
                  {#each day.items as item (item.id)}
                    <div class="relative group">
                      <div class="flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-semibold {itemClass(item)}">
                        <span class="min-w-0 flex-1 truncate">{itemLabel(item)}</span>
                        <button
                          type="button"
                          class="inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-white/70 text-gray-700 transition hover:bg-white hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                          aria-label={item.type === 'booking' ? 'Delete booking' : 'Remove blocker'}
                          title={item.type === 'booking' ? 'Delete booking' : 'Remove blocker'}
                          on:click={(clickEvent) => removeCalendarItem(clickEvent, item)}
                        >
                          ×
                        </button>
                      </div>
                      <div class="pointer-events-none absolute left-0 top-full z-50 mt-2 hidden w-72 rounded-lg bg-gray-950 p-3 text-xs text-white shadow-xl group-hover:block">
                        {#each tooltipRows(item) as row}
                          <div class="grid grid-cols-[72px_1fr] gap-2 py-0.5">
                            <span class="text-gray-300">{row[0]}</span>
                            <span>{row[1]}</span>
                          </div>
                        {/each}
                      </div>
                    </div>
                  {/each}
                </div>
              </div>
            {/each}
          </div>

          <div class="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
            <div class="flex items-center gap-2"><span class="w-3 h-3 rounded bg-purple-100 border border-purple-300"></span>Club Room</div>
            <div class="flex items-center gap-2"><span class="w-3 h-3 rounded bg-sky-100 border border-sky-300"></span>Games Room</div>
            <div class="flex items-center gap-2"><span class="w-3 h-3 rounded bg-amber-100 border border-amber-300"></span>Pending</div>
            <div class="flex items-center gap-2"><span class="w-3 h-3 rounded bg-purple-100 border border-purple-300"></span>Approved/booked</div>
            <div class="flex items-center gap-2"><span class="w-3 h-3 rounded bg-gray-700"></span>Disabled</div>
          </div>
        </div>

        <div class="card">
          <h2 class="text-2xl font-bold text-vb19-text mb-5">Admin action</h2>
          <form class="space-y-4" on:submit|preventDefault={submitAdminAction}>
            <p class="rounded-lg border border-purple-100 bg-purple-50 px-3 py-2 text-sm text-purple-900">
              Click a start date, then an end date on the calendar, or use the fields on the right.
            </p>

            <div>
              <label class="form-label" for="admin-facility">Facility</label>
              <select id="admin-facility" class="form-input" bind:value={facilityName}>
                {#each facilities as facility}
                  <option value={facility.name}>{facility.label}</option>
                {/each}
              </select>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="form-label" for="admin-start">Start date</label>
                <input
                  id="admin-start"
                  class="form-input"
                  type="date"
                  bind:value={startDate}
                  on:input={handleStartDateInput}
                />
              </div>
              <div>
                <label class="form-label" for="admin-end">End date</label>
                <input
                  id="admin-end"
                  class="form-input"
                  type="date"
                  bind:value={endDate}
                  on:input={handleEndDateInput}
                />
              </div>
            </div>

            <div>
              <label class="form-label" for="admin-action">Action</label>
              <select id="admin-action" class="form-input" bind:value={action}>
                <option value="book">Book dates</option>
                <option value="disable">Disable dates</option>
              </select>
            </div>

            {#if action === 'book'}
              <div>
                <label class="form-label" for="resident-name">Resident name</label>
                <input id="resident-name" class="form-input" bind:value={residentName} />
              </div>
              <div>
                <label class="form-label" for="resident-email">Resident email</label>
                <input id="resident-email" class="form-input" type="email" bind:value={residentEmail} />
              </div>
              <div>
                <label class="form-label" for="resident-room">Room number</label>
                <input id="resident-room" class="form-input" bind:value={roomNumber} />
              </div>
              <div>
                <label class="form-label" for="booking-note">Optional note</label>
                <textarea id="booking-note" class="form-input min-h-24" bind:value={adminNote}></textarea>
              </div>
            {:else}
              <div>
                <label class="form-label" for="disable-note">Optional reason/note</label>
                <textarea id="disable-note" class="form-input min-h-24" bind:value={adminNote}></textarea>
              </div>
            {/if}

            {#if formError}
              <p class="text-sm text-red-600">{formError}</p>
            {/if}
            {#if successMessage}
              <p class="text-sm text-green-700">{successMessage}</p>
            {/if}

            <button class="btn-primary w-full" type="submit">
              {action === 'book' ? 'Create Admin Booking' : 'Disable Dates'}
            </button>
          </form>
        </div>
      </div>
      {:else}
        <div class="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-8 items-start">
          <div class="card">
            <h2 class="text-2xl font-bold text-vb19-text mb-5">Add event</h2>
            <form class="space-y-4" on:submit|preventDefault={submitEvent}>
              <div>
                <label class="form-label" for="event-title">Event name</label>
                <input id="event-title" class="form-input" bind:value={eventTitle} />
              </div>

              <div>
                <label class="form-label" for="event-date">Event date</label>
                <input id="event-date" class="form-input" type="date" bind:value={eventDate} />
              </div>

              <div>
                <label class="form-label" for="event-description">Short description</label>
                <textarea id="event-description" class="form-input min-h-28" bind:value={eventDescription}></textarea>
              </div>

              <div>
                <label class="form-label" for="event-poster">Poster/image upload</label>
                {#key posterInputKey}
                  <input
                    id="event-poster"
                    class="form-input"
                    type="file"
                    accept="image/*"
                    on:change={handlePosterInput}
                  />
                {/key}
                {#if eventPoster}
                  <p class="mt-2 text-xs text-vb19-muted">{eventPoster.name}</p>
                {/if}
              </div>

              {#if eventsError}
                <p class="text-sm text-red-600">{eventsError}</p>
              {/if}
              {#if eventsSuccess}
                <p class="text-sm text-green-700">{eventsSuccess}</p>
              {/if}

              <button class="btn-primary w-full" type="submit" disabled={eventsLoading}>
                {eventsLoading ? 'Saving...' : 'Add Event'}
              </button>
            </form>
          </div>

          <div class="card overflow-hidden">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
              <div>
                <h2 class="text-2xl font-bold text-vb19-text">Existing events</h2>
                <p class="text-sm text-vb19-muted">Newest events are shown first.</p>
              </div>
              <button class="btn-secondary py-2 px-4" type="button" on:click={refreshEvents} disabled={eventsLoading}>
                Refresh
              </button>
            </div>

            {#if eventsLoading && sortedEvents.length === 0}
              <p class="text-sm text-vb19-muted">Loading events...</p>
            {:else if sortedEvents.length === 0}
              <p class="text-sm text-vb19-muted">No events have been added yet.</p>
            {:else}
              <div class="overflow-x-auto">
                <table class="w-full min-w-[760px] text-left text-sm">
                  <thead>
                    <tr class="border-b border-purple-100 text-xs uppercase tracking-wide text-vb19-muted">
                      <th class="py-3 pr-4">Poster</th>
                      <th class="py-3 pr-4">Name</th>
                      <th class="py-3 pr-4">Date</th>
                      <th class="py-3 pr-4">Status</th>
                      <th class="py-3 pr-4">Description</th>
                      <th class="py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {#each sortedEvents as event (event.id)}
                      <tr class="border-b border-purple-50 align-top">
                        <td class="py-3 pr-4">
                          <img
                            class="h-16 w-12 rounded-md object-cover shadow-sm"
                            src={event.posterUrl}
                            alt={`${event.title} poster`}
                          />
                        </td>
                        <td class="py-3 pr-4 font-semibold text-vb19-text">{event.title}</td>
                        <td class="py-3 pr-4 text-vb19-muted">{formatDisplayDate(event.eventDate)}</td>
                        <td class="py-3 pr-4">
                          <span class="rounded-full px-2.5 py-1 text-xs font-semibold {eventStatus(event.eventDate) === 'Upcoming' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}">
                            {eventStatus(event.eventDate)}
                          </span>
                        </td>
                        <td class="py-3 pr-4 text-vb19-muted">{event.description}</td>
                        <td class="py-3 text-right">
                          <button
                            type="button"
                            class="text-sm font-semibold text-red-600 hover:text-red-700"
                            on:click={() => removeEvent(event.id)}
                            disabled={eventsLoading}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    {/each}
                  </tbody>
                </table>
              </div>
            {/if}
          </div>
        </div>
      {/if}
    </div>
  </section>
{/if}

<style>
  .admin-page :global(.card),
  .admin-page :global(.btn-primary),
  .admin-page :global(.btn-secondary) {
    transform: none !important;
  }

  .admin-page :global(.card:hover),
  .admin-page :global(.btn-primary:hover),
  .admin-page :global(.btn-primary:active),
  .admin-page :global(.btn-secondary:hover),
  .admin-page :global(.btn-secondary:active) {
    transform: none !important;
  }

  .admin-calendar-day {
    background: rgba(255, 255, 255, 0.8);
    border-color: rgb(243 232 255);
    color: rgb(17 24 39);
  }

  .admin-calendar-day:hover {
    background: rgb(250 245 255);
    border-color: rgb(216 180 254);
  }

  .admin-calendar-day-range {
    background: #faf7ff;
    border-color: #e9d5ff;
    color: #9b51e0;
  }

  .admin-calendar-day-selected {
    background: #8b5cf6;
    border-color: #8b5cf6;
    color: white;
  }

  .admin-calendar-day-selected:hover {
    background: #8b5cf6;
  }

  .admin-calendar-day-selected .admin-calendar-day-number {
    color: white !important;
  }
</style>
