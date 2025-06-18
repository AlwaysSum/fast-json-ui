<template>
  <div class="add-component-dialog-mask">
    <div class="add-component-dialog">
      <div class="dialog-title">选择要添加的组件</div>
      <div class="component-panel add-panel">
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
              :class="{ selected: selectedType === component.type }"
              @click="select(component.type)"
            >
              <span class="component-icon" v-if="component.icon">{{ component.icon }}</span>
              <span class="component-name">{{ component.name }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="dialog-actions">
        <button @click="$emit('close')">取消</button>
        <button :disabled="!selectedType" @click="add">添加</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { availableComponents } from '../config/config';
import { ComponentCategory } from '../types';

const props = defineProps<{ show: boolean }>();
const emit = defineEmits(['close', 'add']);

const selectedType = ref('');
function select(type: string) {
  selectedType.value = type;
}
function add() {
  emit('add', selectedType.value);
  selectedType.value = '';
}

const categories = computed(() => {
  const set = new Set(availableComponents.map(c => c.category));
  return Array.from(set);
});
function getCategoryName(category: ComponentCategory) {
  switch (category) {
    case ComponentCategory.BASIC: return '基础组件';
    case ComponentCategory.LAYOUT: return '布局组件';
    case ComponentCategory.FORM: return '表单组件';
    default: return category;
  }
}
function getComponentsByCategory(category: ComponentCategory) {
  return availableComponents.filter(c => c.category === category);
}
</script>

<style scoped>
.add-component-dialog-mask {
  position: fixed;
  left: 0; top: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.18);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.add-component-dialog {
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.13);
  padding: 24px 28px 18px 28px;
  min-width: 340px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.dialog-title {
  font-weight: bold;
  margin-bottom: 8px;
}
.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 10px;
}
.dialog-actions button {
  font-size: 13px;
  padding: 3px 14px;
  border-radius: 3px;
  border: 1px solid #1890ff;
  background: #fff;
  color: #1890ff;
  cursor: pointer;
  transition: background 0.18s, color 0.18s;
}
.dialog-actions button:disabled {
  color: #aaa;
  border-color: #ccc;
  cursor: not-allowed;
}
.dialog-actions button:hover:not(:disabled) {
  background: #e6f7ff;
}
.add-panel {
  width: 340px;
  max-height: 320px;
  overflow-y: auto;
  background: none;
  border: none;
  padding: 0;
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
  cursor: pointer;
  user-select: none;
  min-width: 90px;
  margin-bottom: 4px;
  transition: background 0.18s, border 0.18s;
}
.component-item.selected, .component-item:hover {
  background-color: #e6f7ff;
  border-color: #1890ff;
}
.component-icon {
  margin-right: 4px;
}
</style> 