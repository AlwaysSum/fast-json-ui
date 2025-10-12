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
        'can-drop': true,
        [`drop-${dropPosition}`]: isDragOver && dropPosition
      }"
      :style="{ '--tree-indent': (level || 0) * 12 + 'px' }"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
      @dragenter="onDragEnter"
      @dragleave="onDragLeave"
      @dragover="onDragOver"
      @drop="onDrop"
    >
      <!-- 拖拽位置指示器 -->
      <div v-if="isDragOver && dropPosition" class="drop-indicator" :class="`indicator-${dropPosition}`">
        <div class="drop-line"></div>
      </div>
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

// 判断是否可以接受拖拽的组件
const canAcceptDrop = computed(() => {
  // 容器类组件可以接受拖拽
  const containerTypes = ['container', 'row', 'column', 'stack'];
  return containerTypes.includes(props.node.type);
});

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
// 拖拽位置指示器
const dropPosition = ref<'before' | 'after' | 'inside' | null>(null);

function calculateDropPosition(event: DragEvent): 'before' | 'after' | 'inside' {
  const element = event.currentTarget as HTMLElement;
  const rect = element.getBoundingClientRect();
  const y = event.clientY - rect.top;
  const height = rect.height;
  
  // 容器类组件优先支持内部插入
  if (canAcceptDrop.value) {
    const threshold = height * 0.25; // 25% 区域用于前后插入
    
    if (y < threshold) {
      return 'before';
    } else if (y > height - threshold) {
      return 'after';
    } else {
      return 'inside';
    }
  }
  
  // 非容器组件只支持前后插入
  return y < height / 2 ? 'before' : 'after';
}

function onDragEnter(event: DragEvent) {
  event.preventDefault();
  isDragOver.value = true;
  dropPosition.value = calculateDropPosition(event);
}

function onDragOver(event: DragEvent) {
  event.preventDefault();
  isDragOver.value = true;
  dropPosition.value = calculateDropPosition(event);
}

function onDragLeave(event: DragEvent) {
  // 检查是否真的离开了当前节点
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
  const x = event.clientX;
  const y = event.clientY;
  
  if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
    isDragOver.value = false;
    dropPosition.value = null;
  }
}

function onDrop(event: DragEvent) {
  event.preventDefault();
  event.stopPropagation();
  isDragOver.value = false;
  
  const position = dropPosition.value;
  dropPosition.value = null;
  
  const data = event.dataTransfer?.getData("application/json");
  if (data) {
    try {
      const widget = JSON.parse(data);
      // 将数组路径转换为字符串路径
      const pathString = Array.isArray(props.path) ? props.path.join('.') : props.path;
      console.log('TreeNode onDrop:', widget, 'to path:', pathString, 'position:', position);
      // 发送拖拽事件，包含目标路径和位置信息
      emit("dropComponent", widget, pathString, position);
    } catch (e) {
      console.error("Failed to parse dropped component", e);
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
  background: #f0f8ff;
  border: 2px dashed #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
}

.tree-node.can-drop > .node-label {
  position: relative;
}

.tree-node.can-drop > .node-label::after {
  content: "📦";
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  opacity: 0.6;
  pointer-events: none;
}

.tree-node.can-drop.drag-over > .node-label {
  background: #e6f7ff;
  border-color: #1890ff;
  transform: scale(1.02);
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
}

.tree-node.can-drop > .node-label:hover {
  border-color: #40a9ff;
}

/* 拖拽位置指示器样式 */
.drop-indicator {
  position: absolute;
  left: 0;
  right: 0;
  z-index: 10;
  pointer-events: none;
}

.drop-indicator.indicator-before {
  top: -2px;
}

.drop-indicator.indicator-after {
  bottom: -2px;
}

.drop-indicator.indicator-inside {
  top: 50%;
  transform: translateY(-50%);
  left: 20px;
  right: 20px;
}

.drop-line {
  height: 2px;
  background: #1890ff;
  border-radius: 1px;
  box-shadow: 0 0 4px rgba(24, 144, 255, 0.5);
}

.drop-indicator.indicator-inside .drop-line {
  height: 1px;
  background: rgba(24, 144, 255, 0.3);
  border: 1px dashed #1890ff;
  border-radius: 2px;
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
