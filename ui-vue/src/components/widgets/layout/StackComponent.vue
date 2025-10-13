<template>
  <div :style="stackStyle">
    <template v-if="!isEditor || (config.children && config.children.length > 0)">
      <fast-json-widget
        v-for="(item, index) in config.children"
        :key="index"
        :config="item"
        :data="data"
        :methods="methods"
        :style="getItemStyle(item)"
      />
    </template>
    <div v-else class="placeholder stack-skeleton">
      <div class="layer layer1"></div>
      <div class="layer layer2"></div>
      <div class="layer layer3"></div>
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

const direction = computed(() => props.config.direction || "column");
const gap = computed(() => props.config.gap || 0);
const alignItems = computed(() => props.config.alignItems || "stretch");
const justifyContent = computed(() => props.config.justifyContent || "flex-start");

const stackStyle = computed(() => ({
  display: "flex",
  flexDirection: direction.value,
  gap: typeof gap.value === "number" ? `${gap.value}px` : gap.value,
  alignItems: alignItems.value,
  justifyContent: justifyContent.value,
  ...FastJsonUI.computeStyle(props.config),
}));

const getItemStyle = (item: any) => {
  const zIndexMap = props.config.zIndexMap || {};
  let zIndex;
  if (item && item.id && typeof zIndexMap[item.id] === 'number') {
    zIndex = zIndexMap[item.id];
  }
  return zIndex !== undefined ? { zIndex } : {};
};
const isEditor = computed(() => FastJsonUI.isEditorMode());
</script>

<style scoped>
.placeholder {
  width: 100%;
  border: 1px dashed #d9d9d9;
  background: #fafafa;
  border-radius: 8px;
}
.stack-skeleton {
  position: relative;
  min-height: 100px;
}
.stack-skeleton .layer {
  position: absolute;
  border-radius: 6px;
  border: 1px solid #e5e5e5;
  background: #eee;
}
.stack-skeleton .layer1 {
  top: 16px;
  left: 16px;
  right: 32px;
  height: 50px;
  z-index: 1;
}
.stack-skeleton .layer2 {
  top: 32px;
  left: 32px;
  right: 16px;
  height: 50px;
  z-index: 2;
}
.stack-skeleton .layer3 {
  top: 48px;
  left: 24px;
  right: 24px;
  height: 50px;
  z-index: 3;
}
</style>
