/// <reference types="vite/client" />

declare module 'vite' {
  export function defineConfig(config: any): any;
}

declare module '@vitejs/plugin-vue' {
  const plugin: any;
  export default plugin;
}

declare const __dirname: string; 