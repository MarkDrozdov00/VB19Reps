<script>
  import { selectedFacility } from '$lib/stores/facilities.js';
  import { base } from '$app/paths';
  
  let selectedImageIndex = 0;
  let showLightbox = false;

  // Prefix {base} for project-relative URLs so GH Pages works
  function asset(url) {                               // NEW
    if (!url) return '';
    if (/^(https?:|data:|blob:)/i.test(url)) return url; // leave absolute/external as-is
    if (url.startsWith(base + '/')) return url;
    if (url.startsWith('/')) return `${base}${url}`;
    return `${base}/${url}`;
  }
  
  function openLightbox(index) {
    selectedImageIndex = index;
    showLightbox = true;
  }
  
  function closeLightbox() {
    showLightbox = false;
  }
  
  function nextImage() {
    if ($selectedFacility?.images) {
      selectedImageIndex = (selectedImageIndex + 1) % $selectedFacility.images.length;
    }
  }
  
  function prevImage() {
    if ($selectedFacility?.images) {
      selectedImageIndex = selectedImageIndex === 0 
        ? $selectedFacility.images.length - 1 
        : selectedImageIndex - 1;
    }
  }
  
  function handleKeydown(event) {
    if (!showLightbox) return;
    
    if (event.key === 'Escape') {
      closeLightbox();
    } else if (event.key === 'ArrowRight') {
      nextImage();
    } else if (event.key === 'ArrowLeft') {
      prevImage();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if $selectedFacility}
  <div class="facility-gallery">
    <!-- Main Gallery -->
    <div class="mb-6">
      {#each $selectedFacility.images as image, index}
        <div class="relative group cursor-pointer overflow-hidden rounded-lg bg-gray-100">
          <img
            src={asset(image.url)} 
            alt={image.alt}
            class="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
            on:click={() => openLightbox(index)}
            on:error={(e) => {
              // Fallback for missing images
              e.target.src = `https://via.placeholder.com/600x400/E5E7EB/6B7280?text=${encodeURIComponent($selectedFacility.displayName)}`;
            }}
          />
          
          <!-- Overlay -->
          <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </div>
          </div>
        </div>
      {/each}
    </div>
    
    <!-- Facility Info -->
    <div class="card">
      <h3 class="text-xl font-semibold text-vb19-text mb-3">{$selectedFacility.displayName}</h3>
      <p class="text-vb19-muted mb-4">{$selectedFacility.description}</p>
      
      <div class="flex flex-wrap gap-4 text-sm">
        <div class="flex items-center space-x-2">
          <svg class="w-4 h-4 text-vb19-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span class="text-vb19-text">Max {$selectedFacility.maxDays} day{$selectedFacility.maxDays > 1 ? 's' : ''}</span>
        </div>
        
        <div class="flex items-center space-x-2">
          <svg class="w-4 h-4 text-vb19-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-vb19-text">
            {$selectedFacility.requiresApproval ? 'Requires approval' : 'Auto-approved'}
          </span>
        </div>
        
        {#if $selectedFacility.depositEur}
          <div class="flex items-center space-x-2">
            <svg class="w-4 h-4 text-vb19-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            <span class="text-vb19-text">€{$selectedFacility.depositEur} deposit required</span>
          </div>
        {/if}
      </div>
      
      {#if $selectedFacility.termsNote}
        <div class="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div class="flex items-start space-x-2">
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
    </div>
  </div>
  
  <!-- Lightbox Modal -->
  {#if showLightbox && $selectedFacility.images}
    <div 
      class="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
      on:click={closeLightbox}
    >
      <div class="relative max-w-4xl max-h-full">
        <!-- Close button -->
        <button
          class="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors duration-200"
          on:click={closeLightbox}
        >
          <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <!-- Navigation buttons -->
        {#if $selectedFacility.images.length > 1}
          <button
            class="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors duration-200"
            on:click|stopPropagation={prevImage}
          >
            <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            class="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors duration-200"
            on:click|stopPropagation={nextImage}
          >
            <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        {/if}
        
        <!-- Image -->
        <img
          src={asset($selectedFacility.images[selectedImageIndex].url)}
          alt={$selectedFacility.images[selectedImageIndex].alt}
          class="max-w-full max-h-full object-contain"
          on:click|stopPropagation
        />
        
        <!-- Image counter -->
        {#if $selectedFacility.images.length > 1}
          <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded-full">
            {selectedImageIndex + 1} / {$selectedFacility.images.length}
          </div>
        {/if}
      </div>
    </div>
  {/if}
{/if}

