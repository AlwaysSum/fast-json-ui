<template>
  <div class="json-ui-editor" :class="{ 'preview-mode': state.previewMode }">
    <!-- 顶部工具栏 -->
    <ToolbarArea :mode="state.previewMode ? 'preview' : 'edit'" :canUndo="state.undoStack.length > 0"
      :canRedo="state.redoStack.length > 0" @modeChange="onModeChange" @undo="undo" @redo="redo" @clearAll="clearCanvas"
      @copyConfig="copyConfig" @pasteConfig="pasteConfig" @deviceChange="onDeviceChange" @exportConfig="exportJson"
      @importConfig="importJson" @showSource="openSourceDialog" />

    <div class="editor-layout">
      <!-- 组件面板 - 暂时隐藏 -->
      <!-- <ComponentPanel
        v-if="!state.previewMode"
        @addComponent="onAddComponent"
      /> -->

      <!-- 左侧面板：当 showHierarchyPanel 为 true 显示层级树，否则插槽自定义面板 -->
      <template v-if="showHierarchyPanel">
        <HierarchyPanel :root="state.rootComponent" :selectedPath="selectedTreePath"
          :activeObjectName="props.activeObjectName || String(props.activeObjectId)" @select="onTreeSelect"
          @add="onTreeAdd" @remove="onTreeRemove" @moveUp="onTreeMoveUp" @moveDown="onTreeMoveDown"
          @focusObjectProps="onFocusObjectProps" style="border-right: 1px solid #eee" />
      </template>
      <template v-else>
        <slot name="left-panel" />
      </template>
      <!-- 画布和属性面板 -->
      <div class="center-panel">
        <!-- 预览区域上方的工具栏 -->
        <div class="canvas-toolbar" v-if="!state.previewMode">
          <button @click="undo" :disabled="state.undoStack.length === 0" class="btn btn-sm">
            <i class="icon-undo"></i> 撤销
          </button>
          <button @click="redo" :disabled="state.redoStack.length === 0" class="btn btn-sm">
            <i class="icon-redo"></i> 重做
          </button>
        </div>

        <CanvasArea :config="renderConfig" :data="renderData" :methods="renderMethods"
          @addComponent="onAddComponentToCanvas" @clearCanvas="clearCanvas" @previewMode="togglePreviewMode"
          @move="onMoveComponent" />
      </div>
      <div class="property-panel" v-if="!state.previewMode">
        <div class="tabs">
          <div class="tab" :class="{ active: activePropertyTab === 'properties' }"
            @click="activePropertyTab = 'properties'">
            组件属性
          </div>
          <div class="tab" :class="{ active: activePropertyTab === 'object' }" @click="activePropertyTab = 'object'">
            {{ objectTabLabel }}
          </div>
          <div class="tab" :class="{ active: activePropertyTab === 'globals' }" @click="activePropertyTab = 'globals'">
            全局配置
          </div>
        </div>

        <div class="tab-content">
          <!-- 组件属性面板 -->
          <div v-if="activePropertyTab === 'properties'" class="properties-tab">
            <div v-if="state.selectedComponent">
              <property-editor :component="state.selectedComponent"
                :meta="getComponentMetaByType(state.selectedComponent.type)" :path="state.componentPath"
                @update="updateComponentProperty" @addComponent="onPropertyAddComponent" />
            </div>
            <div v-else class="no-selection">请选择一个组件来编辑其属性</div>
          </div>

          <!-- 对象属性面板（页面/弹窗/自定义组件） -->
          <div v-if="activePropertyTab === 'object'" class="object-tab">
            <t-form layout="vertical">
              <t-form-item label="名称">
                <t-input v-model="objectName" placeholder="请输入名称" />
              </t-form-item>
              <t-form-item :label="objectTabLabel + '变量'" labelAlign="top">
                <KeyValueEditor v-model="objectVars" />
              </t-form-item>
              <t-form-item>
                <t-button theme="primary" @click="saveObjectProps">保存</t-button>
              </t-form-item>
            </t-form>
          </div>

          <!-- 全局配置面板 -->
          <div v-if="activePropertyTab === 'globals'" class="globals-tab">
            <h4>全局变量</h4>
            <global-variables-editor :variables="globalVariables" @update="updateGlobalVariables" />

            <h4>全局函数</h4>
            <global-functions-editor :functions="globalFunctions" @update="updateGlobalFunctions" />
          </div>
        </div>
      </div>
    </div>

    <!-- 源码查看对话框（并入根模板，避免多根模板报错） -->
    <t-dialog v-if="showSourceDialog" :visible="showSourceDialog" header="源码" width="800px" @close="closeSourceDialog">
      <JsonPreview :data="stripWrapper(state.rootComponent)" />
      <template #footer>
        <t-space>
          <t-button theme="default" @click="closeSourceDialog">关闭</t-button>
          <t-button theme="primary" @click="copyConfig">复制 JSON</t-button>
        </t-space>
      </template>
    </t-dialog>

    <!-- 组件选择对话框 -->
    <AddComponentDialog :show="showAddComponentDialog" @close="onComponentDialogCancel" @add="onComponentSelected" />
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
  defineComponent,
  h,
  defineAsyncComponent,
  PropType,
} from "vue";
// 以异步组件形式导入，避免类型检查对默认导出报错
const ComponentRenderer = defineAsyncComponent(() => import("./ComponentRenderer.vue"));
// 使用分组版属性编辑器
const PropertyEditor = defineAsyncComponent(() => import("./PropertyEditorGrouped.vue"));
 const CanvasArea = defineAsyncComponent(() => import("./CanvasArea.vue"));
 const ToolbarArea = defineAsyncComponent(() => import("./ToolbarArea.vue"));
 const AddComponentDialog = defineAsyncComponent(() => import("./AddComponentDialog.vue"));
 const JsonPreview = defineAsyncComponent(() => import("./JsonPreview.vue"));
