import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      vue: "vue/dist/vue.esm-bundler.js",
    },
  },
  build: {
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "FastJsonUiEditor",
      fileName: (format) =>
        `fast-json-ui-editor.${format === "es" ? "mjs" : "umd.js"}`,
    },
    rollupOptions: {
      // Make sure to externalize deps that shouldn't be bundled
      external: ["vue", "fast-json-ui-vue", "vuedraggable"],
      output: {
        // Provide globals for UMD build
        globals: {
          vue: "Vue",
          "fast-json-ui-vue": "FastJsonUiVue",
          vuedraggable: "Draggable",
        },
        exports: "named",
      },
    },
  },
});
