<script lang="ts">
  import { base } from '$app/paths';
  import { onMount } from 'svelte';
  import { getEvents, type EventItem } from '$lib/api';
  import { events as staticEvents } from '$lib/data/events';

  type DisplayEvent = {
    id: string;
    poster: string;
    title: string;
    shortDescription: string;
    eventDate: string | null;
    date?: string;
    location?: string;
  };

  let databaseEvents: EventItem[] = [];
  let eventsLoading = true;
  let eventsError = '';
  let flippedEventIds = new Set<string>();

  const todayIso = toISO(new Date());
  const archiveEvents: DisplayEvent[] = [...staticEvents].sort((a, b) => b.id - a.id).map((event) => ({
    id: `archive-${event.id}`,
    poster: event.poster,
    title: event.title,
    shortDescription: event.shortDescription,
    eventDate: null,
    date: event.date,
    location: event.location
  }));

  $: databaseDisplayEvents = databaseEvents.map((event) => ({
    id: event.id,
    poster: event.posterUrl,
    title: event.title,
    shortDescription: event.description,
    eventDate: event.eventDate,
    date: formatDisplayDate(event.eventDate),
    location: 'ViennaBase19'
  }));
  $: databasePosterKeys = new Set(databaseDisplayEvents.map((event) => posterKey(event.poster)));
  $: fallbackArchiveEvents = archiveEvents.filter((event) => !databasePosterKeys.has(posterKey(event.poster)));

  $: upcomingEvents = databaseDisplayEvents
    .filter((event) => event.eventDate !== null && event.eventDate >= todayIso)
    .sort((a, b) => (a.eventDate ?? '').localeCompare(b.eventDate ?? ''));

  $: pastEvents = [
    ...databaseDisplayEvents.filter((event) => event.eventDate !== null && event.eventDate < todayIso),
    ...fallbackArchiveEvents
  ].sort((a, b) => {
    if (!a.eventDate && !b.eventDate) return 0;
    if (!a.eventDate) return 1;
    if (!b.eventDate) return -1;
    return b.eventDate.localeCompare(a.eventDate);
  });

  function asset(path: string) {
    if (/^(https?:|data:|blob:)/i.test(path)) return path;
    if (path.startsWith(base + '/')) return path;
    if (path.startsWith('/')) return `${base}${path}`;
    return `${base}/${path}`;
  }

  function posterKey(path: string) {
    return path.replace(/\.(jpe?g|png|webp)$/i, '');
  }

  function eventKey(event: DisplayEvent) {
    return event.id || event.poster;
  }

  function toISO(date: Date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function formatDisplayDate(iso: string) {
    return new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB');
  }

  function toggleFlip(id: string) {
    flippedEventIds = new Set(flippedEventIds);
    if (flippedEventIds.has(id)) flippedEventIds.delete(id);
    else flippedEventIds.add(id);
  }

  function handleCardKeydown(event: KeyboardEvent, id: string) {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    toggleFlip(id);
  }

  onMount(async () => {
    eventsLoading = true;
    eventsError = '';
    try {
      databaseEvents = await getEvents();
    } catch {
      eventsError = 'Could not load the latest events. Showing the poster archive for now.';
    } finally {
      eventsLoading = false;
    }
  });

  function revealOnScroll(node: HTMLElement) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      node.classList.add('is-visible');
      return {};
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add('is-visible');
          observer.unobserve(node);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return {
      destroy() {
        observer.disconnect();
      }
    };
  }
</script>

<svelte:head>
  <title>Events - ViennaBase19 Reps</title>
  <meta
    name="description"
    content="Explore upcoming and past ViennaBase19 events from the Reps community."
  />
</svelte:head>

