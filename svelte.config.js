// svelte.config.js
import adapter from '@sveltejs/adapter-static';
// If your project version supports it, you can enable preprocessing:
// import { vitePreprocess } from '@sveltejs/kit/vite';

const dev = process.argv.includes('dev');
// If your repo is MarkDrozdov00/VB19Reps, the site lives at /VB19Reps on GitHub Pages
const base = dev ? '' : '/VB19Reps';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      pages: 'docs',   // output folder GitHub Pages will serve
      assets: 'docs',
      fallback: 'index.html', // <-- SPA fallback fixes "dynamic routes" for GH Pages
      strict: false           // <-- ignore non-prerenderable routes
    }),
    paths: { base }
  }
};

export default config;
