// svelte.config.js
import adapter from '@sveltejs/adapter-static';

const dev = process.argv.includes('dev');
const repo = 'VB19Reps'; // <-- your repo name

export default {
  kit: {
    adapter: adapter({ fallback: '404.html' }),
    paths: { base: dev ? '' : `/${repo}` },
    prerender: { entries: ['*'] }
  }
};
