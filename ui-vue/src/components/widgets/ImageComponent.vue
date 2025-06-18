<template>
  <img
    :src="getValueFromConfig(config.src)"
    :alt="getValueFromConfig(config.alt)"
  />
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import * as FastJsonUI from "../../utils/fast-json-ui";

const props = defineProps({
  config: { type: Object, required: true },
  data: { type: Object, default: () => ({}) },
  methods: { type: Object, default: () => ({}) },
});

const getValueFromConfig = (value: any): any => {
  return FastJsonUI.getValueFromConfig(value, props.data, props.methods);
};
</script>
