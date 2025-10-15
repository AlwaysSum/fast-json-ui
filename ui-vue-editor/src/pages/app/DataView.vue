<template>
  <div class="data-editor">
    <aside class="left">
      <div class="toolbar">
        <input class="search" v-model.trim="searchText" placeholder="搜索变量 / 复合变量 / 函数" />
      </div>
      <div class="section">
        <div class="section-header">
          <span>变量</span>
          <div class="actions">
            <button class="btn" @click="addVar">新增</button>
          </div>
        </div>
        <div class="list">
          <div v-for="item in filtered(vars)" :key="item.id" :class="['item', isSelected('var', item.id) ? 'active' : '']" @click="select('var', item)">
            <div class="item-title">{{ item.name }}</div>
            <div class="item-ops">
              <button class="mini" @click.stop="rename('var', item)">重命名</button>
              <button class="mini danger" @click.stop="remove('var', item)">删除</button>
            </div>
          </div>
        </div>
      </div>
      <div class="section">
        <div class="section-header">
          <span>复合变量</span>
          <div class="actions">
            <button class="btn" @click="addComposite">新增</button>
          </div>
        </div>
        <div class="list">
          <div v-for="item in filtered(composites)" :key="item.id" :class="['item', isSelected('composite', item.id) ? 'active' : '']" @click="select('composite', item)">
            <div class="item-title">{{ item.name }}</div>
            <div class="item-ops">
              <button class="mini" @click.stop="rename('composite', item)">重命名</button>
              <button class="mini danger" @click.stop="remove('composite', item)">删除</button>
            </div>
          </div>
        </div>
      </div>
      <div class="section">
        <div class="section-header">
          <span>函数</span>
          <div class="actions">
            <button class="btn" @click="addFunc">新增</button>
          </div>
        </div>
        <div class="list">
          <div v-for="item in filtered(funcs)" :key="item.id" :class="['item', isSelected('func', item.id) ? 'active' : '']" @click="select('func', item)">
            <div class="item-title">{{ item.name }}</div>
            <div class="item-ops">
              <button class="mini" @click.stop="rename('func', item)">重命名</button>
              <button class="mini danger" @click.stop="remove('func', item)">删除</button>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <section class="middle">
      <div v-if="current" class="editor">
        <div class="editor-header">
          <div class="title">
            <input class="name-input" v-model.trim="currentName" @keyup.enter="commitName" @blur="commitName" placeholder="名称" />
            <span class="type-chip">（{{ typeLabel(current.type) }}）</span>
            <select class="type-select" v-model="currentValueType" @change="commitValueType">
              <option value="string">字符</option>
              <option value="number">数值</option>
              <option value="boolean">布尔值</option>
              <option value="object">对象</option>
              <option value="array">数组</option>
              <option value="color">色值</option>
            </select>
          </div>
          <div class="ops">
            <button class="btn" @click="run">运行</button>
            <button class="btn" @click="copyExpr">{{ current?.type==='var' ? '复制值' : '复制表达式' }}</button>
            <button class="btn" @click="saveExpr">保存</button>
            <button class="btn" @click="rollback">版本回退</button>
          </div>
        </div>
        <template v-if="current?.type==='var'">
          <div class="var-editor">
            <template v-if="currentValueType==='boolean'">
              <label class="bool-row"><input type="checkbox" v-model="boolValue" /> 设为 true/false</label>
            </template>
            <template v-else-if="currentValueType==='color'">
              <input class="color-input" type="color" v-model="valueText" />
            </template>
            <template v-else-if="currentValueType==='object' || currentValueType==='array'">
              <textarea class="code" v-model="valueText" placeholder="请输入 JSON 值"></textarea>
            </template>
            <template v-else>
              <input class="value-input" v-model="valueText" :placeholder="currentValueType==='number' ? '请输入数值' : '请输入字符'" />
            </template>
          </div>
        </template>
        <template v-else>
          <textarea class="code" v-model="exprText" placeholder="在此输入表达式或函数体（支持 JS 表达式）"></textarea>
        </template>
        <div class="editor-footer">
          <div class="result">
            <div class="label">运行结果</div>
            <pre class="panel">{{ runOutput }}</pre>
          </div>
          <div class="deps">
            <div class="label">依赖关系</div>
            <ul class="panel">
              <li v-for="d in dependencies" :key="d">{{ d }}</li>
              <li v-if="dependencies.length===0" class="empty">无</li>
            </ul>
          </div>
        </div>
      </div>
      <div v-else class="empty-tip">请在左侧选择变量 / 复合变量 / 函数进行编辑</div>
    </section>

    <aside class="right">
      <div class="right-section">
        <div class="section-header">
          <span>系统变量</span>
          <div class="actions">
            <input class="search small" v-model.trim="sysVarSearch" placeholder="搜索系统变量" />
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
            <input class="search small" v-model.trim="syntaxSearch" placeholder="搜索语法" />
            <select class="small" v-model="syntaxCategory">
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { AppConfigStore } from '../../services/AppConfigStore';
import type { DataEntry, DataEntryType, DataValueType } from '../../services/AppConfigStore';

