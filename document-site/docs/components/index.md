# 组件

Fast-JSON-UI 提供了一系列内置组件，用于构建用户界面。这些组件可以通过 JSON 配置进行组合和配置，以创建复杂的 UI 布局。

## 基础组件

基础组件是构建用户界面的基本元素：

- [文本组件 (Text)](./text.md) - 显示文本内容
- [按钮组件 (Button)](./button.md) - 可点击的按钮
- [图片组件 (Image)](./image.md) - 显示图片
- [输入组件 (Input)](./input.md) - 文本输入框

## 布局组件

布局组件用于组织和排列其他组件：

- [容器组件 (Container)](./container.md) - 通用容器
- [行组件 (Row)](./row.md) - 水平排列子组件
- [列组件 (Column)](./column.md) - 垂直排列子组件
- [堆叠组件 (Stack)](./stack.md) - 堆叠子组件

## 组件属性

所有组件都支持以下通用属性：

| 属性名 | 类型 | 描述 |
|-------|------|------|
| `type` | `string` | 组件类型（必需） |
| `if` | `string` | 条件表达式，决定是否渲染组件 |
| `for` | `string` | 列表渲染表达式 |
| `item` | `object` | 列表渲染项模板 |
| `style` | `object` | CSS 样式对象 |
| `class` | `string` | CSS 类名 |
| `id` | `string` | 组件 ID |

## 组件示例

以下是一个组合使用多种组件的示例：

```javascript
{
  type: 'column',
  style: { padding: '20px' },
  children: [
    {
      type: 'text',
      text: '欢迎使用 Fast-JSON-UI',
      style: { fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }
    },
    {
      type: 'row',
      style: { marginBottom: '20px' },
      children: [
        {
          type: 'image',
          src: '/logo.png',
          alt: 'Logo',
          style: { width: '100px', marginRight: '20px' }
        },
        {
          type: 'text',
          text: 'Fast-JSON-UI 是一个强大的 JSON 驱动的 UI 库，可以帮助您快速构建动态用户界面。'
        }
      ]
    },
    {
      type: 'input',
      placeholder: '输入您的名称',
      value: '${username}',
      onInput: '@{updateUsername(${event.target.value})}'
    },
    {
      type: 'button',
      text: '点击我',
      onClick: '@{handleClick()}',
      style: { marginTop: '10px' }
    }
  ]
}
```

## 自定义组件

除了内置组件外，Fast-JSON-UI 还支持注册和使用自定义组件。详情请参阅[自定义组件](../guide/custom-components.md)指南。 