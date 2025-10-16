<template>
  <div class="home">
    <h2>我的应用</h2>
    <div class="grid">
      <div class="card add-card" @click="openAddDialog">
        <div class="plus">+</div>
      </div>

      <div v-for="app in apps" :key="app.id" class="card">
        <div class="card-header">
          <span class="type-icon" :class="app.type === 'uniapp' ? 'uniapp' : 'h5'" />
          <span class="name">{{ app.name }}</span>
        </div>
        <div class="card-actions">
          <button class="btn" @click="goEdit(app)">编辑</button>
          <button class="btn warn" @click="confirmDelete(app)">删除</button>
          <button class="btn" @click="openCode(app)">源码预览</button>
        </div>
      </div>
    </div>

    <!-- 添加应用对话框 -->
    <div v-if="dialog.add" class="dialog-backdrop" @click.self="dialog.add=false">
      <div class="dialog">
        <div class="dialog-header">
          <span>添加应用</span>
          <button class="close" @click="dialog.add=false">×</button>
        </div>
        <div class="dialog-body">
          <label>应用名称</label>
          <input v-model.trim="form.name" placeholder="请输入名称" />
          <label>应用类型</label>
          <div class="radio-group">
            <label><input type="radio" value="uniapp" v-model="form.type" /> Uniapp 小程序</label>
            <label><input type="radio" value="h5" v-model="form.type" /> H5 应用</label>
          </div>
        </div>
        <div class="dialog-footer">
          <button class="btn" @click="dialog.add=false">取消</button>
          <button class="btn primary" @click="submitAdd">确定</button>
        </div>
      </div>
    </div>

    <!-- 源码预览对话框 -->
    <div v-if="dialog.code" class="dialog-backdrop" @click.self="dialog.code=false">
      <div class="dialog large">
        <div class="dialog-header">
          <span>源码预览 - {{ current?.name }}</span>
          <button class="close" @click="dialog.code=false">×</button>
        </div>
        <div class="dialog-body">
          <JsonPreview :text="codeText" />
        </div>
        <div class="dialog-footer">
          <button class="btn" @click="copyCode">复制</button>
          <button class="btn" @click="exportCode">导出</button>
          <button class="btn primary" @click="dialog.code=false">关闭</button>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { AppConfigStore, type AppConfigFile } from '../services/AppConfigStore';
import { useRouter } from 'vue-router';
// @ts-ignore 处理 Vue SFC 默认导出或类型声明缺失的诊断
import JsonPreview from '../components/JsonPreview.vue';

type AppType = 'uniapp' | 'h5';
interface AppRecord { id: string; name: string; type: AppType; createdAt: number; config?: AppConfigFile }
const STORAGE_KEY = 'fju-apps';

const router = useRouter();
const apps = ref<AppRecord[]>([]);
const dialog = ref({ add: false, code: false });
const form = ref<AppRecord>({ id: '', name: '', type: 'uniapp', createdAt: Date.now() });
const current = ref<AppRecord | null>(null);
const codeText = ref('');

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    apps.value = raw ? JSON.parse(raw) : [];
    // 用配置中的应用名称进行同步，保证列表显示一致
    apps.value = apps.value.map((a) => {
      try {
        const cfg = AppConfigStore.load(a.id);
        return { ...a, name: cfg.name, config: cfg };
      } catch {
        return a;
      }
    });
    // 回写本地，避免名称不一致
    save();
  } catch { apps.value = [] }
}
function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(apps.value)); }

function openAddDialog() { dialog.value.add = true; form.value = { id: '', name: '', type: 'uniapp', createdAt: Date.now() }; }
function submitAdd() {
  if (!form.value.name.trim()) { alert('请填写应用名称'); return; }
  const id = Math.random().toString(36).slice(2, 10);
  const appName = form.value.name.trim();
  const cfg = defaultConfig(appName);
  // 写入统一配置到本地
  AppConfigStore.save(id, cfg);
  // 列表名称与配置保持一致
  apps.value.push({ id, name: cfg.name, type: form.value.type, createdAt: Date.now(), config: cfg });
  save();
  dialog.value.add = false;
}

