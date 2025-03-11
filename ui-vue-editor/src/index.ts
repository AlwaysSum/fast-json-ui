import { App } from 'vue';
import JsonUiEditor from './components/JsonUiEditor.vue';

// Export component
export { JsonUiEditor };

// Export types
export * from './types/index';

// Export the Vue plugin install function
export function install(app: App): void {
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