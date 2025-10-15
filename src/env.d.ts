/// <reference types="vite/client" />

// 为所有 .vue 单文件组件提供类型声明，避免默认导出与模块解析诊断
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}