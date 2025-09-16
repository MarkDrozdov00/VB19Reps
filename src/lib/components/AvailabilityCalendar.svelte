<script lang="ts">
  // Use relative path to avoid alias hiccups for now
  import { selectedFacility, availability, selectedDates } from '$lib/stores/facilities';
  import { createEventDispatcher, onMount } from 'svelte';
  import { getAvailability } from '$lib/api';

  

  const dispatch = createEventDispatcher();

  // ---- helpers ----
  function atMidnight(d: Date) { const x = new Date(d); x.setHours(0,0,0,0); return x; }
  function addDays(d: Date, n: number) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function addMonths(d: Date, n: number) { const x = new Date(d); x.setMonth(x.getMonth() + n); return x; }
  const lower = (x: unknown) => String(x ?? '').toLowerCase();
  const toISO = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth()+1).padStart(2,'0');
    const day = String(d.getDate()).padStart(2,'0');
    return `${y}-${m}-${day}`;
  };

  // booking window: tomorrow .. +2 months (inclusive)
  const today = atMidnight(new Date());
  const minSelectableDate = addDays(today, 1);
  const maxSelectableDate = new Date(atMidnight(addMonths(today, 2)).getTime() + (24*60*60*1000 - 1));

  let currentDate = new Date();
  let selectedStartDate: Date | null = null;
  let selectedEndDate: Date | null = null;

  // ---- reactive timestamps ----
  $: startTs = selectedStartDate ? atMidnight(selectedStartDate).getTime() : null;
  $: endTs   = selectedEndDate   ? atMidnight(selectedEndDate).getTime()   : null;

  // ---- calendar state ----
  $: currentMonth = currentDate.getMonth();
  $: currentYear = currentDate.getFullYear();
  $: monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // base days for the grid
  $: calendarDays = generateCalendarDays(currentYear, currentMonth, $availability?.days ?? []);

  // DAYS WITH SELECTION FLAGS (reacts to startTs/endTs)
  $: viewDays = calendarDays.map(d => {
    const ts = d.ts as number;
    const isSelected =
      startTs != null && (endTs != null ? (ts === startTs || ts === endTs) : ts === startTs);
    const isInRange =
      startTs != null && endTs != null && ts >= startTs && ts <= endTs;
    return { ...d, _selected: isSelected, _inRange: isInRange };
  });

  // update store so booking form sees dates
  $: selectedDates.set({ start: selectedStartDate, end: selectedEndDate });

  // Show the overnight note only for the Clubroom (or if facility has overnight: true)
  $: isOvernightFacility = !!$selectedFacility && (
    // explicit flag on the object, or fuzzy match on name/slug
    // @ts-ignore
    $selectedFacility.overnight === true ||
    ['clubroom', 'club room', 'club-room'].some(k => {
      // @ts-ignore
      const slugish = lower($selectedFacility.slug ?? $selectedFacility.key ?? $selectedFacility.id);
      // @ts-ignore
      const name = lower($selectedFacility.displayName);
      return slugish.includes(k) || name.includes(k);
    })
  );

  // EU date for header pill
  function fmtDateEU(d: Date) { return d.toLocaleDateString('en-GB'); }

  // totals
  $: totalDays =
    selectedStartDate && selectedEndDate
      ? Math.ceil((atMidnight(selectedEndDate).getTime() - atMidnight(selectedStartDate).getTime()) / (1000*60*60*24)) + 1
      : 1;
  $: totalNights = totalDays; // 1 selected day = 1 night (for Clubroom)

  // ----- availability fetch -----
  let loading = false;
  let availError: string | null = null;

  function firstGridDay(year: number, month: number) {
    const first = new Date(year, month, 1);
    const start = new Date(first);
    // Monday-start grid: shift back so Monday is first cell
    const offset = (first.getDay() + 6) % 7; // Mon=0 … Sun=6
    start.setDate(1 - offset);
    return atMidnight(start);
  }
  function lastGridDayExclusive(year: number, month: number) {
    const start = firstGridDay(year, month);
    const end = addDays(start, 42); // 6 weeks grid -> exclusive end
    return atMidnight(end);
  }

  function toApiFacilityName(displayName?: string) {
    const s = (displayName || '').toLowerCase();
    if (s.includes('club')) return 'CLUB_ROOM' as const;
    if (s.includes('game')) return 'GAMES_ROOM' as const;
    if (s.includes('bbq'))  return 'BBQ_AREA'  as const;
    // fallback if your store carries the enum already
    // @ts-ignore
    return $selectedFacility?.name ?? 'BBQ_AREA';
  }

  async function refreshAvailability() {
    // @ts-ignore
    if (!$selectedFacility) { availability.set({ days: [] }); return; }
    loading = true;
    availError = null;
    try {
      const fromDate = firstGridDay(currentYear, currentMonth);
      const toDateEx = lastGridDayExclusive(currentYear, currentMonth);
      const facilityName = $selectedFacility?.name ?? toApiFacilityName($selectedFacility?.displayName);

      const days = await getAvailability(
        facilityName,
        toISO(fromDate),
        toISO(toDateEx) // API expects exclusive 'to'
      );

      availability.set({ days }); // your getDayStatus reads $availability.days
    } catch (e: any) {
      availError = 'Failed to load availability.';
      console.error('availability error:', e);
      availability.set({ days: [] });
    } finally {
      loading = false;
    }
  }
  

  // initial load + whenever facility/month changes
  onMount(() => {
    refreshAvailability(); // initial load
    const handler = () => {
      // optional guard to avoid overlapping calls
      if (!loading) refreshAvailability();
    };
    window.addEventListener('vb19:refresh-availability', handler);
    return () => window.removeEventListener('vb19:refresh-availability', handler);
  });

  $: if ($selectedFacility) { /* facility changed */ refreshAvailability(); }
  $: if (currentMonth != null && currentYear != null) { /* month changed */ refreshAvailability(); }

  function generateCalendarDays(year: number, month: number, daysFromStore: Array<{date:string;status:string}> = []) {
    const startDate = firstGridDay(year, month);
    const days: any[] = [];
    for (let i = 0; i < 42; i++) {
      const date = addDays(startDate, i);
      const dateAtMidnight = atMidnight(date);
      const dateString = toISO(dateAtMidnight);
      const dayStatus = getDayStatus(dateString, daysFromStore);

      const isOutsideWindow =
        dateAtMidnight < minSelectableDate || dateAtMidnight > maxSelectableDate;

      days.push({
        date: dateAtMidnight,
        ts: dateAtMidnight.getTime(),
        dateString,
        day: dateAtMidnight.getDate(),
        isCurrentMonth: dateAtMidnight.getMonth() === month,
        isToday: dateAtMidnight.getTime() === today.getTime(),
        status: dayStatus,
        isOutsideWindow,
        isSelectable: dayStatus === 'free' && !isOutsideWindow
      });
    }
    return days;
  }

  function getDayStatus(dateString: string, daysArr: Array<{date:string;status:string}>) {
    // @ts-ignore
    const dayData = (daysArr || []).find((d) => d.date === dateString);
    return dayData ? dayData.status : 'free';
  }

  // Use your vb19 theme colors
  function getStatusColor(status: string, isSelected = false, isInRange = false, isOutsideWindow = false) {
    if (isSelected) return 'bg-vb19-muted text-white';
    if (isInRange)  return 'bg-vb19-bg text-vb19-primary';

    switch (status) {
      case 'booked':   return 'bg-red-100 text-red-800 cursor-not-allowed';
      case 'blackout': return 'bg-gray-300 text-gray-600 cursor-not-allowed';
      case 'pending':  return 'bg-amber-100 text-amber-800 cursor-not-allowed';
      case 'free':
        return isOutsideWindow
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : 'bg-white text-vb19-text hover:bg-vb19-bg cursor-pointer';
      default:
        return 'bg-white text-vb19-text hover:bg-vb19-bg cursor-pointer';
    }
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case 'booked': return '✕';
      case 'blackout': return '⚫';
      case 'pending': return '•';
      default: return '';
    }
  }

  function handleDateClick(day: any) {
    if (!day.isSelectable) return;
    const clickedDate: Date = day.date;
    if (clickedDate < minSelectableDate || clickedDate > maxSelectableDate) return;

    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      selectedStartDate = clickedDate;
      selectedEndDate = null;
    } else if (selectedStartDate && !selectedEndDate) {
      if (clickedDate < selectedStartDate) {
        selectedEndDate = selectedStartDate;
        selectedStartDate = clickedDate;
      } else {
        selectedEndDate = clickedDate;
      }
      if (!validateSelection(selectedStartDate, selectedEndDate)) {
        selectedStartDate = clickedDate;
        selectedEndDate = null;
      }
    }

    dispatch('dateSelectionChanged', { start: selectedStartDate, end: selectedEndDate });
    dispatch('datesSelect', { start: selectedStartDate, end: selectedEndDate});
  }

  function validateSelection(start: Date | null, end: Date | null) {
    // @ts-ignore
    if (!$selectedFacility || !start) return true;
    const endEff = end ?? start;

    if (start < minSelectableDate || endEff > maxSelectableDate) return false;

    // @ts-ignore
    const max = $selectedFacility.maxDays ?? 1;
    const daysDiff = Math.ceil((atMidnight(endEff).getTime() - atMidnight(start).getTime()) / (1000*60*60*24)) + 1;
    if (daysDiff > max) return false;

    const d = new Date(start);
    while (d <= endEff) {
      const dateString = toISO(atMidnight(d));
      if (getDayStatus(dateString, $availability?.days ?? []) !== 'free') return false;
      d.setDate(d.getDate() + 1);
    }
    return true;
  }

  // navigation guards
  $: canGoPrev =
    (currentYear > today.getFullYear()) ||
    (currentYear === today.getFullYear() && currentMonth > today.getMonth());

  $: lastAllowedMonth = maxSelectableDate.getMonth();
  $: lastAllowedYear  = maxSelectableDate.getFullYear();

  $: canGoNext =
    (currentYear < lastAllowedYear) ||
    (currentYear === lastAllowedYear && currentMonth < lastAllowedMonth);

  function previousMonth() {
    if (!canGoPrev) return;
    currentDate = new Date(currentYear, currentMonth - 1, 1);
  }

  function nextMonth() {
    if (!canGoNext) return;
    currentDate = new Date(currentYear, currentMonth + 1, 1);
  }

  function clearSelection() {
    selectedStartDate = null;
    selectedEndDate = null;
    dispatch('dateSelectionChanged', { start: null, end: null });
  }
