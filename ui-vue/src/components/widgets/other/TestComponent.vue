<template>
  <div>{{ JSON.stringify(data) }}</div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

// 定义属性
defineProps({
  config: { type: Object, required: true },
  data: { type: Object, default: () => ({}) },
  methods: { type: Object, default: () => ({}) }
});
</script> 