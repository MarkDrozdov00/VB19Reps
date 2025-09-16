<script lang="ts">
  import { selectedFacility, selectedDates } from '$lib/stores/facilities';
  import { createEventDispatcher } from 'svelte';
  import { createReservation, exclusiveEnd } from '$lib/api';


  const dispatch = createEventDispatcher();

  // ---------- validation + sanitizers ----------
  const ROOM_REGEX = /^[A-Za-z0-9 ]+$/;         // letters, numbers, spaces
  const ROOM_MAXLEN = 10;
  const sanitizeRoom = (s: string) => (s ?? '').replace(/[^A-Za-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();

  const NAME_REGEX  = /^[A-Za-z' -]+$/;         // letters, space, hyphen, apostrophe
  const NAME_MAXLEN = 60;
  const sanitizeNameInput = (s: string) => (s ?? '').replace(/[^A-Za-z' -]/g, '');
  const normalizeName = (s: string) =>
    (s ?? '')
      .replace(/[^A-Za-z' -]/g, '')
      .replace(/\s+/g, ' ')
      .replace(/-{2,}/g, '-')
      .replace(/'{2,}/g, "'")
      .replace(/^[ '-]+|[ '-]+$/g, '');

  const EMAIL_MAXLEN = 254;
  const sanitizeEmailInput = (s: string) =>
    (s ?? '').replace(/[\s\r\n\t<>,:;#$%^*&!()=+{}|"?/~]/g, '').trim();
  const normalizeEmailOnBlur = (s: string) => {
    s = sanitizeEmailInput(s);
    const at = s.lastIndexOf('@');
    if (at === -1) return s;
    const local = s.slice(0, at);
    const domain = s.slice(at + 1).toLowerCase();
    return `${local}@${domain}`;
  };
  function isLikelyEmail(s: string) {
    if (!s) return false;
    if (s.length > EMAIL_MAXLEN) return false;
    if (/[ \t\r\n]/.test(s)) return false;
    const parts = s.split('@');
    if (parts.length !== 2) return false;
    const [local, domain] = parts;
    if (!local || !domain) return false;
    if (!domain.includes('.')) return false;
    const labels = domain.split('.');
    if (labels.some(l => !l || l.startsWith('-') || l.endsWith('-') || l.length > 63)) return false;
    return true;
  }
  function preventBadEmailChars(e: InputEvent & { data?: string }) {
    // block space, CR/LF, < > , ;
    // @ts-ignore
    if (e.isComposing) return;
    // @ts-ignore
    if (e.inputType === 'insertText' && /[\s\r\n<>,;]/.test(e.data || '')) e.preventDefault();
  }
  function handleEmailPaste(e: ClipboardEvent) {
    const text = e.clipboardData?.getData('text') ?? '';
    const clean = sanitizeEmailInput(text);
    if (text !== clean) {
      e.preventDefault();
      const el = e.target as HTMLInputElement;
      const { selectionStart, selectionEnd, value } = el;
      const next = value.slice(0, selectionStart ?? 0) + clean + value.slice(selectionEnd ?? value.length);
      el.value = next;
      handleInputChange('email', next);
      const pos = (selectionStart ?? 0) + clean.length;
      requestAnimationFrame(() => el.setSelectionRange(pos, pos));
    }
  }

  // ---------- date helpers ----------
  function atMidnight(d: Date) { const x = new Date(d); x.setHours(0,0,0,0); return x; }
  function toISODateLocal(d?: Date | null) {
    if (!d) return null;
    const x = atMidnight(d);
    const y = x.getFullYear();
    const m = String(x.getMonth()+1).padStart(2,'0');
    const day = String(x.getDate()).padStart(2,'0');
    return `${y}-${m}-${day}`;
  }
  function fmtEU(d?: Date | null) { return d ? d.toLocaleDateString('en-GB') : ''; }

  // ---------- state ----------
  let formData = { roomNumber: '', name: '', email: '' };
  let isSubmitting = false;
  let submitStatus: 'success' | 'error' | null = null;
  let submitMessage = '';
  let fieldErrors: Record<string, string> = {};

  // ---------- derived from stores ----------
  $: start = $selectedDates.start as Date | null;
  $: end   = $selectedDates.end as Date | null;

  $: isRangeFacility = ($selectedFacility?.maxDays ?? 1) > 1;
  $: hasValidDates = !!start;

  $: selectedDateLabel = !start
    ? ''
    : (isRangeFacility && end && atMidnight(start).getTime() !== atMidnight(end).getTime())
      ? `${fmtEU(start)} – ${fmtEU(end)}`
      : fmtEU(start);

  function isValidEmailBasic(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  $: isFormValid =
    formData.roomNumber.trim() &&
    formData.name.trim() &&
    formData.email.trim() &&
    isValidEmailBasic(formData.email) &&
    hasValidDates;

  // Map UI displayName → API enum
  function toApiFacilityName(displayName?: string) {
    const s = (displayName || '').toLowerCase();
    if (s.includes('club')) return 'CLUB_ROOM' as const;
    if (s.includes('game')) return 'GAMES_ROOM' as const;
    if (s.includes('bbq'))  return 'BBQ_AREA'  as const;
    // fallback if your store already has the enum
    // @ts-ignore
    return $selectedFacility?.name ?? 'BBQ_AREA';
  }

  function validateForm() {
    const errors: Record<string,string> = {};

    // Room number
    const rn = sanitizeRoom(formData.roomNumber || '');
    if (!rn) errors.roomNumber = 'Room number is required';
    else if (!ROOM_REGEX.test(rn)) errors.roomNumber = 'Use letters, numbers, and spaces only';
    else if (rn.length > ROOM_MAXLEN) errors.roomNumber = `Max ${ROOM_MAXLEN} characters`;
    else formData.roomNumber = rn;

    // Full name
    const nm = normalizeName(formData.name);
    if (!nm) errors.name = 'Name is required';
    else if (!NAME_REGEX.test(nm)) errors.name = "Use letters, spaces, hyphens (-), and apostrophes (') only";
    else if (nm.length > NAME_MAXLEN) errors.name = `Max ${NAME_MAXLEN} characters`;
    else formData.name = nm;

    // Email
    const em = normalizeEmailOnBlur(formData.email);
    if (!em) errors.email = 'Email is required';
    else if (!isLikelyEmail(em)) errors.email = 'Please enter a valid email address';
    else formData.email = em;

    if (!start) errors.dates = 'Please select your booking dates';

    fieldErrors = errors;
    return Object.keys(errors).length === 0;
  }

  function handleInputChange(field: 'roomNumber'|'name'|'email', value: string) {
    if (field === 'roomNumber') value = sanitizeRoom(value);
    if (field === 'name')       value = sanitizeNameInput(value);
    if (field === 'email')      value = sanitizeEmailInput(value);

    // @ts-ignore
    formData[field] = value;

    if (fieldErrors[field]) {
      const { [field]: _, ...rest } = fieldErrors;
      fieldErrors = rest;
    }
  }

  // ---------- submit (calls real backend) ----------
  async function handleSubmit() {
    if (!validateForm()) return;

    isSubmitting = true;
    submitStatus = null;
    submitMessage = '';

    const startDate = toISODateLocal(start)!;
    const endUi     = isRangeFacility && end ? toISODateLocal(end)! : startDate;
    const endDate   = exclusiveEnd(endUi); // backend expects EXCLUSIVE end-date

    const facilityName = toApiFacilityName($selectedFacility?.displayName);

    const payload = {
      facilityName,                 // 'CLUB_ROOM' | 'GAMES_ROOM' | 'BBQ_AREA'
      startDate,                    // 'YYYY-MM-DD'
      endDate,                      // exclusive end
      roomNumber: formData.roomNumber.trim(),
      name: formData.name.trim(),
      email: formData.email.trim()
    };

    try {
      const res = await createReservation(payload);

      submitStatus = 'success';
      // right after success handling, before setTimeout(resetForm,...)
      window.dispatchEvent(new CustomEvent('vb19:refresh-availability'));

      const label = selectedDateLabel || `${startDate}${endUi !== startDate ? ` – ${endUi}` : ''}`;

      if (res.status === 'CONFIRMED') {
        submitMessage = `Success! Your ${$selectedFacility.displayName} booking for ${label} is confirmed. We’ve emailed ${formData.email}.`;
      } else {
        submitMessage = `Thanks! We’ve received your request for the ${$selectedFacility.displayName} (${label}). A representative will contact you to arrange key pickup. A €200 deposit is required at pickup.`;
      }

      dispatch('submit', { ...payload, id: res.id, status: res.status });
      setTimeout(resetForm, 4000);
    } catch (err: any) {
      submitStatus = 'error';
      if (err?.error === 'UNAVAILABLE' || err?.error === 'UNAVAILABLE_BLACKOUT') {
        submitMessage = 'Sorry, those dates are not available. Please choose different dates.';
      } else if (err?.error === 'TOO_LONG') {
        submitMessage = `Selected date range is too long. Max ${$selectedFacility?.maxDays ?? 1} day(s) for this facility.`;
      } else if (err?.error === 'INVALID_EMAIL') {
        fieldErrors = { ...fieldErrors, email: 'Please enter a valid email address' };
        submitMessage = 'Please check your information and try again.';
      } else if (err?.error === 'BAD_DATES') {
        fieldErrors = { ...fieldErrors, dates: 'Please check your dates' };
        submitMessage = 'Please check your information and try again.';
      } else {
        submitMessage = 'Something went wrong. Please try again or contact our representatives.';
        console.error('createReservation failed:', err);
      }
    } finally {
      isSubmitting = false;
    }
  }

  function resetForm() {
    formData = { roomNumber: '', name: '', email: '' };
    fieldErrors = {};
    submitStatus = null;
    submitMessage = '';
    // optionally clear selectedDates too
    // selectedDates.set({ start: null, end: null });
  }
</script>

<div class="booking-form">
  {#if !$selectedFacility}
    <div class="text-center py-8 text-vb19-muted">
      <svg class="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <p>Please select a facility to continue with booking</p>
    </div>
  {:else if !hasValidDates}
    <div class="text-center py-8 text-vb19-muted">
      <svg class="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
      </svg>
      <p>Please select your booking {isRangeFacility ? 'date range' : 'date'} to continue</p>
    </div>
  {:else}
    <!-- Booking Summary -->
    <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h4 class="font-semibold text-vb19-text mb-2">Booking Summary</h4>
      <div class="space-y-1 text-sm">
        <div class="flex justify-between">
          <span class="text-vb19-muted">Facility:</span>
          <span class="text-vb19-text font-medium">{$selectedFacility.displayName}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-vb19-muted">Dates:</span>
          <span class="text-vb19-text font-medium">{selectedDateLabel}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-vb19-muted">Status:</span>
          <span class="text-vb19-text font-medium">
            {$selectedFacility.requiresApproval ? 'Requires approval' : 'Auto-approved'}
          </span>
        </div>
        {#if $selectedFacility.depositEur}
          <div class="flex justify-between">
            <span class="text-vb19-muted">Deposit:</span>
            <span class="text-vb19-accent font-medium">€{$selectedFacility.depositEur}</span>
          </div>
        {/if}
      </div>
    </div>

    {#if $selectedFacility.termsNote}
      <div class="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <div class="flex items-start space-x-3">
          <svg class="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <h4 class="font-medium text-amber-800 mb-1">Important Notice</h4>
            <p class="text-sm text-amber-700">{$selectedFacility.termsNote}</p>
          </div>
        </div>
      </div>
    {/if}

    <!-- Form -->
    <form on:submit|preventDefault={handleSubmit} class="space-y-6">
      <div>
        <label for="roomNumber" class="form-label">Room Number <span class="text-red-500">*</span></label>
        <input
          id="roomNumber"
          type="text"
          class="form-input {fieldErrors.roomNumber ? 'border-red-300 focus:ring-red-500' : ''}"
          placeholder="e.g., 1510, 2313, WB215, PW3"
          bind:value={formData.roomNumber}
          on:input={(e) => handleInputChange('roomNumber', (e.target as HTMLInputElement).value)}
          disabled={isSubmitting}
          autocomplete="off"
          spellcheck="false"
          maxlength="10"
          pattern="[A-Za-z0-9 ]+"
          title="Use letters, numbers, and spaces only"
        />
        {#if fieldErrors.roomNumber}<p class="mt-1 text-sm text-red-600">{fieldErrors.roomNumber}</p>{/if}
      </div>

      <div>
        <label for="name" class="form-label">Full Name <span class="text-red-500">*</span></label>
        <input
          id="name"
          type="text"
          class="form-input {fieldErrors.name ? 'border-red-300 focus:ring-red-500' : ''}"
          placeholder="Your full name"
          bind:value={formData.name}
          on:input={(e) => handleInputChange('name', (e.target as HTMLInputElement).value)}
          autocomplete="name"
          spellcheck="false"
          maxlength="60"
          pattern="[A-Za-z' -]+"
          title="Use letters, spaces, hyphens (-), and apostrophes (') only"
          disabled={isSubmitting}
        />
        {#if fieldErrors.name}<p class="mt-1 text-sm text-red-600">{fieldErrors.name}</p>{/if}
      </div>

      <div>
        <label for="email" class="form-label">Email Address <span class="text-red-500">*</span></label>
        <input
          id="email"
          type="email"
          class="form-input {fieldErrors.email ? 'border-red-300 focus:ring-red-500' : ''}"
          placeholder="your.email@example.com"
          bind:value={formData.email}
          on:beforeinput={preventBadEmailChars}
          on:paste={handleEmailPaste}
          on:input={(e) => handleInputChange('email', (e.target as HTMLInputElement).value)}
          on:blur={() => (formData.email = normalizeEmailOnBlur(formData.email))}
          inputmode="email"
          autocomplete="email"
          spellcheck="false"
          maxlength="254"
          disabled={isSubmitting}
        />
        {#if fieldErrors.email}
          <p class="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
        {:else}
          <p class="mt-1 text-sm text-vb19-muted">We'll send booking confirmation and updates to this email</p>
        {/if}
      </div>

      {#if fieldErrors.dates}
        <div class="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-600">{fieldErrors.dates}</p>
        </div>
      {/if}

      <div class="pt-4">
        <button
          type="submit"
          class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          disabled={!isFormValid || isSubmitting}
        >
          {#if isSubmitting}
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Submitting...</span>
          {:else}
            <span>{$selectedFacility?.requiresApproval ? 'Submit Request' : 'Book Now'}</span>
          {/if}
        </button>
      </div>
    </form>

    {#if submitStatus}
      <div class="mt-6 p-4 rounded-lg {submitStatus === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}">
        <div class="flex items-start space-x-3">
          <div class="flex-shrink-0">
            {#if submitStatus === 'success'}
              <svg class="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {:else}
              <svg class="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
            {/if}
          </div>
          <div>
            <h4 class="font-medium {submitStatus === 'success' ? 'text-green-800' : 'text-red-800'} mb-1">
              {submitStatus === 'success' ? 'Booking Submitted!' : 'Booking Failed'}
            </h4>
            <p class="text-sm {submitStatus === 'success' ? 'text-green-700' : 'text-red-700'}">{submitMessage}</p>
            {#if submitStatus === 'success'}
              <div class="mt-3">
                <button type="button" class="text-sm text-green-700 hover:text-green-800 font-medium" on:click={resetForm}>
                  Make another booking
                </button>
              </div>
            {/if}
          </div>
        </div>
      </div>
    {/if}

    <div class="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
      <h4 class="font-medium text-vb19-text mb-2">Need Help?</h4>
      <p class="text-sm text-vb19-muted mb-2">
        If you have questions about booking or need assistance, contact our representatives:
      </p>
      <a href="mailto:base19.reps@outlook.com" class="text-sm text-vb19-primary hover:text-blue-700 font-medium">
        base19.reps@outlook.com
      </a>
    </div>
  {/if}
</div>
