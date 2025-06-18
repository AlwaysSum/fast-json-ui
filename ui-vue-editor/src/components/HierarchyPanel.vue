<template>
  <div class="hierarchy-panel">
    <h3>组件层级</h3>
    <div class="tree-root">
      <template v-if="root && root.type === 'ComponentRenderer'">
        <TreeNode
          v-if="root.child"
          :node="root.child"
          :path="['child']"
          :selectedPath="selectedPath"
          :level="0"
          @select="onSelect"
          @add="onAdd"
          @remove="onRemove"
          @moveUp="onMoveUp"
          @moveDown="onMoveDown"
          @dropComponent="onDropComponent"
          @moveNode="onMoveNode"
        />
        <TreeNode
          v-for="(child, idx) in root.children"
          v-if="Array.isArray(root.children)"
          :key="idx"
          :node="child"
          :path="['children', String(idx)]"
          :selectedPath="selectedPath"
          :level="0"
          @select="onSelect"
          @add="onAdd"
          @remove="onRemove"
          @moveUp="onMoveUp"
          @moveDown="onMoveDown"
          @dropComponent="onDropComponent"
          @moveNode="onMoveNode"
        />
      </template>
      <template v-else>
        <TreeNode
          v-if="root"
          :node="root"
          :path="[]"
          :selectedPath="selectedPath"
          :level="0"
          @select="onSelect"
          @add="onAdd"
          @remove="onRemove"
          @moveUp="onMoveUp"
          @moveDown="onMoveDown"
          @dropComponent="onDropComponent"
          @moveNode="onMoveNode"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from "vue";
import TreeNode from './TreeNode.vue';

const props = defineProps({
  root: { type: Object, required: true },
  selectedPath: { type: Array, default: () => [] },
});
const emit = defineEmits(["select", "add", "remove", "moveUp", "moveDown", "dropComponent", "moveNode"]);

function onSelect(path: string[]) { emit("select", path); }
function onAdd(path: string[]) { emit("add", path); }
function onRemove(path: string[]) { emit("remove", path); }
function onMoveUp(path: string[]) { emit("moveUp", path); }
function onMoveDown(path: string[]) { emit("moveDown", path); }
function onDropComponent(component: any, path: string[]) { emit("dropComponent", component, path); }
function onMoveNode(fromPath: string[], toPath: string[], toIndex: number) { emit("moveNode", fromPath, toPath, toIndex); }

// 节点类型图标
function getNodeIcon(type: string) {
  switch(type) {
    case 'container': return '📦';
    case 'row': return '⬅️➡️';
    case 'column': return '⬆️⬇️';
    case 'stack': return '🗂️';
    case 'text': return '📝';
    case 'button': return '🔘';
    case 'image': return '🖼️';
    case 'input': return '✏️';
    case 'select': return '🔽';
    default: return '⬛';
  }
}
</script>

<script lang="ts">
export default {
  name: "HierarchyPanel",
  components: { TreeNode }
};
</script>

<style scoped>
.hierarchy-panel {
  width: 240px;
  background: #fff;
  border-right: 1px solid #eee;
  padding: 12px 8px;
  overflow-y: auto;
}
.tree-root {
  font-size: 14px;
}
.tree-node {
  margin-bottom: 2px;
  min-height: 28px;
  position: relative;
}
.tree-node::before {
  content: '';
  position: absolute;
  left: -9px;
  top: 0;
  bottom: 0;
  width: 1px;
  background: #e0e0e0;
  z-index: 0;
  display: block;
}
.tree-node:first-child::before {
  top: 14px;
}
.tree-node:last-child::before {
  bottom: 14px;
}
.node-label {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 2px 4px 2px 0;
  border-radius: 4px;
  position: relative;
  background: transparent;
  transition: background 0.18s, border 0.18s;
  min-height: 28px;
  width: 100%;
  box-sizing: border-box;
}
.node-label::before {
  content: '';
  display: inline-block;
  width: 16px;
  height: 1px;
  background: #e0e0e0;
  position: absolute;
  left: -16px;
  top: 50%;
  transform: translateY(-50%);
}
.tree-node.root > .node-label::before {
  display: none;
}
.node-label:hover {
  background: #f0f7ff;
}
.tree-node.selected > .node-label {
  background: #e6f7ff;
  color: #1890ff;
  border: 1.5px solid #1890ff;
  box-shadow: 0 0 0 2px #e6f7ff;
}
.tree-node.drag-over > .node-label {
  background: #e6f7ff;
  border: 1.5px dashed #1890ff;
}
.tree-toggle {
  width: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  font-size: 13px;
  color: #888;
  margin-right: 2px;
}
.tree-toggle-placeholder {
  width: 18px;
  display: inline-block;
}
.tree-icon {
  width: 18px;
  text-align: center;
  font-size: 15px;
  opacity: 0.85;
  margin-right: 2px;
}
.tree-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #bdbdbd;
  display: inline-block;
  margin-right: 6px;
  margin-left: 2px;
}
.tree-type {
  flex: 1;
  font-weight: 500;
  font-size: 14px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tree-btns {
  display: flex;
  gap: 1px;
  min-width: 60px;
  justify-content: flex-end;
  align-items: center;
}
.tree-btns:not(:hover):not(.active) {
  visibility: hidden;
}
.node-label:hover .tree-btns,
.tree-node.selected > .node-label .tree-btns {
  visibility: visible;
}
.node-label button {
  font-size: 11px;
  padding: 0 3px;
  border: 1px solid #ddd;
  background: #f9f9f9;
  border-radius: 2px;
  cursor: pointer;
  transition: background 0.18s;
  height: 18px;
  min-width: 16px;
  margin-left: 1px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.node-label button:hover {
  background: #e6f7ff;
  color: #1890ff;
  border-color: #1890ff;
}
.tree-drop-indicator {
  height: 4px;
  background: #1890ff;
  margin: 2px 0;
  border-radius: 2px;
  transition: background 0.18s;
}
</style>
