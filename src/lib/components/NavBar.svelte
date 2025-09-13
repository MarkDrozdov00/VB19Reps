<script>
  import { page } from '$app/stores';
  
  $: currentPath = $page.url.pathname;
</script>

<nav class="bg-white shadow-sm border-b border-gray-100">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center h-16">
      <!-- Logo/Brand -->
      <div class="flex items-center">
        <a href="/" class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-vb19-primary rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-sm">VB</span>
          </div>
          <span class="text-xl font-semibold text-vb19-text">ViennaBase19 Reps</span>
        </a>
      </div>
      
      <!-- Navigation Links -->
      <div class="hidden md:block">
        <div class="ml-10 flex items-baseline space-x-8">
          <a 
            href="/" 
            class="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 {currentPath === '/' ? 'text-vb19-primary bg-blue-50' : 'text-vb19-muted hover:text-vb19-text hover:bg-gray-50'}"
          >
            Home
          </a>
          <!-- <a 
            href="/announcements" 
            class="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 {currentPath.startsWith('/announcements') ? 'text-vb19-primary bg-blue-50' : 'text-vb19-muted hover:text-vb19-text hover:bg-gray-50'}"
          >
            Announcements
          </a>
          <a 
            href="/about" 
            class="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 {currentPath === '/about' ? 'text-vb19-primary bg-blue-50' : 'text-vb19-muted hover:text-vb19-text hover:bg-gray-50'}"
          >
            About Us
          </a> -->
        </div>
      </div>
      
      <!-- Mobile menu button -->
      <div class="md:hidden">
        <button 
          type="button" 
          class="inline-flex items-center justify-center p-2 rounded-md text-vb19-muted hover:text-vb19-text hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-vb19-primary"
          aria-expanded="false"
        >
          <span class="sr-only">Open main menu</span>
          <!-- Menu icon -->
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>
  </div>
  
  <!-- Mobile menu -->
  <div class="md:hidden">
    <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50">
      <a 
        href="/" 
        class="block px-3 py-2 rounded-md text-base font-medium {currentPath === '/' ? 'text-vb19-primary bg-blue-50' : 'text-vb19-muted hover:text-vb19-text hover:bg-white'}"
      >
        Home
      </a>
      <!-- <a 
        href="/announcements" 
        class="block px-3 py-2 rounded-md text-base font-medium {currentPath.startsWith('/announcements') ? 'text-vb19-primary bg-blue-50' : 'text-vb19-muted hover:text-vb19-text hover:bg-white'}"
      >
        Announcements
      </a>
      <a 
        href="/about" 
        class="block px-3 py-2 rounded-md text-base font-medium {currentPath === '/about' ? 'text-vb19-primary bg-blue-50' : 'text-vb19-muted hover:text-vb19-text hover:bg-white'}"
      >
        About Us
      </a> -->
    </div>
  </div>
</nav>

