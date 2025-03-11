<template>
  <div>Unknown component type: {{ config.type }}</div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps({
  config: { type: Object, required: true },
  data: { type: Object, default: () => ({}) },
  methods: { type: Object, default: () => ({}) }
});
</script> 