<template>
  <div class="json-preview">
    <pre class="code"><code>{{ prettyText }}</code></pre>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  text?: string; // JSON 字符串
  data?: unknown; // 原始对象
}
const props = defineProps<Props>();

function stringifySafe(input: unknown) {
  try {
    if (typeof input === 'string') {
      try { return JSON.stringify(JSON.parse(input), null, 2); } catch { return input; }
    }
    return JSON.stringify(input, null, 2);
  } catch {
    return String(input ?? '');
  }
}

const prettyText = computed(() => stringifySafe(props.text ?? props.data ?? ''));
</script>

<style scoped>
.json-preview { max-height: 70vh; overflow: auto; border: 1px solid #eee; border-radius: 6px; background: #fafafa; }
.code { margin:0; padding: 10px 12px; white-space: pre; word-break: break-word; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; font-size: 12px; line-height: 1.6; }
</style>