const KeyValueEditor = defineAsyncComponent(() => import("./KeyValueEditor.vue"));
import { ComponentConfig } from "../types";
// 通过命名空间导入以规避类型提示中的导出不匹配问题
import * as FastJsonUiVue from "fast-json-ui-vue";
const WidgetFactory = (FastJsonUiVue as any).WidgetFactory as typeof FastJsonUiVue.WidgetFactory;
const setRenderModeSafe = (mode: 'normal' | 'editor' | 'preview') => {
  const fn = (FastJsonUiVue as any).setRenderMode;
  if (typeof fn === 'function') {
    fn(mode);
  } else {
    console.warn('fast-json-ui-vue: setRenderMode 不可用，已跳过设置渲染模式');
  }
};
import JsonTransformFactory, { toPreview, stripWrapper } from "../services/JsonTransformFactory";
import { registerComponent } from "fast-json-ui-vue";
const HierarchyPanel = defineAsyncComponent(() => import("./HierarchyPanel.vue"));
import type { WidgetMeta } from 'fast-json-ui-vue/src/components/WidgetFactory';

//注册组件
registerComponent("ComponentRenderer", ComponentRenderer, {
  type: "ComponentRenderer",
  name: "组件渲染器",
  icon: "🧩",
  category: "custom",
  defaultConfig: {
    type: "ComponentRenderer",
    child: { type: "text", text: "内容" },
  },
  properties: [{ name: "child", label: "子组件", type: "child" }],
});

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

// 由于画布区域 CanvasArea 会触发 move 事件，这里提供占位实现以避免模板绑定报错
function onMoveComponent(..._args: any[]) {
  // 拖拽/移动排序逻辑已移除，当前不执行任何处理
}

// Props
const props = defineProps({
  initialConfig: {
    type: Object as PropType<ComponentConfig>,
    default: () => ({
      type: "container",
      children: [],
    }),
  },
  showHierarchyPanel: {
    type: Boolean,
    default: true,
  },
  activeObjectKind: {
    type: String as PropType<'page' | 'dialog' | 'custom'>,
    default: 'page'
  },
  activeObjectId: {
    type: [String, Number] as PropType<string | number>,
    default: 'home'
  },
  activeObjectName: {
    type: String,
    default: ''
  },
  activeObjectVars: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({})
  }
});

const showHierarchyPanel = computed(() => !!props.showHierarchyPanel);

// Emits
const emit = defineEmits(["update:config", "export", "update:objectProps"]);

