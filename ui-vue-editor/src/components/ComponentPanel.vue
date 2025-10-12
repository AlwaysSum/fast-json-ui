<template>
  <div class="component-panel">
    <div class="panel-header">
      <h3>组件</h3>
      <div class="panel-tabs">
        <div class="tab active">系统组件</div>
        <div class="tab">自定义组件</div>
      </div>
      <div class="search-container">
        <input 
          v-model="searchText" 
          type="text" 
          placeholder="输入关键字查询组件" 
          class="search-input"
        />
        <span class="search-icon">🔍</span>
      </div>
    </div>
    
    <div class="component-categories">
      <div 
        v-for="category in filteredCategories" 
        :key="category.name"
        class="category-section"
      >
        <div class="category-header" @click="toggleCategory(category.name)">
          <span class="category-name">{{ getCategoryLabel(category.name) }}</span>
          <span class="toggle-icon" :class="{ expanded: expandedCategories.includes(category.name) }">
            ▼
          </span>
        </div>
        
        <div 
          v-if="expandedCategories.includes(category.name)" 
          class="component-grid"
        >
          <div
            v-for="widget in category.widgets"
            :key="widget.type"
            class="component-item"
            draggable="true"
            @dragstart="onDragStart($event, widget)"
            @dragend="onDragEnd($event)"
            @click="addComponent(widget)"
          >
            <span class="component-icon">{{ getComponentIcon(widget.type) }}</span>
            <span class="component-name">{{ getComponentName(widget.type) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { WidgetFactory } from 'fast-json-ui-vue';
import type { WidgetMeta, ComponentCategory } from 'fast-json-ui-vue/src/components/WidgetFactory';

// Props
interface Props {
  searchable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  searchable: true
});

// Emits
const emit = defineEmits<{
  dragComponent: [widget: WidgetMeta];
  addComponent: [widget: WidgetMeta];
}>();

// 响应式数据
const searchText = ref('');
const expandedCategories = ref<string[]>(['layout', 'data', 'form']);
const widgets = ref<WidgetMeta[]>([]);

// 获取所有组件
onMounted(() => {
  const registry = WidgetFactory.getWidgetRegistry();
  widgets.value = Object.values(registry).map(reg => reg.metadata);
});

// 按分类分组的组件
const categorizedWidgets = computed(() => {
  const categories: Record<string, WidgetMeta[]> = {
    layout: [],
    data: [],
    form: []
  };
  
  widgets.value.forEach((widget: WidgetMeta) => {
    // 根据组件类型分类
    if (['container', 'row', 'column', 'stack', 'flex', 'panel', 'card', 'tabs', 'collapse', 'drawer'].includes(widget.type)) {
      categories.layout.push(widget);
    } else if (['table', 'list', 'tree', 'chart'].includes(widget.type)) {
      categories.data.push(widget);
    } else if (['text', 'textarea', 'input', 'button', 'select', 'checkbox', 'radio', 'switch', 'slider', 'date', 'upload'].includes(widget.type)) {
      categories.form.push(widget);
    }
  });
  
  return categories;
});

// 过滤后的分类
const filteredCategories = computed(() => {
  const categories = Object.entries(categorizedWidgets.value).map(([name, widgets]) => ({
    name,
    widgets: widgets.filter((widget: WidgetMeta) => 
      !searchText.value || 
      getComponentName(widget.type).toLowerCase().includes(searchText.value.toLowerCase()) ||
      widget.type.toLowerCase().includes(searchText.value.toLowerCase())
    )
  })).filter(category => category.widgets.length > 0);
  
  return categories;
});

// 获取分类标签
function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    layout: '布局容器',
    data: '数据容器',
    form: '表单项'
  };
  return labels[category] || '其他组件';
}

// 获取组件图标
function getComponentIcon(type: string): string {
  const icons: Record<string, string> = {
    // 布局容器
    'row': '⬅️➡️',
    'column': '⬆️⬇️', 
    'container': '📦',
    'stack': '🗂️',
    'flex': '🔧',
    'panel': '🗃️',
    'card': '🃏',
    'tabs': '📑',
    'collapse': '📁',
    'drawer': '🗄️',
    
    // 数据容器
    'table': '📊',
    'list': '📋',
    'tree': '🌳',
    'chart': '📈',
    
    // 表单项
    'text': '📝',
    'textarea': '📄',
    'input': '✏️',
    'button': '🔘',
    'select': '📋',
    'checkbox': '☑️',
    'radio': '🔘',
    'switch': '🔄',
    'slider': '🎚️',
    'date': '📅',
    'upload': '📤'
  };
  return icons[type] || '🧩';
}

