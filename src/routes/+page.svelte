<script>
  import FacilityPicker from '$lib/components/FacilityPicker.svelte';
  import FacilityGallery from '$lib/components/FacilityGallery.svelte';
  import AvailabilityCalendar from '$lib/components/AvailabilityCalendar.svelte';
  import BookingForm from '$lib/components/BookingForm.svelte';
  import Toast from '$lib/components/Toast.svelte';
  
  let selectedFacility = null;
  let selectedDates = [];
  let showBookingForm = false;
  let toastMessage = '';
  let toastType = 'success';
  let showToast = false;
  
  function handleFacilitySelect(event) {
    selectedFacility = event.detail;
    selectedDates = [];
    showBookingForm = false;
    console.log('Selected facility:', selectedFacility); // Debug log
  }
  
  function handleDatesSelect(event) {
    selectedDates = event.detail;
    showBookingForm = selectedDates.length > 0;
  }
  
  function handleBookingSubmit(event) {
    const bookingData = event.detail;
    
    // Simulate booking submission
    setTimeout(() => {
      if (selectedFacility?.id === 'bbq-area') {
        toastMessage = 'Booking confirmed! Your BBQ Area reservation is ready.';
        toastType = 'success';
      } else {
        toastMessage = 'Booking request submitted! We\'ll review and confirm within 24 hours.';
        toastType = 'info';
      }
      showToast = true;
      
      // Reset form
      selectedDates = [];
      showBookingForm = false;
    }, 1000);
  }
  
  function scrollToBooking() {
    document.getElementById('booking-section').scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  }
</script>

<svelte:head>
  <title>ViennaBase19 - Book Your Facility</title>
  <meta name="description" content="Book shared facilities at ViennaBase19. Choose from Club Room, Games Room, or BBQ Area for your next gathering." />
</svelte:head>

<!-- Hero Section -->
<section class="relative min-h-screen flex items-center justify-center overflow-hidden">
  <!-- Background Image -->
  <div class="absolute inset-0 bg-cover bg-center bg-no-repeat" style="background-image: url('/banner.png');"></div>
  <!-- Dark overlay for better text readability -->
  <div class="absolute inset-0 bg-black/40"></div>
  
  <div class="relative z-10 text-center px-4 max-w-4xl mx-auto">
    <div class="animate-bounce-in">
      <h1 class="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
        Welcome to ViennaBase19
        <span class="block bg-gradient-to-r from-yellow-300 via-pink-300 to-orange-300 bg-clip-text text-transparent">
          Reps Portal
        </span>
      </h1>
    </div>
    
    <div class="animate-slide-up" style="animation-delay: 0.3s;">
      <p class="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
        We’re working hard to make dorm life even better — upgrading current spaces, adding new facilities, and bringing you fun events to enjoy together!
      </p>
    </div>
    
    <div class="animate-slide-up" style="animation-delay: 0.6s;">
      <p class="text-lg text-white/80 mb-12">
        Select a facility, choose your dates, and submit your booking request. Our representatives will review and confirm your request.
      </p>
    </div>
    
    <div class="animate-slide-up" style="animation-delay: 0.9s;">
      <button 
        class="btn-primary text-lg px-8 py-4 pulse-glow"
        on:click={scrollToBooking}
      >
        🚀 Start Booking
      </button>
    </div>
  </div>
  
  <!-- Scroll Indicator -->
  <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
    <div class="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
      <div class="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
    </div>
  </div>
</section>

<!-- Booking Section -->
<section id="booking-section" class="py-20 px-4">
  <div class="max-w-7xl mx-auto">
    <div class="text-center mb-16 animate-slide-up">
      <h2 class="text-4xl md:text-5xl font-bold gradient-text mb-6">
        Book Your Facility
      </h2>
      <p class="text-xl text-gray-600 max-w-3xl mx-auto">
        Select a facility, choose your dates, and submit your booking request. Our representatives will review and confirm your request.
      </p>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
      <!-- Step 1: Choose Facility -->
      <div class="space-y-8 animate-slide-up " style="animation-delay: 0.2s;">
        <div class="card">
          <h3 class="text-2xl font-bold gradient-text mb-6 flex items-center">
            <span class="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">1</span>
            What would you like to book?
          </h3>
          
          <FacilityPicker on:facilityChanged={handleFacilitySelect} />
        </div>
        
        {#if selectedFacility}
          <div class="card animate-bounce-in">
            <FacilityGallery facility={selectedFacility} />
          </div>
        {/if}
      </div>
      
      <!-- Step 2 & 3: Calendar and Form -->
      <div class="space-y-8">
        {#if selectedFacility}
          <div class="card animate-slide-up" style="animation-delay: 0.4s;">
            <h3 class="text-2xl font-bold gradient-text mb-6 flex items-center">
              <span class="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">2</span>
              Select Your Dates
            </h3>
            <AvailabilityCalendar 
              facility={selectedFacility} 
              on:datesSelect={handleDatesSelect}
            />
          </div>
        {/if}
        
        {#if showBookingForm}
          <div class="card animate-bounce-in">
            <h3 class="text-2xl font-bold gradient-text mb-6 flex items-center">
              <span class="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">3</span>
              Complete Your Booking
            </h3>
            <BookingForm 
              facility={selectedFacility}
              dates={selectedDates}
              on:submit={handleBookingSubmit}
            />
          </div>
        {:else if selectedFacility}
          <div class="card text-center animate-slide-up">
            <div class="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-700 mb-2">Step 3: Complete Your Booking</h3>
            <p class="text-gray-500">Please select your booking dates to continue</p>
          </div>
        {/if}
      </div>
    </div>
  </div>
</section>

<!-- Community Guidelines Section -->
<section class="py-20 px-4 bg-gradient-to-br from-purple-50 to-pink-50">
  <div class="max-w-6xl mx-auto">
    <div class="text-center mb-16 animate-slide-up">
      <h2 class="text-4xl font-bold gradient-text mb-6">Community Guidelines</h2>
      <p class="text-xl text-gray-600">Simple rules to ensure everyone enjoys our shared spaces</p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="card text-center facility-card animate-slide-up" style="animation-delay: 0.1s;">
        <div class="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-xl font-bold gradient-text mb-4">Respect Time Limits</h3>
        <p class="text-gray-600">Club Room & Games Room: Max 2 days • BBQ Area: Max 1 day per booking</p>
      </div>
      
      <div class="card text-center facility-card animate-slide-up" style="animation-delay: 0.3s;">
        <div class="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 class="text-xl font-bold gradient-text mb-4">Clean Up After Use</h3>
        <p class="text-gray-600">Leave facilities clean and tidy for the next resident to enjoy</p>
      </div>
      
      <div class="card text-center facility-card animate-slide-up" style="animation-delay: 0.5s;">
        <div class="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-xl font-bold gradient-text mb-4">Follow House Rules</h3>
        <p class="text-gray-600">Respect noise levels and building policies during your booking</p>
      </div>
    </div>
  </div>
</section>

{#if showToast}
  <Toast message={toastMessage} type={toastType} on:close={() => showToast = false} />
{/if}

