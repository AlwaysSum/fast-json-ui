<template>
  <div :style="containerStyle" v-if="config.children && config.children.length > 0">
    <fast-json-widget
      v-for="(item, index) in config.children"
      :key="index"
      :config="item"
      :data="data"
      :methods="methods"
    />
  </div>
  <div :style="containerStyle" v-else>
    <fast-json-widget :config="config.child" :data="data" :methods="methods" />
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
</script>
