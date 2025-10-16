<template>
  <aside class="left">
    <div class="toolbar">
      <input class="search" :value="searchText" @input="onSearchInput" placeholder="搜索变量 / 复合变量 / 函数" />
    </div>
    <div class="section">
      <div class="section-header">
        <span>变量</span>
        <div class="actions">
          <button class="btn" @click="$emit('addVar')">新增</button>
        </div>
      </div>
      <div class="tags">
        <span v-for="item in filtered(vars)" :key="item.id" :class="['tag', selected?.type==='var' && selected?.id===item.id ? 'active' : '']" @click="$emit('select', 'var', item)">
          {{ item.name }}
          <button class="tag-close" title="删除" @click.stop="$emit('remove', 'var', item)">❌</button>
        </span>
      </div>
    </div>
    <div class="section">
      <div class="section-header">
        <span>复合变量</span>
        <div class="actions">
          <button class="btn" @click="$emit('addComposite')">新增</button>
        </div>
      </div>
      <div class="tags">
        <span v-for="item in filtered(composites)" :key="item.id" :class="['tag', selected?.type==='composite' && selected?.id===item.id ? 'active' : '']" @click="$emit('select', 'composite', item)">
          {{ item.name }}
          <button class="tag-close" title="删除" @click.stop="$emit('remove', 'composite', item)">❌</button>
        </span>
      </div>
    </div>
    <div class="section">
      <div class="section-header">
        <span>函数</span>
        <div class="actions">
          <button class="btn" @click="$emit('addFunc')">新增</button>
        </div>
      </div>
      <div class="tags">
        <span v-for="item in filtered(funcs)" :key="item.id" :class="['tag', selected?.type==='func' && selected?.id===item.id ? 'active' : '']" @click="$emit('select', 'func', item)">
          {{ item.name }}
          <button class="tag-close" title="删除" @click.stop="$emit('remove', 'func', item)">❌</button>
        </span>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { DataEntry, DataEntryType } from '../../../services/AppConfigStore';

const props = defineProps<{ 
  vars: DataEntry[];
  composites: DataEntry[];
  funcs: DataEntry[];
  searchText: string;
  selected?: { type: DataEntryType; id: string } | null;
}>();
const emit = defineEmits<{
  (e: 'update:searchText', v: string): void;
  (e: 'select', type: DataEntryType, item: DataEntry): void;
  (e: 'addVar'): void;
  (e: 'addComposite'): void;
  (e: 'addFunc'): void;
  (e: 'remove', type: DataEntryType, item: DataEntry): void;
}>();

function filtered(list: DataEntry[]) {
  const q = (props.searchText || '').trim().toLowerCase();
  if (!q) return list;
  return list.filter(x => (x.name || '').toLowerCase().includes(q));
}

function onSearchInput(e: Event){ emit('update:searchText', (e.target as HTMLInputElement).value); }
</script>

<script lang="ts">
export default {
  name: 'DataListPanel',
};
</script>

<style scoped>
.left { width: 260px; border-right:1px solid #eee; padding:10px; display:flex; flex-direction:column; gap:12px; overflow-y:auto; min-height:0; }
.toolbar { display:flex; }
.search { flex:1; padding:6px 8px; border:1px solid #ccc; border-radius:6px; font-size:12px; }
.section { display:flex; flex-direction:column; gap:6px; }
.section-header { display:flex; align-items:center; justify-content:space-between; }
.actions { display:flex; gap:6px; }
.btn { padding:4px 8px; border:1px solid #aaa; border-radius:6px; background:#fff; cursor:pointer; font-size:12px; }
.small { font-size:12px; padding:4px 6px; }
.tags { display:flex; flex-wrap:wrap; gap:8px; }
.tag { display:inline-flex; align-items:center; gap:6px; border:1px solid #ddd; border-radius:16px; padding:6px 10px; font-size:12px; cursor:pointer; background:#fff; }
.tag.active { border-color:#4a90e2; box-shadow:0 0 0 2px rgba(74,144,226,.12); }
.tag-close { margin-left:2px; border:none; background:transparent; color:#c00; cursor:pointer; font-size:12px; line-height:1; }
</style>