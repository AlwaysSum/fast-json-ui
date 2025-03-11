# 安装

本节将指导您如何安装 Fast-JSON-UI 库并将其集成到您的 Vue 3 项目中。

## 环境要求

在安装 Fast-JSON-UI 之前，请确保您的开发环境满足以下要求：

- **Node.js**: 版本 16.0.0 或更高
- **Vue**: 版本 3.2.0 或更高
- **TypeScript**: 版本 4.5.0 或更高（推荐，但不是必需的）

## 使用包管理器安装

### npm

```bash
npm install fast-json-ui-vue
```

### yarn

```bash
yarn add fast-json-ui-vue
```

### pnpm

```bash
pnpm add fast-json-ui-vue
```

## 在 Vue 项目中注册

### 全局注册

在您的 `main.js` 或 `main.ts` 文件中：

```javascript
import { createApp } from 'vue'
import App from './App.vue'
import FastJsonUI from 'fast-json-ui-vue'

const app = createApp(App)
app.use(FastJsonUI)
app.mount('#app')
```

这将全局注册所有 Fast-JSON-UI 组件，使它们在任何组件中都可用。

### 按需引入

如果您只想使用特定的组件，可以按需引入：

```vue
<template>
  <div>
    <FastJsonWidget :config="config" :data="data" :methods="methods" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { FastJsonWidget } from 'fast-json-ui-vue'

// 组件逻辑...
</script>
```

## TypeScript 支持

Fast-JSON-UI 提供了完整的 TypeScript 类型定义。如果您使用 TypeScript，可以获得良好的类型检查和自动补全支持。

在 TypeScript 项目中使用：

```typescript
import { ref } from 'vue'
import { FastJsonWidget, type ComponentConfig, type ConfigData, type ConfigMethods } from 'fast-json-ui-vue'

const config = ref<ComponentConfig>({
  type: 'column',
  children: [
    {
      type: 'text',
      text: 'Hello, ${name}'
    }
  ]
})

const data = ref<ConfigData>({
  name: 'World'
})

const methods = ref<ConfigMethods>({
  sayHello: () => {
    alert('Hello!')
  }
})
```

## 验证安装

安装完成后，您可以创建一个简单的组件来验证 Fast-JSON-UI 是否正常工作：

```vue
<template>
  <div>
    <h1>Fast-JSON-UI 测试</h1>
    <FastJsonWidget :config="config" :data="data" :methods="methods" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { FastJsonWidget } from 'fast-json-ui-vue'

const data = ref({
  message: 'Fast-JSON-UI 安装成功！'
})

const methods = ref({})

const config = ref({
  type: 'text',
  text: '${message}'
})
</script>
```

如果页面显示 "Fast-JSON-UI 安装成功！"，则表示安装和配置已正确完成。

## 常见问题

### 找不到模块 'fast-json-ui-vue'

如果您遇到 "找不到模块 'fast-json-ui-vue'" 的错误，请检查：

1. 包是否已正确安装（检查 `node_modules` 目录）
2. 包名是否拼写正确
3. 尝试重新安装依赖：`npm install` 或 `yarn install`

### Vue 版本兼容性问题

Fast-JSON-UI 需要 Vue 3.2.0 或更高版本。如果您使用较低版本的 Vue，可能会遇到兼容性问题。请更新您的 Vue 版本：

```bash
npm update vue
```

## 下一步

- [快速开始](./getting-started.md) - 了解如何开始使用 Fast-JSON-UI
- [基本用法](./basic-usage.md) - 基本使用方法和示例 