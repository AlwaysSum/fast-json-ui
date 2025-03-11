<template>
  <div class="json-ui-editor" :class="{ 'preview-mode': state.previewMode }">
    <div class="editor-toolbar">
      <button @click="togglePreviewMode">
        {{ state.previewMode ? '编辑模式' : '预览模式' }}
      </button>
      <button @click="undo" :disabled="state.undoStack.length === 0">撤销</button>
      <button @click="redo" :disabled="state.redoStack.length === 0">重做</button>
      <button @click="exportJson">导出 JSON</button>
    </div>
    
    <div class="editor-content">
      <div class="component-panel" v-if="!state.previewMode">
        <h3>组件列表</h3>
        <div class="component-category" v-for="category in categories" :key="category">
          <h4>{{ getCategoryName(category) }}</h4>
          <div class="component-list">
            <div 
              v-for="component in getComponentsByCategory(category)" 
              :key="component.type"
              class="component-item"
              draggable="true"
              @dragstart="onDragStart($event, component)"
            >
              <span class="component-icon" v-if="component.icon">{{ component.icon }}</span>
              <span class="component-name">{{ component.name }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="canvas-container" 
        @dragover.prevent 
        @drop="onDrop"
      >
        <div class="canvas">
          <component-renderer 
            :config="state.rootComponent" 
            :is-editor="!state.previewMode"
            @select="selectComponent"
            @update="updateComponent"
          />
        </div>
      </div>
      
      <div class="property-panel" v-if="!state.previewMode && state.selectedComponent">
        <h3>属性设置</h3>
        <property-editor 
          :component="state.selectedComponent" 
          :meta="getComponentMetaByType(state.selectedComponent.type)"
          @update="updateSelectedComponent"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, computed, onMounted } from 'vue';
import { ComponentConfig } from 'fast-json-ui-vue';
import { ComponentCategory, EditorState } from '../types';
import { allComponents, getComponentMetaByType, getComponentsByCategory } from './metadata';
import ComponentRenderer from './ComponentRenderer.vue';
import PropertyEditor from './PropertyEditor.vue';

// Props
const props = defineProps({
  initialConfig: {
    type: Object as () => ComponentConfig,
    default: () => ({
      type: 'column',
      children: []
    })
  }
});

// Emits
const emit = defineEmits(['update:config', 'export']);

// 编辑器状态
const state = reactive<EditorState>({
  selectedComponent: null,
  rootComponent: JSON.parse(JSON.stringify(props.initialConfig)),
  componentPath: [],
  undoStack: [],
  redoStack: [],
  previewMode: false
});

// 组件分类
const categories = computed(() => {
  const uniqueCategories = new Set<ComponentCategory>();
  allComponents.forEach(component => uniqueCategories.add(component.category));
  return Array.from(uniqueCategories);
});

// 获取分类名称
function getCategoryName(category: ComponentCategory): string {
  switch (category) {
    case ComponentCategory.BASIC:
      return '基础组件';
    case ComponentCategory.LAYOUT:
      return '布局组件';
    case ComponentCategory.FORM:
      return '表单组件';
    case ComponentCategory.CUSTOM:
      return '自定义组件';
    default:
      return '其他组件';
  }
}

// 切换预览模式
function togglePreviewMode() {
  state.previewMode = !state.previewMode;
}

// 撤销操作
function undo() {
  if (state.undoStack.length > 0) {
    const previousState = state.undoStack.pop()!;
    state.redoStack.push(JSON.parse(JSON.stringify(state.rootComponent)));
    state.rootComponent = JSON.parse(JSON.stringify(previousState));
    state.selectedComponent = null;
    emit('update:config', state.rootComponent);
  }
}

// 重做操作
function redo() {
  if (state.redoStack.length > 0) {
    const nextState = state.redoStack.pop()!;
    state.undoStack.push(JSON.parse(JSON.stringify(state.rootComponent)));
    state.rootComponent = JSON.parse(JSON.stringify(nextState));
    state.selectedComponent = null;
    emit('update:config', state.rootComponent);
  }
}

