import type { ComponentConfig } from '../types';

export type WrapOptions = {
  isEditor: boolean;
  path?: string[];
};

type WrapperBuilder = (child: ComponentConfig, options: WrapOptions) => ComponentConfig;

// 默认包装器：使用 ComponentRenderer 包裹
function defaultWrapper(child: ComponentConfig, options: WrapOptions): ComponentConfig {
  return {
    type: 'ComponentRenderer',
    child: child,
    isEditor: options.isEditor,
    path: options.path || [],
    onTap: '@{selectComponent(${config}, ${path})}',
    onUpdate: '@{updateComponent(${config}, ${path})}',
    onRemove: '@{removeComponent(${path})}',
    onMove: '@{moveComponent(${fromPath}, ${toPath})}',
  } as any;
}

const typeWrappers = new Map<string, WrapperBuilder>();
let globalWrapper: WrapperBuilder = defaultWrapper;

export function registerTypeWrapper(type: string, builder: WrapperBuilder) {
  typeWrappers.set(type, builder);
}

export function setGlobalWrapper(builder: WrapperBuilder) {
  globalWrapper = builder;
}

export function getWrapperForType(type: string): WrapperBuilder {
  return typeWrappers.get(type) || globalWrapper;
}

export function wrapComponent(child: ComponentConfig, options: WrapOptions): ComponentConfig {
  const builder = getWrapperForType(child?.type || '*');
  return builder(child, options);
}

export function stripWrapper(config: ComponentConfig): ComponentConfig | null {
  if (!config) return config as any;
  if ((config as any).type === 'ComponentRenderer') {
    const child = (config as any).child;
    if (!child) return null;
    return stripWrapper(child);
  }
  const clone = deepClone(config);
  if (Array.isArray((clone as any).children)) {
    (clone as any).children = (clone as any).children.map(stripWrapper).filter(Boolean) as any;
  }
  if ((clone as any).child) {
    (clone as any).child = stripWrapper((clone as any).child) as any;
  }
  return clone;
}

function deepClone<T>(obj: T): T {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch {
    return obj;
  }
}

export default {
  registerTypeWrapper,
  setGlobalWrapper,
  getWrapperForType,
  wrapComponent,
  stripWrapper,
};