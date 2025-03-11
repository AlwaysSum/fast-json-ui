# 数据绑定

Fast-JSON-UI 提供了强大的数据绑定功能，允许您在 JSON 配置中动态引用数据。本指南将详细介绍数据绑定的语法、用法和高级特性。

## 基本语法

Fast-JSON-UI 使用 `${expression}` 语法进行数据绑定，其中 `expression` 可以是任何有效的 JavaScript 表达式。

### 简单绑定

最基本的数据绑定是直接引用数据对象中的属性：

```javascript
{
  type: 'text',
  text: '用户名: ${username}'  // 绑定到 data.username
}
```

### 嵌套属性访问

您可以访问嵌套对象的属性：

```javascript
{
  type: 'text',
  text: '城市: ${user.address.city}'  // 绑定到 data.user.address.city
}
```

### 数组访问

您可以访问数组元素：

```javascript
{
  type: 'text',
  text: '第一个项目: ${items[0].name}'  // 绑定到 data.items[0].name
}
```

## 表达式

数据绑定支持任何有效的 JavaScript 表达式：

### 条件表达式

```javascript
{
  type: 'text',
  text: '状态: ${isActive ? "活跃" : "非活跃"}'
}
```

### 字符串操作

```javascript
{
  type: 'text',
  text: '欢迎, ${firstName.toUpperCase()} ${lastName.toUpperCase()}'
}
```

### 数学运算

```javascript
{
  type: 'text',
  text: '总价: ${price * quantity} 元'
}
```

### 函数调用

```javascript
{
  type: 'text',
  text: '日期: ${new Date().toLocaleDateString()}'
}
```

## 链式属性访问

Fast-JSON-UI 支持安全的链式属性访问，即使中间属性为 `null` 或 `undefined`，也不会导致错误：

```javascript
{
  type: 'text',
  text: '详细信息: ${user.details.description || "无详细信息"}'
}
```

在上面的例子中，即使 `user` 或 `user.details` 为 `null` 或 `undefined`，也不会抛出错误，而是返回 `undefined`，然后通过 `||` 运算符提供默认值。

## 在不同属性中使用数据绑定

数据绑定可以用于组件的各种属性，不仅限于文本内容：

### 样式绑定

```javascript
{
  type: 'text',
  text: '重要消息',
  style: {
    color: '${isImportant ? "red" : "black"}',
    fontWeight: '${isImportant ? "bold" : "normal"}'
  }
}
```

### 条件渲染

```javascript
{
  type: 'text',
  text: '管理员信息',
  if: '${user.role === "admin"}'
}
```

### 属性绑定

```javascript
{
  type: 'image',
  src: '${user.avatarUrl}',
  alt: '${user.name}的头像'
}
```

## 在列表渲染中使用数据绑定

在列表渲染中，您可以访问当前项和索引：

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
        type: 'text',
        text: '价格: ${item.price} 元',
        style: {
          color: '${item.price > 100 ? "red" : "green"}'
        }
      }
    ]
  }
}
```

## 数据绑定与方法绑定结合

数据绑定可以与方法绑定结合使用：

```javascript
{
  type: 'button',
  text: '删除 ${item.name}',
  onClick: '@{deleteItem(${item.id})}'
}
```

## 处理复杂数据结构

### 对象遍历

您可以使用 `for...in` 遍历对象的属性：

```javascript
{
  type: 'column',
  for: '(value, key) in user',
  item: {
    type: 'text',
    text: '${key}: ${value}'
  }
}
```

### 数组过滤和映射

您可以在表达式中使用数组方法：

```javascript
{
  type: 'text',
  text: '完成的项目数: ${items.filter(item => item.completed).length}'
}
```

## 响应式数据

Fast-JSON-UI 与 Vue 的响应式系统完全集成。当绑定的数据发生变化时，UI 会自动更新：

```vue
<script setup>
import { ref } from 'vue';
import { FastJsonWidget } from 'fast-json-ui-vue';

const data = ref({
  counter: 0
});

const methods = ref({
  increment: () => {
    data.value.counter++;
  }
});

const config = ref({
  type: 'column',
  children: [
    {
      type: 'text',
      text: '计数器: ${counter}'
    },
    {
      type: 'button',
      text: '增加',
      onClick: '@{increment()}'
    }
  ]
});
</script>
```

## 最佳实践

### 使用默认值

为了处理可能为空的数据，使用默认值：

```javascript
{
  type: 'text',
  text: '描述: ${description || "无描述"}'
}
```

### 避免复杂表达式

虽然可以在绑定中使用复杂表达式，但为了可读性和可维护性，建议保持表达式简单：

```javascript
// 不推荐
{
  type: 'text',
  text: '${items.filter(i => i.price > 100).map(i => i.name).join(", ")}'
}

// 推荐：在数据或方法中预处理
{
  type: 'text',
  text: '${expensiveItemNames}'  // 在数据中预先计算
}
```

### 使用计算属性

对于复杂的数据转换，可以在 Vue 组件中使用计算属性，然后在 Fast-JSON-UI 中引用：

```vue
<script setup>
import { ref, computed } from 'vue';
import { FastJsonWidget } from 'fast-json-ui-vue';

const rawData = ref({
  items: [
    { id: 1, name: '项目 A', price: 120 },
    { id: 2, name: '项目 B', price: 80 },
    { id: 3, name: '项目 C', price: 150 }
  ]
});

// 计算属性
const data = computed(() => {
  return {
    items: rawData.value.items,
    expensiveItems: rawData.value.items.filter(i => i.price > 100),
    expensiveItemNames: rawData.value.items
      .filter(i => i.price > 100)
      .map(i => i.name)
      .join(', '),
    totalPrice: rawData.value.items.reduce((sum, i) => sum + i.price, 0)
  };
});

const config = ref({
  type: 'column',
  children: [
    {
      type: 'text',
      text: '昂贵的项目: ${expensiveItemNames}'
    },
    {
      type: 'text',
      text: '总价: ${totalPrice} 元'
    }
  ]
});
</script>
```

## 下一步

- [方法绑定](./method-binding.md) - 了解如何绑定和调用方法
- [条件渲染](./conditional-rendering.md) - 学习条件渲染的高级用法
- [列表渲染](./list-rendering.md) - 深入了解列表渲染的高级用法 