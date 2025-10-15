<template>
  <div class="kv-editor">
    <div v-if="items.length === 0" class="empty">暂无变量</div>
    <div v-for="(item, i) in items" :key="i" class="kv-row" @dragover.prevent @drop="onDrop(i)">
      <div class="handle" draggable="true" @dragstart="onDragStart(i)" @dragend="onDragEnd" title="拖拽排序"></div>
      <div class="col key">
        <t-input v-model="item.key" placeholder="Key" @change="onChange" />
      </div>
      <div class="col value">
        <t-textarea v-model="item.value" placeholder="Value" :autosize="{ minRows: 1, maxRows: 4 }" @change="onChange" />
      </div>
      <div class="ops">
        <t-button size="small" variant="text" theme="danger" title="删除" @click="remove(i)">
          <RemoveIcon />
        </t-button>
      </div>
    </div>
    <div class="footer">
      <t-button variant="outline" theme="primary" size="small" class="block" @click="add">＋ 新增</t-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, PropType } from 'vue';
import { RemoveIcon } from 'tdesign-icons-vue-next';

type KVItem = { key: string; value: string };

const props = defineProps({
  modelValue: { type: Object as PropType<Record<string, any>>, default: () => ({}) }
});
const emit = defineEmits(['update:modelValue']);

const items = ref<KVItem[]>([]);
const draggingIndex = ref<number|null>(null);

function syncFromObject(obj: Record<string, any>){
  const arr: KVItem[] = [];
  Object.keys(obj || {}).forEach(k => {
    const v = obj[k];
    arr.push({ key: String(k), value: v == null ? '' : (typeof v === 'string' ? v : JSON.stringify(v)) });
  });
  items.value = arr.length ? arr : [{ key: '', value: '' }];
}

function toObject(): Record<string, any> {
  const out: Record<string, any> = {};
  items.value.forEach(({ key, value }) => {
    const k = String(key || '').trim();
    if (!k) return;
    // 尝试解析 JSON，否则按字符串保存
    const v = String(value || '').trim();
    if (!v) { out[k] = ''; return; }
    try {
      // 如果看起来是对象/数组/数字/布尔/空/null，尝试解析
      if (/^\s*[\[{0-9\-\+]|true|false|null\s*$/i.test(v)) {
        out[k] = JSON.parse(v);
      } else {
        out[k] = v;
      }
    } catch {
      out[k] = v;
    }
  });
  return out;
}

function add(){ items.value.push({ key: '', value: '' }); }
function remove(i: number){ items.value.splice(i, 1); onChange(); }
function onDragStart(i: number){ draggingIndex.value = i; }
function onDragEnd(){ draggingIndex.value = null; }
function onDrop(targetIndex: number){
  const from = draggingIndex.value;
  if (from == null || from === targetIndex) return;
  const arr = items.value;
  const [moved] = arr.splice(from, 1);
  arr.splice(targetIndex, 0, moved);
  draggingIndex.value = null;
  onChange();
}
function onChange(){ emit('update:modelValue', toObject()); }

watch(() => props.modelValue, (v) => syncFromObject(v || {}), { immediate: true, deep: true });
</script>

<style scoped>
.kv-editor { border: 1px solid var(--td-border-level-1-color); border-radius: 8px; padding: 8px; background: #fff; max-width: 100%; box-sizing: border-box; }
.kv-row { display: grid; grid-template-columns: 24px 1fr 1fr 24px; gap: 12px; align-items: center; padding: 6px 0; overflow: hidden; }
.handle { width: 16px; height: 32px; border-radius: 4px; cursor: grab; position: relative; }
.handle::before { content: ""; position: absolute; inset: 4px 3px; background-image: radial-gradient(currentColor 1px, transparent 1px);
  background-size: 4px 4px; color: var(--td-text-color-disabled); }
.handle:active { cursor: grabbing; }
.col { min-width: 0; }
.col :deep(.t-input){ width: 100%; }
.col.value :deep(.t-textarea__inner){ width: 100%; resize: none; }
.ops { display:flex; align-items:center; justify-content:center; }
.footer { margin-top: 10px; }
.footer :deep(.t-button){ width: 100%; }
.empty { color: var(--td-text-color-disabled); padding: 6px 0; text-align: center; }
</style>