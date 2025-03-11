import { createApp } from 'vue';
import App from './App.vue';
import FastJsonUi from 'fast-json-ui-vue';

const app = createApp(App);

// 注册 Fast-JSON-UI 组件
app.use(FastJsonUi);

app.mount('#app'); 