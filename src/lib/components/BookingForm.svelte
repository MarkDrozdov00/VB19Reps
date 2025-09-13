<script>
  import { selectedFacility, selectedDates } from '$lib/stores/facilities.js';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  const ROOM_REGEX = /^[A-Za-z0-9 ]+$/;         // letters, numbers, spaces
  const ROOM_MAXLEN = 10;                        // tweak if you want
  const sanitizeRoom = (s) => s.replace(/[^A-Za-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
  // Allow letters, spaces, hyphens, apostrophes
  // Allowed set: letters, space, hyphen, apostrophe
  const NAME_CHAR  = /^[A-Za-z' -]$/;
  const NAME_REGEX = /^[A-Za-z' -]+$/;
  const NAME_MAXLEN = 60;

  // Lenient while typing (keystrokes/paste)
  const sanitizeNameInput = (s) => (s ?? '').replace(/[^A-Za-z' -]/g, '');

  // Strict on blur/submit
  const normalizeName = (s) =>
    (s ?? '')
      .replace(/[^A-Za-z' -]/g, '')
      .replace(/\s+/g, ' ')
      .replace(/-{2,}/g, '-')   // collapse multiple hyphens
      .replace(/'{2,}/g, "'")   // collapse multiple apostrophes
      .replace(/^[ '-]+|[ '-]+$/g, ''); // trim leading/trailing space/'/-

      const EMAIL_MAXLEN = 254;

  // remove junk *while typing/pasting* (don’t remove '+')
  const sanitizeEmailInput = (s) =>
  (s ?? '')
    .replace(/[\s\r\n\t<>,:;#$%^*&!()=+{}|"?/~]/g, '')  // <-- added , ;
    .trim();

  // normalize *on blur/submit*
  const normalizeEmailOnBlur = (s) => {
    s = sanitizeEmailInput(s);
    const at = s.lastIndexOf('@');
    if (at === -1) return s;
    const local = s.slice(0, at);
    const domain = s.slice(at + 1).toLowerCase();
    return `${local}@${domain}`;
  };

  // broad, lenient validator (still allows IDNs & plus addressing)
  function isLikelyEmail(s) {
    if (!s) return false;
    if (s.length > EMAIL_MAXLEN) return false;
    if (/[ \t\r\n]/.test(s)) return false;
    const parts = s.split('@');
    if (parts.length !== 2) return false;
    const [local, domain] = parts;
    if (!local || !domain) return false;
    if (!domain.includes('.')) return false;             // need at least one dot
    const labels = domain.split('.');
    // no empty labels, no leading/trailing '-', each <= 63 chars
    if (labels.some(l => !l || l.startsWith('-') || l.endsWith('-') || l.length > 63)) return false;
    return true;
  }

  // block bad keystrokes (space, CR/LF, < > , ;)
  function preventBadEmailChars(e) {
    if (e.isComposing) return;
    if (e.inputType === 'insertText' && /[\s\r\n<>,;]/.test(e.data)) {
      e.preventDefault();
    }
  }

  function handleEmailPaste(e) {
    const text = e.clipboardData?.getData('text') ?? '';
    const clean = sanitizeEmailInput(text);
    if (text !== clean) {
      e.preventDefault();
      const el = e.target;
      const { selectionStart, selectionEnd, value } = el;
      const next = value.slice(0, selectionStart) + clean + value.slice(selectionEnd);
      el.value = next;
      handleInputChange('email', next);
      const pos = (selectionStart ?? 0) + clean.length;
      requestAnimationFrame(() => el.setSelectionRange(pos, pos));
    }
  }



  // ---- helpers ----
  function atMidnight(d) { const x = new Date(d); x.setHours(0,0,0,0); return x; }
  function toISODateLocal(d) {
    if (!d) return null;
    const x = atMidnight(d);
    const y = x.getFullYear();
    const m = String(x.getMonth()+1).padStart(2,'0');
    const day = String(x.getDate()).padStart(2,'0');
    return `${y}-${m}-${day}`;
  }
  function fmtEU(d) { return d?.toLocaleDateString('en-GB'); }

  // Form data/state
  let formData = { roomNumber: '', name: '', email: '' };
  let isSubmitting = false;
  let submitStatus = null; // 'success' | 'error' | null
  let submitMessage = '';
  let fieldErrors = {};

  // Derived
  $: start = $selectedDates.start;
  $: end   = $selectedDates.end;

  $: isRangeFacility = $selectedFacility?.maxDays > 1;
  $: hasValidDates = !!start;

  $: selectedDateLabel = !start
    ? ''
    : (isRangeFacility && end && atMidnight(start).getTime() !== atMidnight(end).getTime())
      ? `${fmtEU(start)} – ${fmtEU(end)}`
      : fmtEU(start);

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Reactive “can submit”
  $: isFormValid =
    formData.roomNumber.trim() &&
    formData.name.trim() &&
    formData.email.trim() &&
    isValidEmail(formData.email) &&
    hasValidDates;

  function validateForm() {
    const errors = {};

    if (!formData.roomNumber.trim()) errors.roomNumber = 'Room number is required';
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Room number
    const rn = sanitizeRoom(formData.roomNumber || '');
    if (!rn) {
      errors.roomNumber = 'Room number is required';
    } else if (!ROOM_REGEX.test(rn)) {
      errors.roomNumber = 'Use letters, numbers, and spaces only';
    } else if (rn.length > ROOM_MAXLEN) {
      errors.roomNumber = `Max ${ROOM_MAXLEN} characters`;
    } else {
      formData.roomNumber = rn; // keep normalized value
    }

    // --- Full name ---
    const nm = normalizeName(formData.name);
    if (!nm) {
      errors.name = 'Name is required';
    } else if (!NAME_REGEX.test(nm)) {
      errors.name = "Use letters, spaces, hyphens (-), and apostrophes (') only";
    } else if (nm.length > NAME_MAXLEN) {
      errors.name = `Max ${NAME_MAXLEN} characters`;
    } else {
      formData.name = nm; // keep normalized
    }

    // Email
    const em = normalizeEmailOnBlur(formData.email);
    if (!em) {
      errors.email = 'Email is required';
    } else if (!isLikelyEmail(em)) {
      errors.email = 'Please enter a valid email address';
    } else {
      formData.email = em; // keep normalized email (domain lowercased)
    }

    if (!start) {
      errors.dates = 'Please select your booking dates';
    }

    fieldErrors = errors;
    return Object.keys(errors).length === 0;
  }

  function handleInputChange(field, value) {
  if (field === 'roomNumber') {
    value = sanitizeRoom(value); // live sanitize
  }
  if (field === 'name') {
    value = sanitizeNameInput(value); // lenient while typing, removes , . ;
  }
  if (field === 'email') {
    value = sanitizeEmailInput(value); // lenient while typing, removes , . ;
  }

  formData[field] = value;

  // Clear field error when user starts typing
  if (fieldErrors[field]) {
    const { [field]: _, ...rest } = fieldErrors;
    fieldErrors = rest;
  }
}


  async function handleSubmit() {
    if (!validateForm()) return;

    isSubmitting = true;
    submitStatus = null;
    submitMessage = '';

    const payload = {
      facilityId: $selectedFacility?.id,
      facilityName: $selectedFacility?.displayName,
      requiresApproval: !!$selectedFacility?.requiresApproval,
      startDate: toISODateLocal(start),
      endDate: isRangeFacility ? toISODateLocal(end ?? start) : toISODateLocal(start),
      roomNumber: formData.roomNumber.trim(),
      name: formData.name.trim(),
      email: formData.email.trim()
    };

    try {
      // Simulate API call
      await simulateBookingSubmission();

      submitStatus = 'success';
      if ($selectedFacility?.requiresApproval) {
        submitMessage = `Thanks! We've received your request for the ${$selectedFacility.displayName} (${selectedDateLabel}). A representative will contact you to arrange key pickup. A €200 deposit is required at pickup.`;
      } else {
        submitMessage = `Success! Your ${$selectedFacility.displayName} booking for ${selectedDateLabel} is confirmed. We've emailed the details to ${formData.email}.`;
      }

      // You can also emit upward if a parent wants to handle it:
      dispatch('submit', payload);

      // Reset after a short delay
      setTimeout(resetForm, 4000);
    } catch (error) {
      submitStatus = 'error';
      if (error.code === 'UNAVAILABLE') {
        submitMessage = 'Sorry, those dates are no longer available. Please choose different dates.';
      } else if (error.code === 'INVALID_INPUT') {
        submitMessage = 'Please check your information and try again.';
        fieldErrors = error.fieldErrors || {};
      } else {
        submitMessage = 'Something went wrong. Please try again or contact our representatives.';
      }
    } finally {
      isSubmitting = false;
    }
  }

  async function simulateBookingSubmission() {
    await new Promise(r => setTimeout(r, 1200));
    const random = Math.random();
    if (random < 0.08) throw { code: 'UNAVAILABLE' };
    if (random < 0.12) throw { code: 'INVALID_INPUT', fieldErrors: { email: 'This email is already in use for this date' } };
    return { id: Math.floor(Math.random() * 1000) };
  }

  function resetForm() {
    formData = { roomNumber: '', name: '', email: '' };
    fieldErrors = {};
    submitStatus = null;
    submitMessage = '';
    // keep selectedDates so user sees what they booked; or clear if you prefer
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
          on:input={(e) => handleInputChange('roomNumber', e.target.value)}
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
          on:input={(e) => handleInputChange('name', e.target.value)}
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
          on:input={(e) => handleInputChange('email', e.target.value)}
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
