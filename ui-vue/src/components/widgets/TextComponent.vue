<template>
  <div :style="textStyle" :title="showEllipsis ? getValueFromConfig(config.text) : undefined">
    <span v-if="showEllipsis" class="text-ellipsis">{{ getValueFromConfig(config.text) }}</span>
    <span v-else>{{ getValueFromConfig(config.text) }}</span>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue';
import * as FastJsonUI from '../../utils/fast-json-ui';

// 定义属性
const props = defineProps({
  config: { type: Object, required: true },
  data: { type: Object, default: () => ({}) },
  methods: { type: Object, default: () => ({}) }
});

/**
 * 从配置中获取值
 */
const getValueFromConfig = (value: any): any => {
  return FastJsonUI.getValueFromConfig(value, props.data, props.methods);
};

const showEllipsis = computed(() => !!props.config.ellipsis);

const textStyle = computed(() => ({
  color: props.config.color || '#222',
  fontSize: props.config.fontSize ? `${props.config.fontSize}px` : '16px',
  fontWeight: props.config.fontWeight || 'normal',
  fontStyle: props.config.fontStyle || 'normal',
  textAlign: props.config.textAlign || 'left',
  lineHeight: props.config.lineHeight ? props.config.lineHeight : 1.5,
  margin: props.config.margin || 0,
  padding: props.config.padding || 0,
  backgroundColor: props.config.backgroundColor || undefined,
  overflow: showEllipsis.value ? 'hidden' : undefined,
  textOverflow: showEllipsis.value ? 'ellipsis' : undefined,
  whiteSpace: showEllipsis.value ? 'nowrap' : undefined,
  display: showEllipsis.value ? 'block' : undefined
}));
</script>

<style scoped>
.text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}
</style> 