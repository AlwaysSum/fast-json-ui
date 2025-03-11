# 待办事项应用示例

本示例展示如何使用 Fast-JSON-UI 构建一个完整的待办事项管理应用，包括添加、编辑、删除、标记完成等功能。

## 目标

创建一个功能完整的待办事项应用，包括以下功能：

- 添加新的待办事项
- 编辑现有待办事项
- 删除待办事项
- 标记待办事项为已完成/未完成
- 显示待办事项完成进度
- 过滤待办事项（全部、已完成、未完成）

## 完整代码

```vue
<template>
  <div class="todo-app">
    <FastJsonWidget 
      :config="config" 
      :data="data" 
      :methods="methods"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { FastJsonWidget } from 'fast-json-ui-vue';

// 数据
const data = ref({
  todos: [
    { id: 1, text: '学习 Vue 3', completed: true },
    { id: 2, text: '学习 Fast-JSON-UI', completed: false },
    { id: 3, text: '构建待办事项应用', completed: false }
  ],
  newTodo: '',
  editingTodo: null,
  editText: '',
  filter: 'all' // 'all', 'active', 'completed'
});

// 计算属性
const filteredTodos = computed(() => {
  const filter = data.value.filter;
  if (filter === 'all') {
    return data.value.todos;
  } else if (filter === 'active') {
    return data.value.todos.filter(todo => !todo.completed);
  } else if (filter === 'completed') {
    return data.value.todos.filter(todo => todo.completed);
  }
  return data.value.todos;
});

const completedCount = computed(() => {
  return data.value.todos.filter(todo => todo.completed).length;
});

const totalCount = computed(() => {
  return data.value.todos.length;
});

const progress = computed(() => {
  if (totalCount.value === 0) return 0;
  return Math.round((completedCount.value / totalCount.value) * 100);
});

// 方法
const methods = ref({
  // 输入处理
  updateNewTodo(value) {
    data.value.newTodo = value;
  },
  
  updateEditText(value) {
    data.value.editText = value;
  },
  
  // 待办事项操作
  addTodo() {
    const text = data.value.newTodo.trim();
    if (!text) return;
    
    const newId = data.value.todos.length > 0 
      ? Math.max(...data.value.todos.map(t => t.id)) + 1 
      : 1;
      
    data.value.todos.push({
      id: newId,
      text: text,
      completed: false
    });
    
    data.value.newTodo = '';
  },
  
  removeTodo(id) {
    const index = data.value.todos.findIndex(todo => todo.id === id);
    if (index !== -1) {
      data.value.todos.splice(index, 1);
    }
  },
  
  toggleTodo(id) {
    const todo = data.value.todos.find(todo => todo.id === id);
    if (todo) {
      todo.completed = !todo.completed;
    }
  },
  
  startEditing(todo) {
    data.value.editingTodo = todo.id;
    data.value.editText = todo.text;
  },
  
  saveEdit() {
    if (!data.value.editingTodo) return;
    
    const todo = data.value.todos.find(todo => todo.id === data.value.editingTodo);
    if (todo && data.value.editText.trim()) {
      todo.text = data.value.editText.trim();
    }
    
    this.cancelEdit();
  },
  
  cancelEdit() {
    data.value.editingTodo = null;
    data.value.editText = '';
  },
  
  // 过滤操作
  setFilter(filter) {
    data.value.filter = filter;
  },
  
  // 批量操作
  markAllCompleted() {
    data.value.todos.forEach(todo => {
      todo.completed = true;
    });
  },
  
  clearCompleted() {
    data.value.todos = data.value.todos.filter(todo => !todo.completed);
  }
});

// UI 配置
const config = ref({
  type: 'column',
  style: {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  children: [
    // 标题
    {
      type: 'text',
      text: '待办事项应用',
      style: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '20px',
        textAlign: 'center'
      }
    },
    
    // 进度条
    {
      type: 'column',
      style: {
        marginBottom: '20px'
      },
      children: [
        {
          type: 'text',
          text: '进度: ${progress}% (${completedCount}/${totalCount})',
          style: {
            marginBottom: '5px'
          }
        },
        {
          type: 'row',
          style: {
            height: '10px',
            backgroundColor: '#eee',
            borderRadius: '5px',
            overflow: 'hidden'
          },
          children: [
            {
              type: 'column',
              style: {
                width: '${progress}%',
                height: '100%',
                backgroundColor: '#4caf50',
                transition: 'width 0.3s'
              }
            }
          ]
        }
      ]
    },
    
    // 添加新待办
    {
      type: 'row',
      style: {
        marginBottom: '20px'
      },
      children: [
        {
          type: 'input',
          placeholder: '添加新待办事项...',
          value: '${newTodo}',
          onInput: '@{updateNewTodo(${event.target.value})}',
          style: {
            flex: 1,
            padding: '10px',
            borderRadius: '4px 0 0 4px',
            border: '1px solid #ddd',
            borderRight: 'none'
          }
        },
        {
          type: 'button',
          text: '添加',
          onClick: '@{addTodo()}',
          style: {
            padding: '10px 15px',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '0 4px 4px 0',
            cursor: 'pointer'
          }
        }
      ]
    },
    
    // 过滤器
    {
      type: 'row',
      style: {
        marginBottom: '15px',
        gap: '10px'
      },
      children: [
        {
          type: 'button',
          text: '全部',
          onClick: '@{setFilter("all")}',
          style: {
            padding: '8px 12px',
            backgroundColor: '${filter === "all" ? "#4caf50" : "#f1f1f1"}',
            color: '${filter === "all" ? "white" : "black"}',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            flex: 1
          }
        },
        {
          type: 'button',
          text: '未完成',
          onClick: '@{setFilter("active")}',
          style: {
            padding: '8px 12px',
            backgroundColor: '${filter === "active" ? "#4caf50" : "#f1f1f1"}',
            color: '${filter === "active" ? "white" : "black"}',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            flex: 1
          }
        },
        {
          type: 'button',
          text: '已完成',
          onClick: '@{setFilter("completed")}',
          style: {
            padding: '8px 12px',
            backgroundColor: '${filter === "completed" ? "#4caf50" : "#f1f1f1"}',
            color: '${filter === "completed" ? "white" : "black"}',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            flex: 1
          }
        }
      ]
    },
    
    // 待办事项列表
    {
      type: 'column',
      style: {
        gap: '10px',
        marginBottom: '20px'
      },
      for: 'todo in filteredTodos',
      item: {
        type: 'column',
        children: [
          // 非编辑模式
          {
            type: 'row',
            if: '${editingTodo !== todo.id}',
            style: {
              padding: '12px 15px',
              backgroundColor: '${todo.completed ? "#f9fff9" : "#fff"}',
              border: '1px solid #ddd',
              borderRadius: '4px',
              alignItems: 'center'
            },
            children: [
              {
                type: 'button',
                text: '${todo.completed ? "✓" : "○"}',
                onClick: '@{toggleTodo(${todo.id})}',
                style: {
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  border: '${todo.completed ? "none" : "1px solid #ddd"}',
                  backgroundColor: '${todo.completed ? "#4caf50" : "transparent"}',
                  color: '${todo.completed ? "white" : "#666"}',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '10px',
                  cursor: 'pointer'
                }
              },
              {
                type: 'text',
                text: '${todo.text}',
                style: {
                  flex: 1,
                  textDecoration: '${todo.completed ? "line-through" : "none"}',
                  color: '${todo.completed ? "#888" : "#333"}'
                }
              },
              {
                type: 'row',
                style: {
                  gap: '5px'
                },
                children: [
                  {
                    type: 'button',
                    text: '编辑',
                    onClick: '@{startEditing(${todo})}',
                    style: {
                      padding: '5px 10px',
                      backgroundColor: '#f1f1f1',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }
                  },
                  {
                    type: 'button',
                    text: '删除',
                    onClick: '@{removeTodo(${todo.id})}',
                    style: {
                      padding: '5px 10px',
                      backgroundColor: '#ff5252',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }
                  }
                ]
              }
            ]
          },
          
          // 编辑模式
          {
            type: 'row',
            if: '${editingTodo === todo.id}',
            style: {
              padding: '12px 15px',
              backgroundColor: '#f9f9f9',
              border: '1px solid #ddd',
              borderRadius: '4px',
              alignItems: 'center'
            },
            children: [
              {
                type: 'input',
                value: '${editText}',
                onInput: '@{updateEditText(${event.target.value})}',
                style: {
                  flex: 1,
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  marginRight: '10px'
                }
              },
              {
                type: 'row',
                style: {
                  gap: '5px'
                },
                children: [
                  {
                    type: 'button',
                    text: '保存',
                    onClick: '@{saveEdit()}',
                    style: {
                      padding: '5px 10px',
                      backgroundColor: '#4caf50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }
                  },
                  {
                    type: 'button',
                    text: '取消',
                    onClick: '@{cancelEdit()}',
                    style: {
                      padding: '5px 10px',
                      backgroundColor: '#f1f1f1',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    
    // 底部操作
    {
      type: 'row',
      style: {
        justifyContent: 'space-between',
        marginTop: '10px'
      },
      children: [
        {
          type: 'button',
          text: '全部标记为已完成',
          onClick: '@{markAllCompleted()}',
          style: {
            padding: '8px 12px',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }
        },
        {
          type: 'button',
          text: '清除已完成',
          onClick: '@{clearCompleted()}',
          if: '${completedCount > 0}',
          style: {
            padding: '8px 12px',
            backgroundColor: '#ff5252',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }
        }
      ]
    }
  ]
});
</script>

<style scoped>
.todo-app {
  font-family: Arial, sans-serif;
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}
</style>
```

