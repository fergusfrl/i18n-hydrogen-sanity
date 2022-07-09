import {defineConfig} from 'vite';
import hydrogen from '@shopify/hydrogen/plugin';
import netlifyPlugin from '@netlify/hydrogen-platform/plugin';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [hydrogen(), netlifyPlugin()],
  optimizeDeps: {include: ['@headlessui/react']},
});
