import { type Component } from "vue";

// 导入组件
import TextComponent from "./widgets/TextComponent.vue";
import TestComponent from "./widgets/TestComponent.vue";
import ImageComponent from "./widgets/ImageComponent.vue";
import ButtonComponent from "./widgets/ButtonComponent.vue";
import ContainerComponent from "./widgets/ContainerComponent.vue";
import RowComponent from "./widgets/RowComponent.vue";
import ColumnComponent from "./widgets/ColumnComponent.vue";
import StackComponent from "./widgets/StackComponent.vue";
import DefaultComponent from "./widgets/DefaultComponent.vue";

// Vite import.meta.glob 类型声明（仅限 Vite 项目）
declare global {
  interface ImportMeta {
    glob: (
      pattern: string,
      options?: { eager?: boolean }
    ) => Record<string, any>;
  }
}

// 新增：组件注册表，包含组件和元数据
export interface WidgetMeta {
  type: string;
  name: string;
  icon?: string;
  category?: string;
  defaultConfig: Record<string, any>;
  properties: Array<{
    name: string;
    label: string;
    type: string;
    defaultValue?: any;
    required?: boolean;
    options?: Array<{ label: string; value: any }>;
  }>;
}

export interface WidgetRegistration {
  component: Component;
  metadata: WidgetMeta;
}

const widgetRegistry: Record<string, WidgetRegistration> = {};

// 自动扫描 widgets 目录下所有 .vue 和 .metadata.ts 文件
const componentModules = import.meta.glob("./widgets/*.vue", { eager: true });
const metadataModules = import.meta.glob("./widgets/*.metadata.ts", {
  eager: true,
});

// 以文件名（不含扩展名）为 key 进行组件和元数据的对应
Object.entries(componentModules).forEach(([vuePath, mod]: [string, any]) => {
  const name = vuePath.match(/\.\/widgets\/(.*)\.vue$/)?.[1];
  if (!name) return;
  const component = mod.default;
  // 查找同名 metadata
  const metaMod = metadataModules[`./widgets/${name}.metadata.ts`];
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
