<template>
  <button
    :class="[
      'fast-json-button',
      `type-${getValueFromConfig(config.typeStyle) || getValueFromConfig(config.type) || 'primary'}`,
      `size-${getValueFromConfig(config.size) || 'medium'}`,
      { 'is-block': getValueFromConfig(config.block) },
      { 'is-loading': getValueFromConfig(config.loading) },
      { [`shape-${getValueFromConfig(config.shape)}`]: !!getValueFromConfig(config.shape) }
    ]"
    :style="{
      backgroundColor: getValueFromConfig(config.backgroundColor),
      color: getValueFromConfig(config.color),
      borderRadius: getValueFromConfig(config.borderRadius),
      width: getValueFromConfig(config.width),
      height: getValueFromConfig(config.height),
      fontSize: getValueFromConfig(config.fontSize),
      fontWeight: getValueFromConfig(config.fontWeight),
      padding: getValueFromConfig(config.padding),
      margin: getValueFromConfig(config.margin),
      boxShadow: getValueFromConfig(config.boxShadow),
    }"
    :disabled="getValueFromConfig(config.disabled) || getValueFromConfig(config.loading)"
    @mouseover="onHover"
    @mouseleave="onLeave"
    @mousedown="onActive"
    @mouseup="onLeave"
  >
    <span v-if="getValueFromConfig(config.loading)" class="button-loading">⏳</span>
    <span v-if="config.icon && !getValueFromConfig(config.loading)" class="button-icon">{{
      getValueFromConfig(config.icon)
    }}</span>
    <span class="button-text">{{ getValueFromConfig(config.text) }}</span>
  </button>
</template>

<script setup lang="ts">
import { defineProps, ref } from "vue";
import * as FastJsonUI from '../../../utils/fast-json-ui';

const props = defineProps({
  config: { type: Object, required: true },
  data: { type: Object, default: () => ({}) },
  methods: { type: Object, default: () => ({}) },
});

const getValueFromConfig = (value: any): any => {
  if (value === undefined) return undefined;
  return FastJsonUI.getValueFromConfig(value, props.data, props.methods);
};

const originalBg = ref<string | undefined>(undefined);
const originalColor = ref<string | undefined>(undefined);

function onHover(e: MouseEvent) {
  const hoverColor = getValueFromConfig(props.config.hoverColor);
  if (hoverColor) {
    const btn = e.currentTarget as HTMLElement;
    originalBg.value = btn.style.backgroundColor;
    btn.style.backgroundColor = hoverColor;
  }
  const hoverTextColor = getValueFromConfig(props.config.hoverTextColor);
  if (hoverTextColor) {
    const btn = e.currentTarget as HTMLElement;
    originalColor.value = btn.style.color;
    btn.style.color = hoverTextColor;
  }
}
function onActive(e: MouseEvent) {
  const activeColor = getValueFromConfig(props.config.activeColor);
  if (activeColor) {
    const btn = e.currentTarget as HTMLElement;
    btn.style.backgroundColor = activeColor;
  }
}
function onLeave(e: MouseEvent) {
  const btn = e.currentTarget as HTMLElement;
  if (originalBg.value !== undefined) btn.style.backgroundColor = originalBg.value;
  if (originalColor.value !== undefined) btn.style.color = originalColor.value;
}
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
.is-block {
  display: flex;
  width: 100%;
}
.shape-circle {
  border-radius: 50%;
  padding-left: 0;
  padding-right: 0;
  width: 40px;
  height: 40px;
  justify-content: center;
}
.shape-round {
  border-radius: 20px;
}
.button-loading {
  margin-right: 6px;
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
