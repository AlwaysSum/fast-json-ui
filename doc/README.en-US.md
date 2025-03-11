# Fast-JSON-UI-Vue

Fast-JSON-UI-Vue is a Vue 3 library for converting JSON configurations to UI components. With simple JSON configurations, you can quickly build complex user interfaces without writing a lot of HTML and CSS code.

## Features

- **JSON to UI Components**: Convert JSON configurations to Vue components
- **Dynamic Data Binding**: Support for variable and method binding
- **Custom Component Extension**: Easily extend with your own custom components
- **Flexible Layout System**: Support for row, column, stack, and other layouts
- **Chained Property Access**: Support for chained property access like `user.name` or `array.1.name`
- **Modern Vue 3 Support**: Both Options API and Composition API (script setup) components
- **Type Safety**: Complete TypeScript type support

## Installation

```bash
npm install fast-json-ui-vue
```

## Basic Usage

### Quick Start

```vue
<template>
  <div>
    <FastJsonWidget 
      :config="config" 
      :data="configData" 
      :methods="configMethods">
    </FastJsonWidget>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { FastJsonWidget } from 'fast-json-ui-vue';

const configData = ref({
  "name": "John Doe",
  "age": 28
});

const configMethods = ref({
  "sayHello": (name: string) => {
    alert(`Hello, ${name}!`);
  }
});

const config = ref({
  type: "column",
  children: [
    {
      type: "text",
      text: "Username: ${name}"
    },
    {
      type: "text",
      text: "Age: ${age}"
    },
    {
      type: "button",
      text: "Say Hello",
      onClick: "@{sayHello(${name})}"
    }
  ]
});
</script>
```

### Using Custom Components

```vue
<template>
  <div>
    <FastJsonWidget 
      :config="config" 
      :data="configData" 
      :methods="configMethods">
      <template #default="{ child }">
        <FastCustomWidget 
          :config="child" 
          :data="configData" 
          :methods="configMethods">
        </FastCustomWidget>
      </template>
    </FastJsonWidget>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { FastJsonWidget, FastCustomWidget, registerComponent } from 'fast-json-ui-vue';
import MyCustomCard from './components/MyCustomCard.vue';

// Register custom component
onMounted(() => {
  registerComponent('CustomCard', MyCustomCard);
});

const config = ref({
  type: "column",
  children: [
    {
      type: "text",
      text: "Standard Component"
    },
    {
      type: "CustomCard",
      title: "Custom Card",
      content: "This is a custom card component"
    }
  ]
});
</script>
```

### Using Composition API Components

The library provides both Options API and Composition API style components:

- `FastJsonWidget` and `FastCustomWidget`: Options API components
- `FastJsonWidgetSetup` and `FastCustomWidgetSetup`: Composition API components with `<script setup>`

```vue
<template>
  <div>
    <FastJsonWidgetSetup 
      :config="config" 
      :data="configData" 
      :methods="configMethods">
    </FastJsonWidgetSetup>
  </div>
</template>
```

## JSON Configuration Format

```json
{
  "type": "string",  // Component type (required)
  "children": [],    // Child components array (for parent components)
  "child": {},       // Single child component (for container components)
  ...                // Other properties specific to the component type
}
```

## Data Binding

Use `${variableName}` syntax to bind variables:

```json
{
  "type": "text",
  "text": "Hello, ${name}"
}
```

Support for chained property access:

```json
{
  "type": "text",
  "text": "City: ${user.address.city}"
}
```

Support for array index access:

```json
{
  "type": "text",
  "text": "First item: ${items.0.title}"
}
```

## Method Binding

Use `@{methodName(args)}` syntax to bind methods:

```json
{
  "type": "button",
  "text": "Click Me",
  "onClick": "@{handleClick(${name})}"
}
```

## Implemented Components

### Basic Components

| Component Type | Description | Main Properties |
|----------------|-------------|----------------|
| `text` | Text component | `text`: Text content to display |
| `image` | Image component | `src`: Image source URL<br>`alt`: Alternative text |
| `button` | Button component | `text`: Button text<br>`onClick`: Click event |
| `test` | Test component | Used for debugging, displays data object |

### Layout Components

| Component Type | Description | Main Properties |
|----------------|-------------|----------------|
| `container` | Container component | `children`: Array of child components |
| `row` | Row layout component | `children`: Array of child components<br>Arranges children horizontally |
| `column` | Column layout component | `children`: Array of child components<br>Arranges children vertically |
| `stack` | Stack layout component | `children`: Array of child components<br>Stacks children on top of each other |

### Common Properties

All components support the following common properties:

- `width`: Component width
- `height`: Component height
- `color`: Background color
- `padding`: Inner spacing
- `margin`: Outer spacing

## Planned Components

### Basic Components

- `input`: Input field component
- `select`: Selector component
- `checkbox`: Checkbox component
- `radio`: Radio button component
- `switch`: Toggle switch component
- `label`: Label component
- `link`: Link component
- `icon`: Icon component

### Layout Components

- `grid`: Grid layout component
- `card`: Card component
- `tabs`: Tabs component
- `collapse`: Collapsible panel component
- `divider`: Divider component
- `spacer`: Spacing component

### Advanced Components

- `table`: Table component
- `list`: List component
- `modal`: Modal dialog component
- `form`: Form component

## Custom Component Development

Create your own custom components:

```vue
<template>
  <div v-if="config.type === 'CustomType'" class="custom-component">
    {{ getValueFromConfig(config.text) }}
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { BaseConfig, ConfigData, ConfigMethods, getValueFromConfig } from 'fast-json-ui-vue';

const props = defineProps({
  config: {
    type: Object as PropType<BaseConfig>,
    required: true
  },
  data: {
    type: Object as PropType<ConfigData>,
    default: () => ({})
  },
  methods: {
    type: Object as PropType<ConfigMethods>,
    default: () => ({})
  }
});

const getValueFromConfig = (value: any): any => {
  if (typeof value !== 'string') {
    return value;
  }
  
  return FastJsonUI.getValueFromConfig(value, props.data, props.methods);
};
</script>
```

Register custom components:

```javascript
import { registerComponent } from 'fast-json-ui-vue';
import MyCustomComponent from './MyCustomComponent.vue';

// Single registration
registerComponent('CustomType', MyCustomComponent);

// Batch registration
registerMultipleComponents({
  'CustomType1': MyCustomComponent1,
  'CustomType2': MyCustomComponent2
});
```

## Demo

The library includes a demo application that showcases its features. To run the demo:

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the demo:
   ```bash
   npm run dev
   ```

The demo allows you to:
- Edit JSON configuration in real-time
- Update data bindings
- See the resulting UI components

## Development

### Project Setup

```bash
npm install
```

### Compile and Hot-Reload for Development

```bash
npm run dev
```

### Type-Check, Compile and Minify for Production

```bash
npm run build
```

### Lint with ESLint

```bash
npm run lint
```

## License

MIT 