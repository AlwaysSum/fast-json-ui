import type { ComponentConfig } from '../types';
import { wrapComponent as wrapByManager, stripWrapper as stripByManager } from './ComponentManager';

export type PreviewTransformOptions = {
  isEditor: boolean;
};

/**
 * 深拷贝，确保转换过程无副作用
 */
function deepClone<T>(obj: T): T {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (e) {
    // Fallback，尽可能返回原对象（调用方需保证不再修改原始数据）
    return obj;
  }
}

/**
 * 将编辑JSON转换为预览JSON，并为每个组件包裹 ComponentRenderer。
 * 纯函数，无副作用：不会修改输入的 config。
 */
export function toPreview(config: ComponentConfig, options: PreviewTransformOptions): ComponentConfig {
  try {
    return wrapWithManager(config, [], options);
  } catch (e) {
    console.error('JsonTransformFactory.toPreview error:', e);
    return { type: 'text', text: '预览生成失败' } as any;
  }
}

/**
 * 去除预览JSON中的 ComponentRenderer 包装，生成干净的编辑JSON。
 * 纯函数，无副作用。
 */
export function stripWrapper(config: ComponentConfig): ComponentConfig | null {
  try {
    return stripByManager(config);
  } catch (e) {
    console.error('JsonTransformFactory.stripWrapper error:', e);
    return null;
  }
}

function wrapWithManager(config: ComponentConfig, currentPath: string[], options: PreviewTransformOptions): ComponentConfig {
  if (!config) return { type: 'text', text: '请添加组件' } as any;

  // 原始组件的浅拷贝，避免修改输入
  const base = deepClone(config);

  // 递归处理子组件
  if (Array.isArray(base.children)) {
    base.children = base.children.map((child: ComponentConfig, index: number) =>
      wrapWithManager(child, [...currentPath, 'children', String(index)], options)
    );
  }
  if (base.child) {
    base.child = wrapWithManager(base.child, [...currentPath, 'child'], options);
  }

  // 使用 ComponentManager 提供的包装策略
  return wrapByManager(base, { isEditor: options.isEditor, path: currentPath });
}

export default {
  toPreview,
  stripWrapper,
};