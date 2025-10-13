<template>
  <div class="property-editor">
    <t-card v-if="!meta" title="属性编辑器" :bordered="false">
      <t-empty description="没有可编辑的属性" />
    </t-card>
    <t-form v-else :data="formData" :colon="true" label-width="88px" size="small" @submit="onSubmit">
      <!-- 通用属性：名称 -->
      <t-form-item label="名称" name="name">
        <t-input v-model="formData.name" placeholder="请输入名称" size="small" @change="handleStringInput($event, 'name')" />
      </t-form-item>
      <t-form-item v-for="property in filteredProperties" :key="property.name" :label="property.label"
        :name="property.name" :required="property.required">
        <!-- 字符串属性 -->
        <t-input v-if="property.type === 'string'" v-model="formData[property.name]"
          :placeholder="`请输入${property.label}`" size="small" @change="handleStringInput($event, property.name)" />

        <!-- 数字属性 -->
        <t-input-number v-else-if="property.type === 'number'" v-model="formData[property.name]"
          :placeholder="`请输入${property.label}`" size="small" @change="handleNumberInput($event, property.name)" />

        <!-- 布尔属性 -->
        <t-switch v-else-if="property.type === 'boolean'" v-model="formData[property.name]" size="small"
          @change="handleBooleanChange($event, property.name)" />

        <!-- 选择属性 -->
        <t-select v-else-if="property.type === 'select'" v-model="formData[property.name]"
          :placeholder="`请选择${property.label}`" size="small" @change="handleSelectChange($event, property.name)">
          <t-option v-for="option in property.options" :key="option.value" :value="option.value"
            :label="option.label" />
        </t-select>

        <!-- 颜色属性 -->
        <t-color-picker v-else-if="property.type === 'color'" v-model="formData[property.name]" size="small"
          @change="handleColorInput($event, property.name)" />

        <!-- 表达式属性 -->
        <t-textarea v-else-if="property.type === 'expression'" v-model="formData[property.name]"
          :placeholder="`请输入${property.label}`" :autosize="{ minRows: 3, maxRows: 6 }" size="small"
          @change="handleTextareaInput($event, property.name)" />

        <!-- 方法属性 -->
        <t-textarea v-else-if="property.type === 'method'" v-model="formData[property.name]" placeholder="输入方法名称"
          :autosize="{ minRows: 3, maxRows: 6 }" size="small" @change="handleTextareaInput($event, property.name)" />

        <!-- 默认输入 -->
        <t-input v-else v-model="formData[property.name]" :placeholder="`请输入${property.label}`" size="small"
          @change="handleStringInput($event, property.name)" />
      </t-form-item>

      <!-- 特殊属性：子组件 -->
      <t-form-item v-if="hasChildren" label="子组件">
        <div class="children-info">
          <t-space align="center">
            <t-tag theme="primary" variant="light">
              {{ childrenCount }} 个子组件
            </t-tag>
            <t-button theme="primary" size="small" @click="handleAddComponentClick">
              <template #icon>
                <AddIcon />
              </template>
              添加子组件
            </t-button>
          </t-space>
        </div>
      </t-form-item>
    </t-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, reactive } from 'vue';
import { ComponentConfig } from "fast-json-ui-vue";
import { WidgetFactory } from "fast-json-ui-vue";
import { AddIcon } from 'tdesign-icons-vue-next';

// Props
const props = defineProps({
  component: {
    type: Object as () => ComponentConfig,
    required: true,
  },
  meta: {
    type: Object as () => WidgetFactory.WidgetMeta | undefined,
    default: undefined,
  },
  path: {
    type: Array as () => string[],
    default: () => [],
  },
});

// Emits
const emit = defineEmits<{
  update: [name: string, value: any];
  addComponent: [path: string[]];
}>();

// 表单数据
const formData = reactive<Record<string, any>>({});

// 监听组件变化，同步表单数据
watch(
  () => props.component,
  (newComponent) => {
    if (!newComponent) return;
    // 通用属性：name
    (formData as any).name = (newComponent as any).name || '';
    if (props.meta?.properties) {
      props.meta.properties.forEach((property) => {
        formData[property.name] = (newComponent as any)[property.name];
      });
    }
  },
  { immediate: true, deep: true }
);

// 过滤掉 child/children 的属性
const filteredProperties = computed(() => {
  return (
    props.meta?.properties?.filter(
      (p) => p.name !== "child" && p.name !== "children"
    ) || []
  );
});

// 是否有子组件 - 只对容器类型组件显示添加按钮
const hasChildren = computed(() => {
  const keys = Object.keys(props.component)
  return keys.includes("child") || keys.includes("children");
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

// 添加子组件逻辑
function handleAddComponentClick() {
  // 发出事件，让父组件处理添加组件逻辑
  emit("addComponent", props.path || []);
}

// 更新属性
function updateProperty(name: string, value: any) {
  emit("update", name, value);
}

// 事件处理方法
function handleStringInput(value: any, propertyName: string) {
  updateProperty(propertyName, value);
}

function handleNumberInput(value: any, propertyName: string) {
  updateProperty(propertyName, value);
}

function handleBooleanChange(value: any, propertyName: string) {
  updateProperty(propertyName, value);
}

function handleSelectChange(value: any, propertyName: string) {
  updateProperty(propertyName, value);
}

function handleColorInput(value: any, propertyName: string) {
  updateProperty(propertyName, value);
}

function handleTextareaInput(value: any, propertyName: string) {
  updateProperty(propertyName, value);
}

// 表单提交（可选）
function onSubmit() {
  // 可以在这里处理表单提交逻辑
}
</script>

<style scoped>
.property-editor {
  padding: 12px;
  background: var(--td-bg-color-container);
}

.no-properties {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.property-type {
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--td-border-level-1-color);
}

.children-info {
  padding: 12px;
  background: var(--td-bg-color-container-hover);
  border-radius: var(--td-radius-default);
  border: 1px solid var(--td-border-level-1-color);
}

:deep(.t-form-item) {
  margin-bottom: 8px;
}

:deep(.t-form__label) {
  font-weight: 500;
  color: var(--td-text-color-primary);
}

:deep(.t-input),
:deep(.t-textarea),
:deep(.t-select),
:deep(.t-input-number) {
  width: 100%;
}

:deep(.t-color-picker) {
  width: 100%;
}

:deep(.t-color-picker .t-color-picker__trigger) {
  width: 100%;
  height: 32px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .property-editor {
    padding: 12px;
  }

  :deep(.t-form) {
    --td-form-label-width: 60px;
  }
}
</style>
