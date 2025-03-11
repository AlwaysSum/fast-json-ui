# 方法绑定

Fast-JSON-UI 提供了强大的方法绑定功能，允许您在 JSON 配置中引用和调用方法。本指南将详细介绍方法绑定的语法、用法和高级特性。

## 基本语法

Fast-JSON-UI 使用 `@{methodName(args)}` 语法进行方法绑定，其中 `methodName` 是方法对象中的方法名，`args` 是传递给方法的参数。

### 简单方法调用

最基本的方法绑定是直接调用方法对象中的方法：

```javascript
{
  type: 'button',
  text: '点击我',
  onClick: '@{handleClick()}'  // 调用 methods.handleClick 方法
}
```

### 带参数的方法调用

您可以向方法传递参数：

```javascript
{
  type: 'button',
  text: '删除',
  onClick: '@{deleteItem(123)}'  // 调用 methods.deleteItem 方法，并传入参数 123
}
```

## 与数据绑定结合

方法绑定可以与数据绑定结合使用，将数据作为参数传递给方法：

```javascript
{
  type: 'button',
  text: '删除',
  onClick: '@{deleteItem(${item.id})}'  // 调用 methods.deleteItem 方法，并传入 data.item.id 作为参数
}
```

### 多个参数

您可以传递多个参数：

```javascript
{
  type: 'button',
  text: '添加到购物车',
  onClick: '@{addToCart(${item.id}, ${item.name}, ${quantity})}'
}
```

### 字符串参数

对于字符串参数，您可以使用单引号或反引号：

```javascript
{
  type: 'button',
  text: '问候',
  onClick: '@{greet("你好")}'
}
```

结合数据绑定：

```javascript
{
  type: 'button',
  text: '问候',
  onClick: '@{greet(`你好，${username}`)}'
}
```

## 在不同事件中使用方法绑定

方法绑定可以用于各种事件属性：

### 点击事件

```javascript
{
  type: 'button',
  text: '点击我',
  onClick: '@{handleClick()}'
}
```

### 输入事件

```javascript
{
  type: 'input',
  placeholder: '输入名称',
  onInput: '@{updateName(${event.target.value})}'
}
```

### 自定义事件

```javascript
{
  type: 'CustomComponent',
  onCustomEvent: '@{handleCustomEvent(${eventData})}'
}
```

## 在列表渲染中使用方法绑定

在列表渲染中，您可以结合当前项和索引调用方法：

```javascript
{
  type: 'column',
  for: '(item, index) in items',
  item: {
    type: 'row',
    children: [
      {
        type: 'text',
        text: '${item.name}'
      },
      {
        type: 'button',
        text: '删除',
        onClick: '@{removeItem(${index})}'
      },
      {
        type: 'button',
        text: '编辑',
        onClick: '@{editItem(${item.id}, ${item.name})}'
      }
    ]
  }
}
```

## 方法链式调用

您可以在方法绑定中使用链式调用：

```javascript
{
  type: 'button',
  text: '处理并保存',
  onClick: '@{processData().then(saveData)}'
}
```

## 方法返回值处理

方法的返回值可以在 UI 中使用：

```javascript
{
  type: 'text',
  text: '计算结果: ${calculateResult()}'  // 调用 methods.calculateResult 方法并显示其返回值
}
```

## 异步方法

Fast-JSON-UI 支持异步方法，您可以在方法中使用 `async/await` 或 Promise：

```javascript
// 在 methods 对象中定义异步方法
const methods = ref({
  async fetchData() {
    const response = await fetch('/api/data');
    const data = await response.json();
    // 更新数据
    this.data.value.items = data.items;
  }
});

// 在配置中使用
const config = {
  type: 'button',
  text: '加载数据',
  onClick: '@{fetchData()}'
};
```

## 方法上下文

在方法内部，您可以访问组件的数据和其他方法：

```javascript
const data = ref({
  counter: 0
});

const methods = ref({
  increment() {
    // 访问和修改数据
    data.value.counter++;
  },
  reset() {
    data.value.counter = 0;
  },
  incrementAndReset() {
    // 调用其他方法
    this.increment();
    if (data.value.counter > 10) {
      this.reset();
    }
  }
});
```

## 事件对象

在某些事件处理方法中，您可以访问原生事件对象：

```javascript
{
  type: 'input',
  placeholder: '输入文本',
  onInput: '@{handleInput(${event})}'  // event 是原生 DOM 事件对象
}
```

在方法中处理事件对象：

```javascript
const methods = ref({
  handleInput(event) {
    console.log('输入值:', event.target.value);
    data.value.inputText = event.target.value;
  }
});
```

## 条件方法调用

您可以结合条件表达式调用方法：

```javascript
{
  type: 'button',
  text: '保存',
  onClick: '@{${isValid} ? saveData() : showError("数据无效")}'
}
```

## 最佳实践

