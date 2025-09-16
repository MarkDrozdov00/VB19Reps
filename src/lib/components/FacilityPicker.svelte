<script>
  import { facilities, selectedFacility } from '$lib/stores/facilities';
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();
  
  let isOpen = false;
  
  function selectFacility(facility) {
    selectedFacility.set(facility);
    isOpen = false;
    dispatch('facilityChanged', facility);
  }
  
  function toggleDropdown() {
    isOpen = !isOpen;
  }
  
  // Close dropdown when clicking outside
  function handleClickOutside(event) {
    if (!event.target.closest('.facility-picker')) {
      isOpen = false;
    }
  }
</script>

<svelte:window on:click={handleClickOutside} />

<div class="facility-picker relative z-10" style="overflow: none;">
  <label class="form-label">Select Facility</label>
  
  <button
    type="button"
    class="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-vb19-primary focus:border-transparent transition-colors duration-200 flex items-center justify-between"
    on:click={toggleDropdown}
    aria-haspopup="listbox"
    aria-expanded={isOpen}
  >
    <span class="block truncate">
      {($selectedFacility && $selectedFacility.id) ? $selectedFacility.displayName : 'Select...'}
    </span>
    <svg 
      class="h-5 w-5 text-gray-400 transition-transform duration-200 {isOpen ? 'rotate-180' : ''}" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
    </svg>
  </button>
  
  {#if isOpen}
    <div class="relative mt-1 w-full bg-white shadow-lg max-h-60 rounded-lg py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none" >
      {#each $facilities as facility (facility.id)}
        <button
          type="button"
          class="w-full text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors duration-150 {$selectedFacility?.id === facility.id ? 'bg-blue-50 text-vb19-primary' : 'text-gray-900'}"
          on:click={() => selectFacility(facility)}
          role="option"
          aria-selected={$selectedFacility?.id === facility.id}
        >
          <div class="flex flex-col">
            <span class="font-medium">{facility.displayName}</span>
            <span class="text-sm text-gray-500 mt-1">
              Max {facility.maxDays} day{facility.maxDays > 1 ? 's' : ''} • 
              {facility.requiresApproval ? 'Requires approval' : 'Auto-approved'}
            </span>
          </div>
        </button>
      {/each}
    </div>
  {/if}
</div>

