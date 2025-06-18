<template>
  <div class="property-editor">
    <div v-if="!meta" class="no-properties">
      没有可编辑的属性
    </div>
    <template v-else>
      <div class="property-type">
        <strong>组件类型:</strong> {{ meta.name }}
      </div>
      
      <div 
        v-for="property in meta.properties" 
        :key="property.name"
        class="property-item"
      >
        <div class="property-label">
          {{ property.label }}
          <span class="required" v-if="property.required">*</span>
        </div>
        
        <!-- 字符串属性 -->
        <input 
          v-if="property.type === PropertyType.STRING" 
          type="text" 
          :value="component[property.name]"
          @input="(e: any) => updateProperty(property.name, (e.target as HTMLInputElement).value)"
          class="property-input"
        />
        
        <!-- 数字属性 -->
        <input 
          v-else-if="property.type === PropertyType.NUMBER" 
          type="number" 
          :value="component[property.name]"
          @input="(e: any) => updateProperty(property.name, Number((e.target as HTMLInputElement).value))"
          class="property-input"
        />
        
        <!-- 布尔属性 -->
        <input 
          v-else-if="property.type === PropertyType.BOOLEAN" 
          type="checkbox" 
          :checked="component[property.name]"
          @change="(e: any) => updateProperty(property.name, (e.target as HTMLInputElement).checked)"
          class="property-checkbox"
        />
        
        <!-- 选择属性 -->
        <select 
          v-else-if="property.type === PropertyType.SELECT" 
          :value="component[property.name]"
          @change="(e: any) => updateProperty(property.name, (e.target as HTMLSelectElement).value)"
          class="property-select"
        >
          <option 
            v-for="option in property.options" 
            :key="option.value" 
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
        
        <!-- 颜色属性 -->
        <input 
          v-else-if="property.type === PropertyType.COLOR" 
          type="color" 
          :value="component[property.name]"
          @input="(e: any) => updateProperty(property.name, (e.target as HTMLInputElement).value)"
          class="property-color"
        />
        
        <!-- 表达式属性 -->
        <textarea 
          v-else-if="property.type === PropertyType.EXPRESSION" 
          :value="component[property.name]"
          @input="(e: any) => updateProperty(property.name, (e.target as HTMLTextAreaElement).value)"
          class="property-textarea"
          rows="3"
        ></textarea>
        
        <!-- 方法属性 -->
        <textarea 
          v-else-if="property.type === PropertyType.METHOD" 
          :value="component[property.name]"
          @input="(e: any) => updateProperty(property.name, (e.target as HTMLTextAreaElement).value)"
          class="property-textarea"
          rows="3"
          placeholder="输入方法名称"
        ></textarea>
        
        <!-- 默认输入 -->
        <input 
          v-else
          type="text" 
          :value="component[property.name]"
          @input="(e: any) => updateProperty(property.name, (e.target as HTMLInputElement).value)"
          class="property-input"
        />
      </div>
      
      <!-- 特殊属性：子组件 -->
      <div v-if="hasChildren" class="property-item">
        <div class="property-label">子组件</div>
        <div class="children-count">
          {{ childrenCount }} 个子组件
          <button class="add-child-btn" @click="openAddDialog">添加子组件</button>
        </div>
      </div>
    </template>
    <AddComponentDialog v-if="showAddDialog" :show="showAddDialog" @close="closeAddDialog" @add="handleAddComponent" />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { ComponentConfig } from 'fast-json-ui-vue';
import { ComponentMeta, PropertyType } from '../types';
import { availableComponents } from '../config/config';
import AddComponentDialog from './AddComponentDialog.vue';

// Props
const props = defineProps({
  component: {
    type: Object as () => ComponentConfig,
    required: true
  },
  meta: {
    type: Object as () => ComponentMeta | undefined,
    default: undefined
  }
});

// Emits
const emit = defineEmits(['update']);

// 是否有子组件
const hasChildren = computed(() => {
  return props.component.children || props.component.child;
});

// 子组件数量
const childrenCount = computed(() => {
  if (props.component.children) {
    return props.component.children.length;
  } else if (props.component.child) {
    return 1;
  }
  return 0;
});

// 新增：添加子组件弹窗逻辑
const showAddDialog = ref(false);
function openAddDialog() {
  showAddDialog.value = true;
}
function closeAddDialog() {
  showAddDialog.value = false;
}
function handleAddComponent(type: string) {
  const metaToAdd = availableComponents.find(c => c.type === type);
  if (metaToAdd) {
    if (Array.isArray(props.component.children)) {
      props.component.children.push(JSON.parse(JSON.stringify(metaToAdd.defaultConfig)));
    } else if (props.component.child === undefined) {
      props.component.child = JSON.parse(JSON.stringify(metaToAdd.defaultConfig));
    }
    emit('update', '', '');
  }
  closeAddDialog();
}

// 更新属性
function updateProperty(name: string, value: any) {
  emit('update', props.component, name, value);
}
</script>

<style scoped>
.property-editor {
  padding: 8px;
}

.no-properties {
  color: #999;
  font-style: italic;
}

.property-type {
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.property-item {
  margin-bottom: 12px;
}

.property-label {
  margin-bottom: 4px;
  font-size: 14px;
  color: #333;
}

.required {
  color: #f5222d;
  margin-left: 4px;
}

.property-input,
.property-select,
.property-textarea {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
}

.property-input:focus,
.property-select:focus,
.property-textarea:focus {
  border-color: #40a9ff;
  outline: none;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.property-checkbox {
  margin-right: 8px;
}

.property-color {
  width: 100%;
  height: 32px;
  padding: 0;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
}

.children-count {
  color: #666;
  font-size: 14px;
}

.add-child-btn {
  margin-left: 12px;
  font-size: 12px;
  padding: 2px 8px;
  border: 1px solid #1890ff;
  background: #fff;
  color: #1890ff;
  border-radius: 3px;
  cursor: pointer;
  transition: background 0.18s, color 0.18s;
}
.add-child-btn:hover {
  background: #e6f7ff;
}
</style> 