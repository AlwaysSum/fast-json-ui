<template>
  <div 
    class="component-wrapper" 
    :class="{ 'is-selected': isSelected, 'is-editor': isEditor }"
    @click.stop="selectComponent"
  >
    <div class="component-actions" v-if="isEditor && isSelected">
      <button @click.stop="removeComponent">删除</button>
      <button @click.stop="moveUp" v-if="canMoveUp">上移</button>
      <button @click.stop="moveDown" v-if="canMoveDown">下移</button>
    </div>
    
    <div class="component-content">
      <template v-if="!isEditor">
        <!-- 预览模式：直接使用 FastJsonWidget 渲染 -->
        <fast-json-widget :config="config" :data="data" :methods="methods" />
      </template>
      <template v-else>
        <!-- 编辑模式：根据组件类型渲染不同的编辑器 -->
        <template v-if="config.type === 'container'">
          <div class="container-editor" :style="containerStyle">
            <component-renderer 
              v-if="config.child"
              :config="config.child" 
              :is-editor="isEditor"
              :path="[...path, 'child']"
              @select="onChildSelect"
              @update="onChildUpdate"
              @remove="onChildRemove"
              @move="onChildMove"
            />
            <div v-else class="empty-container" @click.stop="selectComponent">
              拖拽组件到此处
            </div>
          </div>
        </template>
        
        <template v-else-if="['row', 'column', 'stack'].includes(config.type)">
          <div :class="`${config.type}-editor`">
            <draggable 
              v-model="children" 
              :item-key="getItemKey"
              :animation="150"
              :group="{ name: 'components' }"
              class="layout-container"
              :class="config.type"
              @change="onDragChange"
            >
              <template #item="{ element, index }">
                <component-renderer 
                  :config="element" 
                  :is-editor="isEditor"
                  :path="[...path, `children[${index}]`]"
                  @select="onChildSelect"
                  @update="onChildUpdate"
                  @remove="onChildRemove"
                  @move="onChildMove"
                />
              </template>
            </draggable>
            <div v-if="children.length === 0" class="empty-layout" @click.stop="selectComponent">
              拖拽组件到此处
            </div>
          </div>
        </template>
        
        <template v-else-if="config.type === 'text'">
          <div class="text-editor">
            {{ config.text }}
          </div>
        </template>
        
        <template v-else-if="config.type === 'image'">
          <div class="image-editor">
            <img :src="config.src" :style="{ width: config.width, height: config.height }" />
          </div>
        </template>
        
        <template v-else-if="config.type === 'button'">
          <div class="button-editor">
            <button>{{ config.text }}</button>
          </div>
        </template>
        
        <template v-else>
          <div class="unknown-component">
            未知组件类型: {{ config.type }}
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { ComponentConfig } from 'fast-json-ui-vue';
import { FastJsonWidget } from 'fast-json-ui-vue';
import draggable from 'vuedraggable';

// Props
const props = defineProps({
  config: {
    type: Object as () => ComponentConfig,
    required: true
  },
  isEditor: {
    type: Boolean,
    default: false
  },
  isSelected: {
    type: Boolean,
    default: false
  },
  path: {
    type: Array as () => string[],
    default: () => []
  },
  parentType: {
    type: String,
    default: ''
  },
  index: {
    type: Number,
    default: -1
  },
  siblingCount: {
    type: Number,
    default: 0
  }
});

// Emits
const emit = defineEmits(['select', 'update', 'remove', 'move']);

// 数据和方法（用于预览模式）
const data = ref({});
const methods = ref({});

// 子组件列表（用于布局组件）
const children = ref<ComponentConfig[]>(
  props.config.children ? [...props.config.children] : []
);

// 监听子组件变化
watch(children, (newChildren: ComponentConfig[]) => {
  if (['row', 'column', 'stack'].includes(props.config.type)) {
    const updatedConfig = { ...props.config, children: newChildren };
    emit('update', updatedConfig, props.path);
  }
}, { deep: true });

// 容器样式
const containerStyle = computed(() => {
  if (props.config.type !== 'container') return {};
  
  return {
    backgroundColor: props.config.color || 'transparent',
    padding: props.config.padding || '0',
    margin: props.config.margin || '0'
  };
});

// 是否可以上移
const canMoveUp = computed(() => {
  return props.index > 0;
});

// 是否可以下移
const canMoveDown = computed(() => {
  return props.index >= 0 && props.index < props.siblingCount - 1;
});

// 获取项目键
function getItemKey(item: ComponentConfig) {
  return `${item.type}-${Math.random()}`;
}

// 选择组件
function selectComponent() {
  emit('select', props.config, props.path);
}

// 移除组件
function removeComponent() {
  emit('remove', props.path);
}

// 上移组件
function moveUp() {
  if (canMoveUp.value) {
    emit('move', props.path, props.index - 1);
  }
}

// 下移组件
function moveDown() {
  if (canMoveDown.value) {
    emit('move', props.path, props.index + 1);
  }
}

// 子组件选择
function onChildSelect(component: ComponentConfig, path: string[]) {
  emit('select', component, path);
}

// 子组件更新
function onChildUpdate(component: ComponentConfig, path: string[]) {
  emit('update', component, path);
}

// 子组件移除
function onChildRemove(path: string[]) {
  emit('remove', path);
}

// 子组件移动
function onChildMove(path: string[], newIndex: number) {
  emit('move', path, newIndex);
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
    emit('update', props.config, props.path);
  }
}
</script>

<style scoped>
.component-wrapper {
  position: relative;
  margin: 4px;
  min-height: 24px;
}

.is-editor {
  border: 1px dashed transparent;
}

.is-editor:hover {
  border-color: #ddd;
}

.is-selected {
  border-color: #1890ff !important;
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
  width: 100%;
  height: 100%;
}

.container-editor {
  min-height: 50px;
  padding: 8px;
  border-radius: 4px;
}

.empty-container,
.empty-layout {
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

.layout-container {
  display: flex;
  min-height: 50px;
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

.text-editor,
.button-editor,
.image-editor {
  padding: 4px;
}

.unknown-component {
  padding: 8px;
  background-color: #fff0f0;
  border: 1px solid #ffccc7;
  border-radius: 4px;
  color: #f5222d;
}
</style> 