<template>
  <div class="canvas-area">
    <div class="canvas-header">
      <div class="canvas-title">画布</div>
      <div class="canvas-actions">
        <button class="btn btn-sm" @click="clearCanvas" title="清空画布">
          🗑️ 清空
        </button>
        <button class="btn btn-sm" @click="previewMode" title="预览模式">
          👁️ 预览
        </button>
      </div>
    </div>
    
    <div 
      class="canvas-container"
      :class="{ 'drag-over': isDragOver, 'empty': isEmpty }"
      @dragover.prevent="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
    >
      <div v-if="isEmpty" class="empty-state">
        <div class="empty-icon">📱</div>
        <div class="empty-text">拖拽组件到此处开始设计</div>
        <div class="empty-hint">或点击左侧组件面板中的组件</div>
      </div>
      
      <div v-else class="canvas-content">
        <fast-json-widget
          :config="config"
          :data="data"
          :methods="methods"
        />
      </div>
      
      <!-- 拖拽指示器 -->
      <div v-if="isDragOver" class="drop-indicator">
        <div class="drop-zone">
          <div class="drop-icon">📦</div>
          <div class="drop-text">释放以添加组件</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { FastJsonWidget } from 'fast-json-ui-vue';
import type { ComponentConfig, ConfigData, ConfigMethods } from 'fast-json-ui-vue';
import type { WidgetMeta } from 'fast-json-ui-vue/src/components/WidgetFactory';

// Props
interface Props {
  config: ComponentConfig;
  data?: ConfigData;
  methods?: ConfigMethods;
}

const props = withDefaults(defineProps<Props>(), {
  data: () => ({}),
  methods: () => ({})
});

// Emits
const emit = defineEmits<{
  addComponent: [widget: WidgetMeta];
  clearCanvas: [];
  previewMode: [];
}>();

// 响应式数据
const isDragOver = ref(false);

// 计算属性
const isEmpty = computed(() => {
  return !props.config || 
         (!props.config.children?.length && !props.config.child);
});

// 拖拽处理
function onDragOver(event: DragEvent) {
  event.preventDefault();
  isDragOver.value = true;
  
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'copy';
  }
}

function onDragLeave(event: DragEvent) {
  // 只有当离开整个容器时才取消拖拽状态
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
  const x = event.clientX;
  const y = event.clientY;
  
  if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
    isDragOver.value = false;
  }
}

function onDrop(event: DragEvent) {
  event.preventDefault();
  isDragOver.value = false;
  
  if (event.dataTransfer) {
    const data = event.dataTransfer.getData("application/json");
    if (data) {
      try {
        const widget = JSON.parse(data) as WidgetMeta;
        emit('addComponent', widget);
      } catch (e) {
        console.error("Failed to parse dropped component", e);
      }
    }
  }
}

// 操作方法
function clearCanvas() {
  emit('clearCanvas');
}

function previewMode() {
  emit('previewMode');
}
</script>

<style scoped>
.canvas-area {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f8f9fa;
}

.canvas-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #fff;
  border-bottom: 1px solid #e6e6e6;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.canvas-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.canvas-actions {
  display: flex;
  gap: 8px;
}

.btn {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background: #fff;
  color: #666;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.canvas-container {
  flex: 1;
  position: relative;
  margin: 16px;
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  background: #fff;
  transition: all 0.3s ease;
  overflow: auto;
}

.canvas-container.empty {
  display: flex;
  align-items: center;
  justify-content: center;
}

.canvas-container.drag-over {
  border-color: #1890ff;
  background: #f0f8ff;
  transform: scale(1.02);
}

.empty-state {
  text-align: center;
  color: #999;
  user-select: none;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.6;
}

.empty-text {
  font-size: 16px;
  margin-bottom: 8px;
  color: #666;
}

.empty-hint {
  font-size: 14px;
  color: #999;
}

.canvas-content {
  padding: 16px;
  min-height: 100%;
}

.drop-indicator {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(24, 144, 255, 0.1);
  backdrop-filter: blur(2px);
  z-index: 1000;
}

.drop-zone {
  padding: 32px;
  border: 2px dashed #1890ff;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.9);
  text-align: center;
  animation: pulse 2s infinite;
}

.drop-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.drop-text {
  font-size: 16px;
  color: #1890ff;
  font-weight: 500;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
}

/* 滚动条样式 */
.canvas-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.canvas-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.canvas-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.canvas-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>