// 状态
const state = reactive({
  rootComponent: {} as ComponentConfig,
  selectedComponent: null as ComponentConfig | null,
  componentPath: [] as string[],
  undoStack: [] as ComponentConfig[],
  redoStack: [] as ComponentConfig[],
  previewMode: false,
});

// 预览JSON：由编辑JSON实时转换生成
const renderConfig = computed(() => {
  return toPreview(state.rootComponent, { isEditor: !state.previewMode });
});

// 源码查看对话框
const showSourceDialog = ref(false);
function openSourceDialog(){ showSourceDialog.value = true; }
function closeSourceDialog(){ showSourceDialog.value = false; }

// 监听来自顶层布局的全局动作事件
function handleOpenSourceAction(){ openSourceDialog(); }
function handleExportAction(){
  // 触发原有导出事件（供页面自定义处理）
  exportJson();
  // 同时打开源码预览，提供复制能力，提升一致性体验
  openSourceDialog();
}
function handleImportAction(){ importJson(); }
onMounted(() => {
  try {
    window.addEventListener('fju-action-source', handleOpenSourceAction as EventListener);
    window.addEventListener('fju-action-export', handleExportAction as EventListener);
    window.addEventListener('fju-action-import', handleImportAction as EventListener);
  } catch {}
});
onBeforeUnmount(() => {
  try {
    window.removeEventListener('fju-action-source', handleOpenSourceAction as EventListener);
    window.removeEventListener('fju-action-export', handleExportAction as EventListener);
    window.removeEventListener('fju-action-import', handleImportAction as EventListener);
  } catch {}
});

// 递归处理组件配置
// 包装逻辑迁移至 JsonTransformFactory

const renderData = computed(() => ({
  component: state.selectedComponent,
  path: state.componentPath,
}));

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
const objectTabLabel = computed(() => {
  if (props.activeObjectKind === 'dialog') return '弹窗属性';
  if (props.activeObjectKind === 'custom') return '组件属性';
  return '页面属性';
});
const objectName = ref<string>('');
const objectVars = ref<Record<string, any>>({});

// 新增：当前树选中路径
const selectedTreePath = ref<string[]>([]);

// 组件选择对话框状态
const showAddComponentDialog = ref(false);
const addComponentTarget = ref<{ path: string[], position?: string } | null>(null);

function getComponentMetaByType(type: string) {
  console.log(
    "WidgetFactory.getWidgetRegistry()",
    WidgetFactory.getWidgetRegistry()
  );
  return (
    Object.values(WidgetFactory.getWidgetRegistry() as any).find(
      (reg: any) => reg.metadata.type === type
    ) as any
  )?.metadata;
}