const route = useRoute();
function appId(){ return String(route.params.appId || 'default'); }

const vars = ref<DataEntry[]>([]);
const composites = ref<DataEntry[]>([]);
const funcs = ref<DataEntry[]>([]);
const searchText = ref('');
function filtered(list: DataEntry[]) {
  const q = searchText.value.trim().toLowerCase();
  if (!q) return list;
  return list.filter(x => x.name.toLowerCase().includes(q));
}

const current = ref<DataEntry | null>(null);
const currentName = ref('');
const currentValueType = ref<DataValueType>('string');
const exprText = ref('');
const valueText = ref(''); // 变量值（string/number/color 或 JSON 文本）
const boolValue = ref<boolean>(false);
function isSelected(type: DataEntryType, id: string){ return current.value?.type===type && current.value?.id===id; }
function typeLabel(t: DataEntryType){ return t==='var' ? '变量' : t==='composite' ? '复合变量' : '函数'; }
function select(type: DataEntryType, item: DataEntry){
  current.value = { ...item };
  currentName.value = item.name || '';
  currentValueType.value = (item.valueType as DataValueType) || 'string';
  exprText.value = item.expr || '';
  // 变量值初始化
  if (type === 'var') {
    const v = (item as any).value;
    if (currentValueType.value === 'boolean') boolValue.value = Boolean(v);
    else if (currentValueType.value === 'object' || currentValueType.value === 'array') {
      try { valueText.value = v!==undefined ? JSON.stringify(v, null, 2) : '' } catch { valueText.value = String(v ?? '') }
    } else { valueText.value = v !== undefined ? String(v) : ''; }
  } else {
    valueText.value = '';
    boolValue.value = false;
  }
  runOutput.value = '';
  computeDeps();
}

function addVar(){ const e = AppConfigStore.addVar(appId(), '新变量'); loadLists(); select('var', e); }
function addComposite(){ const e = AppConfigStore.addComposite(appId(), '新复合变量'); loadLists(); select('composite', e); }
function addFunc(){ const e = AppConfigStore.addFunc(appId(), '新函数'); loadLists(); select('func', e); }
function rename(type: DataEntryType, item: DataEntry){ const name = prompt('输入新的名称：', item.name); if (!name) return; if (type==='var') AppConfigStore.renameVar(appId(), item.id, name); else if (type==='composite') AppConfigStore.renameComposite(appId(), item.id, name); else AppConfigStore.renameFunc(appId(), item.id, name); loadLists(); }
function remove(type: DataEntryType, item: DataEntry){ if (!confirm(`确认删除 ${typeLabel(type)}「${item.name}」？`)) return; if (type==='var') AppConfigStore.removeVar(appId(), item.id); else if (type==='composite') AppConfigStore.removeComposite(appId(), item.id); else AppConfigStore.removeFunc(appId(), item.id); loadLists(); if (isSelected(type, item.id)) { current.value = null; exprText.value = ''; runOutput.value=''; dependencies.value=[]; } }

function saveExpr(){
  if (!current.value) return;
  const { type, id } = current.value;
  if (type==='var') {
    let newValue: any = undefined;
    if (currentValueType.value === 'boolean') newValue = boolValue.value;
    else if (currentValueType.value === 'number') newValue = valueText.value === '' ? undefined : Number(valueText.value);
    else if (currentValueType.value === 'color' || currentValueType.value === 'string') newValue = valueText.value;
    else {
      // object/array 解析 JSON
      try { newValue = valueText.value ? JSON.parse(valueText.value) : (currentValueType.value==='array' ? [] : {}); }
      catch (e:any) { alert('JSON 解析失败：' + String(e?.message || e)); return; }
    }
    AppConfigStore.setVarValue(appId(), id, newValue);
  } else if (type==='composite') {
    AppConfigStore.setCompositeExpr(appId(), id, exprText.value);
  } else {
    AppConfigStore.setFuncExpr(appId(), id, exprText.value);
  }
  loadLists();
  const pool = type==='var' ? vars.value : type==='composite' ? composites.value : funcs.value;
  const latest = pool.find(x=>x.id===id);
  if (latest) current.value = { ...latest };
  alert('已保存');
}
function rollback(){
  if (!current.value) return;
  const { type, id } = current.value;
  const ok = type==='var' ? AppConfigStore.rollbackVar(appId(), id)
    : type==='composite' ? AppConfigStore.rollbackComposite(appId(), id)
    : AppConfigStore.rollbackFunc(appId(), id);
  if (ok) {
    loadLists();
    const pool = type==='var' ? vars.value : type==='composite' ? composites.value : funcs.value;
    const latest = pool.find(x=>x.id===id);
    if (latest) select(type, latest);
    alert('已回退到上一个版本');
  } else {
    alert('无可回退的历史版本');
  }
}