## 分步解析

### 1. 数据结构

首先，我们定义了应用所需的数据：

```javascript
const data = ref({
  todos: [
    { id: 1, text: '学习 Vue 3', completed: true },
    { id: 2, text: '学习 Fast-JSON-UI', completed: false },
    { id: 3, text: '构建待办事项应用', completed: false }
  ],
  newTodo: '',
  editingTodo: null,
  editText: '',
  filter: 'all' // 'all', 'active', 'completed'
});
```

- `todos`: 待办事项数组，每个项目包含 id、text 和 completed 属性
- `newTodo`: 新待办事项的输入文本
- `editingTodo`: 当前正在编辑的待办事项 ID
- `editText`: 编辑模式下的输入文本
- `filter`: 当前过滤器状态

### 2. 计算属性

我们使用计算属性来处理过滤和统计：

```javascript
const filteredTodos = computed(() => {
  const filter = data.value.filter;
  if (filter === 'all') {
    return data.value.todos;
  } else if (filter === 'active') {
    return data.value.todos.filter(todo => !todo.completed);
  } else if (filter === 'completed') {
    return data.value.todos.filter(todo => todo.completed);
  }
  return data.value.todos;
});

const completedCount = computed(() => {
  return data.value.todos.filter(todo => todo.completed).length;
});

const totalCount = computed(() => {
  return data.value.todos.length;
});

const progress = computed(() => {
  if (totalCount.value === 0) return 0;
  return Math.round((completedCount.value / totalCount.value) * 100);
});
```

