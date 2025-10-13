<template>
  <div class="fj-navbar" :style="navbarStyle">
    <div class="left" v-if="getValueFromConfig(config.showBack)" @click="onBack">
      {{ getValueFromConfig(config.backText) || '返回' }}
    </div>
    <div class="title">{{ getValueFromConfig(config.title) }}</div>
    <div class="right">
      <button v-for="(m, i) in menus" :key="i" class="nav-btn" @click="onMenu(m)">{{ m.label }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed, type CSSProperties } from 'vue';
import * as FastJsonUI from '../../../utils/fast-json-ui';

const props = defineProps({
  config: { type: Object, required: true },
  data: { type: Object, default: () => ({}) },
  methods: { type: Object, default: () => ({}) },
});

const getValueFromConfig = (v: any): any => FastJsonUI.getValueFromConfig(v, props.data, props.methods);

const navbarStyle = computed<CSSProperties>(() => ({
  ...FastJsonUI.computeStyle(props.config) as CSSProperties,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  boxSizing: 'border-box',
}));

const menus = computed<any[]>(() => getValueFromConfig(props.config.menus) || []);

function onBack() {
  FastJsonUI.callFunction(props.config.onBack, props.data, props.methods);
}
function onMenu(m: any) {
  if (m && m.onClick) {
    FastJsonUI.callFunction(m.onClick, props.data, props.methods);
  }
}
</script>

<style scoped>
.fj-navbar { height: 48px; padding: 0 16px; border-bottom: 1px solid #eee; }
.left { cursor: pointer; color: #1a73e8; }
.title { font-weight: 600; }
.right { display: flex; gap: 8px; }
.nav-btn { border: none; background: transparent; cursor: pointer; color: #1a73e8; }
</style>