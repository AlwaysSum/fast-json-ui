<template>
  <div class="fj-qrcode" :style="containerStyle">
    <img :src="qrSrc" :alt="getValueFromConfig(config.text)" :style="imgStyle" />
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue';
import * as FastJsonUI from '../../../utils/fast-json-ui';

const props = defineProps({
  config: { type: Object, required: true },
  data: { type: Object, default: () => ({}) },
  methods: { type: Object, default: () => ({}) },
});

const getValueFromConfig = (v: any): any => FastJsonUI.getValueFromConfig(v, props.data, props.methods);

const text = computed(() => String(getValueFromConfig(props.config.text) || ''));
const size = computed(() => Number(getValueFromConfig(props.config.size) || 128));
const qrMargin = computed(() => Number(getValueFromConfig(props.config.qrMargin) || 0));

// 使用公共二维码服务生成图片（轻量化，无需依赖）
const qrSrc = computed(() => {
  const data = encodeURIComponent(text.value);
  return `https://api.qrserver.com/v1/create-qr-code/?data=${data}&size=${size.value}x${size.value}&margin=${qrMargin.value}`;
});

const containerStyle = computed(() => ({
  display: 'inline-block',
  ...FastJsonUI.computeStyle(props.config),
}));

const imgStyle = computed(() => ({
  width: props.config.width || `${size.value}px`,
  height: props.config.height || `${size.value}px`,
}));
</script>

<style scoped>
.fj-qrcode img { display: block; }
</style>