<template>
  <template v-if="node.type === 'ComponentRenderer'">
    <TreeNode
      v-if="node.child"
      :node="node.child"
      :path="[...path, 'child']"
      :selectedPath="selectedPath"
      :level="(level || 0) + 1"
      @select="$emit('select', $event)"
      @add="$emit('add', $event)"
      @remove="$emit('remove', $event)"
      @moveUp="$emit('moveUp', $event)"
      @moveDown="$emit('moveDown', $event)"
      @dropComponent="$emit('dropComponent', $event)"
      @moveNode="$emit('moveNode', $event)"
    />
    <TreeNode
      v-for="(child, idx) in node.children"
      v-if="Array.isArray(node.children)"
      :key="idx"
      :node="child"
      :path="[...path, 'children', String(idx)]"
      :selectedPath="selectedPath"
      :level="(level || 0) + 1"
      @select="$emit('select', $event)"
      @add="$emit('add', $event)"
      @remove="$emit('remove', $event)"
      @moveUp="$emit('moveUp', $event)"
      @moveDown="$emit('moveDown', $event)"
      @dropComponent="$emit('dropComponent', $event)"
      @moveNode="$emit('moveNode', $event)"
    />
  </template>
  <template v-else>
    <div
      class="tree-node"
      :class="{
        selected: isSelected,
        'drag-over': isDragOver,
        'is-root': isRoot,
      }"
      :style="{ '--tree-indent': (level || 0) * 12 + 'px' }"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
    >
      <div class="node-label" @click="select">
        <span v-if="canExpand" class="tree-toggle" @click.stop="toggleExpand">
          {{ expanded ? "▼" : "▶" }}
        </span>
        <span v-else class="tree-toggle-placeholder"></span>
        <span class="tree-icon">{{ getNodeIcon(node.type) }}</span>
        <span class="tree-type">{{ node.type }}</span>
        <div class="tree-btns">
          <button @click.stop="add">➕</button>
          <button v-if="!isRoot" @click.stop="remove">🗑️</button>
          <button @click.stop="moveUp">↑</button>
          <button @click.stop="moveDown">↓</button>
        </div>
      </div>
      <div v-if="hasChildren && expanded">
        <TreeNode
          v-for="(child, idx) in node.children"
          :key="idx"
          :node="child"
          :path="[...path, 'children', String(idx)]"
          :selectedPath="selectedPath"
          :level="(level || 0) + 1"
          @select="$emit('select', $event)"
          @add="$emit('add', $event)"
          @remove="$emit('remove', $event)"
          @moveUp="$emit('moveUp', $event)"
          @moveDown="$emit('moveDown', $event)"
          @dropComponent="$emit('dropComponent', $event)"
          @moveNode="$emit('moveNode', $event)"
        />
      </div>
      <div v-else-if="node.child && expanded">
        <TreeNode
          :node="node.child"
          :path="[...path, 'child']"
          :selectedPath="selectedPath"
          :level="(level || 0) + 1"
          @select="$emit('select', $event)"
          @add="$emit('add', $event)"
          @remove="$emit('remove', $event)"
          @moveUp="$emit('moveUp', $event)"
          @moveDown="$emit('moveDown', $event)"
          @dropComponent="$emit('dropComponent', $event)"
          @moveNode="$emit('moveNode', $event)"
        />
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, ref } from "vue";

const props = defineProps({
  node: { type: Object, required: true },
  path: { type: Array, required: true },
  selectedPath: { type: Array, required: true },
  level: { type: Number, default: 0 },
});
const emit = defineEmits([
  "select",
  "add",
  "remove",
  "moveUp",
  "moveDown",
  "dropComponent",
  "moveNode",
]);

const isSelected = computed(
  () => JSON.stringify(props.path) === JSON.stringify(props.selectedPath)
);
const canExpand = computed(() => {
  return (
    (Array.isArray(props.node.children) && props.node.children.length > 0) ||
    !!props.node.child
  );
});
const hasChildren = computed(
  () => Array.isArray(props.node.children) && props.node.children.length > 0
);
const isDragOver = ref(false);
const dragOverIndex = ref(-1);
const expanded = ref(true);
function toggleExpand(e: Event) {
  e.stopPropagation();
  expanded.value = !expanded.value;
}
function select() {
  emit("select", props.path);
}
function add() {
  emit("add", props.path);
}
function remove() {
  emit("remove", props.path);
}
function moveUp() {
  emit("moveUp", props.path);
}
function moveDown() {
  emit("moveDown", props.path);
}
function onDragStart(event: DragEvent) {
  event.stopPropagation();
  event.dataTransfer?.setData(
    "application/tree-node-path",
    JSON.stringify(props.path)
  );
}
function onDragOverNode(event: DragEvent, idx: number) {
  event.preventDefault();
  event.stopPropagation();
  dragOverIndex.value = idx;
}
function onDragLeaveNode(event: DragEvent) {
  dragOverIndex.value = -1;
}
function onDropNode(event: DragEvent, idx: number) {
  event.preventDefault();
  event.stopPropagation();
  dragOverIndex.value = -1;
  const fromPathStr = event.dataTransfer?.getData("application/tree-node-path");
  if (fromPathStr) {
    try {
      const fromPath = JSON.parse(fromPathStr);
      emit("moveNode", fromPath, props.path, idx);
    } catch (e) {}
  }
}
function onDragOver(event: DragEvent) {
  if (Array.isArray(props.node.children)) {
    event.preventDefault();
    isDragOver.value = true;
  }
}
function onDragLeave(event: DragEvent) {
  isDragOver.value = false;
}
function onDrop(event: DragEvent) {
  isDragOver.value = false;
  if (Array.isArray(props.node.children)) {
    event.preventDefault();
    const data = event.dataTransfer?.getData("application/json");
    if (data) {
      try {
        const newComponent = JSON.parse(data);
        emit("dropComponent", newComponent, props.path);
      } catch (e) {
        console.error("Failed to parse dropped component", e);
      }
    }
  }
}
const isRoot = computed(() => props.level === 0 || !props.level);
const showBtns = ref(false);
function onMouseEnter() {
  showBtns.value = true;
}
function onMouseLeave() {
  showBtns.value = false;
}
function getNodeIcon(type: string) {
  switch (type) {
    case "container":
      return "📦";
    case "row":
      return "⬅️➡️";
    case "column":
      return "⬆️⬇️";
    case "stack":
      return "🗂️";
    case "text":
      return "📝";
    case "button":
      return "🔘";
    case "image":
      return "🖼️";
    case "input":
      return "✏️";
    case "select":
      return "🔽";
    default:
      return "⬛";
  }
}
</script>

<style scoped>
.tree-node {
  margin-bottom: 2px;
  min-height: 28px;
  position: relative;
  padding-left: var(--tree-indent, 0);
}
.tree-node.is-root {
  padding-left: 0;
}
.tree-node:not(.is-root)::before {
  content: "";
  position: absolute;
  left: calc(var(--tree-indent, 0) - 11px);
  top: 0;
  bottom: 0;
  width: 1px;
  background: #e0e0e0;
  z-index: 0;
  display: block;
}
.tree-node:not(.is-root) > .node-label::before {
  content: "";
  display: inline-block;
  width: 16px;
  height: 1px;
  background: #e0e0e0;
  position: absolute;
  left: calc(-16px - var(--tree-indent, 0) + 20px);
  top: 50%;
  transform: translateY(-50%);
}
.tree-node.is-root > .node-label::before {
  display: none;
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
  content: "";
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
