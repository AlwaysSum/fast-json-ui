# 按钮组件 (Button)

按钮组件用于创建可点击的按钮，支持事件处理和样式自定义。

## 基本用法

```javascript
{
  type: 'button',
  text: '点击我',
  onClick: '@{handleClick()}'
}
```

## 属性

| 属性名 | 类型 | 必需 | 描述 |
|-------|------|------|------|
| `type` | `string` | 是 | 必须为 `'button'` |
| `text` | `string` | 是 | 按钮显示的文本 |
| `onClick` | `string` | 否 | 点击事件处理方法 |
| `disabled` | `boolean` | 否 | 是否禁用按钮 |
| `style` | `object` | 否 | CSS 样式对象 |
| `class` | `string` | 否 | CSS 类名 |
| `if` | `string` | 否 | 条件表达式，决定是否渲染组件 |

## 事件处理

按钮组件支持通过 `@{methodName(args)}` 语法绑定事件处理方法：

```javascript
{
  type: 'button',
  text: '保存',
  onClick: '@{saveData()}'
}
```

## 数据绑定

按钮文本和事件处理方法都支持数据绑定：

```javascript
{
  type: 'button',
  text: '删除 ${item.name}',
  onClick: '@{deleteItem(${item.id})}'
}
```

## 条件禁用

可以使用数据绑定动态控制按钮的禁用状态：

```javascript
{
  type: 'button',
  text: '提交',
  onClick: '@{submitForm()}',
  disabled: '${!isFormValid}'
}
```

## 样式设置

可以通过 `style` 属性设置按钮样式：

```javascript
{
  type: 'button',
  text: '主要按钮',
  onClick: '@{handlePrimary()}',
  style: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  }
}
```

也可以使用动态样式：

```javascript
{
  type: 'button',
  text: '保存',
  onClick: '@{saveData()}',
  style: {
    backgroundColor: '${isSaving ? "#cccccc" : "#4CAF50"}',
    cursor: '${isSaving ? "not-allowed" : "pointer"}'
  }
}
```

## 条件渲染

可以使用 `if` 属性实现条件渲染：

```javascript
{
  type: 'button',
  text: '删除',
  onClick: '@{deleteItem()}',
  if: '${user.role === "admin"}'
}
```

## 示例

### 基本按钮

```javascript
{
  type: 'button',
  text: '点击我',
  onClick: '@{handleClick()}'
}
```

### 带样式的按钮

```javascript
{
  type: 'button',
  text: '提交',
  onClick: '@{submitForm()}',
  style: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px'
  }
}
```

### 带数据绑定的按钮

```javascript
{
  type: 'button',
  text: '${isEditing ? "保存" : "编辑"}',
  onClick: '@{${isEditing} ? saveItem() : editItem()}'
}
```

### 禁用状态的按钮

```javascript
{
  type: 'button',
  text: '提交',
  onClick: '@{submitForm()}',
  disabled: '${isSubmitting || !isFormValid}',
  style: {
    opacity: '${isSubmitting || !isFormValid ? 0.5 : 1}'
  }
}
```

### 带确认对话框的按钮

```javascript
{
  type: 'button',
  text: '删除',
  onClick: '@{confirmDelete(${item.id}, ${item.name})}',
  style: {
    backgroundColor: 'red',
    color: 'white'
  }
}
```

## 最佳实践

- 为按钮提供清晰的文本标签，表明点击后会发生什么
- 使用样式区分不同类型的按钮（主要、次要、危险等）
- 对于危险操作（如删除），添加确认步骤
- 在异步操作期间禁用按钮，防止重复提交
- 为禁用的按钮提供视觉反馈，如降低透明度
- 考虑按钮的大小和间距，确保在移动设备上易于点击 