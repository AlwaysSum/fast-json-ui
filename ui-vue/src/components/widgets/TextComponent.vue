<template>
  <div>{{ getValueFromConfig(config.text) }}</div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
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
</script> 