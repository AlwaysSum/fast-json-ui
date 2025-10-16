<template>
  <aside class="right">
    <div class="right-section">
      <div class="section-header">
        <span>系统变量</span>
        <div class="actions">
          <input class="search small" :value="sysVarSearch" @input="onSysVarSearch" placeholder="搜索系统变量" />
        </div>
      </div>
      <div class="list">
        <div v-for="sv in filteredSysVars" :key="sv.name" class="sysvar-item">
          <div class="name">{{ sv.name }}<span class="type">（{{ sv.type }}）</span></div>
          <div class="desc">{{ sv.desc }}</div>
          <div class="default" v-if="sv.default !== undefined">默认值：{{ sv.default }}</div>
        </div>
      </div>
    </div>
    <div class="right-section">
      <div class="section-header">
        <span>系统语法提示</span>
        <div class="actions">
          <input class="search small" :value="syntaxSearch" @input="onSyntaxSearch" placeholder="搜索语法" />
          <select class="small" :value="syntaxCategory" @change="onSyntaxCategory">
            <option value="">全部</option>
            <option value="条件判断">条件判断</option>
            <option value="循环">循环</option>
            <option value="运算">运算</option>
          </select>
        </div>
      </div>
      <div class="list">
        <div v-for="tip in filteredSyntaxTips" :key="tip.title" class="syntax-item">
          <div class="name">{{ tip.title }}<span class="type">（{{ tip.category }}）</span></div>
          <div class="desc">{{ tip.desc }}</div>
          <pre class="example">{{ tip.example }}</pre>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
const props = defineProps<{ 
  sysVarSearch: string;
  filteredSysVars: Array<{ name: string; type: string; default?: any; desc: string }>;
  syntaxSearch: string;
  syntaxCategory: string;
  filteredSyntaxTips: Array<{ title: string; category: string; desc: string; example: string }>;
}>();

const emit = defineEmits<{
  (e: 'update:sysVarSearch', v: string): void;
  (e: 'update:syntaxSearch', v: string): void;
  (e: 'update:syntaxCategory', v: string): void;
}>();

function onSysVarSearch(e: Event){ emit('update:sysVarSearch', (e.target as HTMLInputElement).value); }
function onSyntaxSearch(e: Event){ emit('update:syntaxSearch', (e.target as HTMLInputElement).value); }
function onSyntaxCategory(e: Event){ emit('update:syntaxCategory', (e.target as HTMLSelectElement).value); }
</script>

<script lang="ts">
export default {
  name: 'DataHelperSidebar',
};
</script>

<style scoped>
.right { width: 320px; border-left:1px solid #eee; padding:10px; display:flex; flex-direction:column; gap:16px; overflow-y:auto; min-height:0; }
.right-section { display:flex; flex-direction:column; gap:8px; }
.sysvar-item { border:1px solid #eee; border-radius:8px; padding:8px; }
.syntax-item { border:1px solid #eee; border-radius:8px; padding:8px; }
.name { font-weight:600; }
.type { color:#888; margin-left:4px; }
.desc { color:#555; margin-top:4px; }
.default { color:#666; font-size:12px; margin-top:4px; }
.example { margin-top:6px; background:#f7f7f7; border:1px dashed #ddd; border-radius:6px; padding:8px; font-family: SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size:12px; }
.search { flex:1; padding:6px 8px; border:1px solid #ccc; border-radius:6px; font-size:12px; }
.small { font-size:12px; padding:4px 6px; }
.section-header { display:flex; align-items:center; justify-content:space-between; }
.actions { display:flex; gap:6px; }
.list { display:flex; flex-direction:column; gap:8px; }
</style>