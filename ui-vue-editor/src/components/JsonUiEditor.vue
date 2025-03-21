<template>
  <div class="json-ui-editor" :class="{ 'preview-mode': state.previewMode }">
    <!-- 顶部工具栏 -->
    <div class="main-toolbar">
      <div class="logo">Fast-JSON-UI 编辑器</div>
      <div class="actions">
        <button class="btn btn-primary" @click="exportJson">导出 JSON</button>
        <button class="btn" @click="togglePreviewMode">
          {{ state.previewMode ? "编辑模式" : "预览模式" }}
        </button>
      </div>
    </div>

    <div class="editor-layout">
      <!-- 左侧组件列表 -->
      <div class="component-panel" v-if="!state.previewMode">
        <h3>组件列表</h3>
        <div
          class="component-category"
          v-for="category in categories"
          :key="category"
        >
          <h4>{{ getCategoryName(category) }}</h4>
          <div class="component-list">
            <div
              v-for="component in getComponentsByCategory(category)"
              :key="component.type"
              class="component-item"
              draggable="true"
              @dragstart="onDragStart($event, component)"
            >
              <span class="component-icon" v-if="component.icon">{{
                component.icon
              }}</span>
              <span class="component-name">{{ component.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 中间预览操作区 -->
      <div class="center-panel">
        <!-- 预览区域上方的工具栏 -->
        <div class="canvas-toolbar" v-if="!state.previewMode">
          <button
            @click="undo"
            :disabled="state.undoStack.length === 0"
            class="btn btn-sm"
          >
            <i class="icon-undo"></i> 撤销
          </button>
          <button
            @click="redo"
            :disabled="state.redoStack.length === 0"
            class="btn btn-sm"
          >
            <i class="icon-redo"></i> 重做
          </button>
        </div>

        <div class="canvas-container" @dragover.prevent @drop="onDrop">
          <div class="canvas">
            <fast-json-widget
              :config="renderConfig"
              :data="renderData"
              :methods="renderMethods"
            />
          </div>
        </div>
      </div>

      <!-- 右侧属性面板 -->
      <div class="property-panel" v-if="!state.previewMode">
        <div class="tabs">
          <div
            class="tab"
            :class="{ active: activePropertyTab === 'properties' }"
            @click="activePropertyTab = 'properties'"
          >
            组件属性
          </div>
          <div
            class="tab"
            :class="{ active: activePropertyTab === 'globals' }"
            @click="activePropertyTab = 'globals'"
          >
            全局配置
          </div>
        </div>

        <div class="tab-content">
          <!-- 组件属性面板 -->
          <div v-if="activePropertyTab === 'properties'" class="properties-tab">
            <div v-if="state.selectedComponent">
              <property-editor
                :component="state.selectedComponent"
                :meta="getComponentMetaByType(state.selectedComponent.type)"
                @update="updateComponentProperty"
              />
            </div>
            <div v-else class="no-selection">请选择一个组件来编辑其属性</div>
          </div>

          <!-- 全局配置面板 -->
          <div v-if="activePropertyTab === 'globals'" class="globals-tab">
            <h4>全局变量</h4>
            <global-variables-editor
              :variables="globalVariables"
              @update="updateGlobalVariables"
            />

            <h4>全局函数</h4>
            <global-functions-editor
              :functions="globalFunctions"
              @update="updateGlobalFunctions"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  computed,
  watch,
  onMounted,
  defineComponent,
  h,
} from "vue";
import ComponentRenderer from "./ComponentRenderer.vue";
import PropertyEditor from "./PropertyEditor.vue";
import { ComponentCategory, ComponentConfig, ComponentMeta } from "../types";
import { availableComponents } from "../config/config";
import { registerComponent } from "fast-json-ui-vue";

//注册组件
registerComponent("ComponentRenderer", ComponentRenderer);

// 全局变量编辑器组件
const GlobalVariablesEditor = defineComponent({
  name: "GlobalVariablesEditor",
  props: {
    variables: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ["update"],
  setup(props, { emit }) {
    return () =>
      h("div", { class: "global-variables-editor" }, [
        h("p", "全局变量编辑器 - 待实现"),
      ]);
  },
});

// 全局函数编辑器组件
const GlobalFunctionsEditor = defineComponent({
  name: "GlobalFunctionsEditor",
  props: {
    functions: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ["update"],
  setup(props, { emit }) {
    return () =>
      h("div", { class: "global-functions-editor" }, [
        h("p", "全局函数编辑器 - 待实现"),
      ]);
  },
});

// Props
const props = defineProps({
  initialConfig: {
    type: Object as () => ComponentConfig,
    default: () => ({
      type: "container",
      children: [],
    }),
  },
});

// Emits
const emit = defineEmits(["update:config", "export"]);

// 状态
const state = reactive({
  rootComponent: {} as ComponentConfig,
  selectedComponent: null as ComponentConfig | null,
  componentPath: [] as string[],
  undoStack: [] as ComponentConfig[],
  redoStack: [] as ComponentConfig[],
  previewMode: false,
});

// 在 props.config 的所有内部组件上套一个 ComponentRenderer 的 config
const renderConfig = computed(() => {
  return wrapWithRenderer(state.rootComponent, []);
});

// 递归处理组件配置
function wrapWithRenderer(config: ComponentConfig, currentPath: string[]): ComponentConfig {
  if (!config) return { type: "text", text: "请添加组件" };

  // 如果已经是 ComponentRenderer，直接处理其子组件
  if (config.type === "ComponentRenderer") {
    if (!config.child?.type) {
      return { type: "text", text: "请添加组件" };
    }
    if (config.child?.type && config.child.type !== "ComponentRenderer") {
      config.child = wrapWithRenderer(config.child, currentPath);
    }
    return config;
  }

  // 处理子组件
  if (config.children) {
    config.children = config.children.map((child: ComponentConfig) =>
      child.type === "ComponentRenderer" ? child : wrapWithRenderer(child, currentPath)
    );
  }
  if (config.child) {
    config.child =
      config.child.type === "ComponentRenderer"
        ? config.child
        : wrapWithRenderer(config.child, currentPath);
  }

  // 包装当前组件
  return {
    type: "ComponentRenderer",
    child: config,
    isEditor: !state.previewMode,
    path: [...currentPath, config.type],
    onTap: "@{selectComponent(${config}, ${path})}",
    onUpdate: "@{updateComponent(${config}, ${path})}",
    onRemove: "@{removeComponent(${path})}",
    onMove: "@{moveComponent(${fromPath}, ${toPath})}",
  };
}

const renderData = ref({
  component: state.selectedComponent,
  path: state.componentPath,
});

const renderMethods = ref({
  selectComponent: selectComponent,
  updateComponent: updateComponent,
  removeComponent: removeComponent,
  moveComponent: moveComponent,
});

// 新增的状态
const activePropertyTab = ref("properties");
const globalVariables = ref<Record<string, any>>({});
const globalFunctions = ref<Record<string, any>>({});

// 计算属性
const categories = computed(() => {
  const cats = new Set<ComponentCategory>();
  availableComponents.forEach((comp: ComponentMeta) => cats.add(comp.category));
  return Array.from(cats);
});

// 方法
function getCategoryName(category: ComponentCategory): string {
  switch (category) {
    case ComponentCategory.BASIC:
      return "基础组件";
    case ComponentCategory.LAYOUT:
      return "布局组件";
    case ComponentCategory.FORM:
      return "表单组件";
    case ComponentCategory.CUSTOM:
      return "自定义组件";
    default:
      return "其他组件";
  }
}

function getComponentsByCategory(category: ComponentCategory) {
  return availableComponents.filter(
    (comp: ComponentMeta) => comp.category === category
  );
}

function getComponentMetaByType(type: string): ComponentMeta | undefined {
  return availableComponents.find((comp: ComponentMeta) => comp.type === type);
}

function onDragStart(event: DragEvent, component: ComponentMeta) {
  if (event.dataTransfer) {
    event.dataTransfer.setData(
      "application/json",
      JSON.stringify(component.defaultConfig)
    );
  }
}

function onDrop(event: DragEvent) {
  event.preventDefault();
  if (event.dataTransfer) {
    const data = event.dataTransfer.getData("application/json");
    if (data) {
      try {
        const newComponent = JSON.parse(data);
        addComponent(newComponent);
      } catch (e) {
        console.error("Failed to parse dropped component", e);
      }
    }
  }
}

function addComponent(component: ComponentConfig) {
  // 保存当前状态到撤销栈
  saveToUndoStack();

  if (!state.rootComponent.children) {
    state.rootComponent.children = [];
  }

  state.rootComponent.children.push(component);
  updateConfig();
}

function selectComponent(component: ComponentConfig, path: string[]) {
  state.selectedComponent = component;
  state.componentPath = path;
}

function updateComponent(component: ComponentConfig, path: string[]) {
  // 保存当前状态到撤销栈
  saveToUndoStack();

  // 根据路径更新组件
  let current = state.rootComponent;
  let parent = null;
  let index = -1;

  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    if (key === "children") {
      const idx = parseInt(path[i + 1]);
      if (!isNaN(idx)) {
        parent = current;
        current = current.children[idx];
        index = idx;
        i++; // 跳过下一个索引
      }
    }
  }

  if (parent && index !== -1) {
    parent.children[index] = component;
  } else {
    // 直接更新根组件
    Object.assign(state.rootComponent, component);
  }

  updateConfig();
}

function updateComponentProperty(
  component: ComponentConfig,
  property: string,
  value: any
) {
  // 保存当前状态到撤销栈
  saveToUndoStack();

  // 更新属性
  if (component) {
    component[property] = value;
    updateConfig();
  }
}

function removeComponent(path: string[]) {
  // 保存当前状态到撤销栈
  saveToUndoStack();

  // 根据路径删除组件
  let current = state.rootComponent;
  let parent = null;
  let index = -1;

  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    if (key === "children") {
      const idx = parseInt(path[i + 1]);
      if (!isNaN(idx)) {
        parent = current;
        index = idx;
        break;
      }
    }
  }

  if (parent && index !== -1) {
    parent.children.splice(index, 1);

    // 如果删除的是当前选中的组件，清除选择
    if (state.selectedComponent === current) {
      state.selectedComponent = null;
      state.componentPath = [];
    }

    updateConfig();
  }
}

function moveComponent(fromPath: string[], toPath: string[]) {
  // 保存当前状态到撤销栈
  saveToUndoStack();

  // 根据路径获取组件和目标位置
  let component = null;
  let fromParent = state.rootComponent;
  let fromIndex = -1;
  let toParent = state.rootComponent;
  let toIndex = -1;

  // 解析源路径
  for (let i = 0; i < fromPath.length - 1; i++) {
    const key = fromPath[i];
    if (key === "children") {
      const idx = parseInt(fromPath[i + 1]);
      if (!isNaN(idx)) {
        fromParent = fromParent;
        fromIndex = idx;
        component = fromParent.children[idx];
        break;
      }
    }
  }

  // 解析目标路径
  for (let i = 0; i < toPath.length - 1; i++) {
    const key = toPath[i];
    if (key === "children") {
      const idx = parseInt(toPath[i + 1]);
      if (!isNaN(idx)) {
        toParent = toParent;
        toIndex = idx;
        break;
      }
    }
  }

  // 执行移动
  if (component && fromIndex !== -1 && toIndex !== -1) {
    // 从源位置移除
    fromParent.children.splice(fromIndex, 1);

    // 添加到目标位置
    toParent.children.splice(toIndex, 0, component);

    updateConfig();
  }
}

function saveToUndoStack() {
  state.undoStack.push(JSON.parse(JSON.stringify(state.rootComponent)));
  state.redoStack = []; // 清空重做栈
}

function undo() {
  if (state.undoStack.length > 0) {
    // 保存当前状态到重做栈
    state.redoStack.push(JSON.parse(JSON.stringify(state.rootComponent)));

    // 恢复上一个状态
    state.rootComponent = state.undoStack.pop()!;

    // 清除选中状态
    state.selectedComponent = null;
    state.componentPath = [];

    updateConfig();
  }
}

function redo() {
  if (state.redoStack.length > 0) {
    // 保存当前状态到撤销栈
    state.undoStack.push(JSON.parse(JSON.stringify(state.rootComponent)));

    // 恢复下一个状态
    state.rootComponent = state.redoStack.pop()!;

    // 清除选中状态
    state.selectedComponent = null;
    state.componentPath = [];

    updateConfig();
  }
}

function togglePreviewMode() {
  state.previewMode = !state.previewMode;

  // 清除选中状态
  if (state.previewMode) {
    state.selectedComponent = null;
    state.componentPath = [];
  }
}

function exportJson() {
  emit("export", state.rootComponent);
}

function updateConfig() {
  emit("update:config", state.rootComponent);
}

// 更新全局变量和函数的方法
function updateGlobalVariables(variables: Record<string, any>) {
  globalVariables.value = variables;
}

function updateGlobalFunctions(functions: Record<string, any>) {
  globalFunctions.value = functions;
}

// 初始化
onMounted(() => {
  state.rootComponent = JSON.parse(JSON.stringify(props.initialConfig));
});
</script>

<style scoped>
.json-ui-editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  font-family: Arial, sans-serif;
  color: #333;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.main-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
  height: 48px;
}

