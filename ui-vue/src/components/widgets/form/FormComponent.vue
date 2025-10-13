<template>
  <form :style="formStyle" @submit.prevent="onSubmit">
    <div class="fj-form" :class="[`dir-${direction}`]" :style="{ gap }">
      <fast-json-widget
        v-for="(item, index) in getValueFromConfig(config.children) || []"
        :key="index"
        :config="item"
        :data="data"
        :methods="methods"
      />
    </div>
    <button v-if="getValueFromConfig(config.showSubmit)" type="submit" class="submit-btn">
      {{ getValueFromConfig(config.submitText) || '提交' }}
    </button>
  </form>
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

const formStyle = computed(() => ({
  ...FastJsonUI.computeStyle(props.config),
}));

const direction = computed(() => getValueFromConfig(props.config.direction) || 'vertical');
const gap = computed(() => getValueFromConfig(props.config.gap) || '12px');

function onSubmit() {
  FastJsonUI.callFunction(props.config.onSubmit, props.data, props.methods);
}
</script>

<style scoped>
.fj-form.dir-vertical { display: flex; flex-direction: column; }
.fj-form.dir-horizontal { display: flex; flex-direction: row; align-items: center; flex-wrap: wrap; }
.submit-btn { margin-top: 12px; padding: 6px 12px; }
</style>