<template>
  <div class="placeholder">
    <div class="card">
      <h3>数据（占位）</h3>
      <p>此区域预留给数据源管理、数据结构配置与调试。</p>
      <p>后续将支持：连接数据源、字段映射、示例数据与校验。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// 暂为占位视图
</script>

<style scoped>
.placeholder { display:flex; align-items:center; justify-content:center; height:100%; }
.card { width: 720px; max-width: 90vw; background:#fff; border:1px solid #ddd; border-radius:8px; padding:20px; box-shadow: 0 2px 6px rgba(0,0,0,0.06); }
h3 { margin:0 0 8px; }
p { margin:4px 0; color:#555; }
</style>