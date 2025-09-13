<script>
  import { selectedFacility, availability, selectedDates } from '$lib/stores/facilities.js';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  // ---- helpers ----
  function atMidnight(d) { const x = new Date(d); x.setHours(0,0,0,0); return x; }
  function addDays(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function addMonths(d, n) { const x = new Date(d); x.setMonth(x.getMonth() + n); return x; }

  // booking window: tomorrow .. +2 months (inclusive)
  const today = atMidnight(new Date());
  const minSelectableDate = addDays(today, 1);
  const maxSelectableDate = new Date(atMidnight(addMonths(today, 2)).getTime() + (24*60*60*1000 - 1));

  let currentDate = new Date();
  let selectedStartDate = null;
  let selectedEndDate = null;

  // ---- reactive timestamps ----
  $: startTs = selectedStartDate ? atMidnight(selectedStartDate).getTime() : null;
  $: endTs   = selectedEndDate   ? atMidnight(selectedEndDate).getTime()   : null;

  // ---- calendar state ----
  $: currentMonth = currentDate.getMonth();
  $: currentYear = currentDate.getFullYear();
  $: monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // base days for the grid
  $: calendarDays = generateCalendarDays(currentYear, currentMonth);

  // DAYS WITH SELECTION FLAGS (reacts to startTs/endTs)
  $: viewDays = calendarDays.map(d => {
    const ts = d.ts;
    const isSelected =
      startTs != null && (endTs != null ? (ts === startTs || ts === endTs) : ts === startTs);
    const isInRange =
      startTs != null && endTs != null && ts >= startTs && ts <= endTs;
    return { ...d, _selected: isSelected, _inRange: isInRange };
  });

  // update store
  $: selectedDates.set({ start: selectedStartDate, end: selectedEndDate });

  // EU date for header pill
  function fmtDateEU(d) { return d.toLocaleDateString('en-GB'); }

  $: totalDays =
    selectedStartDate && selectedEndDate
      ? Math.ceil((atMidnight(selectedEndDate) - atMidnight(selectedStartDate)) / (1000*60*60*24)) + 1
      : 1;

  function generateCalendarDays(year, month) {
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay()); // start Sunday

    const days = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const dateAtMidnight = atMidnight(date);
      const dateString = dateAtMidnight.toISOString().split('T')[0];
      const dayStatus = getDayStatus(dateString);

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

  function getDayStatus(dateString) {
    const dayData = $availability.days.find(d => d.date === dateString);
    return dayData ? dayData.status : 'free';
  }

  // Use your vb19 theme colors to avoid purge issues
  function getStatusColor(status, isSelected = false, isInRange = false, isOutsideWindow = false) {
    if (isSelected) return 'bg-vb19-muted text-white';              // selected = purple
    if (isInRange)  return 'bg-vb19-bg text-vb19-primary';          // range = soft brand

    switch (status) {
      case 'booked':   return 'bg-red-100 text-red-800 cursor-not-allowed';
      case 'blackout': return 'bg-gray-300 text-gray-600 cursor-not-allowed';
      case 'free':
        return isOutsideWindow
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : 'bg-white text-vb19-text hover:bg-vb19-bg cursor-pointer';
      default:
        return 'bg-white text-vb19-text hover:bg-vb19-bg cursor-pointer';
    }
  }

  function getStatusIcon(status) {
    switch (status) {
      case 'booked': return '✕';
      case 'blackout': return '⚫';
      default: return '';
    }
  }

  function handleDateClick(day) {
    if (!day.isSelectable) return;
    const clickedDate = day.date;
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
  

  function validateSelection(start, end) {
    if (!$selectedFacility || !start || !end) return true;
    if (start < minSelectableDate || end > maxSelectableDate) return false;

    const daysDiff = Math.ceil((end - start) / (1000*60*60*24)) + 1;
    if (daysDiff > $selectedFacility.maxDays) return false;

    const d = new Date(start);
    while (d <= end) {
      const dateString = atMidnight(d).toISOString().split('T')[0];
      if (getDayStatus(dateString) !== 'free') return false;
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

  <!-- Selected pill -->
  {#if selectedStartDate}
    <div class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <div class="flex items-center justify-between">
        <div>
          <span class="text-sm font-medium text-vb19-text">Selected:</span>
          {#if $selectedFacility?.maxDays > 1 && selectedEndDate && totalDays > 1}
            <span class="text-sm text-vb19-primary ml-2">
              {fmtDateEU(selectedStartDate)} – {fmtDateEU(selectedEndDate)}
            </span>
          {:else}
            <span class="text-sm text-vb19-primary ml-2">{fmtDateEU(selectedStartDate)}</span>
          {/if}
        </div>
        {#if $selectedFacility?.maxDays > 1 && selectedEndDate && totalDays > 1}
          <span class="text-xs text-vb19-muted">{totalDays} {totalDays === 1 ? 'day' : 'days'}</span>
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
    {#each ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'] as dayName}
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
        title="{day.date.toLocaleDateString()} - {day.status}"
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
      <div class="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
      <span class="text-vb19-muted">Booked</span>
    </div>
    <div class="flex items-center space-x-2">
      <div class="w-3 h-3 bg-vb19-muted rounded"></div>
      <span class="text-vb19-muted">Selected</span>
    </div>
    <div class="flex items-center space-x-2">
      <div class="w-3 h-3 bg-gray-300 rounded"></div>
      <span class="text-vb19-muted">Unavailable</span>
    </div>
  </div>
</div>
