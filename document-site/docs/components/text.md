# 文本组件 (Text)

文本组件用于显示文本内容，支持静态文本和动态数据绑定。

## 基本用法

```javascript
{
  type: 'text',
  text: '这是一段文本'
}
```

## 属性

| 属性名 | 类型 | 必需 | 描述 |
|-------|------|------|------|
| `type` | `string` | 是 | 必须为 `'text'` |
| `text` | `string` | 是 | 要显示的文本内容 |
| `style` | `object` | 否 | CSS 样式对象 |
| `class` | `string` | 否 | CSS 类名 |
| `if` | `string` | 否 | 条件表达式，决定是否渲染组件 |

## 数据绑定

文本组件支持通过 `${expression}` 语法绑定动态数据：

```javascript
{
  type: 'text',
  text: '用户名: ${username}'
}
```

## 条件表达式

可以在文本中使用条件表达式：

```javascript
{
  type: 'text',
  text: '状态: ${isActive ? "活跃" : "非活跃"}'
}
```

## 样式设置

可以通过 `style` 属性设置文本样式：

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

也可以使用动态样式：

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

可以使用 `if` 属性实现条件渲染：

```javascript
{
  type: 'text',
  text: '仅管理员可见',
  if: '${user.role === "admin"}'
}
```

## 示例

### 基本示例

```javascript
{
  type: 'text',
  text: '这是一段普通文本'
}
```

### 带样式的文本

```javascript
{
  type: 'text',
  text: '这是一段带样式的文本',
  style: {
    color: 'blue',
    fontSize: '20px',
    fontWeight: 'bold',
    textDecoration: 'underline'
  }
}
```

### 数据绑定示例

```javascript
{
  type: 'text',
  text: '欢迎，${user.name}！您有 ${notifications.length} 条未读消息。'
}
```

### 条件渲染示例

```javascript
{
  type: 'text',
  text: '您的账户余额: ${balance} 元',
  if: '${isLoggedIn}',
  style: {
    color: '${balance < 100 ? "red" : "green"}'
  }
}
```

### 复杂格式化示例

```javascript
{
  type: 'text',
  text: '上次登录时间: ${new Date(lastLoginTime).toLocaleString()}',
  style: {
    fontSize: '12px',
    color: 'gray'
  }
}
```

## 最佳实践

- 对于简单的文本显示，直接使用文本组件
- 对于复杂的格式化文本，考虑在数据或方法中预处理，然后在文本组件中引用
- 使用样式属性来调整文本的外观，而不是创建多个文本组件
- 对于需要频繁更新的文本，确保绑定的数据是响应式的 