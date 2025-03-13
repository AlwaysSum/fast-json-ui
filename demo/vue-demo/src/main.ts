import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import FastJsonUI, { registerComponent } from "fast-json-ui-vue";
import * as EditorModule from "fast-json-ui-editor";
import "fast-json-ui-editor/dist/style.css";

//注册自定义 Vue
import CustomComponent from "./components/custom/CustomComponent.vue";
registerComponent("CustomType", CustomComponent);
registerComponent("CustomCard", CustomComponent);

const app = createApp(App);

// Register all components from the Fast-JSON-UI library
app.use(FastJsonUI);

// Register the Fast-JSON-UI Editor
app.use(EditorModule.FastJsonUiEditor);

app.mount("#app");