</script>

<div class="availability-calendar">
  <!-- Header -->
  <div class="flex items-center justify-between mb-6">
    {#if $selectedFacility}
      <h4 class="text-lg font-semibold text-vb19-text">
        Select dates for {$selectedFacility.displayName}
      </h4>
    {:else}
      <h4 class="text-lg font-semibold text-vb19-text">Select dates</h4>
    {/if}

    {#if selectedStartDate}
      <button
        type="button"
        class="text-sm text-vb19-muted hover:text-vb19-text transition-colors duration-200"
        on:click={clearSelection}
      >
        Clear selection
      </button>
    {/if}
  </div>

  <!-- Optional loading / error -->
  {#if loading}
    <div class="mb-3 text-sm text-vb19-muted">Loading availability…</div>
  {:else if availError}
    <div class="mb-3 text-sm text-red-600">{availError}</div>
  {/if}

  <!-- Booking policy note (Clubroom only) -->
  {#if isOvernightFacility}
    <div class="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-vb19-text">
      <span class="font-medium">Heads up:</span>
      Reservations run from <span class="font-semibold">18:00</span> on the selected day
      until <span class="font-semibold">15:00</span> the following day (cleaning &amp; key return).
      Selecting 2 days means <span class="font-semibold">2 nights</span>.
    </div>
  {/if}

  <!-- Selected pill -->
  {#if selectedStartDate}
    <div class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <span class="text-sm font-medium text-vb19-text">Selected:</span>
          {#if ($selectedFacility?.maxDays ?? 1) > 1 && selectedEndDate && totalDays > 1}
            <span class="text-sm text-vb19-primary ml-2">
              {fmtDateEU(selectedStartDate)} – {fmtDateEU(selectedEndDate)}
            </span>
          {:else}
            <span class="text-sm text-vb19-primary ml-2">{fmtDateEU(selectedStartDate)}</span>
          {/if}
        </div>

        {#if isOvernightFacility}
          <div class="text-xs text-vb19-muted">
            {#if selectedEndDate}
              {totalNights} {totalNights === 1 ? 'night' : 'nights'}
            {:else}
              1 night
            {/if}
            · Check-in after 18:00 · Check-out before 15:00
          </div>
        {:else}
          {#if ($selectedFacility?.maxDays ?? 1) > 1 && selectedEndDate && totalDays > 1}
            <div class="text-xs text-vb19-muted">
              {totalDays} {totalDays === 1 ? 'day' : 'days'}
            </div>
          {/if}
        {/if}
      </div>
    </div>
  {/if}

  <!-- Nav -->
  <div class="flex items-center justify-between mb-4">
    <button type="button"
      class="p-2 rounded-lg transition-colors duration-200 {canGoPrev ? 'hover:bg-gray-100' : 'opacity-40 cursor-not-allowed'}"
      on:click={previousMonth}
      disabled={!canGoPrev}
      aria-disabled={!canGoPrev}>
      <svg class="w-5 h-5 text-vb19-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>

    <h3 class="text-lg font-semibold text-vb19-text">{monthName}</h3>

    <button type="button"
      class="p-2 rounded-lg transition-colors duration-200 {canGoNext ? 'hover:bg-gray-100' : 'opacity-40 cursor-not-allowed'}"
      on:click={nextMonth}
      disabled={!canGoNext}
      aria-disabled={!canGoNext}>
      <svg class="w-5 h-5 text-vb19-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>

  <!-- Grid -->
  <div class="grid grid-cols-7 gap-1 mb-4">
    {#each ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] as dayName}
      <div class="p-2 text-center text-sm font-medium text-vb19-muted">{dayName}</div>
    {/each}

    {#each viewDays as day (day.dateString)}
      <button
        type="button"
        class="relative p-2 text-sm border border-gray-200 rounded-lg transition-all duration-200 min-h-[40px]
               {getStatusColor(day.status, day._selected, day._inRange, day.isOutsideWindow)}
               {!day.isCurrentMonth ? 'opacity-30' : ''}"
        disabled={!day.isSelectable}
        aria-disabled={!day.isSelectable}
        on:click={() => handleDateClick(day)}
        title={`${day.date.toLocaleDateString()} — ${day.status}`}
      >
        <span class="relative z-10">{day.day}</span>

        {#if getStatusIcon(day.status)}
          <span class="absolute top-0 right-0 text-xs leading-none">{getStatusIcon(day.status)}</span>
        {/if}

        {#if day.isToday}
          <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-vb19-accent rounded-full"></div>
        {/if}
      </button>
    {/each}
  </div>

  <!-- Legend -->
  <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
    <div class="flex items-center space-x-2">
      <div class="w-3 h-3 bg-white border border-gray-200 rounded"></div>
      <span class="text-vb19-muted">Available</span>
    </div>
    <div class="flex items-center space-x-2">
      <div class="w-3 h-3 bg-amber-100 border border-amber-200 rounded"></div>
      <span class="text-vb19-muted">Pending</span>
    </div>
    <div class="flex items-center space-x-2">
      <div class="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
      <span class="text-vb19-muted">Booked</span>
    </div>
    <div class="flex items-center space-x-2">
      <div class="w-3 h-3 bg-gray-300 rounded"></div>
      <span class="text-vb19-muted">Unavailable</span>
    </div>
  </div>
</div>
