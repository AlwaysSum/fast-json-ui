import { type Component } from "vue";

// 导入组件
import TextComponent from "./widgets/basic/TextComponent.vue";
import TestComponent from "./widgets/other/TestComponent.vue";
import ImageComponent from "./widgets/basic/ImageComponent.vue";
import ButtonComponent from "./widgets/basic/ButtonComponent.vue";
import ContainerComponent from "./widgets/layout/ContainerComponent.vue";
import RowComponent from "./widgets/layout/RowComponent.vue";
import ColumnComponent from "./widgets/layout/ColumnComponent.vue";
import StackComponent from "./widgets/layout/StackComponent.vue";
import DefaultComponent from "./widgets/other/DefaultComponent.vue";

// Vite import.meta.glob 类型声明（仅限 Vite 项目）
declare global {
  interface ImportMeta {
    glob: (
      pattern: string,
      options?: { eager?: boolean }
    ) => Record<string, any>;
  }
}

/**
 * 组件分类
 */
export type ComponentCategory =
  | "basic"
  | "layout"
  | "form"
  | "custom"
  | "other";

/**
 * 属性类型
 */
export type PropertyType =
  | "string"
  | "number"
  | "boolean"
  | "select"
  | "color"
  | "icon"
  | "expression"
  | "children"
  | "child"
  | "array"
  | "object"
  | "method";

/**
 * 属性元数据
 */
export interface PropertyMeta {
  name: string;
  label: string;
  type: PropertyType;
  defaultValue?: any;
  options?: { label: string; value: any }[];
  required?: boolean;
  // 新增：属性分组配置（用于编辑器折叠面板分组显示）
  group?: string; // 分组键，如 "layout"、"style"、"size"、"event" 等
  groupLabel?: string; // 分组显示名称，如 "布局"、"样式"
}

/**
 * 组件配置
 */
export interface ComponentConfig {
  type: string;
  [key: string]: any;
}

// 新增：组件注册表，包含组件和元数据
export interface WidgetMeta {
  type: string;
  name: string;
  icon?: string;
  category: ComponentCategory;
  defaultConfig: ComponentConfig;
  properties: PropertyMeta[];
}

export interface WidgetRegistration {
  component: Component;
  metadata: WidgetMeta;
}

const widgetRegistry: Record<string, WidgetRegistration> = {};

// 自动扫描 widgets 目录下所有 .vue 和 .metadata.ts 文件（递归子文件夹）
const componentModules = import.meta.glob("./widgets/**/*.vue", {
  eager: true,
});
const metadataModules = import.meta.glob("./widgets/**/*.metadata.ts", {
  eager: true,
});

// 以文件名（不含扩展名）为 key 进行组件和元数据的对应
Object.entries(componentModules).forEach(([vuePath, mod]: [string, any]) => {
  const name = vuePath.match(/\.\/widgets\/(?:.+\/)?(.*)\.vue$/)?.[1];
  if (!name) return;
  const component = mod.default;
  // 查找同名 metadata
  // 递归子文件夹后，metadata 路径需与 vuePath 匹配
  const metaPath = vuePath.replace(/\.vue$/, ".metadata.ts");
  const metaMod = metadataModules[metaPath];
  const meta = metaMod?.metadata || metaMod?.default;
  if (meta && meta.type) {
    widgetRegistry[meta.type] = { component, metadata: meta };
  }
});

export const componentMap: Record<string, Component> = Object.fromEntries(
  Object.entries(widgetRegistry).map(([type, reg]) => [type, reg.component])
);

/**
 * 获取组件类型
 * @param type 组件类型
 * @returns 对应的组件
 */
export function getComponentByType(type: string): Component {
  return componentMap[type] || componentMap["default"];
}

export function getWidgetMetaByType(type: string): WidgetMeta | undefined {
  return widgetRegistry[type]?.metadata;
}

/**
 * 注册自定义组件
 * @param type 组件类型名称
 * @param component 组件实例
 * @param metadata 组件元数据
 */
export function registerCustomComponent(
  type: string,
  component: Component,
  metadata: WidgetMeta
): void {
  if (widgetRegistry[type]) {
    console.warn(`组件类型 "${type}" 已存在，将被覆盖`);
  }
  widgetRegistry[type] = { component, metadata };
  componentMap[type] = component;
}

/**
 * 批量注册自定义组件
 * @param components 组件映射对象
 */
export function registerCustomComponents(
  components: Record<string, { component: Component; metadata: WidgetMeta }>
): void {
  Object.entries(components).forEach(([type, reg]) => {
    registerCustomComponent(type, reg.component, reg.metadata);
  });
}

export const getWidgetRegistry = () => widgetRegistry;

// 导出所有组件，方便单独使用
export {
  TextComponent,
  TestComponent,
  ImageComponent,
  ButtonComponent,
  ContainerComponent,
  RowComponent,
  ColumnComponent,
  StackComponent,
  DefaultComponent,
};
