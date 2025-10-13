<template>
  <div :style="containerStyle">
    <table class="fj-table" :class="[`size-${size}`, { bordered }]">
      <thead v-if="columns.length">
        <tr>
          <th v-for="(col, i) in columns" :key="i" :style="{ width: col.width || undefined, textAlign: col.align || 'left' }">
            {{ col.title }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, r) in rows" :key="r" :class="[{ striped: striped && r % 2 === 1 }]">
          <td v-for="(col, c) in columns" :key="c" :style="{ textAlign: col.align || 'left' }">
            {{ row[col.key] }}
          </td>
        </tr>
      </tbody>
    </table>
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

const containerStyle = computed<CSSProperties>(() => ({
  ...FastJsonUI.computeStyle(props.config) as CSSProperties,
  overflowX: 'auto',
}));

const columns = computed<any[]>(() => getValueFromConfig(props.config.columns) || []);
const rows = computed<any[]>(() => getValueFromConfig(props.config.data) || []);
const striped = computed(() => !!getValueFromConfig(props.config.striped));
const bordered = computed(() => !!getValueFromConfig(props.config.bordered));
const size = computed(() => getValueFromConfig(props.config.size) || 'medium');
</script>

<style scoped>
.fj-table { width: 100%; border-collapse: collapse; }
.fj-table thead th { background: #f7f7f7; font-weight: 600; }
.fj-table th, .fj-table td { border: none; padding: 8px; }
.fj-table.bordered th, .fj-table.bordered td { border: 1px solid #e5e5e5; }
.fj-table.size-small th, .fj-table.size-small td { padding: 6px; font-size: 12px; }
.fj-table.size-medium th, .fj-table.size-medium td { padding: 8px; font-size: 14px; }
.fj-table.size-large th, .fj-table.size-large td { padding: 12px; font-size: 16px; }
tr.striped td { background: #fafafa; }
</style>