### 保持方法简单明了

为了提高可维护性，建议保持方法简单明了，每个方法只负责一个特定的功能：

```javascript
// 推荐
const methods = ref({
  updateUsername(username) {
    data.value.username = username;
  },
  validateUsername(username) {
    return username.length >= 3;
  },
  saveUsername(username) {
    if (this.validateUsername(username)) {
      this.updateUsername(username);
      return true;
    }
    return false;
  }
});
```

### 使用命名约定

为了提高代码可读性，建议使用一致的命名约定：

- 使用动词开头的名称（如 `handleClick`、`updateData`、`fetchItems`）
- 对于事件处理程序，使用 `handle` 或 `on` 前缀（如 `handleSubmit`、`onUserLogin`）
- 对于数据操作，使用描述性动词（如 `addItem`、`removeUser`、`updateProfile`）

### 错误处理

在方法中添加适当的错误处理：

```javascript
const methods = ref({
  async fetchData() {
    try {
      const response = await fetch('/api/data');
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      this.data.value.items = data.items;
    } catch (error) {
      console.error('获取数据失败:', error);
      this.data.value.error = error.message;
    } finally {
      this.data.value.loading = false;
    }
  }
});
```

## 完整示例

下面是一个综合示例，展示了 Fast-JSON-UI 中方法绑定的多种用法：

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
  username: '',
  items: [
    { id: 1, name: '项目 A', completed: false },
    { id: 2, name: '项目 B', completed: true }
  ],
  newItemName: '',
  error: null,
  loading: false
});

const methods = ref({
  // 表单处理
  updateUsername(value) {
    data.value.username = value;
  },
  
  updateNewItemName(value) {
    data.value.newItemName = value;
  },
  
  // 项目操作
  addItem() {
    if (!data.value.newItemName.trim()) {
      this.showError('项目名称不能为空');
      return;
    }
    
    const newId = Math.max(0, ...data.value.items.map(i => i.id)) + 1;
    data.value.items.push({
      id: newId,
      name: data.value.newItemName,
      completed: false
    });
    data.value.newItemName = '';
    this.clearError();
  },
  
  toggleItem(id) {
    const item = data.value.items.find(item => item.id === id);
    if (item) {
      item.completed = !item.completed;
    }
  },
  
  removeItem(index) {
    if (confirm(`确定要删除 "${data.value.items[index].name}" 吗？`)) {
      data.value.items.splice(index, 1);
    }
  },
  
  // 错误处理
  showError(message) {
    data.value.error = message;
    // 3秒后自动清除错误
    setTimeout(() => this.clearError(), 3000);
  },
  
  clearError() {
    data.value.error = null;
  },
  
  // 数据计算
  getCompletedCount() {
    return data.value.items.filter(item => item.completed).length;
  },
  
  getTotalCount() {
    return data.value.items.length;
  },
  
  // 异步操作
  async saveItems() {
    data.value.loading = true;
    try {
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('保存项目:', data.value.items);
      alert('保存成功！');
    } catch (error) {
      this.showError('保存失败: ' + error.message);
    } finally {
      data.value.loading = false;
    }
  }
});

const config = ref({
  type: 'column',
  style: { padding: '20px', maxWidth: '500px', margin: '0 auto' },
  children: [
    {
      type: 'text',
      text: '待办事项应用',
      style: { fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }
    },
    {
      type: 'text',
      text: '欢迎，${username || "访客"}',
      style: { marginBottom: '10px' }
    },
    {
      type: 'row',
      style: { marginBottom: '20px' },
      children: [
        {
          type: 'input',
          placeholder: '输入您的名称',
          value: '${username}',
          onInput: '@{updateUsername(${event.target.value})}'
        }
      ]
    },
    {
      type: 'text',
      text: '${error}',
      if: '${error !== null}',
      style: { color: 'red', marginBottom: '10px' }
    },
    {
      type: 'row',
      style: { marginBottom: '10px' },
      children: [
        {
          type: 'input',
          placeholder: '添加新项目',
          value: '${newItemName}',
          onInput: '@{updateNewItemName(${event.target.value})}'
        },
        {
          type: 'button',
          text: '添加',
          onClick: '@{addItem()}'
        }
      ]
    },
    {
      type: 'text',
      text: '进度: ${getCompletedCount()} / ${getTotalCount()}',
      style: { marginBottom: '10px' }
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
            text: '${item.name}',
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
    },
    {
      type: 'button',
      text: '${loading ? "保存中..." : "保存项目"}',
      onClick: '@{saveItems()}',
      style: { marginTop: '20px' }
    }
  ]
});
</script>
```

## 下一步

- [数据绑定](./data-binding.md) - 深入了解数据绑定机制
- [条件渲染](./conditional-rendering.md) - 学习条件渲染的高级用法
- [列表渲染](./list-rendering.md) - 深入了解列表渲染的高级用法 