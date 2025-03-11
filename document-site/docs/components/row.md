# 行组件 (Row)

行组件是一个布局容器，用于水平排列子组件。它是构建水平布局的基础组件。

## 基本用法

```javascript
{
  type: 'row',
  children: [
    { type: 'text', text: '左侧' },
    { type: 'text', text: '中间' },
    { type: 'text', text: '右侧' }
  ]
}
```

## 属性

| 属性名 | 类型 | 必需 | 描述 |
|-------|------|------|------|
| `type` | `string` | 是 | 必须为 `'row'` |
| `children` | `array` | 否 | 子组件数组 |
| `for` | `string` | 否 | 列表渲染表达式 |
| `item` | `object` | 否 | 列表渲染项模板 |
| `style` | `object` | 否 | CSS 样式对象 |
| `class` | `string` | 否 | CSS 类名 |
| `if` | `string` | 否 | 条件表达式，决定是否渲染组件 |
| `spacing` | `number` | 否 | 子组件之间的间距（像素） |
| `align` | `string` | 否 | 垂直对齐方式，可选值：'start', 'center', 'end' |
| `justify` | `string` | 否 | 水平对齐方式，可选值：'start', 'center', 'end', 'space-between', 'space-around' |

## 子组件

行组件通过 `children` 属性接收子组件数组：

```javascript
{
  type: 'row',
  children: [
    { type: 'button', text: '取消' },
    { type: 'button', text: '确认' }
  ]
}
```

## 列表渲染

行组件支持列表渲染，可以根据数据数组动态生成子组件：

```javascript
{
  type: 'row',
  for: 'tab in tabs',
  item: {
    type: 'button',
    text: '${tab.label}',
    onClick: '@{selectTab(${tab.id})}'
  }
}
```

## 样式设置

可以通过 `style` 属性设置行组件的样式：

```javascript
{
  type: 'row',
  style: {
    padding: '10px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    gap: '10px'  // 子组件间距
  },
  children: [
    { type: 'text', text: '左侧' },
    { type: 'text', text: '右侧' }
  ]
}
```

## 间距控制

可以使用 `spacing` 属性控制子组件之间的间距：

```javascript
{
  type: 'row',
  spacing: 20,  // 20像素的间距
  children: [
    { type: 'button', text: '上一步' },
    { type: 'button', text: '下一步' }
  ]
}
```

## 对齐方式

可以使用 `align` 和 `justify` 属性控制子组件的对齐方式：

```javascript
{
  type: 'row',
  align: 'center',  // 垂直居中
  justify: 'space-between',  // 水平两端对齐
  style: { height: '50px' },
  children: [
    { type: 'text', text: '左侧' },
    { type: 'text', text: '右侧' }
  ]
}
```

## 条件渲染

可以使用 `if` 属性实现条件渲染：

```javascript
{
  type: 'row',
  if: '${showActions}',
  children: [
    { type: 'button', text: '编辑', onClick: '@{editItem()}' },
    { type: 'button', text: '删除', onClick: '@{deleteItem()}' }
  ]
}
```

## 示例

### 基本行布局

```javascript
{
  type: 'row',
  children: [
    {
      type: 'text',
      text: '用户名:',
      style: { width: '100px' }
    },
    {
      type: 'text',
      text: '${user.name}'
    }
  ]
}
```

### 带样式的行布局

```javascript
{
  type: 'row',
  style: {
    padding: '15px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '10px'
  },
  children: [
    {
      type: 'image',
      src: '${user.avatar}',
      style: { width: '50px', height: '50px', borderRadius: '50%', marginRight: '15px' }
    },
    {
      type: 'column',
      children: [
        {
          type: 'text',
          text: '${user.name}',
          style: { fontWeight: 'bold', fontSize: '16px' }
        },
        {
          type: 'text',
          text: '${user.email}',
          style: { color: '#666', fontSize: '14px' }
        }
      ]
    }
  ]
}
```

### 对齐方式示例

```javascript
{
  type: 'row',
  align: 'center',
  justify: 'space-between',
  style: {
    padding: '10px',
    backgroundColor: '#f0f0f0',
    borderRadius: '4px',
    height: '60px'
  },
  children: [
    {
      type: 'text',
      text: '标题',
      style: { fontWeight: 'bold', fontSize: '18px' }
    },
    {
      type: 'row',
      children: [
        {
          type: 'button',
          text: '取消',
          style: { marginRight: '10px' }
        },
        {
          type: 'button',
          text: '确认'
        }
      ]
    }
  ]
}
```

### 响应式布局示例

```javascript
{
  type: 'row',
  style: {
    flexWrap: 'wrap',
    gap: '10px'
  },
  children: [
    {
      type: 'column',
      style: {
        flex: '1 1 200px',
        padding: '15px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px'
      },
      children: [
        {
          type: 'text',
          text: '第一部分',
          style: { fontWeight: 'bold', marginBottom: '10px' }
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
        flex: '1 1 200px',
        padding: '15px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px'
      },
      children: [
        {
          type: 'text',
          text: '第二部分',
          style: { fontWeight: 'bold', marginBottom: '10px' }
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

### 表单行示例

```javascript
{
  type: 'column',
  style: { gap: '15px' },
  children: [
    {
      type: 'row',
      align: 'center',
      children: [
        {
          type: 'text',
          text: '用户名:',
          style: { width: '100px' }
        },
        {
          type: 'input',
          placeholder: '请输入用户名',
          value: '${username}',
          onInput: '@{updateUsername(${event.target.value})}'
        }
      ]
    },
    {
      type: 'row',
      align: 'center',
      children: [
        {
          type: 'text',
          text: '密码:',
          style: { width: '100px' }
        },
        {
          type: 'input',
          placeholder: '请输入密码',
          value: '${password}',
          onInput: '@{updatePassword(${event.target.value})}'
        }
      ]
    },
    {
      type: 'row',
      justify: 'flex-end',
      style: { marginTop: '20px' },
      children: [
        {
          type: 'button',
          text: '登录',
          onClick: '@{login()}'
        }
      ]
    }
  ]
}
```

## 最佳实践

- 使用行组件创建水平流动的布局
- 使用 `align` 和 `justify` 属性控制子组件的对齐方式
- 为了更好的间距控制，使用 `spacing` 属性或在样式中设置 `gap`
- 对于需要响应式布局的情况，考虑在样式中使用 `flexWrap: 'wrap'` 和 flex 布局
- 嵌套行组件和列组件可以创建复杂的布局结构
- 对于表单布局，使用行组件来对齐标签和输入框 