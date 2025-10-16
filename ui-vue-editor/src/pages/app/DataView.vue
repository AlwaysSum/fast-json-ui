<template>
    <div class="data-editor">
        <DataListPanel :vars="vars" :composites="composites" :funcs="funcs" :searchText="searchText"
            :selected="selectedRef" @update:searchText="v => searchText = v" @select="select" @addVar="addVar"
            @addComposite="addComposite" @addFunc="addFunc" @remove="removeWithConfirm" />

        <DataEditorPanel :current="current" :currentName="currentName" :currentValueType="currentValueType"
            :exprText="exprText" :valueText="valueText" :boolValue="boolValue" :runOutput="runOutput"
            :dependencies="dependencies" @update:currentName="v => currentName = v" @commitName="commitName"
            @update:currentValueType="v => currentValueType = v" @typeChange="commitValueType"
            @update:exprText="v => exprText = v" @update:valueText="v => valueText = v"
            @update:boolValue="v => boolValue = v" @run="run" @copy="copyExpr" @save="saveExpr" @rollback="rollback" />

        <DataHelperSidebar :sysVarSearch="sysVarSearch" :filteredSysVars="filteredSysVars" :syntaxSearch="syntaxSearch"
            :syntaxCategory="syntaxCategory" :filteredSyntaxTips="filteredSyntaxTips"
            @update:sysVarSearch="v => sysVarSearch = v" @update:syntaxSearch="v => syntaxSearch = v"
            @update:syntaxCategory="v => syntaxCategory = v" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watchEffect } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import DataListPanel from './components/DataListPanel.vue';
import DataEditorPanel from './components/DataEditorPanel.vue';
import DataHelperSidebar from './components/DataHelperSidebar.vue';
import { useRoute } from 'vue-router';
import { AppConfigStore } from '../../services/AppConfigStore';
import type { DataEntry, DataEntryType, DataValueType } from '../../services/AppConfigStore';

const route = useRoute();
function appId() { return String(route.params.appId || 'default'); }

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
function isSelected(type: DataEntryType, id: string) { return current.value?.type === type && current.value?.id === id; }
const selectedRef = computed(() => current.value ? { type: current.value.type, id: current.value.id } : null);
function typeLabel(t: DataEntryType) { return t === 'var' ? '变量' : t === 'composite' ? '复合变量' : '函数'; }
function select(type: DataEntryType, item: DataEntry) {
    current.value = { ...item };
    currentName.value = item.name || '';
    currentValueType.value = (item.valueType as DataValueType) || 'string';
    exprText.value = item.expr || '';
    // 变量值初始化
    if (type === 'var') {
        const v = (item as any).value;
        if (currentValueType.value === 'boolean') boolValue.value = Boolean(v);
        else if (currentValueType.value === 'object' || currentValueType.value === 'array') {
            try { valueText.value = v !== undefined ? JSON.stringify(v, null, 2) : '' } catch { valueText.value = String(v ?? '') }
        } else { valueText.value = v !== undefined ? String(v) : ''; }
    } else {
        valueText.value = '';
        boolValue.value = false;
    }
    runOutput.value = '';
    computeDeps();
}

function addVar() { const e = AppConfigStore.addVar(appId(), '新变量'); loadLists(); select('var', e); }
function addComposite() { const e = AppConfigStore.addComposite(appId(), '新复合变量'); loadLists(); select('composite', e); }
function addFunc() { const e = AppConfigStore.addFunc(appId(), '新函数'); loadLists(); select('func', e); }
function removeWithConfirm(type: DataEntryType, item: DataEntry) { if (!confirm(`确认删除${typeLabel(type)}「${item.name}」？`)) return; if (type === 'var') AppConfigStore.removeVar(appId(), item.id); else if (type === 'composite') AppConfigStore.removeComposite(appId(), item.id); else AppConfigStore.removeFunc(appId(), item.id); loadLists(); if (isSelected(type, item.id)) { current.value = null; exprText.value = ''; runOutput.value = ''; dependencies.value = []; } }

