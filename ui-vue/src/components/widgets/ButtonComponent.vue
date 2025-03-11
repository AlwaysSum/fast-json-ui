<template>
  <button @click="handleClick">{{ getValueFromConfig(config.text) }}</button>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import * as FastJsonUI from '../../utils/fast-json-ui';
import { getMethodNameByString } from '../../utils/regex-utils';

const props = defineProps({
  config: { type: Object, required: true },
  data: { type: Object, default: () => ({}) },
  methods: { type: Object, default: () => ({}) }
});

const getValueFromConfig = (value: any): any => {
  return FastJsonUI.getValueFromConfig(value, props.data, props.methods);
};

const handleClick = () => {
  if (props.config.onTap) {
    const methodInfo = getMethodNameByString(props.config.onTap);
    if (methodInfo && props.methods && props.methods[methodInfo.method]) {
      const result = props.methods[methodInfo.method](...methodInfo.args);
      if (result && typeof result === 'function') {
        result(this);
      }
    }
  }
};
</script> 