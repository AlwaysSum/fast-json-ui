import { App } from 'vue';
import FastJsonWidget from './components/FastJsonWidget.vue';
import * as WidgetFactory from './components/WidgetFactory';

// Export components
export { 
  FastJsonWidget,
  WidgetFactory
};

// Export types
export * from './types';

// Export utilities
export * from './utils/regex-utils';
export * from './utils/fast-json-ui';

// Default export for Vue plugin
export default {
  install: (app: App): void => {
    app.component('FastJsonWidget', FastJsonWidget);
  }
}; 