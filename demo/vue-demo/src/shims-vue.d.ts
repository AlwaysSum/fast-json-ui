// Vue SFC 类型声明：为 .vue 文件提供默认导出组件类型
// 解决在 TS 中导入 *.vue 提示“Module has no default export”的问题。
declare module '*.vue' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// 如果需要，可在此追加其他第三方 SFC 的类型声明