<template>
  <div
    class="component-wrapper"
    :class="{
      'is-selected': config.isSelected,
      'is-editor': config.isEditor,
      'is-hoverable': config.isEditor && !config.isSelected,
      'is-layout': hasChildren || hasSingleChild,
      'is-drag-over': isDragOver && hasChildren,
    }"
    @click.stop="selectComponent"
    @mouseenter="setHovered(true)"
    @mouseleave="setHovered(false)"
  >
    <!-- 编辑模式下的操作按钮 -->
    <div class="component-actions" v-if="config.isEditor && config.isSelected">
      <button @click.stop="removeComponent">删除</button>
      <button @click.stop="moveUp" v-if="canMoveUp">上移</button>
      <button @click.stop="moveDown" v-if="canMoveDown">下移</button>
    </div>

    <div class="component-content">
      <!-- 布局型组件支持拖拽接收 -->
      <div
        v-if="hasChildren"
        class="drop-container"
        @dragenter="onDragEnter"
        @dragleave="onDragLeave"
        @dragover="onDragOver"
        @drop="onDropToContainer"
      >
        <fast-json-widget
          :config="props.config.child"
          :data="props.data"
          :methods="props.methods"
        />
      </div>
      <template v-else>
        <fast-json-widget
          :config="props.config.child"
          :data="props.data"
          :methods="props.methods"
        />
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, PropType } from "vue";
import {
  BaseConfig,
  callFunction,
  ComponentConfig,
  ConfigData,
  ConfigMethods,
} from "fast-json-ui-vue";
import { FastJsonWidget } from "fast-json-ui-vue";

// Props
const props = defineProps({
  config: {
    type: Object as PropType<BaseConfig>,
    required: true,
  },
  data: {
    type: Object as PropType<ConfigData>,
    default: () => ({}),
  },
  methods: {
    type: Object as PropType<ConfigMethods>,
    default: () => ({}),
  },
});

// Emits
const emit = defineEmits(["select", "update", "remove", "move"]);

// 悬停状态
const isHovered = ref(false);

// 拖拽覆盖状态
const isDragOver = ref(false);

// 设置悬停状态
function setHovered(hovered: boolean) {
  isHovered.value = hovered;
}

// 子组件列表（用于布局组件）
const childrenComponents = ref<ComponentConfig[]>(
  props.config.children ? [...props.config.children] : []
);

// 监听子组件变化
watch(
  childrenComponents,
  (newChildren: ComponentConfig[]) => {
    if (hasChildren.value) {
      const updatedConfig = { ...props.config, children: newChildren };
      // emit("update", updatedConfig, props.config.path);
      callFunction(
        props.config.onUpdate,
        {
          config: updatedConfig,
          path: props.config.path,
        },
        props.methods
      );
    }
  },
  { deep: true }
);

// 判断是否有多个子组件布局
const hasChildren = computed(() => {
  return Array.isArray(props.config.children);
});

// 判断是否有单个子组件布局
const hasSingleChild = computed(() => {
  return "child" in props.config;
});

// 是否可以上移
const canMoveUp = computed(() => {
  return props.config.index > 0;
});

// 是否可以下移
const canMoveDown = computed(() => {
  return (
    props.config.index >= 0 &&
    props.config.index < props.config.siblingCount - 1
  );
});

// 获取项目键
function getItemKey(item: ComponentConfig) {
  return `${item.type}-${Math.random()}`;
}

// 选择组件
function selectComponent() {
  // 只在编辑模式下允许选中
  if (props.config.isEditor) {
    // 如果当前是 ComponentRenderer，选中 child
    if (props.config.type === "ComponentRenderer" && props.config.child) {
      callFunction(
        props.config.onTap,
        {
          config: props.config.child,
          path: props.config.path,
        },
        props.methods
      );
    } else {
      callFunction(
        props.config.onTap,
        {
          config: props.config,
          path: props.config.path,
        },
        props.methods
      );
    }
  }
}

// 移除组件
function removeComponent() {
  // emit("remove", props.config.path);
  callFunction(
    props.config.onRemove,
    {
      path: props.config.path,
    },
    props.methods
  );
}

// 上移组件
function moveUp() {
  if (canMoveUp.value) {
    // emit("move", props.config.path, props.config.index - 1);
    callFunction(
      props.config.onMove,
      {
        path: props.config.path,
        index: props.config.index - 1,
      },
      props.methods
    );
  }
}

// 下移组件
function moveDown() {
  if (canMoveDown.value) {
    // emit("move", props.config.path, props.config.index + 1);
    callFunction(
      props.config.onMove,
      {
        path: props.config.path,
        index: props.config.index + 1,
      },
      props.methods
    );
  }
}

