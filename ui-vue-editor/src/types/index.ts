import { WidgetFactory } from "fast-json-ui-vue";

/**
 * 组件配置
 */
export interface ComponentConfig {
  type: string;
  [key: string]: any;
}

/**
 * 编辑器状态
 */
export interface EditorState {
  selectedComponent: ComponentConfig | null;
  rootComponent: ComponentConfig;
  componentPath: string[];
  undoStack: ComponentConfig[];
  redoStack: ComponentConfig[];
  previewMode: boolean;
}

/**
 * 编辑器配置
 */
export interface EditorConfig {
  customComponents?: WidgetFactory.WidgetMeta[];
  initialConfig?: ComponentConfig;
  theme?: "light" | "dark";
}

/**
 * 编辑器选项
 */
export interface EditorOptions {
  initialConfig?: ComponentConfig;
  readOnly?: boolean;
  theme?: string;
}
