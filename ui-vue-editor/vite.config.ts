import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    host: true,
    port: 5175,
  },
  optimizeDeps: {
    exclude: ['tdesign-icons-vue-next'],
    esbuildOptions: {
      sourcemap: false,
    },
  },
  css: {
    devSourcemap: false,
  },
  build: {
    sourcemap: false,
  },
});
