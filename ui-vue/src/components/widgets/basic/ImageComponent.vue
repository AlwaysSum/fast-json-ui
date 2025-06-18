<template>
  <img
    :src="getValueFromConfig(config.src)"
    :alt="getValueFromConfig(config.alt)"
    :width="getValueFromConfig(config.width)"
    :height="getValueFromConfig(config.height)"
    :style="{
      objectFit: getValueFromConfig(config.fit),
      borderRadius: getValueFromConfig(config.radius),
      border: getValueFromConfig(config.border),
      boxShadow: getValueFromConfig(config.boxShadow),
      margin: getValueFromConfig(config.margin),
      padding: getValueFromConfig(config.padding),
      backgroundColor: getValueFromConfig(config.backgroundColor),
      objectPosition: getValueFromConfig(config.objectPosition),
    }"
    :loading="getValueFromConfig(config.lazy) ? 'lazy' : undefined"
    v-if="getValueFromConfig(config.src)"
  />
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import * as FastJsonUI from '../../../utils/fast-json-ui';

const props = defineProps({
  config: { type: Object, required: true },
  data: { type: Object, default: () => ({}) },
  methods: { type: Object, default: () => ({}) },
});

const getValueFromConfig = (value: any): any => {
  return FastJsonUI.getValueFromConfig(value, props.data, props.methods);
};
</script>
