import { App } from 'vue';
import JsonUiEditor from './components/JsonUiEditor.vue';
// Ensure required styles are bundled when consumers import the library
import 'tdesign-vue-next/es/style/index.css';
import 'fast-json-ui-vue/dist/style.css';
import './style.css';
// Auto-register TDesign to ensure components render properly
import TDesign from 'tdesign-vue-next';

// Export component
export { JsonUiEditor };

// Export types
export * from './types/index';

// Export the Vue plugin install function
export function install(app: App): void {
  // Register TDesign UI library used internally by the editor
  app.use(TDesign);
  // Register editor component
  app.component('JsonUiEditor', JsonUiEditor);
}

// Create a plugin object
const plugin = {
  install,
  JsonUiEditor
};

// Export as named export
export { plugin as FastJsonUiEditor };

// Default export
export default plugin;