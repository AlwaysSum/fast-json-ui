<template>
  <div :style="containerStyle">
    <template v-if="config.children && config.children.length > 0">
      <fast-json-widget
        v-for="(item, index) in config.children"
        :key="index"
        :config="item"
        :data="data"
        :methods="methods"
      />
    </template>
    <template v-else-if="config.child">
      <fast-json-widget :config="config.child" :data="data" :methods="methods" />
    </template>
    <div v-else-if="isEditor" class="placeholder container-skeleton">
      <div class="skeleton-inner">
        <div class="skeleton-item"></div>
      </div>
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

const containerStyle = computed(() => {
  return {
    display: "flex",
    flexDirection: "column" as const,
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
.container-skeleton {
  padding: 12px;
  min-height: 80px;
}
.skeleton-inner {
  border: 1px dashed #e0e0e0;
  border-radius: 8px;
  padding: 12px;
  background: #fff;
}
.skeleton-item {
  height: 60px;
  background: #f0f0f0;
  border-radius: 6px;
  border: 1px solid #e5e5e5;
}
</style>
