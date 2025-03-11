# 快速开始

本指南将帮助您快速上手 Fast-JSON-UI，创建您的第一个 JSON 驱动的 UI 界面。

## 前提条件

在开始之前，请确保您已经：

1. 安装了 Node.js (版本 16.0.0 或更高)
2. 创建了一个 Vue 3 项目
3. 安装了 Fast-JSON-UI 库 (参见 [安装指南](./installation.md))

## 创建第一个 Fast-JSON-UI 组件

### 步骤 1: 导入组件

在您的 Vue 组件中导入 `FastJsonWidget`：

```vue
<template>
  <div class="container">
    <FastJsonWidget 
      :config="config" 
      :data="data" 
      :methods="methods"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { FastJsonWidget } from 'fast-json-ui-vue';

// 接下来我们将定义 config, data 和 methods
</script>

<style scoped>
.container {
  padding: 20px;
}
</style>
```

### 步骤 2: 定义数据和方法

添加响应式数据和方法：

```vue
<script setup>
import { ref } from 'vue';
import { FastJsonWidget } from 'fast-json-ui-vue';

// 定义数据
const data = ref({
  username: '张三',
  age: 28,
  isActive: true
});

// 定义方法
const methods = ref({
  greet: (name) => {
    alert(`你好，${name}！`);
  },
  toggleActive: () => {
    data.value.isActive = !data.value.isActive;
  }
});

// 接下来我们将定义 config
</script>
```

### 步骤 3: 创建 JSON 配置

定义 UI 配置：

```vue
<script setup>
import { ref } from 'vue';
import { FastJsonWidget } from 'fast-json-ui-vue';

// 定义数据和方法...

// 定义 UI 配置
const config = ref({
  type: 'column',
  children: [
    {
      type: 'text',
      text: '用户信息'
    },
    {
      type: 'row',
      children: [
        {
          type: 'text',
          text: '用户名: ${username}'
        },
        {
          type: 'text',
          text: '年龄: ${age}'
        }
      ]
    },
    {
      type: 'text',
      text: '状态: ${isActive ? "活跃" : "非活跃"}'
    },
    {
      type: 'button',
      text: '打招呼',
      onClick: '@{greet(${username})}'
    },
    {
      type: 'button',
      text: '切换状态',
      onClick: '@{toggleActive()}'
    }
  ]
});
</script>
```

### 完整示例

将上述代码组合起来，完整的组件如下：

```vue
<template>
  <div class="container">
    <FastJsonWidget 
      :config="config" 
      :data="data" 
      :methods="methods"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { FastJsonWidget } from 'fast-json-ui-vue';

// 定义数据
const data = ref({
  username: '张三',
  age: 28,
  isActive: true
});

// 定义方法
const methods = ref({
  greet: (name) => {
    alert(`你好，${name}！`);
  },
  toggleActive: () => {
    data.value.isActive = !data.value.isActive;
  }
});

// 定义 UI 配置
const config = ref({
  type: 'column',
  children: [
    {
      type: 'text',
      text: '用户信息'
    },
    {
      type: 'row',
      children: [
        {
          type: 'text',
          text: '用户名: ${username}'
        },
        {
          type: 'text',
          text: '年龄: ${age}'
        }
      ]
    },
    {
      type: 'text',
      text: '状态: ${isActive ? "活跃" : "非活跃"}'
    },
    {
      type: 'button',
      text: '打招呼',
      onClick: '@{greet(${username})}'
    },
    {
      type: 'button',
      text: '切换状态',
      onClick: '@{toggleActive()}'
    }
  ]
});
</script>

<style scoped>
.container {
  padding: 20px;
}
</style>
```

## 理解配置结构

Fast-JSON-UI 使用 JSON 配置来描述 UI 结构。每个配置对象都有一个 `type` 属性，指定要渲染的组件类型。

### 基本结构

```javascript
{
  type: 'componentType',  // 组件类型，如 'text', 'button', 'column' 等
  ...otherProps,          // 组件特定的属性
  children: []            // 子组件数组（对于容器组件）
}
```

### 数据绑定

使用 `${variableName}` 语法绑定数据：

```javascript
{
  type: 'text',
  text: '用户名: ${username}'  // 将绑定到 data.username
}
```

### 方法绑定

使用 `@{methodName(args)}` 语法绑定方法：

```javascript
{
  type: 'button',
  text: '点击我',
  onClick: '@{handleClick(${username})}'  // 将调用 methods.handleClick 方法，并传入 data.username 作为参数
}
```

## 使用自定义组件

如果您需要使用自定义组件，可以先注册它们：

```javascript
import { registerComponent } from 'fast-json-ui-vue';
import MyCustomCard from './components/MyCustomCard.vue';

// 注册自定义组件
registerComponent('CustomCard', MyCustomCard);
```

然后在配置中使用：

```javascript
const config = {
  type: 'column',
  children: [
    {
      type: 'CustomCard',
      title: '自定义卡片',
      content: '这是一个自定义卡片组件'
    }
  ]
};
```

## 下一步

- [基本用法](./basic-usage.md) - 了解更多基本使用方法
- [数据绑定](./data-binding.md) - 深入了解数据绑定机制
- [方法绑定](./method-binding.md) - 深入了解方法绑定机制
- [组件](../components/) - 浏览所有可用组件 