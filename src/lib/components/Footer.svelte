<script>
  import { base } from '$app/paths';
</script>

<footer class="bg-white border-t border-gray-100 mt-auto">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Brand -->
      <div class="col-span-1">
        <div class="flex items-center space-x-2 mb-4">
          <div class="w-8 h-8 bg-vb19-primary rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-sm">VB</span>
          </div>
          <span class="text-xl font-semibold text-vb19-text">ViennaBase19 Reps</span>
        </div>
        <p class="text-vb19-muted text-sm">
          Brought to live and hosted by your own ViennaBase19 Representatives.
        </p>
      </div>
      
      <!-- Quick Links -->
      <div class="col-span-1">
        <h3 class="text-sm font-semibold text-vb19-text uppercase tracking-wider mb-4">Quick Links</h3>
        <ul class="space-y-2">
          <li>
            <a href={`${base}/`} class="text-vb19-muted hover:text-vb19-primary text-sm transition-colors duration-200">
              Book Facilities
            </a>
          </li>

          {#if false}
            <li>
              <a href={`${base}/announcements`} class="text-vb19-muted hover:text-vb19-primary text-sm transition-colors duration-200">
                Announcements
              </a>
            </li>
            <li>
              <a href={`${base}/about`} class="text-vb19-muted hover:text-vb19-primary text-sm transition-colors duration-200">
                About Us
              </a>
            </li>
          {/if}
        </ul>
      </div>
      
      <!-- Contact -->
      <div class="col-span-1">
        <h3 class="text-sm font-semibold text-vb19-text uppercase tracking-wider mb-4">Contact</h3>
        <div class="space-y-4">
          <p class="text-vb19-muted text-sm">For other inquiries:</p>
          <a 
            href="mailto:base19.reps@outlook.com" 
            class="text-vb19-primary hover:text-blue-700 text-sm font-medium transition-colors duration-200"
          >
            base19.reps@outlook.com
          </a>

          <div>
            <h4 class="text-xs font-semibold text-vb19-text uppercase tracking-wider mb-3">Stay Connected</h4>
            <div class="flex items-center justify-center md:justify-start gap-5">
              <a
                href="mailto:base19.reps@outlook.com"
                class="text-vb19-muted hover:text-vb19-primary hover:opacity-90 transition duration-200 hover:scale-105"
                aria-label="Email"
              >
                <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
              </a>

              <a
                href="https://chat.whatsapp.com/KkefmfDcWRNCD2hNaAhEuW?mode=gi_t"
                class="text-vb19-muted hover:text-vb19-primary hover:opacity-90 transition duration-200 hover:scale-105"
                aria-label="WhatsApp"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12.04 2a9.9 9.9 0 0 0-8.48 15.02L2.2 22l5.1-1.34A9.9 9.9 0 1 0 12.04 2Zm0 1.75a8.15 8.15 0 0 1 6.92 12.46 8.15 8.15 0 0 1-10.98 2.73l-.36-.21-3.02.79.8-2.94-.23-.38a8.15 8.15 0 0 1 6.87-12.45Zm-3.1 4.33c-.18 0-.47.07-.72.34-.25.28-.95.93-.95 2.26s.98 2.63 1.12 2.81c.14.18 1.92 3.07 4.76 4.18 2.36.93 2.84.74 3.35.7.51-.04 1.65-.67 1.88-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33-.28-.14-1.65-.81-1.9-.9-.26-.1-.44-.14-.63.14-.18.27-.72.9-.88 1.08-.16.19-.33.21-.61.07-.28-.14-1.17-.43-2.23-1.38-.82-.73-1.38-1.64-1.54-1.92-.16-.28-.02-.43.12-.57.13-.13.28-.33.42-.49.14-.16.18-.28.28-.46.09-.19.04-.35-.02-.49-.07-.14-.63-1.52-.86-2.08-.23-.55-.46-.47-.63-.48h-.54Z"></path>
                </svg>
              </a>

              <a
                href="https://www.instagram.com/viennabase19?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                class="text-vb19-muted hover:text-vb19-primary hover:opacity-90 transition duration-200 hover:scale-105"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <rect width="20" height="20" x="2" y="2" rx="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z"></path>
                  <path d="M17.5 6.5h.01"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Bottom Bar -->
    <div class="mt-8 pt-8 border-t border-gray-100">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <p class="text-vb19-muted text-sm">
          © 2025 ViennaBase19 Reps. All rights reserved.
        </p>
        <p class="text-vb19-muted text-sm mt-2 md:mt-0">
          Built with care for our community
        </p>
      </div>
    </div>
  </div>
</footer>
