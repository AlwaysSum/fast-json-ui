import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'FastJsonUiVue',
      fileName: (format) => `fast-json-ui-vue.${format}.js`,
    },
    rollupOptions: {
      // Make sure to externalize deps that shouldn't be bundled into the library
      external: ['vue'],
      output: {
        // Provide global variables to use in the UMD build for externalized deps
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
}); 