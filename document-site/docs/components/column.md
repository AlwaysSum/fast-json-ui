# 列组件 (Column)

列组件是一个布局容器，用于垂直排列子组件。它是构建垂直布局的基础组件。

## 基本用法

```javascript
{
  type: 'column',
  children: [
    { type: 'text', text: '第一行' },
    { type: 'text', text: '第二行' },
    { type: 'text', text: '第三行' }
  ]
}
```

## 属性

| 属性名 | 类型 | 必需 | 描述 |
|-------|------|------|------|
| `type` | `string` | 是 | 必须为 `'column'` |
| `children` | `array` | 否 | 子组件数组 |
| `for` | `string` | 否 | 列表渲染表达式 |
| `item` | `object` | 否 | 列表渲染项模板 |
| `style` | `object` | 否 | CSS 样式对象 |
| `class` | `string` | 否 | CSS 类名 |
| `if` | `string` | 否 | 条件表达式，决定是否渲染组件 |
| `spacing` | `number` | 否 | 子组件之间的间距（像素） |

## 子组件

列组件通过 `children` 属性接收子组件数组：

```javascript
{
  type: 'column',
  children: [
    { type: 'text', text: '标题' },
    { type: 'button', text: '点击我' },
    { type: 'image', src: '/image.jpg' }
  ]
}
```

## 列表渲染

列组件支持列表渲染，可以根据数据数组动态生成子组件：

```javascript
{
  type: 'column',
  for: 'item in items',
  item: {
    type: 'text',
    text: '${item.name}'
  }
}
```

带索引的列表渲染：

```javascript
{
  type: 'column',
  for: '(item, index) in items',
  item: {
    type: 'text',
    text: '${index + 1}. ${item.name}'
  }
}
```

## 样式设置

可以通过 `style` 属性设置列组件的样式：

```javascript
{
  type: 'column',
  style: {
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    gap: '10px'  // 子组件间距
  },
  children: [
    { type: 'text', text: '第一行' },
    { type: 'text', text: '第二行' }
  ]
}
```

## 间距控制

可以使用 `spacing` 属性控制子组件之间的间距：

```javascript
{
  type: 'column',
  spacing: 20,  // 20像素的间距
  children: [
    { type: 'text', text: '第一行' },
    { type: 'text', text: '第二行' }
  ]
}
```

## 条件渲染

可以使用 `if` 属性实现条件渲染：

```javascript
{
  type: 'column',
  if: '${user.preferences.showDetails}',
  children: [
    { type: 'text', text: '详细信息' },
    { type: 'text', text: '创建时间: ${item.createdAt}' },
    { type: 'text', text: '修改时间: ${item.updatedAt}' }
  ]
}
```

## 示例

### 基本列布局

```javascript
{
  type: 'column',
  children: [
    {
      type: 'text',
      text: '用户信息',
      style: { fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }
    },
    {
      type: 'text',
      text: '姓名: ${user.name}'
    },
    {
      type: 'text',
      text: '邮箱: ${user.email}'
    },
    {
      type: 'text',
      text: '电话: ${user.phone}'
    }
  ]
}
```

### 带样式的列布局

```javascript
{
  type: 'column',
  style: {
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    maxWidth: '500px'
  },
  children: [
    {
      type: 'text',
      text: '联系我们',
      style: { fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }
    },
    {
      type: 'input',
      placeholder: '您的姓名',
      value: '${name}',
      onInput: '@{updateName(${event.target.value})}'
    },
    {
      type: 'input',
      placeholder: '您的邮箱',
      value: '${email}',
      onInput: '@{updateEmail(${event.target.value})}'
    },
    {
      type: 'button',
      text: '提交',
      onClick: '@{submitForm()}',
      style: { marginTop: '20px' }
    }
  ]
}
```

### 列表渲染示例

```javascript
{
  type: 'column',
  style: { gap: '10px' },
  for: 'item in todoItems',
  item: {
    type: 'row',
    style: {
      padding: '10px',
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
      }
    ]
  }
}
```

### 嵌套列布局

```javascript
{
  type: 'column',
  style: { padding: '20px' },
  children: [
    {
      type: 'text',
      text: '嵌套布局示例',
      style: { fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }
    },
    {
      type: 'column',
      style: {
        backgroundColor: '#f0f0f0',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px'
      },
      children: [
        {
          type: 'text',
          text: '第一部分',
          style: { fontWeight: 'bold' }
        },
        {
          type: 'text',
          text: '这是第一部分的内容。'
        }
      ]
    },
    {
      type: 'column',
      style: {
        backgroundColor: '#e6f7ff',
        padding: '15px',
        borderRadius: '8px'
      },
      children: [
        {
          type: 'text',
          text: '第二部分',
          style: { fontWeight: 'bold' }
        },
        {
          type: 'text',
          text: '这是第二部分的内容。'
        }
      ]
    }
  ]
}
```

## 最佳实践

- 使用列组件创建垂直流动的布局
- 为了更好的间距控制，使用 `spacing` 属性或在样式中设置 `gap`
- 对于需要响应式布局的情况，考虑在样式中使用百分比或 flex 布局
- 使用列表渲染处理重复的内容结构
- 嵌套列组件和行组件可以创建复杂的布局结构 