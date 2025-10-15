<template>
  <div class="app">
    <header class="topbar" v-if="!isAppEditor">
      <div class="brand">FastJSONUI</div>
      <nav class="nav">
        <router-link to="/" class="nav-item" active-class="active">应用管理</router-link>
        <router-link to="/single" class="nav-item" active-class="active">单页编辑器</router-link>
        <a class="nav-item" href="https://github.com/AlwaysSum/fast-json-ui" target="_blank">GIT 地址</a>
        <a class="nav-item" href="https://alwayssum.github.io/fast-json-ui/" target="_blank">API 文档</a>
      </nav>
    </header>
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
// 顶层仅负责导航与路由容器
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const isAppEditor = computed(() => route.path.startsWith('/app'));
</script>

<style>
* { box-sizing: border-box; }
html, body, #app { height: 100%; }
body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, 'PingFang SC', 'Microsoft YaHei', sans-serif; }

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: #d0d0d0;
}
.brand { font-weight: 600; }
.nav { display: flex; gap: 16px; align-items: center; }
.nav-item { text-decoration: none; color: #222; padding: 6px 10px; border-radius: 16px; }
.nav-item.active { background: #fff; }

.content { padding: 12px 16px; }
</style>