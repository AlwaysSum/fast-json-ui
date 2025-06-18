<template>
  <div :style="stackStyle">
    <fast-json-widget
      v-for="(item, index) in config.children"
      :key="index"
      :config="item"
      :data="data"
      :methods="methods"
      :style="getItemStyle(item)"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from "vue";
import * as FastJsonUI from "../../utils/fast-json-ui";

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
</script>
