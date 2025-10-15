<template>
  <div class="single-editor">
    <JsonUiEditor :initial-config="initialConfig" @update:config="onConfigUpdate" @export="onExport" />
    <!-- 导出弹窗 -->
    <div v-if="showExport" class="dialog-backdrop" @click.self="showExport=false">
      <div class="dialog large">
        <div class="dialog-header">
          <span>导出 JSON</span>
          <button class="close" @click="showExport=false">×</button>
        </div>
        <div class="dialog-body"><pre>{{ output }}</pre></div>
        <div class="dialog-footer">
          <button class="btn" @click="copy">复制</button>
          <button class="btn primary" @click="showExport=false">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
// @ts-expect-error default export is provided in shims
import JsonUiEditor from '../components/JsonUiEditor.vue';
import type { ComponentConfig } from 'fast-json-ui-vue';

const initialConfig: ComponentConfig = { type: 'column', children: [{ type: 'text', text: '欢迎使用编辑器' }] };
const output = ref('');
const showExport = ref(false);

function onConfigUpdate(_config: ComponentConfig) {}
function onExport(config: ComponentConfig) { output.value = JSON.stringify(config, null, 2); showExport.value = true; }
async function copy() { try { await navigator.clipboard.writeText(output.value); alert('已复制'); } catch {} }
</script>

<style scoped>
.single-editor { padding: 12px; }
.dialog-backdrop { position: fixed; inset:0; background: rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center; }
.dialog.large { width: 800px; background:#fff; border-radius:8px; border:1px solid #ddd; display:flex; flex-direction:column; }
.dialog-header { display:flex; justify-content:space-between; align-items:center; padding:10px 14px; border-bottom:1px solid #eee; font-weight:600; }
.dialog-body { padding: 12px 14px; }
.dialog-footer { display:flex; justify-content:flex-end; gap:8px; padding:10px 14px; border-top:1px solid #eee; }
.btn { padding: 4px 10px; border: 1px solid #aaa; background: #fff; border-radius: 4px; cursor: pointer; }
.btn.primary { background:#4a90e2; color:#fff; border-color:#4a90e2; }
pre { margin:0; white-space:pre-wrap; word-break:break-word; font-family:monospace; }
.close { border:none; background:transparent; font-size:20px; cursor:pointer; }
</style>