// 组件面板相关方法
function onAddComponent(widget: WidgetMeta) {
  // 直接添加组件到根容器
  const newComponent = { ...widget.defaultConfig };
  addComponent(newComponent);
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

// 画布区域相关方法
function onAddComponentToCanvas(widget: WidgetMeta) {
  const newComponent = { ...widget.defaultConfig };
  addComponent(newComponent);
}

function clearCanvas() {
  // 保存当前状态到撤销栈
  saveToUndoStack();

  // 清空根组件的子组件
  if (state.rootComponent.children) {
    state.rootComponent.children = [];
  }
  if (state.rootComponent.child) {
    delete state.rootComponent.child;
  }

  // 清除选中状态
  state.selectedComponent = null;
  state.componentPath = [];

  updateConfig();
}

function selectComponent(component: ComponentConfig, path: string[]) {
  if (component == null) return;
  // 如果 component 是 ComponentRenderer，选中 child
  if (component.type === "ComponentRenderer" && component.child) {
    state.selectedComponent = component.child;
    state.componentPath = path;
  } else {
    state.selectedComponent = component;
    state.componentPath = path;
  }
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
  property: string,
  value: any
) {
  // 保存当前状态到撤销栈
  saveToUndoStack();

  // 根据选中路径在 rootComponent 中定位真实组件并更新属性
  const path = state.componentPath;
  if (!path || path.length === 0) {
    // 如果没有路径，默认更新根组件
    (state.rootComponent as any)[property] = value;
    updateConfig();
    return;
  }

  let current: any = state.rootComponent;

  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    if (key === "children") {
      const idx = parseInt(path[i + 1]);
      if (!isNaN(idx)) {
        current = current.children[idx];
        i++; // 跳过下一个索引
      }
    }
  }

  if (current) {
    current[property] = value;
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
        fromParent = fromParent.children[idx];
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
        toParent = toParent.children[idx];
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

// ===== 对象属性（页面/弹窗/组件）逻辑 =====
watch(() => props.activeObjectName, (n) => { objectName.value = n || ''; }, { immediate: true });
watch(() => props.activeObjectVars, (v) => {
  objectVars.value = (v && typeof v === 'object') ? JSON.parse(JSON.stringify(v)) : {};
}, { immediate: true, deep: true });

function saveObjectProps() {
  const vars = objectVars.value || {};
  emit('update:objectProps', { id: props.activeObjectId, kind: props.activeObjectKind, name: objectName.value.trim(), vars });
}

function onFocusObjectProps() { activePropertyTab.value = 'object'; }

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

  // 切换渲染模式（加入安全包装）
  setRenderModeSafe(state.previewMode ? 'preview' : 'editor');
}

// strip 逻辑迁移至 JsonTransformFactory

function exportJson() {
  const cleanConfig = stripWrapper(state.rootComponent);
  emit("export", cleanConfig);
}

// 工具栏相关方法
function onModeChange(mode: 'edit' | 'preview') {
  state.previewMode = mode === 'preview';
  // 切换渲染模式（加入安全包装）
  setRenderModeSafe(state.previewMode ? 'preview' : 'editor');
}

function copyConfig() {
  const cleanConfig = stripWrapper(state.rootComponent);
  navigator.clipboard.writeText(JSON.stringify(cleanConfig, null, 2))
    .then(() => {
      console.log('配置已复制到剪贴板');
    })
    .catch(err => {
      console.error('复制失败:', err);
    });
}

function pasteConfig() {
  navigator.clipboard.readText()
    .then(text => {
      try {
        const config = JSON.parse(text);
        // 保存当前状态到撤销栈
        saveToUndoStack();
        state.rootComponent = config;
        updateConfig();
        console.log('配置已从剪贴板粘贴');
      } catch (err) {
        console.error('粘贴失败，无效的 JSON 格式:', err);
      }
    })
    .catch(err => {
      console.error('读取剪贴板失败:', err);
    });
}

function onDeviceChange(device: string) {
  console.log('设备切换:', device);
  // 可以在这里实现设备预览功能
}

function importJson() {
  // 创建文件输入元素
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = (event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const config = JSON.parse(e.target?.result as string);
          // 保存当前状态到撤销栈
          saveToUndoStack();
          state.rootComponent = config;
          updateConfig();
          console.log('配置已导入');
        } catch (err) {
          console.error('导入失败，无效的 JSON 格式:', err);
        }
      };
      reader.readAsText(file);
    }
  };
  input.click();
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

// 选中树节点时联动选中组件
function onTreeSelect(path: string[]) {
  selectedTreePath.value = path;
  // 根据 path 定位组件并选中
  let current = state.rootComponent;
  for (let i = 0; i < path.length; i++) {
    const key = path[i];
    if (key === "children" && i + 1 < path.length) {
      const idx = parseInt(path[i + 1]);
      if (!isNaN(idx) && current.children && current.children[idx]) {
        current = current.children[idx];
        i++;
      } else {
        console.warn('Invalid children index or missing children array:', idx, current);
        return;
      }
    } else if (key === "child") {
      if (current.child) {
        current = current.child;
      } else {
        console.warn('Missing child property:', current);
        return;
      }
    }
  }

  if (current && current.type) {
    state.selectedComponent = current;
    state.componentPath = path;
  } else {
    console.warn('Invalid component found at path:', path, current);
  }
}

// 画布选中时联动树
watch(
  () => state.componentPath,
  (val) => {
    selectedTreePath.value = val;
  }
);

// 层级树操作：添加组件（打开组件选择对话框）
function onTreeAdd(path: string[]) {
  console.log('=== onTreeAdd Debug ===');
  console.log('Add path:', path);
  addComponentTarget.value = { path };
  showAddComponentDialog.value = true;
}