const runOutput = ref<string>('');
function run(){
  try {
    if (!current.value) return;
    if (current.value.type === 'var') {
      let val: any = undefined;
      if (currentValueType.value === 'boolean') val = boolValue.value;
      else if (currentValueType.value === 'number') val = valueText.value === '' ? undefined : Number(valueText.value);
      else if (currentValueType.value === 'color' || currentValueType.value === 'string') val = valueText.value;
      else { try { val = valueText.value ? JSON.parse(valueText.value) : (currentValueType.value==='array' ? [] : {}); } catch (e:any) { throw e; } }
      runOutput.value = stringify(val);
      return;
    }
    const context = buildRunContext();
    const expr = exprText.value || '';
    const fn = new Function('ctx', `with (ctx) { return (${expr}); }`);
    const result = fn(context);
    runOutput.value = stringify(result);
  } catch (err: any) { runOutput.value = `运行出错：${String(err?.message || err)}`; }
}
function copyExpr(){
  try {
    const text = current.value?.type === 'var'
      ? (currentValueType.value==='object' || currentValueType.value==='array' ? valueText.value : String(valueText.value))
      : (exprText.value || '');
    navigator.clipboard.writeText(text);
    alert((current.value?.type==='var' ? '值' : '表达式') + '已复制');
  } catch {}
}

function buildRunContext(){
  const ctx: Record<string, any> = { Math, Date, JSON, console };
  try {
    const data = AppConfigStore.getData(appId());
    for (const v of data.vars) { try { ctx[v.name] = (v as any).value; } catch {} }
    for (const c of data.composites) { try { ctx[c.name] = new Function('ctx', `with(ctx){ return (${c.expr}); }`)(ctx); } catch {} }
    for (const f of data.funcs) { try { ctx[f.name] = new Function('ctx', `with(ctx){ return (${f.expr}); }`)(ctx); } catch {} }
  } catch {}
  ctx.now = Date.now(); ctx.today = new Date().toISOString().slice(0,10); ctx.env = 'dev';
  return ctx;
}
function stringify(v: any){ try { return typeof v==='string' ? v : JSON.stringify(v, null, 2); } catch { return String(v); } }

const dependencies = ref<string[]>([]);
function computeDeps(){
  const names: string[] = [];
  const data = AppConfigStore.getData(appId());
  for (const x of [...data.vars, ...data.composites, ...data.funcs]) names.push(x.name);
  const expr = current.value?.type==='var' ? '' : (exprText.value || '');
  const set = new Set<string>();
  for (const n of names) { const re = new RegExp(`(^|[^A-Za-z0-9_])${n}([^A-Za-z0-9_]|$)`); if (re.test(expr)) set.add(n); }
  dependencies.value = Array.from(set);
}

const systemVars = [ { name: 'now', type: 'number', default: 'Date.now()', desc: '当前时间戳（毫秒）' }, { name: 'today', type: 'string', default: 'YYYY-MM-DD', desc: '当前日期字符串' }, { name: 'env', type: 'string', default: 'dev', desc: '当前环境标识' }, ];
const sysVarSearch = ref('');
const filteredSysVars = computed(() => { const q = sysVarSearch.value.trim().toLowerCase(); if (!q) return systemVars; return systemVars.filter(x => x.name.toLowerCase().includes(q) || String(x.desc).toLowerCase().includes(q)); });

interface SyntaxTip { title: string; category: '条件判断'|'循环'|'运算'; desc: string; example: string; }
const syntaxTips: SyntaxTip[] = [ { title: '三元表达式', category: '条件判断', desc: '条件 ? 值1 : 值2', example: 'score >= 60 ? "及格" : "不及格"' }, { title: 'if 判断', category: '条件判断', desc: 'if (条件) { ... } else { ... }', example: 'if (a > b) { a } else { b }' }, { title: 'while 循环', category: '循环', desc: 'while (条件) { ... }', example: 'let i=0; while(i<3){ i++; }' }, { title: 'for 循环', category: '循环', desc: 'for (初始化; 条件; 更新) { ... }', example: 'for (let i=0;i<3;i++){ i }' }, { title: '加法运算', category: '运算', desc: 'a + b', example: 'sum + delta' }, ];
const syntaxSearch = ref('');
const syntaxCategory = ref<string>('');
const filteredSyntaxTips = computed(() => { const q = syntaxSearch.value.trim().toLowerCase(); const c = syntaxCategory.value; return syntaxTips.filter(t => (!c || t.category===c) && (!q || t.title.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q))); });

