<template>
  <t-dialog
    :visible="dialogVisible"
    header="选择要添加的组件"
    width="800px"
    :close-on-overlay-click="true"
    @close="handleClose"
  >
    <div class="component-panel">
      <t-tabs v-model="activeTab" placement="top">
        <t-tab-panel
          v-for="category in categories"
          :key="category"
          :value="category"
          :label="getCategoryName(category)"
        >
          <div class="component-grid">
            <div
              v-for="component in getComponentsByCategory(category)"
              :key="component.type"
              class="component-card"
              :class="{ selected: selectedType === component.type }"
              @click="select(component.type)"
            >
              <div class="component-name">{{ component.name }}</div>
            </div>
          </div>
        </t-tab-panel>
      </t-tabs>
    </div>
    
    <template #footer>
      <t-space>
        <t-button theme="default" @click="handleClose">取消</t-button>
        <t-button 
          theme="primary" 
          :disabled="!selectedType" 
          @click="handleAdd"
        >
          确定添加
        </t-button>
      </t-space>
    </template>
  </t-dialog>
</template>
<script lang="ts" setup>
import { ref, computed, watch } from "vue";
import { WidgetFactory } from "fast-json-ui-vue";

const props = defineProps<{ show: boolean }>();
const emit = defineEmits(["close", "add"]);

const visible = computed(() => props.show);
const dialogVisible = ref(false);
const selectedType = ref("");
const activeTab = ref("");

// 监听 show 属性变化
watch(() => props.show, (newVal) => {
  dialogVisible.value = newVal;
  if (newVal) {
    // 重置选择状态
    selectedType.value = "";
    // 设置默认激活的标签页
    if (categories.value.length > 0) {
      activeTab.value = categories.value[0];
    }
  }
});

function select(type: string) {
  selectedType.value = type;
}

function handleAdd() {
  if (selectedType.value) {
    emit("add", selectedType.value);
    selectedType.value = "";
    dialogVisible.value = false;
  }
}

function handleClose() {
  selectedType.value = "";
  dialogVisible.value = false;
  emit('close');
}

const categories = computed(() => {
  const set = new Set<string>();
  Object.values(WidgetFactory.getWidgetRegistry()).forEach((reg: any) => {
    if (reg && reg.metadata && reg.metadata.category) {
      set.add(reg.metadata.category);
    } else {
      set.add("other");
    }
  });
  return Array.from(set);
});

function getCategoryName(category: string) {
  const categoryMap: Record<string, string> = {
    basic: "基础组件",
    layout: "布局组件", 
    form: "表单组件",
    custom: "自定义组件",
    display: "展示组件",
    feedback: "反馈组件",
    navigation: "导航组件",
    other: "其他组件"
  };
  return categoryMap[category] || category;
}

function getComponentsByCategory(category: string) {
  return Object.values(WidgetFactory.getWidgetRegistry())
    .filter(
      (reg: any) => reg && reg.metadata && reg.metadata.category === category
    )
    .map((reg: any) => reg.metadata);
}
</script>

<style scoped>
.add-component-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.dialog-content {
  position: relative;
  background: white;
  border-radius: 8px;
  width: 600px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e5e5;
}

.dialog-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
  color: #666;
}

.close-btn:hover {
  color: #333;
}

.component-panel {
  display: flex;
  height: 400px;
}

.category-tabs {
  width: 120px;
  border-right: 1px solid #e5e5e5;
  background-color: #f8f9fa;
}

.tab-btn {
  display: block;
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  border-bottom: 1px solid #e5e5e5;
}

.tab-btn:hover {
  background-color: #e9ecef;
}

.tab-btn.active {
  background-color: white;
  color: #007bff;
  font-weight: 500;
}

.component-grid {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-content: flex-start;
}

.component-card {
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
  min-width: 120px;
  text-align: center;
}

.component-card:hover {
  border-color: #007bff;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.15);
}

.component-card.selected {
  border-color: #007bff;
  background-color: #f0f8ff;
}

.component-name {
  font-weight: 500;
  font-size: 14px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px 20px;
  border-top: 1px solid #e5e5e5;
  background-color: #f8f9fa;
}

.btn {
  padding: 8px 16px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-default:hover:not(:disabled) {
  background-color: #f8f9fa;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #0056b3;
  border-color: #0056b3;
}
</style>
