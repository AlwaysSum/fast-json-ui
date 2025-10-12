import { createApp } from 'vue';
import App from './App.vue';
import FastJsonUi  from 'fast-json-ui-vue';
import TDesign from 'tdesign-vue-next';
import 'tdesign-vue-next/es/style/index.css';
import './style.css';

const app = createApp(App);

// 注册 TDesign 组件库
app.use(TDesign);

// 注册 Fast-JSON-UI 组件
app.use(FastJsonUi);

app.mount('#app');