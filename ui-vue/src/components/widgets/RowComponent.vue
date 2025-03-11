<template>
  <div :style="rowStyle">
    <fast-json-widget 
      v-for="(item, index) in config.children" 
      :key="index" 
      :config="item" 
      :data="data" 
      :methods="methods"
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

const rowStyle = computed(() => {
  return {
    display: 'flex',
    flexDirection: 'row' as const,
    ...FastJsonUI.computeStyle(props.config)
  };
});
</script> 