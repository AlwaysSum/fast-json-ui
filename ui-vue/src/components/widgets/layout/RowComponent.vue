<template>
  <div :style="rowStyle">
    <template v-if="!isEditor || (config.children && config.children.length > 0)">
      <fast-json-widget
        v-for="(item, index) in config.children"
        :key="index"
        :config="item"
        :data="data"
        :methods="methods"
      />
    </template>
    <div v-else class="placeholder row-skeleton">
      <div class="skeleton-item"></div>
      <div class="skeleton-item"></div>
      <div class="skeleton-item"></div>
    </div>
  </div>
  
</template>

<script setup lang="ts">
import { defineProps, computed } from "vue";
import * as FastJsonUI from '../../../utils/fast-json-ui';

const props = defineProps({
  config: { type: Object, required: true },
  data: { type: Object, default: () => ({}) },
  methods: { type: Object, default: () => ({}) },
});

const getValueFromConfig = (value: any): any => {
  return FastJsonUI.getValueFromConfig(value, props.data, props.methods);
};

const rowStyle = computed(() => {
  return {
    display: "flex",
    flexDirection: "row" as const,
    gap: getValueFromConfig(props.config.gap),
    alignItems: getValueFromConfig(props.config.align),
    justifyContent: getValueFromConfig(props.config.justify),
    borderRadius: getValueFromConfig(props.config.borderRadius),
    boxShadow: getValueFromConfig(props.config.boxShadow),
    ...FastJsonUI.computeStyle(props.config),
  };
});

const isEditor = computed(() => FastJsonUI.isEditorMode());
</script>

<style scoped>
.placeholder {
  width: 100%;
  border: 1px dashed #d9d9d9;
  background: #fafafa;
  border-radius: 8px;
}
.row-skeleton {
  display: flex;
  flex-direction: row;
  gap: 8px;
  padding: 12px;
  min-height: 60px;
}
.skeleton-item {
  flex: 1;
  height: 40px;
  background: #eee;
  border-radius: 6px;
  border: 1px solid #e5e5e5;
}
</style>
