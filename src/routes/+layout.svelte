<script>
  import { onMount } from 'svelte';
  import '../app.css';
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';

  onMount(() => {
    document.documentElement.classList.remove('preload');
  });
</script>

<div class="min-h-screen flex flex-col">
  <NavBar />
  
  <main class="flex-1">
    <slot />
  </main>
  
  <Footer />
</div>
