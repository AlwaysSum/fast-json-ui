# Fast-JSON-UI-Vue

<div align="center">
  <p>
    <a href="./doc/README.zh-CN.md">中文</a> | 
    <a href="./doc/README.en-US.md">English</a>
  </p>
</div>

Fast-JSON-UI-Vue 是一个基于 Vue 3 的库，用于将 JSON 配置转换为 UI 组件。通过简单的 JSON 配置，您可以快速构建复杂的用户界面，无需编写大量的 HTML 和 CSS 代码。

[https://alwayssum.github.io/fast-json-ui/](https://alwayssum.github.io/fast-json-ui/)

## 特色功能

- **JSON 转 UI 组件**：通过 JSON 配置快速生成 Vue 组件
- **动态数据绑定**：支持变量和方法的动态绑定
- **自定义组件扩展**：轻松扩展自己的自定义组件
- **灵活的布局系统**：支持行、列、堆叠等多种布局方式
- **链式属性访问**：支持 `user.name` 或 `array.1.name` 这样的链式属性访问
- **现代 Vue 3 支持**：同时提供 Options API 和 Composition API（script setup）组件
- **类型安全**：完整的 TypeScript 类型支持

## 文档

详细文档请查看：
- [中文文档](./doc/README.zh-CN.md)
- [English Documentation](./doc/README.en-US.md)

## 快速开始

### 安装

```bash
npm install fast-json-ui-vue
```

### 基本用法

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
  "name": "张三",
  "age": 28
});

const configMethods = ref({
  "sayHello": (name: string) => {
    alert(`你好，${name}！`);
  }
});

const config = ref({
  type: "column",
  children: [
    {
      type: "text",
      text: "用户名: ${name}"
    },
    {
      type: "button",
      text: "打招呼",
      onClick: "@{sayHello(${name})}"
    }
  ]
});
</script>
```

## 许可证

MIT 