// 处理组件选择对话框的组件选择
function onComponentSelected(componentType: string) {
  if (!addComponentTarget.value) return;

  saveToUndoStack();

  const { path } = addComponentTarget.value;
  console.log('=== onComponentSelected Debug ===');
  console.log('Component type:', componentType);
  console.log('Target path:', path);
  console.log('Root component:', state.rootComponent);

  // 根据组件类型创建新组件
  const widgetRegistry = WidgetFactory.getWidgetRegistry();
  const widgetMeta = widgetRegistry[componentType];
  const newComponent = widgetMeta?.metadata?.defaultConfig || { type: componentType };

  let current = state.rootComponent;
  console.log('Starting traversal from root:', current);

  for (let i = 0; i < path.length; i++) {
    const key = path[i];
    console.log(`Step ${i}: key="${key}", current:`, current);

    if (key === "children" && i + 1 < path.length) {
      const idx = parseInt(path[i + 1]);
      if (!isNaN(idx) && current.children && current.children[idx]) {
        current = current.children[idx];
        console.log(`Navigated to children[${idx}]:`, current);
        i++;
      } else {
        console.warn('Invalid children navigation:', idx, current.children);
        return;
      }
    } else if (key === "child") {
      if (current.child) {
        current = current.child;
        console.log('Navigated to child:', current);
      } else {
        console.warn('No child property found:', current);
        return;
      }
    }
  }

  console.log('Final target container:', current);

  // 优先使用 children 数组，确保新组件被添加而不是替换
  if (Array.isArray(current.children)) {
    // 如果已经有 children 数组，直接添加
    console.log('Adding to existing children array');
    current.children.push(newComponent);
  } else if (current.child !== undefined) {
    // 如果只有一个 child，将其转换为 children 数组
    console.log('Converting child to children array');
    current.children = [current.child, newComponent];
    delete current.child;
  } else if (current.children === undefined) {
    // 如果没有子组件，创建 children 数组
    console.log('Creating new children array');
    current.children = [newComponent];
  } else {
    // 如果 children 是空数组，直接添加
    console.log('Adding to empty children array');
    current.children.push(newComponent);
  }

  console.log('Updated container:', current);
  updateConfig();

  // 关闭对话框
  showAddComponentDialog.value = false;
  addComponentTarget.value = null;
}

// 处理组件选择对话框的取消
function onComponentDialogCancel() {
  showAddComponentDialog.value = false;
  addComponentTarget.value = null;
}

// 处理属性面板的添加组件事件
function onPropertyAddComponent(path: string[]) {
  console.log('=== onPropertyAddComponent Debug ===');
  console.log('Add path:', path);
  addComponentTarget.value = { path };
  showAddComponentDialog.value = true;
}

// 层级树操作：删除组件
function onTreeRemove(path: string[]) {
  saveToUndoStack();
  if (path.length < 2) return; // 根节点不允许删除
  let parent = state.rootComponent;
  for (let i = 0; i < path.length - 2; i++) {
    const key = path[i];
    if (key === "children" && i + 1 < path.length - 2) {
      const idx = parseInt(path[i + 1]);
      if (!isNaN(idx)) {
        parent = parent.children[idx];
        i++;
      }
    } else if (key === "child") {
      parent = parent.child;
    }
  }
  const lastKey = path[path.length - 2];
  const lastIdx = Number(path[path.length - 1]);
  if (lastKey === "children") {
    parent.children.splice(lastIdx, 1);
    updateConfig();
  } else if (lastKey === "child") {
    parent.child = undefined;
    updateConfig();
  }
}

// 层级树操作：上移
function onTreeMoveUp(path: string[]) {
  saveToUndoStack();
  if (path.length < 2) return;
  let parent = state.rootComponent;
  for (let i = 0; i < path.length - 2; i++) {
    const key = path[i];
    if (key === "children" && i + 1 < path.length - 2) {
      const idx = parseInt(path[i + 1]);
      if (!isNaN(idx)) {
        parent = parent.children[idx];
        i++;
      }
    } else if (key === "child") {
      parent = parent.child;
    }
  }
  const lastKey = path[path.length - 2];
  const lastIdx = Number(path[path.length - 1]);
  if (lastKey === "children" && lastIdx > 0) {
    const arr = parent.children;
    [arr[lastIdx - 1], arr[lastIdx]] = [arr[lastIdx], arr[lastIdx - 1]];
    updateConfig();
  }
}