### 3. 方法

我们定义了一系列方法来处理用户交互：

```javascript
const methods = ref({
  // 输入处理
  updateNewTodo(value) { /* ... */ },
  updateEditText(value) { /* ... */ },
  
  // 待办事项操作
  addTodo() { /* ... */ },
  removeTodo(id) { /* ... */ },
  toggleTodo(id) { /* ... */ },
  startEditing(todo) { /* ... */ },
  saveEdit() { /* ... */ },
  cancelEdit() { /* ... */ },
  
  // 过滤操作
  setFilter(filter) { /* ... */ },
  
  // 批量操作
  markAllCompleted() { /* ... */ },
  clearCompleted() { /* ... */ }
});
```

### 4. UI 配置

UI 配置使用 Fast-JSON-UI 的 JSON 结构定义：

- **整体布局**：使用列组件作为主容器
- **标题**：使用文本组件显示应用标题
- **进度条**：使用嵌套的行和列组件创建进度条
- **添加新待办**：使用行组件包含输入框和按钮
- **过滤器**：使用行组件包含三个过滤按钮
- **待办事项列表**：使用列组件和列表渲染显示待办事项
- **底部操作**：使用行组件包含批量操作按钮

## 关键技术点

1. **数据绑定**：使用 `${expression}` 语法绑定数据
   ```javascript
   text: '进度: ${progress}% (${completedCount}/${totalCount})'
   ```

2. **方法绑定**：使用 `@{methodName(args)}` 语法绑定方法
   ```javascript
   onClick: '@{toggleTodo(${todo.id})}'
   ```

3. **条件渲染**：使用 `if` 属性实现条件渲染
   ```javascript
   if: '${editingTodo !== todo.id}'
   ```

4. **列表渲染**：使用 `for` 和 `item` 属性实现列表渲染
   ```javascript
   for: 'todo in filteredTodos'
   ```

5. **动态样式**：使用数据绑定动态设置样式
   ```javascript
   backgroundColor: '${filter === "all" ? "#4caf50" : "#f1f1f1"}'
   ```

6. **计算属性**：使用 Vue 的计算属性处理数据转换
   ```javascript
   const filteredTodos = computed(() => { /* ... */ });
   ```

## 扩展思路

1. **本地存储**：添加本地存储功能，保存待办事项
   ```javascript
   // 在 mounted 钩子中加载数据
   onMounted(() => {
     const savedTodos = localStorage.getItem('todos');
     if (savedTodos) {
       data.value.todos = JSON.parse(savedTodos);
     }
   });
   
   // 在数据变化时保存
   watch(() => data.value.todos, (newTodos) => {
     localStorage.setItem('todos', JSON.stringify(newTodos));
   }, { deep: true });
   ```

2. **拖拽排序**：集成拖拽功能，允许用户重新排序待办事项

3. **分类标签**：添加标签功能，允许用户为待办事项添加分类标签

4. **截止日期**：添加截止日期功能，包括日期选择器和过期提醒

5. **搜索功能**：添加搜索框，允许用户搜索待办事项

6. **主题切换**：添加明暗主题切换功能

7. **导入/导出**：添加导入/导出功能，允许用户备份和恢复数据 