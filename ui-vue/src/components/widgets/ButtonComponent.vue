<template>
  <button 
    :class="[
      'fast-json-button',
      `type-${getValueFromConfig(config.type) || 'primary'}`,
      `size-${getValueFromConfig(config.size) || 'medium'}`
    ]"
    :style="{
      backgroundColor: getValueFromConfig(config.backgroundColor),
      color: getValueFromConfig(config.color),
      borderRadius: getValueFromConfig(config.borderRadius),
      width: getValueFromConfig(config.width),
      height: getValueFromConfig(config.height)
    }"
    :disabled="getValueFromConfig(config.disabled)"
  >
    <span v-if="config.icon" class="button-icon">{{ getValueFromConfig(config.icon) }}</span>
    <span class="button-text">{{ getValueFromConfig(config.text) }}</span>
  </button>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import * as FastJsonUI from '../../utils/fast-json-ui';

const props = defineProps({
  config: { type: Object, required: true },
  data: { type: Object, default: () => ({}) },
  methods: { type: Object, default: () => ({}) }
});

const getValueFromConfig = (value: any): any => {
  if (value === undefined) return undefined;
  return FastJsonUI.getValueFromConfig(value, props.data, props.methods);
};
</script>

<style scoped>
.fast-json-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  border: none;
  outline: none;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  white-space: nowrap;
  border-radius: 4px;
}

/* 按钮类型 */
.type-primary {
  background-color: #1890ff;
  color: white;
}

.type-default {
  background-color: #fff;
  color: rgba(0, 0, 0, 0.65);
  border: 1px solid #d9d9d9;
}

.type-danger {
  background-color: #ff4d4f;
  color: white;
}

.type-success {
  background-color: #52c41a;
  color: white;
}

.type-warning {
  background-color: #faad14;
  color: white;
}

/* 按钮尺寸 */
.size-small {
  height: 24px;
  padding: 0 8px;
  font-size: 12px;
}

.size-medium {
  height: 32px;
  padding: 0 16px;
  font-size: 14px;
}

.size-large {
  height: 40px;
  padding: 0 20px;
  font-size: 16px;
}

/* 悬停效果 */
.fast-json-button:hover:not(:disabled) {
  opacity: 0.85;
  transform: translateY(-1px);
}

.fast-json-button:active:not(:disabled) {
  opacity: 0.7;
  transform: translateY(0);
}

/* 禁用状态 */
.fast-json-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 图标 */
.button-icon {
  margin-right: 8px;
}

/* 文本 */
.button-text {
  line-height: 1;
}
</style> 