function loadLists(){ try { const data = AppConfigStore.getData(appId()); vars.value = [...(data.vars||[])]; composites.value = [...(data.composites||[])]; funcs.value = [...(data.funcs||[])]; } catch {} }
function onAppConfigChanged(){ loadLists(); }
onMounted(() => { loadLists(); window.addEventListener('fju-app-config-changed', onAppConfigChanged as EventListener); });
onBeforeUnmount(() => { window.removeEventListener('fju-app-config-changed', onAppConfigChanged as EventListener); });
watchEffect(() => { computeDeps(); });

function commitName(){ if (!current.value) return; const name = currentName.value.trim(); if (!name) return; const { type, id } = current.value; if (type==='var') AppConfigStore.renameVar(appId(), id, name); else if (type==='composite') AppConfigStore.renameComposite(appId(), id, name); else AppConfigStore.renameFunc(appId(), id, name); loadLists(); const pool = type==='var' ? vars.value : type==='composite' ? composites.value : funcs.value; const latest = pool.find(x=>x.id===id); if (latest) current.value = { ...latest }; }
function commitValueType(){ if (!current.value) return; const { type, id } = current.value; const vt = currentValueType.value; if (type==='var') AppConfigStore.setVarType(appId(), id, vt); else if (type==='composite') AppConfigStore.setCompositeType(appId(), id, vt); else AppConfigStore.setFuncType(appId(), id, vt); loadLists(); }
</script>

<style scoped>
.data-editor { display:flex; height:100%; background:#fff; }
.left { width: 260px; border-right:1px solid #eee; padding:10px; display:flex; flex-direction:column; gap:12px; }
.toolbar { display:flex; }
.search { flex:1; padding:6px 8px; border:1px solid #ccc; border-radius:6px; font-size:12px; }
.section { display:flex; flex-direction:column; gap:6px; }
.section-header { display:flex; align-items:center; justify-content:space-between; }
.actions { display:flex; gap:6px; }
.btn { padding:4px 8px; border:1px solid #aaa; border-radius:6px; background:#fff; cursor:pointer; font-size:12px; }
.small { font-size:12px; padding:4px 6px; }
.list { display:flex; flex-direction:column; gap:6px; }
.item { border:1px solid #ddd; border-radius:8px; padding:8px; display:flex; align-items:center; justify-content:space-between; cursor:pointer; }
.item.active { border-color:#4a90e2; box-shadow:0 0 0 2px rgba(74,144,226,.15); }
.item-title { font-size:13px; }
.item-ops { display:flex; gap:6px; }
.mini { padding:2px 6px; border:1px solid #aaa; border-radius:6px; background:#fff; font-size:11px; cursor:pointer; }
.mini.danger { border-color:#f66; color:#c00; }

.middle { flex:1; padding:10px; }
.editor { display:flex; flex-direction:column; gap:8px; height:100%; }
.editor-header { display:flex; align-items:center; justify-content:space-between; }
.title { font-weight:600; }
.code { flex:0 0 240px; width:100%; min-height:200px; font-family: SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size:13px; line-height:1.6; border:1px solid #ddd; border-radius:8px; padding:10px; }
.editor-footer { display:flex; gap:12px; }
.label { font-weight:600; margin-bottom:6px; }
.panel { border:1px solid #eee; border-radius:8px; padding:8px; background:#fafafa; max-height:160px; overflow:auto; }
.result { flex:1; }
.deps { width: 240px; }
.empty-tip { height:100%; display:flex; align-items:center; justify-content:center; color:#777; }

.right { width: 320px; border-left:1px solid #eee; padding:10px; display:flex; flex-direction:column; gap:16px; }
.right-section { display:flex; flex-direction:column; gap:8px; }
.sysvar-item { border:1px solid #eee; border-radius:8px; padding:8px; }
.syntax-item { border:1px solid #eee; border-radius:8px; padding:8px; }
.name { font-weight:600; }
.type { color:#888; margin-left:4px; }
.desc { color:#555; margin-top:4px; }
.default { color:#666; font-size:12px; margin-top:4px; }
.example { margin-top:6px; background:#f7f7f7; border:1px dashed #ddd; border-radius:6px; padding:8px; font-family: SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size:12px; }
</style>