function saveExpr() {
    // 统一先提交名称与类型，避免用户未失焦导致未保存
    commitName();
    commitValueType();
    if (!current.value) return;
    const { type, id } = current.value;
    if (type === 'var') {
        let newValue: any = undefined;
        if (currentValueType.value === 'boolean') newValue = boolValue.value;
        else if (currentValueType.value === 'number') newValue = valueText.value === '' ? undefined : Number(valueText.value);
        else if (currentValueType.value === 'color' || currentValueType.value === 'string') newValue = valueText.value;
        else {
            // object/array 解析 JSON
            try { newValue = valueText.value ? JSON.parse(valueText.value) : (currentValueType.value === 'array' ? [] : {}); }
            catch (e: any) { MessagePlugin.error('JSON 解析失败：' + String(e?.message || e)); return; }
        }
        AppConfigStore.setVarValue(appId(), id, newValue);
    } else if (type === 'composite') {
        AppConfigStore.setCompositeExpr(appId(), id, exprText.value);
    } else {
        AppConfigStore.setFuncExpr(appId(), id, exprText.value);
    }
    loadLists();
    const pool = type === 'var' ? vars.value : type === 'composite' ? composites.value : funcs.value;
    const latest = pool.find(x => x.id === id);
    if (latest) select(type, latest);
    MessagePlugin.success('保存成功');
}
function rollback() {
    if (!current.value) return;
    const { type, id } = current.value;
    const ok = type === 'var' ? AppConfigStore.rollbackVar(appId(), id)
        : type === 'composite' ? AppConfigStore.rollbackComposite(appId(), id)
            : AppConfigStore.rollbackFunc(appId(), id);
    if (ok) {
        loadLists();
        const pool = type === 'var' ? vars.value : type === 'composite' ? composites.value : funcs.value;
        const latest = pool.find(x => x.id === id);
        if (latest) select(type, latest);
        MessagePlugin.success('已回退到上一个版本');
    } else {
        MessagePlugin.warning('无可回退的历史版本');
    }
}

