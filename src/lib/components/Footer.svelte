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
        <div class="space-y-2">
          <p class="text-vb19-muted text-sm">For other inquiries:</p>
          <a 
            href="mailto:base19.reps@outlook.com" 
            class="text-vb19-primary hover:text-blue-700 text-sm font-medium transition-colors duration-200"
          >
            base19.reps@outlook.com
          </a>
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
