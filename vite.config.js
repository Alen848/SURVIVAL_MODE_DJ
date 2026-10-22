import { defineConfig } from 'vite';

export default defineConfig({
  server: { host: true },
  build: { assetsInlineLimit: 0, chunkSizeWarningLimit: 800 },
});
