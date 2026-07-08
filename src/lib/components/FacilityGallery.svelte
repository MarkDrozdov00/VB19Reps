<script lang="ts">
  import { onDestroy } from 'svelte';
  import { selectedFacility, type Facility } from '$lib/stores/facilities';
  import { base } from '$app/paths';
  import { fade } from 'svelte/transition';
  
  export let facility: Facility | null = null;

  let selectedImageIndex = 0;
  let showLightbox = false;
  let currentFacilityId: Facility['id'] | null | undefined = null;
  let scrollLocked = false;
  let previousBodyOverflow = '';

  $: displayedFacility = facility ?? $selectedFacility;
  $: galleryImages = displayedFacility?.images ?? [];
  $: currentImage = galleryImages[selectedImageIndex] ?? galleryImages[0];
  $: previousPreloadImage = galleryImages.length
    ? galleryImages[(selectedImageIndex - 1 + galleryImages.length) % galleryImages.length]
    : null;
  $: nextPreloadImage = galleryImages.length
    ? galleryImages[(selectedImageIndex + 1) % galleryImages.length]
    : null;
  $: if (displayedFacility?.id !== currentFacilityId) {
    currentFacilityId = displayedFacility?.id;
    selectedImageIndex = 0;
    showLightbox = false;
  }
  $: if (galleryImages.length && selectedImageIndex >= galleryImages.length) {
    selectedImageIndex = 0;
  }
  $: updateBodyScroll(showLightbox);

  // Prefix {base} for project-relative URLs so GH Pages works
  function asset(url?: string | null) {
    if (!url) return '';
    if (/^(https?:|data:|blob:)/i.test(url)) return url; // leave absolute/external as-is
    if (url.startsWith(base + '/')) return url;
    if (url.startsWith('/')) return `${base}${url}`;
    return `${base}/${url}`;
  }
  
  function openLightbox(index: number) {
    selectedImageIndex = index;
    showLightbox = true;
  }
  
  function closeLightbox() {
    showLightbox = false;
  }
  
  function nextImage() {
    if (galleryImages.length) {
      selectedImageIndex = (selectedImageIndex + 1) % galleryImages.length;
    }
  }
  
  function prevImage() {
    if (galleryImages.length) {
      selectedImageIndex = selectedImageIndex === 0 
        ? galleryImages.length - 1 
        : selectedImageIndex - 1;
    }
  }
  
  function handleKeydown(event: KeyboardEvent) {
    if (!showLightbox) return;
    
    if (event.key === 'Escape') {
      closeLightbox();
    } else if (event.key === 'ArrowRight') {
      nextImage();
    } else if (event.key === 'ArrowLeft') {
      prevImage();
    }
  }

  function handleImageError(event: Event) {
    const img = event.currentTarget as HTMLImageElement;
    img.src = `https://via.placeholder.com/600x400/E5E7EB/6B7280?text=${encodeURIComponent(displayedFacility?.displayName ?? 'Facility')}`;
  }

  function portal(node: HTMLElement) {
    document.body.appendChild(node);

    return {
      destroy() {
        node.remove();
      }
    };
  }

  function updateBodyScroll(locked: boolean) {
    if (typeof document === 'undefined') return;

    if (locked && !scrollLocked) {
      previousBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      scrollLocked = true;
    } else if (!locked && scrollLocked) {
      document.body.style.overflow = previousBodyOverflow;
      scrollLocked = false;
    }
  }

  onDestroy(() => {
    if (typeof document !== 'undefined' && scrollLocked) {
      document.body.style.overflow = previousBodyOverflow;
    }
  });
</script>

<svelte:window on:keydown={handleKeydown} />

