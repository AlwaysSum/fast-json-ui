# 基本用法

本指南将介绍 Fast-JSON-UI 的基本用法，包括组件结构、属性配置、数据绑定和事件处理等核心概念。

## 组件结构

Fast-JSON-UI 的核心是 `FastJsonWidget` 组件，它接受三个主要属性：

- `config`: JSON 配置对象，描述 UI 结构和行为
- `data`: 数据对象，提供动态内容
- `methods`: 方法对象，提供事件处理函数

```vue
<template>
  <FastJsonWidget 
    :config="config" 
    :data="data" 
    :methods="methods"
  />
</template>
```

## 配置对象结构

每个配置对象都必须包含一个 `type` 属性，用于指定要渲染的组件类型。根据组件类型的不同，可能还需要其他特定属性。

### 基本组件示例

```javascript
// 文本组件
{
  type: 'text',
  text: '这是一段文本'
}

// 按钮组件
{
  type: 'button',
  text: '点击我',
  onClick: '@{handleClick()}'
}

// 图片组件
{
  type: 'image',
  src: 'https://example.com/image.jpg',
  alt: '示例图片'
}
```

### 容器组件示例

容器组件通过 `children` 属性包含子组件：

```javascript
// 列布局
{
  type: 'column',
  children: [
    { type: 'text', text: '第一行' },
    { type: 'text', text: '第二行' }
  ]
}

// 行布局
{
  type: 'row',
  children: [
    { type: 'text', text: '左侧' },
    { type: 'text', text: '右侧' }
  ]
}

// 堆叠布局
{
  type: 'stack',
  children: [
    { type: 'image', src: 'background.jpg' },
    { type: 'text', text: '叠加在图片上的文字' }
  ]
}
```

## 数据绑定

Fast-JSON-UI 支持通过 `${expression}` 语法在配置中绑定数据：

```javascript
// 简单数据绑定
{
  type: 'text',
  text: '用户名: ${username}'
}

// 条件表达式
{
  type: 'text',
  text: '状态: ${isActive ? "活跃" : "非活跃"}'
}

// 嵌套属性访问
{
  type: 'text',
  text: '地址: ${user.address.city}'
}

// 数组访问
{
  type: 'text',
  text: '第一个项目: ${items[0].name}'
}
```

## 方法绑定

使用 `@{methodName(args)}` 语法绑定事件处理方法：

```javascript
// 简单方法调用
{
  type: 'button',
  text: '点击我',
  onClick: '@{handleClick()}'
}

// 带参数的方法调用
{
  type: 'button',
  text: '删除',
  onClick: '@{deleteItem(${item.id})}'
}

// 组合数据和方法
{
  type: 'button',
  text: '问候',
  onClick: '@{greet(`你好，${username}`)}'
}
```

## 样式配置

Fast-JSON-UI 支持通过 `style` 属性配置组件样式：

```javascript
{
  type: 'text',
  text: '重要提示',
  style: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: '18px'
  }
}
```

也可以使用条件样式：

```javascript
{
  type: 'text',
  text: '状态指示器',
  style: {
    color: '${isActive ? "green" : "red"}',
    fontWeight: 'bold'
  }
}
```

## 条件渲染

使用 `if` 属性实现条件渲染：

```javascript
{
  type: 'text',
  text: '仅管理员可见',
  if: '${user.role === "admin"}'
}
```

## 列表渲染

使用 `for` 和 `item` 属性实现列表渲染：

```javascript
{
  type: 'column',
  for: 'item in items',
  item: {
    type: 'text',
    text: '项目: ${item.name}'
  }
}
```

更复杂的列表示例：

```javascript
{
  type: 'column',
  for: '(item, index) in items',
  item: {
    type: 'row',
    children: [
      {
        type: 'text',
        text: '${index + 1}. ${item.name}'
      },
      {
        type: 'button',
        text: '删除',
        onClick: '@{removeItem(${index})}'
      }
    ]
  }
}
```

## 完整示例

下面是一个综合示例，展示了 Fast-JSON-UI 的多种功能：

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
  user: {
    name: '张三',
    role: 'admin'
  },
  items: [
    { id: 1, name: '项目 A', completed: false },
    { id: 2, name: '项目 B', completed: true },
    { id: 3, name: '项目 C', completed: false }
  ]
});

const methods = ref({
  toggleItem: (id) => {
    const item = data.value.items.find(item => item.id === id);
    if (item) {
      item.completed = !item.completed;
    }
  },
  removeItem: (index) => {
    data.value.items.splice(index, 1);
  },
  addItem: () => {
    const newId = Math.max(0, ...data.value.items.map(i => i.id)) + 1;
    data.value.items.push({ id: newId, name: `新项目 ${newId}`, completed: false });
  }
});

const config = ref({
  type: 'column',
  children: [
    {
      type: 'text',
      text: '欢迎，${user.name}',
      style: {
        fontSize: '20px',
        fontWeight: 'bold',
        marginBottom: '10px'
      }
    },
    {
      type: 'text',
      text: '管理员控制面板',
      if: '${user.role === "admin"}',
      style: {
        color: 'blue',
        marginBottom: '20px'
      }
    },
    {
      type: 'button',
      text: '添加项目',
      onClick: '@{addItem()}',
      style: {
        marginBottom: '10px'
      }
    },
    {
      type: 'column',
      for: '(item, index) in items',
      item: {
        type: 'row',
        style: {
          padding: '10px',
          marginBottom: '5px',
          backgroundColor: '${item.completed ? "#e6ffe6" : "#fff"}',
          borderRadius: '4px',
          border: '1px solid #ddd'
        },
        children: [
          {
            type: 'text',
            text: '${index + 1}. ${item.name}',
            style: {
              textDecoration: '${item.completed ? "line-through" : "none"}',
              flex: 1
            }
          },
          {
            type: 'button',
            text: '${item.completed ? "取消完成" : "标记完成"}',
            onClick: '@{toggleItem(${item.id})}'
          },
          {
            type: 'button',
            text: '删除',
            onClick: '@{removeItem(${index})}'
          }
        ]
      }
    }
  ]
});
</script>
```

## 下一步

- [数据绑定](./data-binding.md) - 深入了解数据绑定机制
- [方法绑定](./method-binding.md) - 深入了解方法绑定机制
- [组件](../components/) - 浏览所有可用组件
- [高级用法](./advanced-usage.md) - 探索更高级的用法 