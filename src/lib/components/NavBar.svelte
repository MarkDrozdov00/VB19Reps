<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { base } from '$app/paths';

  let mobileOpen = false;
  let isScrolled = false;

  // Build hrefs that respect the base path
  const href = (path = '/') => `${base}${path === '/' ? '/' : path}`;

  function normalizePath(path = '/') {
    let normalized = path || '/';

    if (base && normalized.startsWith(base)) {
      normalized = normalized.slice(base.length) || '/';
    }

    return normalized.replace(/\/+$/, '') || '/';
  }

  // Current route without base/trailing slash noise.
  $: currentPath = normalizePath($page.url.pathname);

  // Active helpers
  const isActive = (path = '/') => {
    const target = normalizePath(path);

    if (target === '/') {
      return currentPath === '/';
    }

    return currentPath === target || currentPath.startsWith(`${target}/`);
  };

  const desktopLinkClass = (active) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
      active ? 'text-vb19-primary bg-blue-50' : 'text-vb19-muted hover:text-vb19-text hover:bg-gray-50'
    }`;

  const mobileLinkClass = (active) =>
    `block px-3 py-2 rounded-md text-base font-medium ${
      active ? 'text-vb19-primary bg-blue-50' : 'text-vb19-muted hover:text-vb19-text hover:bg-white'
    }`;

  function toggleMobile() {
    mobileOpen = !mobileOpen;
  }
  function closeMobile() {
    mobileOpen = false;
  }

  onMount(() => {
    const updateScrolled = () => {
      isScrolled = window.scrollY > 4;
    };

    updateScrolled();
    window.addEventListener('scroll', updateScrolled, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateScrolled);
    };
  });
</script>

<nav
  class={`sticky top-0 z-[10000] border-b backdrop-blur-md transition-[background-color,box-shadow,border-color,backdrop-filter] duration-300 ease-out supports-[backdrop-filter]:bg-white/85 ${
    isScrolled ? 'bg-white/90 border-gray-200 shadow-md' : 'bg-white/95 border-gray-100 shadow-sm'
  }`}
>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center h-16">
      <!-- Logo/Brand -->
      <div class="flex items-center">
        <a href={href('/')} class="flex items-center space-x-2" on:click={closeMobile}>
          <div class="w-8 h-8 bg-vb19-primary rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-sm">VB</span>
          </div>
          <span class="text-xl font-semibold text-vb19-text">ViennaBase19 Reps</span>
        </a>
      </div>

      <!-- Desktop links -->
      <div class="hidden md:block">
        <div class="ml-10 flex items-baseline space-x-8">
          <a
            href={href('/')}
            class={desktopLinkClass(isActive('/'))}
            aria-current={isActive('/') ? 'page' : undefined}
          >
            Home
          </a>

          <a
            href={href('/events')}
            class={desktopLinkClass(isActive('/events'))}
            aria-current={isActive('/events') ? 'page' : undefined}
          >
            Events
          </a>

          <a
            href={href('/admin')}
            class={desktopLinkClass(isActive('/admin'))}
            aria-current={isActive('/admin') ? 'page' : undefined}
          >
            Admin
          </a>

          <!--
          <a
            href={href('/announcements')}
            class={desktopLinkClass(isActive('/announcements'))}
            aria-current={isActive('/announcements') ? 'page' : undefined}
          >
            Announcements
          </a>
          <a
            href={href('/about')}
            class={desktopLinkClass(isActive('/about'))}
            aria-current={isActive('/about') ? 'page' : undefined}
          >
            About Us
          </a>
          -->
        </div>
      </div>

      <!-- Mobile menu button -->
      <div class="md:hidden">
        <button
          type="button"
          class="inline-flex items-center justify-center p-2 rounded-md text-vb19-muted hover:text-vb19-text hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-vb19-primary"
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          on:click={toggleMobile}
        >
          <span class="sr-only">Open main menu</span>
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d={mobileOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
          </svg>
        </button>
      </div>
    </div>
  </div>

  <!-- Mobile menu -->
  {#if mobileOpen}
    <div id="mobile-menu" class="md:hidden">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50">
        <a
          href={href('/')}
          class={mobileLinkClass(isActive('/'))}
          aria-current={isActive('/') ? 'page' : undefined}
          on:click={closeMobile}
        >
          Home
        </a>

        <a
          href={href('/events')}
          class={mobileLinkClass(isActive('/events'))}
          aria-current={isActive('/events') ? 'page' : undefined}
          on:click={closeMobile}
        >
          Events
        </a>

        <a
          href={href('/admin')}
          class={mobileLinkClass(isActive('/admin'))}
          aria-current={isActive('/admin') ? 'page' : undefined}
          on:click={closeMobile}
        >
          Admin
        </a>

        <!--
        <a
          href={href('/announcements')}
          class={mobileLinkClass(isActive('/announcements'))}
          aria-current={isActive('/announcements') ? 'page' : undefined}
          on:click={closeMobile}
        >
          Announcements
        </a>
        <a
          href={href('/about')}
          class={mobileLinkClass(isActive('/about'))}
          aria-current={isActive('/about') ? 'page' : undefined}
          on:click={closeMobile}
        >
          About Us
        </a>
        -->
      </div>
    </div>
  {/if}
</nav>
