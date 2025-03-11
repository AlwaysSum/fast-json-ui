# 介绍

Fast-JSON-UI 是一个基于 Vue 3 的库，用于将 JSON 配置转换为 UI 组件。通过简单的 JSON 配置，您可以快速构建复杂的用户界面，无需编写大量的 HTML 和 CSS 代码。

## 什么是 Fast-JSON-UI？

Fast-JSON-UI 是一个轻量级的 UI 组件库，它允许开发者通过 JSON 配置来描述界面结构和行为，而不是直接编写 Vue 模板。这种方式特别适合以下场景：

- 需要动态生成界面的应用
- 低代码/无代码平台
- 可配置的仪表板或报表系统
- 需要从后端获取界面配置的应用

## 核心特性

### JSON 转 UI 组件

通过 JSON 配置快速生成 Vue 组件，例如：

```json
{
  "type": "column",
  "children": [
    {
      "type": "text",
      "text": "Hello, ${name}"
    },
    {
      "type": "button",
      "text": "Click Me",
      "onClick": "@{handleClick()}"
    }
  ]
}
```

### 动态数据绑定

支持变量和方法的动态绑定，使界面能够响应数据变化：

```vue
<template>
  <FastJsonWidget 
    :config="config" 
    :data="data" 
    :methods="methods"
  />
</template>

<script setup>
import { ref } from 'vue';
import { FastJsonWidget } from 'fast-json-ui-vue';

const data = ref({
  name: "World"
});

const methods = ref({
  handleClick: () => {
    alert('Button clicked!');
  }
});

const config = { /* JSON 配置 */ };
</script>
```

### 自定义组件扩展

轻松扩展自己的自定义组件，满足特定业务需求：

```javascript
import { registerComponent } from 'fast-json-ui-vue';
import MyCustomComponent from './MyCustomComponent.vue';

// 注册自定义组件
registerComponent('CustomType', MyCustomComponent);
```

### 灵活的布局系统

支持行、列、堆叠等多种布局方式，适应各种界面设计需求：

- `row`: 水平排列子组件
- `column`: 垂直排列子组件
- `stack`: 堆叠排列子组件
- `container`: 通用容器组件

### 链式属性访问

支持 `user.name` 或 `array.1.name` 这样的链式属性访问，轻松处理复杂数据结构。

### 现代 Vue 3 支持

同时提供 Options API 和 Composition API（script setup）组件，适应不同开发风格：

- `FastJsonWidget` 和 `FastCustomWidget`：Options API 组件
- `FastJsonWidgetSetup` 和 `FastCustomWidgetSetup`：使用 `<script setup>` 的 Composition API 组件

## 为什么选择 Fast-JSON-UI？

- **简化开发**：减少重复的 UI 代码编写，提高开发效率
- **灵活配置**：通过 JSON 配置灵活定制界面，易于修改和维护
- **动态渲染**：支持从后端或配置文件动态加载界面定义
- **类型安全**：完整的 TypeScript 类型支持，提供良好的开发体验
- **轻量级**：核心库体积小，按需加载组件

## 下一步

- [快速开始](./getting-started.md) - 了解如何开始使用 Fast-JSON-UI
- [安装](./installation.md) - 安装指南和环境要求
- [基本用法](./basic-usage.md) - 基本使用方法和示例 