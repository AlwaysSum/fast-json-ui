declare module 'fast-json-ui-vue' {
  import { Component } from 'vue';
  
  export interface ComponentConfig {
    type: string;
    [key: string]: any;
  }
  
  export const FastJsonWidget: Component;
  
  export function registerComponent(type: string, component: Component): void;
  
  const _default: {
    install: (app: any) => void;
  };
  
  export default _default;
} 