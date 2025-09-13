<script>
  import '../app.css';
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
</script>

<div class="min-h-screen flex flex-col">
  <NavBar />
  
  <main class="flex-1">
    <slot />
  </main>
  
  <Footer />
</div>

