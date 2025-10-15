<template>
  <div class="settings">
    <div class="card">
      <h3>应用设置</h3>
      <div class="row">
        <label>应用名称</label>
        <input v-model.trim="name" placeholder="请输入应用名称" />
        <div class="actions"><button class="btn primary" @click="save">保存</button></div>
      </div>
      <p class="hint">名称将同步到应用列表与配置文件。</p>
    </div>
  </div>
  
  
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { AppConfigStore } from '../../services/AppConfigStore';

const route = useRoute();
const name = ref('');

onMounted(() => {
  const appId = String(route.params.appId || 'default');
  name.value = AppConfigStore.getName(appId);
});

function save(){
  const appId = String(route.params.appId || 'default');
  if (!name.value.trim()) { alert('请填写应用名称'); return; }
  AppConfigStore.setName(appId, name.value.trim());
  alert('已保存');
}
</script>

<style scoped>
.settings { display:flex; align-items:flex-start; justify-content:center; height:100%; padding-top:20px; }
.card { width: 720px; max-width: 90vw; background:#fff; border:1px solid #ddd; border-radius:8px; padding:20px; box-shadow: 0 2px 6px rgba(0,0,0,0.06); }
h3 { margin:0 0 12px; }
.row { display:flex; flex-direction:column; gap:8px; }
label { font-weight:600; }
input { width: 100%; padding: 6px 8px; border: 1px solid #ccc; border-radius: 4px; }
.actions { margin-top:8px; }
.btn { padding: 6px 12px; border: 1px solid #aaa; background: #fff; border-radius: 4px; cursor: pointer; }
.btn.primary { background:#4a90e2; color:#fff; border-color:#4a90e2; }
.hint { color:#666; font-size:12px; }
</style>