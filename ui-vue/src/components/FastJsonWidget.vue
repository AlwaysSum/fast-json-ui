<template>
  <component 
    :is="getComponentByType(config.type)" 
    :config="config" 
    :data="data" 
    :methods="methods"
  >
    <template #default="slotProps">
      <FastJsonWidget 
        v-if="slotProps.child && !isCustomComponent(slotProps.child.type)" 
        :config="slotProps.child" 
        :data="data" 
        :methods="methods"
      >
        <template #default="childSlotProps">
          <slot :child="childSlotProps.child"></slot>
        </template>
      </FastJsonWidget>
      <slot v-else :child="slotProps.child"></slot>
    </template>
  </component>
</template>

<script setup lang="ts">
import { type PropType } from 'vue';
import { ComponentConfig, ConfigData, ConfigMethods } from '../types';
import * as FastJsonUI from '../utils/fast-json-ui';
import { getComponentByType, componentMap } from './WidgetFactory';

// Define props
defineProps({
  config: {
    type: Object as PropType<ComponentConfig>,
    required: true
  },
  data: {
    type: Object as PropType<ConfigData>,
    default: () => ({})
  },
  methods: {
    type: Object as PropType<ConfigMethods>,
    default: () => ({})
  }
});

/**
 * 判断是否为自定义组件
 */
function isCustomComponent(type: string): boolean {
  // 检查组件类型是否在组件映射中
  return !componentMap[type];
}

// 设置全局数据
FastJsonUI.setGlobalData('theme', 'dark');

// 修复模板中的类型错误
defineSlots<{
  default(props: { child: ComponentConfig }): any;
}>();
</script>

<style scoped>
.row {
  display: flex;
  flex-direction: row;
}

.column {
  display: flex;
  flex-direction: column;
}

.stack {
  position: relative;
}

.container {
  display: flex;
}
</style> 