// 获取组件名称
function getComponentName(type: string): string {
  const names: Record<string, string> = {
    // 布局容器
    'row': 'Flex 布局',
    'column': '分栏',
    'container': '容器',
    'stack': '状态容器',
    'flex': '自由容器',
    'panel': '悬浮容器',
    'card': '折叠面板',
    'tabs': '选项卡',
    'collapse': '面板',
    'drawer': '抽屉',
    
    // 数据容器
    'table': '表格2.0',
    'list': '表单',
    'tree': '服务Server',
    'chart': '增删改查',
    
    // 表单项
    'text': '文本框',
    'textarea': '多行文本框',
    'input': '输入框',
    'button': '按钮',
    'select': '下拉选择',
    'checkbox': '复选框',
    'radio': '单选框',
    'switch': '开关',
    'slider': '滑块',
    'date': '日期选择',
    'upload': '文件上传'
  };
  return names[type] || type;
}

// 切换分类展开状态
function toggleCategory(category: string) {
  const index = expandedCategories.value.indexOf(category);
  if (index > -1) {
    expandedCategories.value.splice(index, 1);
  } else {
    expandedCategories.value.push(category);
  }
}

// 拖拽开始
function onDragStart(event: DragEvent, widget: WidgetMeta) {
  if (event.dataTransfer) {
    // 设置拖拽数据，包含完整的 widget 信息
    event.dataTransfer.setData('application/json', JSON.stringify(widget));
    event.dataTransfer.effectAllowed = 'copy';
    
    // 添加拖拽样式
    (event.target as HTMLElement).classList.add('dragging');
  }
  emit('dragComponent', widget);
}

// 拖拽结束
function onDragEnd(event: DragEvent) {
  // 移除拖拽样式
  (event.target as HTMLElement).classList.remove('dragging');
}

// 添加组件
function addComponent(widget: WidgetMeta) {
  emit('addComponent', widget);
}
</script>

<style scoped>
.component-panel {
  width: 280px;
  background: #fff;
  border-right: 1px solid #e6e6e6;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.panel-header {
  padding: 16px;
  border-bottom: 1px solid #e6e6e6;
}

.panel-header h3 {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.panel-tabs {
  display: flex;
  margin-bottom: 12px;
}

.tab {
  padding: 6px 12px;
  font-size: 14px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  color: #666;
}

.tab.active {
  color: #1890ff;
  border-bottom-color: #1890ff;
}

.search-container {
  position: relative;
}

.search-input {
  width: 100%;
  padding: 8px 32px 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  background: #fafafa;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: #1890ff;
  background: #fff;
}

.search-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  font-size: 14px;
}

.component-categories {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.category-section {
  margin-bottom: 8px;
}

.category-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  background: #f5f5f5;
  border-bottom: 1px solid #e6e6e6;
  user-select: none;
  transition: background-color 0.2s;
}

.category-header:hover {
  background-color: #e6f7ff;
}

.category-icon {
  margin-right: 8px;
  font-size: 16px;
}

.category-name {
  flex: 1;
}

.toggle-icon {
  font-size: 12px;
  color: #999;
  transition: transform 0.2s;
}

.toggle-icon.expanded {
  transform: rotate(180deg);
}

.component-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding: 12px 16px;
  background: #fafafa;
}

.component-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
  border: 1px solid #e6e6e6;
  border-radius: 6px;
  cursor: move;
  background: #fff;
  transition: all 0.2s;
  min-height: 60px;
  justify-content: center;
  user-select: none;
}

.component-item:hover {
  border-color: #1890ff;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.2);
  transform: translateY(-1px);
}

.component-item:active {
  transform: scale(0.98);
}

.component-icon {
  font-size: 20px;
  margin-bottom: 4px;
}

.component-name {
  font-size: 12px;
  color: #666;
  text-align: center;
  line-height: 1.2;
  font-weight: 400;
}

/* 拖拽时的样式 */
.component-item.dragging {
  opacity: 0.5;
  transform: scale(0.95);
}

/* 滚动条样式 */
.component-categories::-webkit-scrollbar {
  width: 6px;
}

.component-categories::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.component-categories::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.component-categories::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>