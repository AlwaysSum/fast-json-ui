# Fast-JSON-UI-Vue

Fast-JSON-UI-Vue 是一个基于 Vue 3 的库，用于将 JSON 配置转换为 UI 组件。通过简单的 JSON 配置，您可以快速构建复杂的用户界面，无需编写大量的 HTML 和 CSS 代码。

[https://alwayssum.github.io/fast-json-ui/](https://alwayssum.github.io/fast-json-ui/)

## 特色功能

- **JSON 转 UI 组件**：通过 JSON 配置快速生成 Vue 组件
- **动态数据绑定**：支持变量和方法的动态绑定
- **自定义组件扩展**：轻松扩展自己的自定义组件
- **灵活的布局系统**：支持行、列、堆叠等多种布局方式
- **链式属性访问**：支持 `user.name` 或 `array.1.name` 这样的链式属性访问
- **现代 Vue 3 支持**：同时提供 Options API 和 Composition API（script setup）组件
- **类型安全**：完整的 TypeScript 类型支持

## 安装

```bash
npm install fast-json-ui-vue
```

## 基本用法

### 快速开始

```vue
<template>
  <div>
    <FastJsonWidget 
      :config="config" 
      :data="configData" 
      :methods="configMethods">
    </FastJsonWidget>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { FastJsonWidget } from 'fast-json-ui-vue';

const configData = ref({
  "name": "张三",
  "age": 28
});

const configMethods = ref({
  "sayHello": (name: string) => {
    alert(`你好，${name}！`);
  }
});

const config = ref({
  type: "column",
  children: [
    {
      type: "text",
      text: "用户名: ${name}"
    },
    {
      type: "text",
      text: "年龄: ${age}"
    },
    {
      type: "button",
      text: "打招呼",
      onClick: "@{sayHello(${name})}"
    }
  ]
});
</script>
```

### 使用自定义组件

```vue
<template>
  <div>
    <FastJsonWidget 
      :config="config" 
      :data="configData" 
      :methods="configMethods">
      <template #default="{ child }">
        <FastCustomWidget 
          :config="child" 
          :data="configData" 
          :methods="configMethods">
        </FastCustomWidget>
      </template>
    </FastJsonWidget>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { FastJsonWidget, FastCustomWidget, registerComponent } from 'fast-json-ui-vue';
import MyCustomCard from './components/MyCustomCard.vue';

// 注册自定义组件
onMounted(() => {
  registerComponent('CustomCard', MyCustomCard);
});

const config = ref({
  type: "column",
  children: [
    {
      type: "text",
      text: "标准组件"
    },
    {
      type: "CustomCard",
      title: "自定义卡片",
      content: "这是一个自定义卡片组件"
    }
  ]
});
</script>
```

### 使用 Composition API 组件

库提供了 Options API 和 Composition API 两种风格的组件：

- `FastJsonWidget` 和 `FastCustomWidget`：Options API 组件
- `FastJsonWidgetSetup` 和 `FastCustomWidgetSetup`：使用 `<script setup>` 的 Composition API 组件

```vue
<template>
  <div>
    <FastJsonWidgetSetup 
      :config="config" 
      :data="configData" 
      :methods="configMethods">
    </FastJsonWidgetSetup>
  </div>
</template>
```

## JSON 配置格式

```json
{
  "type": "string",  // 组件类型（必需）
  "children": [],    // 子组件数组（用于父组件）
  "child": {},       // 单个子组件（用于容器组件）
  ...                // 其他特定于组件类型的属性
}
```

## 数据绑定

使用 `${variableName}` 语法绑定变量：

```json
{
  "type": "text",
  "text": "你好，${name}"
}
```

支持链式属性访问：

```json
{
  "type": "text",
  "text": "城市：${user.address.city}"
}
```

支持数组索引访问：

```json
{
  "type": "text",
  "text": "第一项：${items.0.title}"
}
```

## 方法绑定

使用 `@{methodName(args)}` 语法绑定方法：

```json
{
  "type": "button",
  "text": "点击我",
  "onClick": "@{handleClick(${name})}"
}
```

## 已实现的组件

### 基础组件

| 组件类型 | 描述 | 主要属性 |
|---------|------|---------|
| `text` | 文本组件 | `text`: 显示的文本内容 |
| `image` | 图片组件 | `src`: 图片源地址<br>`alt`: 替代文本 |
| `button` | 按钮组件 | `text`: 按钮文本<br>`onClick`: 点击事件 |
| `test` | 测试组件 | 用于调试，显示数据对象 |

### 布局组件

| 组件类型 | 描述 | 主要属性 |
|---------|------|---------|
| `container` | 容器组件 | `children`: 子组件数组 |
| `row` | 行布局组件 | `children`: 子组件数组<br>水平排列子组件 |
| `column` | 列布局组件 | `children`: 子组件数组<br>垂直排列子组件 |
| `stack` | 堆叠布局组件 | `children`: 子组件数组<br>堆叠排列子组件 |

### 通用属性

所有组件都支持以下通用属性：

- `width`: 组件宽度
- `height`: 组件高度
- `color`: 背景颜色
- `padding`: 内边距
- `margin`: 外边距

## 计划中待实现的组件

### 基础组件

- `input`: 输入框组件
- `select`: 选择器组件
- `checkbox`: 复选框组件
- `radio`: 单选框组件
- `switch`: 开关组件
- `label`: 标签组件
- `link`: 链接组件
- `icon`: 图标组件

### 布局组件

- `grid`: 网格布局组件
- `card`: 卡片组件
- `tabs`: 标签页组件
- `collapse`: 折叠面板组件
- `divider`: 分割线组件
- `spacer`: 间距组件

### 高级组件

- `table`: 表格组件
- `list`: 列表组件
- `modal`: 弹窗组件
- `form`: 表单组件

## 自定义组件开发

创建自己的自定义组件：

```vue
<template>
  <div v-if="config.type === 'CustomType'" class="custom-component">
    {{ getValueFromConfig(config.text) }}
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { BaseConfig, ConfigData, ConfigMethods, getValueFromConfig } from 'fast-json-ui-vue';

const props = defineProps({
  config: {
    type: Object as PropType<BaseConfig>,
    required: true
  },
  data: {
    type: Object as PropType<ConfigData>,
    default: () => ({})
  },
  methods: {
    type: Object as PropType<ConfigMethods>,
    default: () => ({})
  }
});

const getValueFromConfig = (value: any): any => {
  if (typeof value !== 'string') {
    return value;
  }
  
  return FastJsonUI.getValueFromConfig(value, props.data, props.methods);
};
</script>
```

注册自定义组件：

```javascript
import { registerComponent } from 'fast-json-ui-vue';
import MyCustomComponent from './MyCustomComponent.vue';

// 单个注册
registerComponent('CustomType', MyCustomComponent);

// 批量注册
registerMultipleComponents({
  'CustomType1': MyCustomComponent1,
  'CustomType2': MyCustomComponent2
});
```

## 演示

库包含一个演示应用程序，展示其功能。要运行演示：

1. 克隆仓库
2. 安装依赖：
   ```bash
   npm install
   ```
3. 运行演示：
   ```bash
   npm run dev
   ```

演示允许您：
- 实时编辑 JSON 配置
- 更新数据绑定
- 查看生成的 UI 组件

## 开发

### 项目设置

```bash
npm install
```

### 编译和热重载以进行开发

```bash
npm run dev
```

### 类型检查、编译和最小化生产

```bash
npm run build
```

### 使用 ESLint 进行代码检查

```bash
npm run lint
```

## 许可证

MIT 