.logo {
  font-size: 18px;
  font-weight: bold;
  color: #f56c6c;
}

.actions {
  display: flex;
  gap: 8px;
}

.editor-layout {
  display: flex;
  flex-direction: row;
  flex: 1;
  overflow: hidden;
}

.component-panel {
  width: 240px;
  padding: 16px;
  background-color: #fff;
  border-right: 1px solid #ddd;
  overflow-y: auto;
}

.center-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.canvas-toolbar {
  display: flex;
  padding: 8px 16px;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
  gap: 8px;
}

.canvas-container {
  flex: 1;
  padding: 16px;
  overflow: auto;
  background-color: #f9f9f9;
}

.canvas {
  min-height: 100%;
  background-color: #fff;
  border: 1px dashed #ddd;
  border-radius: 4px;
  padding: 16px;
}

.property-panel {
  width: 300px;
  background-color: #fff;
  border-left: 1px solid #ddd;
  display: flex;
  flex-direction: column;
}

.tabs {
  display: flex;
  border-bottom: 1px solid #ddd;
}

.tab {
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
}

.tab.active {
  border-bottom-color: #f56c6c;
  color: #f56c6c;
}

.tab-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

.component-category {
  margin-bottom: 16px;
}

.component-category h4 {
  margin: 8px 0;
  padding-bottom: 4px;
  border-bottom: 1px solid #eee;
}

.component-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.component-item {
  display: flex;
  align-items: center;
  padding: 8px;
  background-color: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 4px;
  cursor: move;
  user-select: none;
}

.component-item:hover {
  background-color: #f0f0f0;
}

.component-icon {
  margin-right: 4px;
}

.btn {
  padding: 6px 12px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.btn:hover {
  background-color: #f5f5f5;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #f56c6c;
  color: #fff;
  border-color: #f56c6c;
}

.btn-primary:hover {
  background-color: #e45c5c;
}

.btn-sm {
  padding: 4px 8px;
  font-size: 12px;
}

.no-selection {
  color: #999;
  font-style: italic;
  padding: 16px 0;
}

/* 预览模式样式 */
:deep(.json-ui-editor.preview-mode) .component-panel,
:deep(.json-ui-editor.preview-mode) .property-panel,
:deep(.json-ui-editor.preview-mode) .canvas-toolbar {
  display: none;
}

:deep(.json-ui-editor.preview-mode) .canvas-container {
  padding: 0;
}

:deep(.json-ui-editor.preview-mode) .canvas {
  border: none;
  padding: 0;
}
</style>
