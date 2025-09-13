<script>
  import { createEventDispatcher, onMount } from 'svelte';
  
  export let type = 'info'; // 'success', 'error', 'warning', 'info'
  export let message = '';
  export let duration = 5000; // Auto-dismiss after 5 seconds
  export let dismissible = true;
  
  const dispatch = createEventDispatcher();
  
  let visible = true;
  let timeoutId;
  
  onMount(() => {
    if (duration > 0) {
      timeoutId = setTimeout(() => {
        dismiss();
      }, duration);
    }
    
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  });
  
  function dismiss() {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    visible = false;
    dispatch('close');
  }
  
  function getTypeStyles(type) {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-amber-50 border-amber-200 text-amber-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  }
  
  function getTypeIcon(type) {
    switch (type) {
      case 'success':
        return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'error':
        return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z';
      case 'warning':
        return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z';
      default:
        return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
    }
  }
</script>

{#if visible}
  <div 
    class="fixed top-4 right-4 z-50 max-w-sm w-full transform transition-all duration-300 ease-in-out"
    role="alert"
  >
    <div class="p-4 border rounded-lg shadow-lg {getTypeStyles(type)}">
      <div class="flex items-start space-x-3">
        <!-- Icon -->
        <div class="flex-shrink-0">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={getTypeIcon(type)} />
          </svg>
        </div>
        
        <!-- Message -->
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium">{message}</p>
        </div>
        
        <!-- Dismiss Button -->
        {#if dismissible}
          <button
            type="button"
            class="flex-shrink-0 ml-2 opacity-70 hover:opacity-100 transition-opacity duration-200"
            on:click={dismiss}
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        {/if}
      </div>
    </div>
  </div>
{/if}

