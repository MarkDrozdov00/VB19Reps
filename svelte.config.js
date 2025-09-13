// svelte.config.js
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';

const dev = process.argv.includes('dev');
// ⬇️ Set this to your repo name (for https://USERNAME.github.io/REPO)
const repo = 'YOUR_REPO_NAME';

const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      // Use 404.html as SPA fallback so deep links work on GH Pages
      fallback: '404.html'
    }),
    // On GitHub Pages project sites you need a base path
    paths: {
      base: dev ? '' : `/${repo}`
    },
    prerender: {
      entries: ['*'] // prerender everything (static site)
    }
  }
};

export default config;
