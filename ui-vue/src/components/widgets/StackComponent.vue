<template>
  <div :style="stackStyle">
    <fast-json-widget 
      v-for="(item, index) in config.children" 
      :key="index" 
      :config="item" 
      :data="data" 
      :methods="methods"
      :style="getItemStyle(index)"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue';
import * as FastJsonUI from '../../utils/fast-json-ui';

const props = defineProps({
  config: { type: Object, required: true },
  data: { type: Object, default: () => ({}) },
  methods: { type: Object, default: () => ({}) }
});

const stackStyle = computed(() => {
  return {
    position: 'relative' as const,
    ...FastJsonUI.computeStyle(props.config)
  };
});

const getItemStyle = (index: number) => {
  return {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: index
  };
};
</script> 