<template>
  <div class="hierarchy-panel">
    <t-card title="组件层级" :bordered="false">
      <div class="tree-container" v-if="treeData.length > 0">
        <t-tree
          :data="treeData"
          :keys="{ value: 'value', label: 'label', children: 'children' }"
          :active-multiple="false"
          :actived="activeValue"
          :height="400"
          :transition="false"
          :expand-on-click-node="false"
          :expand-all="true"
          :icon="true"
          :line="true"
          @active="handleNodeActive"
          @click="handleNodeClick"
        >
          <template #icon="{ node }">
            <component :is="getNodeIconComponent(node.data?.data?.type)" />
          </template>
          
          <template #expand-icon="{ node }">
            <component :is="node.expanded ? MinusIcon : AddIcon" />
          </template>
          
          <template #label="{ node }">
            <span class="node-label">{{ getNodeLabel(node.data.data) }}</span>
          </template>

          <template #operations="{ node }">
            <div class="node-operations">
              <!-- 容器类型组件显示添加按钮 -->
              <t-button 
                v-if="isContainerType(node.data?.data?.type)"
                size="small" 
                theme="primary"
                variant="text"
                shape="circle"
                @click="handleAdd(node)"
                title="添加子组件"
              >
                 <add-icon name="add" />
              </t-button>
              
              <!-- 非根节点显示删除按钮 -->
              <t-button 
                v-if="!isRootNode(node)"
                size="small" 
                variant="text" 
                theme="danger"
                shape="circle"
                @click="handleRemove(node)"
                title="删除"
              >
                <template #icon>
                  <RemoveIcon />
                </template>
              </t-button>
              
              <!-- 非根节点显示上移按钮 -->
              <t-button 
                v-if="!isRootNode(node)"
                size="small" 
                variant="text"
                shape="circle"
                @click="handleMoveUp(node)"
                title="上移"
              >
                <template #icon>
                  <ArrowUpIcon />
                </template>
              </t-button>
              
              <!-- 非根节点显示下移按钮 -->
              <t-button 
                v-if="!isRootNode(node)"
                size="small" 
                variant="text"
                shape="circle"
                @click="handleMoveDown(node)"
                title="下移"
              >
                <template #icon>
                  <ArrowDownIcon />
                </template>
              </t-button>
              
              <!-- 非根节点显示增加层级按钮 -->
              <t-button 
                v-if="!isRootNode(node) && canIncreaseLevel(node)"
                size="small" 
                variant="text"
                shape="circle"
                @click="handleIncreaseLevel(node)"
                title="增加层级"
              >
                <template #icon>
                  <ChevronRightIcon />
                </template>
              </t-button>
              
              <!-- 非根节点显示减少层级按钮 -->
              <t-button 
                v-if="!isRootNode(node) && canDecreaseLevel(node)"
                size="small" 
                variant="text"
                shape="circle"
                @click="handleDecreaseLevel(node)"
                title="减少层级"
              >
                <template #icon>
                  <ChevronLeftIcon />
                </template>
              </t-button>
            </div>
          </template>
        </t-tree>
      </div>
      <t-empty v-else description="暂无组件" />
    </t-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, PropType } from 'vue';
import { 
  AddIcon, 
  RemoveIcon, 
  ArrowUpIcon, 
  ArrowDownIcon, 
  ChevronRightIcon, 
  ChevronLeftIcon,
  MinusIcon,
  ViewModuleIcon,
  ViewListIcon,
  ViewColumnIcon,
  TextformatBoldIcon,
  ButtonIcon,
  EditIcon,
  ImageIcon,
  CreditcardIcon,
  TabIcon,
  UnfoldLessIcon,
  WindowIcon,
  MenuFoldIcon,
  ComponentGridIcon,
  FileIcon
} from 'tdesign-icons-vue-next';
import { ComponentConfig } from '../types';
import { TreeInstanceFunctions } from 'tdesign-vue-next';

// Props
const props = defineProps({
  root: {
    type: Object as PropType<ComponentConfig>,
    required: false,
  },
  selectedPath: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
});

// Emits
const emit = defineEmits<{
  select: [path: string[]]
  add: [path: string[]]
  remove: [path: string[]]
  moveUp: [path: string[]]
  moveDown: [path: string[]]
  increaseLevel: [path: string[]]
  decreaseLevel: [path: string[]]
}>();

// TDesign Tree 组件的 keys 配置
const treeKeys = {
  value: 'value',
  label: 'label',
  children: 'children'
};

// Tree 实例引用
const treeRef = ref<TreeInstanceFunctions>();

// 当前激活的节点
const activeValue = ref<string>('');

// 监听选中路径变化
watch(() => props.selectedPath, (newPath) => {
  if (newPath && newPath.length > 0) {
    activeValue.value = newPath.join('.');
  } else {
    activeValue.value = '';
  }
}, { immediate: true });

// 将 ComponentConfig 转换为树形数据格式
function convertToTreeData(component: ComponentConfig, path: string[] = []): any[] {
  if (!component) return [];

  const result: any[] = [];
  
  // 处理 ComponentRenderer 类型
  if (component.type === 'ComponentRenderer') {
    if (component.child) {
      return convertToTreeData(component.child, path);
    }
    if (component.children && Array.isArray(component.children)) {
       const childNodes: any[] = [];
       component.children.forEach((child, index) => {
         childNodes.push(...convertToTreeData(child, [...path, 'children', String(index)]));
       });
       return childNodes;
     }
    return [];
  }

  // 普通组件节点
  const nodeId = path.length > 0 ? path.join('.') : 'root';
  const treeNode: any = {
    value: nodeId,
    label: component.type || 'Unknown',
    data: { ...component, path },
    children: []
  };

  // 处理子组件
  if (component.child) {
    const childNodes = convertToTreeData(component.child, [...path, 'child']);
    treeNode.children.push(...childNodes);
  }
  
  if (component.children && Array.isArray(component.children)) {
    component.children.forEach((child, index) => {
      const childNodes = convertToTreeData(child, [...path, 'children', String(index)]);
      treeNode.children.push(...childNodes);
    });
  }

  result.push(treeNode);
  return result;
}