function confirmDelete(app: AppRecord) {
  if (confirm(`确认删除应用「${app.name}」？`)) {
    apps.value = apps.value.filter(a => a.id !== app.id);
    save();
    // 同步删除统一的应用配置以及遗留旧键
    try { AppConfigStore.removeApp(app.id); } catch {}
  }
}

function goEdit(app: AppRecord) { router.push(`/app/${app.id}`); }

function openCode(app: AppRecord) {
  current.value = app;
  // 优先从统一配置读取，保证与编辑器一致
  try {
    const cfg = AppConfigStore.load(app.id);
    codeText.value = JSON.stringify(cfg, null, 2);
  } catch {
    codeText.value = JSON.stringify(app.config ?? {}, null, 2);
  }
  dialog.value.code = true;
}
async function copyCode() { try { await navigator.clipboard.writeText(codeText.value); alert('已复制'); } catch { alert('复制失败'); } }
function exportCode() {
  const blob = new Blob([codeText.value], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `${current.value?.name || 'config'}.json`; a.click();
  URL.revokeObjectURL(url);
}

function defaultConfig(appName = ''): AppConfigFile {
  const name = appName || '未命名应用';
  return {
    name,
    createtime: new Date().toISOString().slice(0, 10),
    pages: [
      {
        id: 1,
        name: '首页',
        desc: '使用可视化编辑器自定义页面',
        path: '/home',
        schema: { type: 'column', children: [ { type: 'text', text: '欢迎使用 Fast-JSON-UI' } ] },
      },
    ],
    version: '1.0.0',
  };
}

onMounted(load);
</script>

<style scoped>
.home { padding: 12px; }
h2 { margin: 0 0 12px 0; }
.grid { display: flex; gap: 16px; flex-wrap: wrap; }
.card { width: 220px; border: 1px solid #ddd; border-radius: 8px; padding: 12px; background: #f4f4f4; }
.add-card { width: 120px; height: 60px; display: flex; align-items: center; justify-content: center; background: #d8f7da; border: 1px solid #8ad18f; }
.plus { font-size: 32px; font-weight: bold; }
.card-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.type-icon { width: 22px; height: 22px; border-radius: 50%; display: inline-block; }
.type-icon.uniapp { background: #32cd32; }
.type-icon.h5 { background: #3b82f6; }
.name { font-weight: 600; }
.card-actions { display: flex; gap: 8px; }
.btn { padding: 4px 10px; border: 1px solid #aaa; background: #fff; border-radius: 4px; cursor: pointer; }
.btn.warn { color: #fff; background: #f87171; border-color: #f87171; }

.dialog-backdrop { position: fixed; inset:0; background: rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center; z-index:1000; }
.dialog { width: 420px; max-width: 90vw; background:#fff; border-radius:8px; border:1px solid #ddd; display:flex; flex-direction:column; }
.dialog.large { width: 800px; max-width: 90vw; max-height: 80vh; }
.dialog-header { display:flex; justify-content:space-between; align-items:center; padding:10px 14px; border-bottom:1px solid #eee; font-weight:600; }
.dialog-body { padding: 12px 14px; overflow: auto; }
.dialog-body input { width: 100%; padding: 6px 8px; border: 1px solid #ccc; border-radius: 4px; }
.radio-group { display: flex; gap: 16px; margin-top: 8px; }
.dialog-footer { display:flex; justify-content:flex-end; gap:8px; padding:10px 14px; border-top:1px solid #eee; }
pre { margin:0; white-space:pre-wrap; word-break:break-word; font-family: monospace; }
.close { border:none; background:transparent; font-size:20px; cursor:pointer; }
</style>