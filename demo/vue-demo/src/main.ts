import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import FastJsonUI, { registerComponent } from "fast-json-ui-vue";
import * as EditorModule from "fast-json-ui-editor";
// 引入编辑器和依赖的样式（TDesign + fast-json-ui-vue）
import "tdesign-vue-next/es/style/index.css";
import "fast-json-ui-vue/dist/style.css";
import "fast-json-ui-editor/dist/style.css";
import TDesign from "tdesign-vue-next";

//注册自定义 Vue
import CustomComponent from "./components/custom/CustomComponent.vue";
registerComponent("CustomType", CustomComponent, {
  type: "CustomType",
  name: "自定义组件",
  icon: "🧩",
  category: "custom",
  defaultConfig: {
    type: "CustomType",
    text: "自定义内容"
  },
  properties: [
    { name: "text", label: "文本", type: "string", defaultValue: "自定义内容", required: true }
  ]
});
registerComponent("CustomCard", CustomComponent, {
  type: "CustomCard",
  name: "自定义卡片",
  icon: "🃏",
  category: "custom",
  defaultConfig: {
    type: "CustomCard",
    text: "自定义卡片内容"
  },
  properties: [
    { name: "text", label: "文本", type: "string", defaultValue: "自定义卡片内容", required: true }
  ]
});

const app = createApp(App);

// Register all components from the Fast-JSON-UI library
app.use(FastJsonUI);

// Register the Fast-JSON-UI Editor
app.use(EditorModule.FastJsonUiEditor);

// 注册 TDesign 组件库（编辑器内部使用）
app.use(TDesign);

app.mount("#app");
