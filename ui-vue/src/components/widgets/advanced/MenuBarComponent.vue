<template>
  <nav class="fj-menubar" :style="menuStyle" :class="[`mode-${mode}`]">
    <ul>
      <li v-for="(it, i) in items" :key="i" :class="[{ active: it.key === selectedKey }]" @click="onSelect(it)">
        {{ it.label }}
      </li>
    </ul>
  </nav>
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

const items = computed<any[]>(() => getValueFromConfig(props.config.items) || []);
const selectedKey = computed<string | undefined>(() => getValueFromConfig(props.config.selectedKey));
const mode = computed(() => getValueFromConfig(props.config.mode) || 'vertical');

const menuStyle = computed(() => ({
  ...FastJsonUI.computeStyle(props.config),
}));

function onSelect(item: any) {
  props.config.onSelect && FastJsonUI.callFunction(props.config.onSelect, { ...props.data, selected: item }, props.methods);
}
</script>

<style scoped>
.fj-menubar ul { list-style: none; padding: 0; margin: 0; }
.fj-menubar.mode-vertical ul { display: flex; flex-direction: column; gap: 6px; }
.fj-menubar.mode-horizontal ul { display: flex; flex-direction: row; gap: 12px; }
.fj-menubar li { padding: 8px 12px; border-radius: 6px; cursor: pointer; }
.fj-menubar li.active { background: #e6f4ff; color: #1a73e8; }
</style>