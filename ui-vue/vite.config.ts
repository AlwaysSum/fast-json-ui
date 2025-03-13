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
    sourcemap: true,
    cssCodeSplit: false,
    emptyOutDir: true,
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
        exports: 'named',
      },
    },
    // 添加watch配置，支持监听模式
    watch: process.env.VITE_WATCH === 'true' ? {} : null,
  },
}); 