// 导出 JSON
function exportJson() {
  emit('export', state.rootComponent);
}

// 拖拽开始
function onDragStart(event: DragEvent, component: any) {
  if (event.dataTransfer) {
    event.dataTransfer.setData('component', JSON.stringify(component.defaultConfig));
  }
}

// 拖拽放置
function onDrop(event: DragEvent) {
  event.preventDefault();
  if (event.dataTransfer) {
    const componentData = event.dataTransfer.getData('component');
    if (componentData) {
      const newComponent = JSON.parse(componentData);
      
      // 保存当前状态到撤销栈
      state.undoStack.push(JSON.parse(JSON.stringify(state.rootComponent)));
      state.redoStack = [];
      
      // 如果根组件是容器类型，添加到子元素
      if (state.rootComponent.type === 'container') {
        state.rootComponent.child = newComponent;
      } else if (['row', 'column', 'stack'].includes(state.rootComponent.type)) {
        if (!state.rootComponent.children) {
          state.rootComponent.children = [];
        }
        state.rootComponent.children.push(newComponent);
      } else {
        // 如果根组件不是容器类型，创建一个新的列布局作为根组件
        const oldRoot = JSON.parse(JSON.stringify(state.rootComponent));
        state.rootComponent = {
          type: 'column',
          children: [oldRoot, newComponent]
        };
      }
      
      emit('update:config', state.rootComponent);
    }
  }
}

// 选择组件
function selectComponent(component: ComponentConfig) {
  state.selectedComponent = component;
}

// 更新组件
function updateComponent(component: ComponentConfig, path: string[]) {
  // 保存当前状态到撤销栈
  state.undoStack.push(JSON.parse(JSON.stringify(state.rootComponent)));
  state.redoStack = [];
  
  // 更新组件
  let current = state.rootComponent;
  let parent: any = null;
  let key = '';
  let index = -1;
  
  for (let i = 0; i < path.length; i++) {
    parent = current;
    key = path[i];
    
    if (key.includes('[') && key.includes(']')) {
      // 处理数组索引
      const arrayKey = key.substring(0, key.indexOf('['));
      index = parseInt(key.substring(key.indexOf('[') + 1, key.indexOf(']')));
      current = current[arrayKey][index];
    } else {
      current = current[key];
    }
  }
  
  // 更新组件
  if (index !== -1 && parent) {
    parent[key.substring(0, key.indexOf('['))][index] = component;
  } else if (parent) {
    parent[key] = component;
  }
  
  emit('update:config', state.rootComponent);
}

// 更新选中的组件
function updateSelectedComponent(key: string, value: any) {
  if (state.selectedComponent) {
    state.selectedComponent[key] = value;
    emit('update:config', state.rootComponent);
  }
}

// 初始化
onMounted(() => {
  // 初始化编辑器
  state.rootComponent = JSON.parse(JSON.stringify(props.initialConfig));
});
</script>

<style scoped>
.json-ui-editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.editor-toolbar {
  display: flex;
  padding: 8px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
}

.editor-toolbar button {
  margin-right: 8px;
  padding: 4px 8px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.editor-toolbar button:hover {
  background-color: #f0f0f0;
}

.editor-toolbar button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.editor-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.component-panel {
  width: 200px;
  padding: 8px;
  background-color: #f9f9f9;
  border-right: 1px solid #ddd;
  overflow-y: auto;
}

.component-category h4 {
  margin: 8px 0;
  font-size: 14px;
  color: #666;
}

.component-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.component-item {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: move;
}

.component-icon {
  margin-right: 4px;
}

.canvas-container {
  flex: 1;
  padding: 16px;
  background-color: #fff;
  overflow: auto;
}

.canvas {
  min-height: 300px;
  border: 1px dashed #ddd;
  border-radius: 4px;
  padding: 16px;
}

.property-panel {
  width: 250px;
  padding: 8px;
  background-color: #f9f9f9;
  border-left: 1px solid #ddd;
  overflow-y: auto;
}

.preview-mode .component-panel,
.preview-mode .property-panel {
  display: none;
}

.preview-mode .canvas-container {
  flex: 1;
}
</style> 