// 子组件选择
function onChildSelect(component: ComponentConfig, path: string[]) {
  // emit("select", component, path);
  callFunction(
    props.config.onTap,
    {
      config: component,
      path: path,
    },
    props.methods
  );
}

// 子组件更新
function onChildUpdate(component: ComponentConfig, path: string[]) {
  // emit("update", component, path);
  callFunction(
    props.config.onUpdate,
    {
      config: component,
      path: path,
    },
    props.methods
  );
}

// 子组件移除
function onChildRemove(path: string[]) {
  // emit("remove", path);
  callFunction(
    props.config.onRemove,
    {
      path: path,
    },
    props.methods
  );
}

// 子组件移动
function onChildMove(path: string[], newIndex: number) {
  // emit("move", path, newIndex);
  callFunction(
    props.config.onMove,
    {
      path: path,
      index: newIndex,
    },
    props.methods
  );
}

// 拖拽变化
function onDragChange(event: any) {
  // 处理拖拽变化
  if (event.added) {
    // 处理添加的组件
    const newComponent = event.added.element;
    const index = event.added.newIndex;

    // 更新子组件列表
    if (!props.config.children) {
      props.config.children = [];
    }

    props.config.children.splice(index, 0, newComponent);
    // emit("update", props.config, props.config.path);
    callFunction(
      props.config.onUpdate,
      {
        config: props.config,
        path: props.config.path,
      },
      props.methods
    );
  }
}

// 新增：拖拽到容器
function onDragEnter(event: DragEvent) {
  event.preventDefault();
  isDragOver.value = true;
}

function onDragLeave(event: DragEvent) {
  event.preventDefault();
  isDragOver.value = false;
}

function onDragOver(event: DragEvent) {
  event.preventDefault();
  isDragOver.value = true;
}

function onDropToContainer(event: DragEvent) {
  event.preventDefault();
  event.stopPropagation(); // 关键：阻止冒泡，优先最内层容器
  isDragOver.value = false;
  if (event.dataTransfer) {
    const data = event.dataTransfer.getData("application/json");
    if (data) {
      try {
        const newComponent = JSON.parse(data);
        if (
          props.methods &&
          typeof props.methods.onDropToContainer === "function"
        ) {
          props.methods.onDropToContainer(newComponent, props.config.path);
        }
      } catch (e) {
        console.error("Failed to parse dropped component", e);
      }
    }
  }
}
</script>

<style scoped>
.component-wrapper {
  position: relative;
  margin: 4px;
  min-height: 24px;
  transition: all 0.2s ease;
}

.is-editor {
  border: 1px dashed transparent;
}

/* 使用伪元素为非布局组件创建遮罩层 */
.is-editor:not(.is-layout) .component-content::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  cursor: pointer;
  border: 1px dashed transparent;
  transition: all 0.2s ease;
}

/* 悬停效果 */
.is-hoverable:hover,
.is-hoverable:not(.is-layout):hover .component-content::before {
  border-color: #40a9ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
}

.is-selected {
  border-color: #1890ff !important;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2) !important;
}

/* 为不同类型的组件添加特定的悬停效果 */
.is-editor:not(.is-layout) .fast-json-widget__text:hover,
.is-editor:not(.is-layout) .fast-json-widget__button:hover,
.is-editor:not(.is-layout) .fast-json-widget__image:hover,
.is-editor:not(.is-layout) .fast-json-widget__input:hover,
.is-editor:not(.is-layout) .fast-json-widget__select:hover {
  outline: 1px dashed #40a9ff;
}

.component-actions {
  position: absolute;
  top: -24px;
  right: 0;
  display: flex;
  gap: 4px;
  z-index: 10;
}

.component-actions button {
  padding: 2px 4px;
  font-size: 12px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 2px;
  cursor: pointer;
}

.component-actions button:hover {
  background-color: #f0f0f0;
}

.component-content {
  position: relative;
  width: 100%;
  height: 100%;
}

/* 确保子组件容器在覆盖层之上 */
.layout-container {
  position: relative;
  z-index: 2;
  display: flex;
  min-height: 50px;
}

.empty-container,
.empty-layout {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50px;
  padding: 16px;
  background-color: #f9f9f9;
  border: 1px dashed #ddd;
  border-radius: 4px;
  color: #999;
}

.layout-container.row {
  flex-direction: row;
  flex-wrap: wrap;
}

.layout-container.column {
  flex-direction: column;
}

.layout-container.stack {
  position: relative;
}

.layout-container.stack > * {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.drop-container.is-drag-over,
.component-wrapper.is-drag-over {
  outline: 2px solid #1890ff;
  background: #e6f7ff;
}
</style>