const runOutput = ref<string>('');
function run() {
    try {
        if (!current.value) return;
        if (current.value.type === 'var') {
            let val: any = undefined;
            if (currentValueType.value === 'boolean') val = boolValue.value;
            else if (currentValueType.value === 'number') val = valueText.value === '' ? undefined : Number(valueText.value);
            else if (currentValueType.value === 'color' || currentValueType.value === 'string') val = valueText.value;
            else { try { val = valueText.value ? JSON.parse(valueText.value) : (currentValueType.value === 'array' ? [] : {}); } catch (e: any) { throw e; } }
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
function copyExpr() {
    try {
        const text = current.value?.type === 'var'
            ? (currentValueType.value === 'object' || currentValueType.value === 'array' ? valueText.value : String(valueText.value))
            : (exprText.value || '');
        navigator.clipboard.writeText(text);
        MessagePlugin.success((current.value?.type === 'var' ? '值' : '表达式') + '已复制');
    } catch { }
}

function buildRunContext() {
    const ctx: Record<string, any> = { Math, Date, JSON, console };
    try {
        const data = AppConfigStore.getData(appId());
        for (const v of data.vars) { try { ctx[v.name] = (v as any).value; } catch { } }
        for (const c of data.composites) { try { ctx[c.name] = new Function('ctx', `with(ctx){ return (${c.expr}); }`)(ctx); } catch { } }
        for (const f of data.funcs) { try { ctx[f.name] = new Function('ctx', `with(ctx){ return (${f.expr}); }`)(ctx); } catch { } }
    } catch { }
    ctx.now = Date.now(); ctx.today = new Date().toISOString().slice(0, 10); ctx.env = 'dev';
    return ctx;
}
function stringify(v: any) { try { return typeof v === 'string' ? v : JSON.stringify(v, null, 2); } catch { return String(v); } }

const dependencies = ref<string[]>([]);
function computeDeps() {
    const names: string[] = [];
    const data = AppConfigStore.getData(appId());
    for (const x of [...data.vars, ...data.composites, ...data.funcs]) names.push(x.name);
    const expr = current.value?.type === 'var' ? '' : (exprText.value || '');
    const set = new Set<string>();
    for (const n of names) { const re = new RegExp(`(^|[^A-Za-z0-9_])${n}([^A-Za-z0-9_]|$)`); if (re.test(expr)) set.add(n); }
    dependencies.value = Array.from(set);
}

const systemVars = [{ name: 'now', type: 'number', default: 'Date.now()', desc: '当前时间戳（毫秒）' }, { name: 'today', type: 'string', default: 'YYYY-MM-DD', desc: '当前日期字符串' }, { name: 'env', type: 'string', default: 'dev', desc: '当前环境标识' },];
const sysVarSearch = ref('');
const filteredSysVars = computed(() => { const q = sysVarSearch.value.trim().toLowerCase(); if (!q) return systemVars; return systemVars.filter(x => x.name.toLowerCase().includes(q) || String(x.desc).toLowerCase().includes(q)); });

interface SyntaxTip { title: string; category: '条件判断' | '循环' | '运算'; desc: string; example: string; }
const syntaxTips: SyntaxTip[] = [{ title: '三元表达式', category: '条件判断', desc: '条件 ? 值1 : 值2', example: 'score >= 60 ? "及格" : "不及格"' }, { title: 'if 判断', category: '条件判断', desc: 'if (条件) { ... } else { ... }', example: 'if (a > b) { a } else { b }' }, { title: 'while 循环', category: '循环', desc: 'while (条件) { ... }', example: 'let i=0; while(i<3){ i++; }' }, { title: 'for 循环', category: '循环', desc: 'for (初始化; 条件; 更新) { ... }', example: 'for (let i=0;i<3;i++){ i }' }, { title: '加法运算', category: '运算', desc: 'a + b', example: 'sum + delta' },];
const syntaxSearch = ref('');
const syntaxCategory = ref<string>('');
const filteredSyntaxTips = computed(() => { const q = syntaxSearch.value.trim().toLowerCase(); const c = syntaxCategory.value; return syntaxTips.filter(t => (!c || t.category === c) && (!q || t.title.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q))); });

function loadLists() { try { const data = AppConfigStore.getData(appId()); vars.value = [...(data.vars || [])]; composites.value = [...(data.composites || [])]; funcs.value = [...(data.funcs || [])]; } catch { } }
function onAppConfigChanged() { loadLists(); }
onMounted(() => { loadLists(); window.addEventListener('fju-app-config-changed', onAppConfigChanged as EventListener); });
onBeforeUnmount(() => { window.removeEventListener('fju-app-config-changed', onAppConfigChanged as EventListener); });
watchEffect(() => { computeDeps(); });

function commitName() {
    if (!current.value) return;
    const name = currentName.value.trim();
    const oldName = current.value.name || '';
    if (!name || name === oldName) return;
    const { type, id } = current.value;
    // 先执行存储层更新
    if (type === 'var') AppConfigStore.renameVar(appId(), id, name);
    else if (type === 'composite') AppConfigStore.renameComposite(appId(), id, name);
    else AppConfigStore.renameFunc(appId(), id, name);
    // 前端列表乐观更新，确保左侧立即反映名称变更
    if (type === 'var') vars.value = vars.value.map(x => x.id === id ? { ...x, name } : x);
    else if (type === 'composite') composites.value = composites.value.map(x => x.id === id ? { ...x, name } : x);
    else funcs.value = funcs.value.map(x => x.id === id ? { ...x, name } : x);
    // 重新从存储层读取，确保与版本/历史一致
    loadLists();
    const pool = type === 'var' ? vars.value : type === 'composite' ? composites.value : funcs.value;
    const latest = pool.find(x => x.id === id);
    if (latest) current.value = { ...latest };
}
function commitValueType() { if (!current.value) return; const { type, id } = current.value; const vt = currentValueType.value; if (type === 'var') AppConfigStore.setVarType(appId(), id, vt); else if (type === 'composite') AppConfigStore.setCompositeType(appId(), id, vt); else AppConfigStore.setFuncType(appId(), id, vt); loadLists(); }
</script>

<style scoped>
.data-editor {
    display: flex;
    height: 100%;
    min-height: 0;
    background: #fff;
    overflow: hidden;
}
</style>