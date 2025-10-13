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
    
    <div class="canvas-container">
      <div v-if="isEmpty" class="empty-hint">
        <div class="empty-icon">📱</div>
        <div class="empty-text">点击左侧组件面板中的组件开始设计</div>
        <div class="empty-sub">选择合适的组件来构建您的界面</div>
      </div>

      <div class="canvas-content">
        <fast-json-widget
          :config="config"
          :data="data"
          :methods="methods"
        />
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

// 计算属性
const isEmpty = computed(() => {
  return !props.config || 
         (!props.config.children?.length && !props.config.child);
});



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



.empty-hint {
  padding: 16px;
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

.empty-sub {
  font-size: 14px;
  color: #999;
}

.canvas-content {
  padding: 16px;
  min-height: 100%;
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