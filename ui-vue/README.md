# fast-json-ui-vue

A Vue 3 library for converting JSON configurations into UI components.

## Installation

```bash
# npm
npm install fast-json-ui-vue

# yarn
yarn add fast-json-ui-vue

# pnpm
pnpm add fast-json-ui-vue
```

## Usage

### Global Registration

```javascript
import { createApp } from 'vue';
import App from './App.vue';
import FastJsonUI from 'fast-json-ui-vue';

const app = createApp(App);
app.use(FastJsonUI);
app.mount('#app');
```

### Component Import

```vue
<template>
  <div>
    <FastJsonWidget :config="config" :data="data" :methods="methods" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { FastJsonWidget } from 'fast-json-ui-vue';

const data = ref({
  username: 'John Doe',
  age: 30,
  isActive: true
});

const methods = ref({
  greet: (name) => {
    alert(`Hello, ${name}!`);
  },
  toggleActive: () => {
    data.value.isActive = !data.value.isActive;
  }
});

const config = ref({
  type: 'column',
  children: [
    {
      type: 'text',
      text: 'User Information'
    },
    {
      type: 'row',
      children: [
        {
          type: 'text',
          text: 'Username: ${username}'
        },
        {
          type: 'text',
          text: 'Age: ${age}'
        }
      ]
    },
    {
      type: 'text',
      text: 'Status: ${isActive ? "Active" : "Inactive"}'
    },
    {
      type: 'button',
      text: 'Greet',
      onClick: '@{greet(${username})}'
    },
    {
      type: 'button',
      text: 'Toggle Status',
      onClick: '@{toggleActive()}'
    }
  ]
});
</script>
```

## Features

- Convert JSON configurations to Vue components
- Dynamic data binding with `${expression}` syntax
- Method binding with `@{methodName(args)}` syntax
- Conditional rendering with `if` property
- List rendering with `for` and `item` properties
- Flexible layout components (Row, Column, Stack)
- Custom component registration

## Documentation

For detailed documentation, visit our [documentation site](https://your-username.github.io/fast-json-ui/).

## License

MIT 