{#if displayedFacility}
  <div class="facility-gallery">
    <!-- Main Gallery -->
    <div class="mb-6">
      {#if currentImage}
        <div class="relative group w-full overflow-hidden rounded-lg bg-gray-100" style="aspect-ratio: 16 / 9;">
          {#key selectedImageIndex}
          <img
            src={asset(currentImage.url)} 
            alt={currentImage.alt}
            class="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.015]"
            transition:fade={{ duration: 180 }}
            on:error={handleImageError}
          />
          {/key}
          
          <!-- Overlay -->
          <button
            type="button"
            class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center"
            aria-label={`Open ${displayedFacility.displayName} image ${selectedImageIndex + 1}`}
            on:click={() => openLightbox(selectedImageIndex)}
          >
            <span class="rounded-full bg-black/45 p-3 opacity-95 shadow-lg transition duration-300 group-hover:scale-[1.02] group-hover:bg-black/60">
              <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </span>
          </button>

          {#if galleryImages.length > 1}
            <button
              type="button"
              class="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-vb19-text shadow-lg ring-1 ring-black/10 transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-vb19-primary"
              aria-label="Previous image"
              on:click|stopPropagation={prevImage}
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              type="button"
              class="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-vb19-text shadow-lg ring-1 ring-black/10 transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-vb19-primary"
              aria-label="Next image"
              on:click|stopPropagation={nextImage}
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div class="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white">
              {selectedImageIndex + 1} / {galleryImages.length}
            </div>
          {/if}
        </div>

        {#if galleryImages.length > 1}
          <div class="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0" aria-hidden="true">
            {#if previousPreloadImage}
              <img src={asset(previousPreloadImage.url)} alt="" loading="eager" decoding="async" />
            {/if}
            {#if nextPreloadImage}
              <img src={asset(nextPreloadImage.url)} alt="" loading="eager" decoding="async" />
            {/if}
          </div>
        {/if}
      {/if}
    </div>
    
    <!-- Facility Info -->
    <div class="card">
      <h3 class="text-xl font-semibold text-vb19-text mb-3">{displayedFacility.displayName}</h3>
      <p class="text-vb19-muted mb-4">{displayedFacility.description}</p>
      
      <div class="flex flex-wrap gap-4 text-sm">
        <div class="flex items-center space-x-2">
          <svg class="w-4 h-4 text-vb19-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span class="text-vb19-text">Max {displayedFacility.maxDays} day{displayedFacility.maxDays > 1 ? 's' : ''}</span>
        </div>
        
        <div class="flex items-center space-x-2">
          <svg class="w-4 h-4 text-vb19-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-vb19-text">
            {displayedFacility.requiresApproval ? 'Requires approval' : 'Auto-approved'}
          </span>
        </div>
        
        {#if displayedFacility.depositEur}
          <div class="flex items-center space-x-2">
            <svg class="w-4 h-4 text-vb19-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            <span class="text-vb19-text">€{displayedFacility.depositEur} deposit required</span>
          </div>
        {/if}
      </div>
    </div>
  </div>
  
  <!-- Lightbox Modal -->
  {#if showLightbox && currentImage}
    <div
      use:portal
      class="fixed inset-0 z-[20000] flex h-screen w-screen items-center justify-center bg-black/75 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`${displayedFacility?.displayName ?? 'Facility'} image preview`}
    >
      <button
        type="button"
        class="absolute inset-0 h-full w-full"
        aria-label="Close image preview"
        on:click={closeLightbox}
      ></button>

      <div class="relative z-10 flex max-h-[85vh] max-w-[90vw] items-center justify-center">
        <!-- Close button -->
        <button
          type="button"
          class="absolute right-3 top-3 z-10 rounded-full bg-black/50 p-2 text-white transition-colors duration-200 hover:bg-black/70 hover:text-gray-200"
          aria-label="Close image preview"
          on:click|stopPropagation={closeLightbox}
        >
          <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <!-- Navigation buttons -->
        {#if galleryImages.length > 1}
          <button
            type="button"
            class="absolute left-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors duration-200 hover:bg-white/25"
            aria-label="Previous image"
            on:click|stopPropagation={prevImage}
          >
            <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            type="button"
            class="absolute right-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors duration-200 hover:bg-white/25"
            aria-label="Next image"
            on:click|stopPropagation={nextImage}
          >
            <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        {/if}
        
        <!-- Image -->
        <img
          src={asset(currentImage.url)}
          alt={currentImage.alt}
          class="max-h-[85vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
        />
        
        <!-- Image counter -->
        {#if galleryImages.length > 1}
          <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded-full">
            {selectedImageIndex + 1} / {galleryImages.length}
          </div>
        {/if}
      </div>
    </div>
  {/if}
{/if}