<section class="px-4 py-12 md:py-16">
  <div class="max-w-7xl mx-auto">
    <div class="text-center mb-12 animate-slide-up">
      <p class="text-sm font-semibold uppercase tracking-wider text-vb19-primary mb-3">ViennaBase19 Reps</p>
      <h1 class="text-4xl md:text-5xl font-bold gradient-text mb-4">Events</h1>
      <p class="text-lg text-vb19-muted max-w-2xl mx-auto">
        Discover what is coming up next and flip through memories from our community events.
      </p>
    </div>

    <section class="mb-16">
      <div class="flex items-end justify-between gap-4 mb-6">
        <div>
          <h2 class="text-3xl font-bold text-vb19-text">Upcoming Events</h2>
          <p class="text-sm text-vb19-muted mt-1">New events will appear here once they are announced.</p>
        </div>
      </div>

      {#if eventsError}
        <p class="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {eventsError}
        </p>
      {/if}

      {#if eventsLoading}
        <div class="card text-center max-w-2xl mx-auto py-12" use:revealOnScroll>
          <h3 class="text-2xl font-bold text-vb19-text mb-2">Loading events...</h3>
          <p class="text-vb19-muted">Checking what is coming up next.</p>
        </div>
      {:else if upcomingEvents.length === 0}
        <div class="card text-center max-w-2xl mx-auto py-12" use:revealOnScroll>
          <div class="text-5xl mb-4" aria-hidden="true">📅</div>
          <h3 class="text-2xl font-bold text-vb19-text mb-2">No upcoming events</h3>
          <p class="text-vb19-muted">Check back soon to see what's happening at ViennaBase19.</p>
        </div>
      {:else}
        <div class="events-grid">
          {#each upcomingEvents as event (eventKey(event))}
            <button
              type="button"
              class="event-card {flippedEventIds.has(eventKey(event)) ? 'is-flipped' : ''}"
              aria-label={`Flip details for ${event.title}`}
              on:click={() => toggleFlip(eventKey(event))}
              on:keydown={(keyboardEvent) => handleCardKeydown(keyboardEvent, eventKey(event))}
            >
              <span class="event-card-inner">
                <span class="event-card-face event-card-front">
                  <img src={asset(event.poster)} alt={`${event.title} poster`} loading="lazy" />
                </span>
                <span class="event-card-face event-card-back">
                  <span class="text-xl font-bold text-vb19-text mb-2">{event.title}</span>
                  {#if event.date}
                    <span class="text-sm font-semibold text-vb19-primary mb-3">{event.date}</span>
                  {/if}
                  <span class="text-sm text-vb19-muted leading-relaxed">{event.shortDescription}</span>
                  {#if event.location}
                    <span class="mt-4 text-xs font-semibold uppercase tracking-wider text-purple-500">{event.location}</span>
                  {/if}
                </span>
              </span>
            </button>
          {/each}
        </div>
      {/if}
    </section>

    <section>
      <div class="mb-6">
        <h2 class="text-3xl font-bold text-vb19-text">Past Events</h2>
        <p class="text-sm text-vb19-muted mt-1">Past events and poster archive, newest first.</p>
      </div>

      <div class="events-grid">
        {#each pastEvents as event (eventKey(event))}
          <button
            type="button"
            class="event-card {flippedEventIds.has(eventKey(event)) ? 'is-flipped' : ''}"
            aria-label={`Flip details for ${event.title}`}
            on:click={() => toggleFlip(eventKey(event))}
            on:keydown={(keyboardEvent) => handleCardKeydown(keyboardEvent, eventKey(event))}
          >
            <span class="event-card-inner">
              <span class="event-card-face event-card-front">
                <img src={asset(event.poster)} alt={`${event.title} poster`} loading="lazy" />
              </span>
              <span class="event-card-face event-card-back">
                <span class="text-xl font-bold text-vb19-text mb-2">{event.title}</span>
                {#if event.date}
                  <span class="text-sm font-semibold text-vb19-primary mb-3">{event.date}</span>
                {/if}
                <span class="text-sm text-vb19-muted leading-relaxed">{event.shortDescription}</span>
                {#if event.location}
                  <span class="mt-4 text-xs font-semibold uppercase tracking-wider text-purple-500">{event.location}</span>
                {/if}
              </span>
            </span>
          </button>
        {/each}
      </div>
    </section>
  </div>
</section>

<style>
  .events-grid {
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap: 1.5rem;
  }

  @media (min-width: 768px) {
    .events-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (min-width: 1280px) {
    .events-grid {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }

  .event-card {
    aspect-ratio: 3 / 4;
    appearance: none;
    border: 0;
    background: transparent;
    cursor: pointer;
    padding: 0;
    perspective: 1200px;
    text-align: left;
    opacity: 1;
    transform: none;
  }

  .event-card-inner {
    display: block;
    height: 100%;
    position: relative;
    transform-style: preserve-3d;
    transition:
      transform 600ms ease,
      scale 200ms ease;
  }

  .event-card:hover .event-card-inner,
  .event-card:focus-visible .event-card-inner,
  .event-card.is-flipped .event-card-inner {
    transform: rotateY(180deg);
  }

  .event-card:hover .event-card-inner,
  .event-card:focus-visible .event-card-inner {
    scale: 1.02;
  }

  .event-card:focus-visible {
    outline: 3px solid rgb(147 51 234 / 0.45);
    outline-offset: 6px;
    border-radius: 0.75rem;
  }

  .event-card-face {
    align-items: center;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    background: rgb(255 255 255 / 0.8);
    border: 1px solid rgb(255 255 255 / 0.45);
    border-radius: 0.75rem;
    box-shadow: 0 16px 35px rgb(88 28 135 / 0.13);
    display: flex;
    flex-direction: column;
    inset: 0;
    justify-content: center;
    overflow: hidden;
    position: absolute;
  }

  .event-card-front img {
    height: 100%;
    object-fit: cover;
    width: 100%;
  }

  .event-card-back {
    background:
      linear-gradient(135deg, rgb(250 245 255 / 0.98), rgb(255 255 255 / 0.96)),
      white;
    padding: 1.5rem;
    text-align: center;
    transform: rotateY(180deg);
  }

  @media (prefers-reduced-motion: reduce) {
    .event-card,
    .event-card-inner {
      opacity: 1;
      transform: none;
      transition: none;
    }

    .event-card:hover .event-card-inner,
    .event-card:focus-visible .event-card-inner,
    .event-card.is-flipped .event-card-inner {
      transform: none;
      scale: 1;
    }

    .event-card.is-flipped .event-card-front,
    .event-card:hover .event-card-front,
    .event-card:focus-visible .event-card-front {
      display: none;
    }

    .event-card.is-flipped .event-card-back,
    .event-card:hover .event-card-back,
    .event-card:focus-visible .event-card-back {
      transform: none;
    }
  }
</style>