// 计算树形数据
const treeData = computed(() => {
  if (!props.root) return [];
  return convertToTreeData(props.root, []);
});

// 获取节点图标组件
function getNodeIconComponent(type?: string) {
  switch (type) {
    case 'container':
      return ViewModuleIcon;
    case 'row':
      return ViewListIcon;
    case 'column':
      return ViewColumnIcon;
    case 'text':
      return TextformatBoldIcon;
    case 'button':
      return ButtonIcon;
    case 'input':
      return EditIcon;
    case 'image':
      return ImageIcon;
    case 'card':
      return CreditcardIcon;
    case 'tabs':
      return TabIcon;
    case 'collapse':
      return UnfoldLessIcon;
    case 'modal':
      return WindowIcon;
    case 'drawer':
      return MenuFoldIcon;
    case 'ComponentRenderer':
      return ComponentGridIcon;
    default:
      return FileIcon;
  }
}

// 获取节点标签
function getNodeLabel(data: any): string {
  if (!data) return 'Unknown';
  // 优先显示自定义名称，其次显示组件类型
  const n = (data as any).name;
  if (n && String(n).trim().length > 0) return String(n);
  return data.type || 'Unknown';
}

// 判断是否为容器类型组件
function isContainerType(type?: string): boolean {
  const containerTypes = [
    'container', 'row', 'column', 'card', 'tabs', 'collapse', 'modal', 'drawer'
  ];
  return containerTypes.includes(type || '');
}

// 判断是否为根节点
function isRootNode(node: any): boolean {
  return node.value === 'root' || !node.data?.data?.path || node.data.data.path.length === 0;
}

// 节点激活事件
function handleNodeActive(value: string[], context: any) {
  if (value.length > 0) {
    activeValue.value = value[0];
    const node = findNodeByValue(value[0]);
    console.log('Node activated:', node); // 调试日志
    if (node && node.data?.data?.path) {
      console.log('Emitting select from active with path:', node.data.data.path); // 调试日志
      emit('select', node.data.data.path);
    }
  }
}

// 节点点击事件
function handleNodeClick(context: any) {
  const { node } = context;
  console.log('Node clicked:', node); // 调试日志
  if (node && node.data?.data?.path) {
    console.log('Emitting select with path:', node.data.data.path); // 调试日志
    emit('select', node.data.data.path);
  }
}

// 根据 value 查找节点
function findNodeByValue(value: string): any {
  function findInNodes(nodes: any[]): any {
    for (const node of nodes) {
      if (node.value === value) {
        return node;
      }
      if (node.children && node.children.length > 0) {
        const found = findInNodes(node.children);
        if (found) return found;
      }
    }
    return null;
  }
  return findInNodes(treeData.value);
}

// 添加组件
function handleAdd(node: any) {
  console.log('Add button clicked:', node); // 调试日志
  if (node && node.data?.data?.path) {
    console.log('Emitting add with path:', node.data.data.path); // 调试日志
    emit('add', node.data.data.path);
  }
}

// 删除组件
function handleRemove(node: any) {
  if (node && node.data?.data?.path) {
    emit('remove', node.data.data.path);
  }
}

// 上移组件
function handleMoveUp(node: any) {
  if (node && node.data?.data?.path) {
    emit('moveUp', node.data.data.path);
  }
}

// 下移组件
function handleMoveDown(node: any) {
  if (node && node.data?.data?.path) {
    emit('moveDown', node.data.data.path);
  }
}

// 判断是否可以增加层级
function canIncreaseLevel(node: any): boolean {
  // 检查前一个兄弟节点是否为容器类型
  const path = node.data?.data?.path;
  if (!path || path.length < 2) return false;
  
  const parentPath = path.slice(0, -1);
  const currentIndex = parseInt(path[path.length - 1]);
  
  if (currentIndex === 0) return false;
  
  // 获取前一个兄弟节点的路径
  const prevSiblingPath = [...parentPath, (currentIndex - 1).toString()];
  const prevSibling = findComponentByPath(props.root, prevSiblingPath);
  
  return !!(prevSibling && isContainerType(prevSibling.type));
}

// 判断是否可以减少层级
function canDecreaseLevel(node: any): boolean {
  if (!node?.data?.data?.path) return false;
  const path = node.data.data.path;
  return path.length > 2; // 根节点的直接子节点不能减少层级
}

// 增加层级
function handleIncreaseLevel(node: any) {
  if (node && node.data?.data?.path) {
    emit('increaseLevel', node.data.data.path);
  }
}

// 减少层级
function handleDecreaseLevel(node: any) {
  if (node && node.data?.data?.path) {
    emit('decreaseLevel', node.data.data.path);
  }
}

// 根据路径查找组件
function findComponentByPath(root: ComponentConfig | undefined, path: string[]): ComponentConfig | null {
  if (!root || !path.length) return null;
  
  let current = root;
  for (let i = 1; i < path.length; i++) { // 跳过根节点索引
    const index = parseInt(path[i]);
    if (!current.children || !current.children[index]) {
      return null;
    }
    current = current.children[index];
  }
  
  return current;
}
</script>

<style scoped>
.hierarchy-panel {
  width: 300px;
  height: 100%;
  border-right: 1px solid var(--td-border-level-1-color);
  background: var(--td-bg-color-container);
}

.tree-container {
  padding: 8px;
}

</style>