// 层级树操作：下移
function onTreeMoveDown(path: string[]) {
  saveToUndoStack();
  if (path.length < 2) return;
  let parent = state.rootComponent;
  for (let i = 0; i < path.length - 2; i++) {
    const key = path[i];
    if (key === "children" && i + 1 < path.length - 2) {
      const idx = parseInt(path[i + 1]);
      if (!isNaN(idx)) {
        parent = parent.children[idx];
        i++;
      }
    } else if (key === "child") {
      parent = parent.child;
    }
  }
  const lastKey = path[path.length - 2];
  const lastIdx = Number(path[path.length - 1]);
  if (lastKey === "children") {
    const arr = parent.children;
    if (lastIdx < arr.length - 1) {
      [arr[lastIdx + 1], arr[lastIdx]] = [arr[lastIdx], arr[lastIdx + 1]];
      updateConfig();
    }
  }
}

// 初始化
onMounted(() => {
  state.rootComponent = JSON.parse(JSON.stringify(props.initialConfig));
});

// 当父组件传入的 initialConfig 引用发生变化时，同步更新编辑器内部状态
// 说明：这里不做深度监听，仅在引用变更时重置，以避免编辑过程中触发不必要的回写循环
watch(
  () => props.initialConfig,
  (val, oldVal) => {
    if (!val) return;
    if (val === oldVal) return;
    state.rootComponent = JSON.parse(JSON.stringify(val));
    state.selectedComponent = null;
    state.componentPath = [];
  },
  { deep: false, immediate: false }
);
</script>

<style scoped>
.json-ui-editor {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--td-bg-color-page);
  color: var(--td-text-color-primary);
}

.editor-layout {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.center-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--td-bg-color-container);
}

.property-panel {
  width: 300px;
  background: var(--td-bg-color-container);
  border-left: 1px solid var(--td-border-level-1-color);
  display: flex;
  flex-direction: column;
}

/* 层级面板顶部切换按钮 */
.seg {
  padding: 4px 8px;
  border: 1px solid #bbb;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  font-size: 12px;
}

.seg.active {
  background: #4a90e2;
  border-color: #4a90e2;
  color: #fff;
}

.tabs {
  display: flex;
  border-bottom: 1px solid var(--td-border-level-1-color);
  background: var(--td-bg-color-container-hover);
}

.tab {
  flex: 1;
  padding: 12px 16px;
  text-align: center;
  cursor: pointer;
  font-size: 14px;
  color: var(--td-text-color-secondary);
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.tab:hover {
  color: var(--td-text-color-primary);
  background: var(--td-bg-color-container-active);
}

.tab.active {
  color: var(--td-brand-color);
  border-bottom-color: var(--td-brand-color);
  background: var(--td-bg-color-container);
}

.tab-content {
  flex: 1;
  overflow-y: auto;
}

.properties-tab,
.globals-tab {
  height: 100%;
}

.canvas-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--td-bg-color-container-hover);
  border-bottom: 1px solid var(--td-border-level-1-color);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border: 1px solid var(--td-border-level-1-color);
  border-radius: var(--td-radius-default);
  background: var(--td-bg-color-container);
  color: var(--td-text-color-primary);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn:hover:not(:disabled) {
  background: var(--td-bg-color-container-hover);
  border-color: var(--td-brand-color);
  color: var(--td-brand-color);
}

.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  background: var(--td-bg-color-component-disabled);
  color: var(--td-text-color-disabled);
}

.btn-primary {
  background: var(--td-brand-color);
  color: var(--td-text-color-anti);
  border-color: var(--td-brand-color);
}

.btn-primary:hover:not(:disabled) {
  background: var(--td-brand-color-hover);
  border-color: var(--td-brand-color-hover);
}

.btn-sm {
  padding: 4px 8px;
  font-size: 12px;
}

.no-selection {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: var(--td-text-color-placeholder);
  font-style: italic;
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

/* 响应式设计 */
@media (max-width: 1024px) {
  .property-panel {
    width: 250px;
  }
}

@media (max-width: 768px) {
  .editor-layout {
    flex-direction: column;
  }

  .property-panel {
    width: 100%;
    height: 300px;
    border-left: none;
    border-top: 1px solid var(--td-border-level-1-color);
  }
}
</style>

<!-- 源码对话框已并入上方根模板内 -->
