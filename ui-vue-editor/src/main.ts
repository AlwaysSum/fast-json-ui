import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import FastJsonUi  from 'fast-json-ui-vue';
import * as FastJsonUiVue from 'fast-json-ui-vue';
import TDesign from 'tdesign-vue-next';
import 'tdesign-vue-next/es/style/index.css';
// 引入 fast-json-ui-vue 的库样式（包含组件 scoped 样式的抽取文件）
import 'fast-json-ui-vue/dist/style.css';
import './style.css';

const app = createApp(App);

// 注册 TDesign 组件库
app.use(TDesign);

// 注册 Fast-JSON-UI 组件
app.use(FastJsonUi);

// 启用路由
app.use(router);

// 将渲染模式设置为编辑模式
const setRenderModeSafe = (mode: 'normal' | 'editor' | 'preview') => {
  const fn = (FastJsonUiVue as any).setRenderMode;
  if (typeof fn === 'function') {
    fn(mode);
  } else {
    console.warn('fast-json-ui-vue: setRenderMode 不可用，已跳过设置渲染模式');
  }
};

setRenderModeSafe('editor');

app.mount('#app');