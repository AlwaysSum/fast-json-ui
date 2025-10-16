<template>
  <section class="middle">
    <div v-if="current" class="editor">
      <div class="editor-header">
        <div class="title">
          <input class="name-input" :value="currentName" @input="onNameInput" @keyup.enter="emit('commitName')" @blur="emit('commitName')" placeholder="名称" />
          <span class="type-chip">（{{ typeLabel(current.type) }}）</span>
          <select class="type-select" :value="currentValueType" @change="onTypeChange">
            <option value="string">字符</option>
            <option value="number">数值</option>
            <option value="boolean">布尔值</option>
            <option value="object">对象</option>
            <option value="array">数组</option>
            <option value="color">色值</option>
          </select>
        </div>
        <div class="ops">
          <button class="btn" @click="emit('run')">运行</button>
          <button class="btn" @click="emit('copy')">{{ current?.type==='var' ? '复制值' : '复制表达式' }}</button>
          <button class="btn" @click="emit('save')">保存</button>
          <button class="btn" @click="emit('rollback')">版本回退</button>
        </div>
      </div>
      <template v-if="current?.type==='var'">
        <div class="var-editor">
          <template v-if="currentValueType==='boolean'">
            <label class="bool-row"><input type="checkbox" :checked="boolValue" @change="onBoolChange" /> 设为 true/false</label>
          </template>
          <template v-else-if="currentValueType==='color'">
            <input class="color-input" type="color" :value="valueText" @input="onValueInput" />
          </template>
          <template v-else-if="currentValueType==='object' || currentValueType==='array'">
            <textarea class="code" :value="valueText" @input="onValueInput" placeholder="请输入 JSON 值"></textarea>
          </template>
          <template v-else>
            <input class="value-input" :value="valueText" @input="onValueInput" :placeholder="currentValueType==='number' ? '请输入数值' : '请输入字符'" />
          </template>
        </div>
      </template>
      <template v-else>
        <textarea class="code" :value="exprText" @input="onExprInput" placeholder="在此输入表达式或函数体（支持 JS 表达式）"></textarea>
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
</template>

<script setup lang="ts">
import type { DataEntry, DataEntryType, DataValueType } from '../../../services/AppConfigStore';

const props = defineProps<{ 
  current: DataEntry | null;
  currentName: string;
  currentValueType: DataValueType;
  exprText: string;
  valueText: string;
  boolValue: boolean;
  runOutput: string;
  dependencies: string[];
}>();

const emit = defineEmits<{
  (e: 'update:currentName', v: string): void;
  (e: 'commitName'): void;
  (e: 'update:currentValueType', v: DataValueType): void;
  (e: 'typeChange', v: DataValueType): void;
  (e: 'update:exprText', v: string): void;
  (e: 'update:valueText', v: string): void;
  (e: 'update:boolValue', v: boolean): void;
  (e: 'run'): void;
  (e: 'copy'): void;
  (e: 'save'): void;
  (e: 'rollback'): void;
}>();

function typeLabel(t: DataEntryType){ return t==='var' ? '变量' : t==='composite' ? '复合变量' : '函数'; }
function onNameInput(e: Event){ emit('update:currentName', (e.target as HTMLInputElement).value); }
function onTypeChange(e: Event){ const v = (e.target as HTMLSelectElement).value as DataValueType; emit('update:currentValueType', v); emit('typeChange', v); }
function onExprInput(e: Event){ emit('update:exprText', (e.target as HTMLTextAreaElement).value); }
function onValueInput(e: Event){ emit('update:valueText', (e.target as HTMLInputElement | HTMLTextAreaElement).value); }
function onBoolChange(e: Event){ emit('update:boolValue', (e.target as HTMLInputElement).checked); }
</script>

<script lang="ts">
export default {
  name: 'DataEditorPanel',
};
</script>

<style scoped>
.middle { flex:1; padding:10px; overflow-y:auto; min-height:0; }
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
.btn { padding:4px 8px; border:1px solid #aaa; border-radius:6px; background:#fff; cursor:pointer; font-size:12px; }
.type-chip { color:#666; margin-left:6px; }
.type-select { margin-left:8px; }
.value-input { width:100%; padding:6px 8px; border:1px solid #ddd; border-radius:6px; }
.color-input { width: 120px; }
.bool-row { display:flex; align-items:center; gap:8px; }
.var-editor { display:flex; flex-direction:column; gap:8px; }
</style>