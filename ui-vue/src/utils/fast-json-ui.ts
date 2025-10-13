import { ConfigData, ConfigMethods } from '../types';
import * as RegexUtils from './regex-utils';
import { registerCustomComponent,registerCustomComponents } from '../components/WidgetFactory';

/**
 * 注册组件
 */
export const registerComponent = registerCustomComponent;

/**
 * 批量注册组件
 */
export const registerMultipleComponents = registerCustomComponents;

/**
 * 链式获取对象属性值
 * 支持如 "user.name" 或 "array.1.name" 这样的路径
 * @param obj 数据对象
 * @param path 属性路径，如 "user.name"
 * @returns 属性值
 */
export const getNestedValue = (obj: any, path: string): any => {
  if (!obj || !path) {
    return undefined;
  }
  
  // 处理路径中的点号和数组索引
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result === null || result === undefined) {
      return undefined;
    }
    
    // 尝试将键转换为数字（用于数组索引）
    const index = Number(key);
    if (!isNaN(index) && Array.isArray(result)) {
      result = result[index];
    } else {
      result = result[key];
    }
  }
  
  return result;
};

/**
 * 从配置中获取变量值
 * @param value 配置值
 * @param data 数据对象
 * @param methods 方法对象
 * @returns 解析后的值
 */
export const getValueFromConfig = (value: any, data: ConfigData, methods: ConfigMethods): any => {
  if (!value || typeof value !== 'string') {
    return value;
  }

  // 处理方法调用格式 @{methodName(args)}
  if (value.startsWith('@{') && value.endsWith('}')) {
    const findMethod = RegexUtils.getMethodNameByString(value);
    const method = methods[findMethod.method];
    
    if (method) {
      const argsList = findMethod.args.map(arg => {
        if (arg.startsWith('${') && arg.endsWith('}')) {
          const subName = RegexUtils.getVariableNameByString(arg);
          return getNestedValue(data, subName);
        }
        return arg;
      });

      if (typeof method === 'function') {
        return method(...argsList);
      }
    }
    
    return () => {};
  } 
  
  // 处理变量引用格式 ${variableName}
  else if (value.startsWith('${') && value.endsWith('}')) {
    const varName = RegexUtils.getVariableNameByString(value);
    return getNestedValue(data, varName);
  } 
  
  // 处理包含嵌入变量的文本
  else {
    return RegexUtils.replaceStringVariable(value, data);
  }
};

/**
 * 从配置中获取方法
 * @param eventValue 配置值
 * @param data 数据对象
 * @param methods 方法对象
 * @returns 解析后的方法
 */
export const getMethodFromConfig = (eventValue: any, data: ConfigData, methods: ConfigMethods): Function | undefined => {
  if (!eventValue || typeof eventValue !== 'string') {
    return undefined;
  }

  if (eventValue.startsWith('@{') && eventValue.endsWith('}')) {
    const findMethod = RegexUtils.getMethodNameByString(eventValue);
    const method = methods[findMethod.method];
    
    if (method) {
      const argsList = findMethod.args.map(arg => {
        if (arg.startsWith('${') && arg.endsWith('}')) {
          const subName = RegexUtils.getVariableNameByString(arg);
          return getNestedValue(data, subName);
        }
        return arg;
      });

      if (method && typeof method === 'function') {
        return method(...argsList);
      }
    }
  }
  
  // 默认回退函数
  return () => {
    console.warn('Method not found:', eventValue);
  };
};

/**
 * 调用配置中定义的函数
 * @param value 配置值
 * @param data 数据对象
 * @param methods 方法对象
 */
export const callFunction = (value: any, data: ConfigData, methods: ConfigMethods): void => {
  const method = getMethodFromConfig(value, data, methods);
  if (typeof method === 'function') {
    method();
  }
};

/**
 * 计算组件样式
 * @param config 组件配置
 * @returns 样式对象
 */
export const computeStyle = (config: any) => {
  return {
    width: config.width || 'auto',
    height: config.height || 'auto',
    backgroundColor: config.backgroundColor,
    padding: config.padding,
    margin: config.margin,
    borderRadius: config.borderRadius,
    boxShadow: config.boxShadow,
  };
};

// 渲染模式类型
export type RenderMode = 'normal' | 'editor' | 'preview';

// 全局存储
const globalStore: {
  data: ConfigData;
  methods: ConfigMethods;
  mode: RenderMode;
} = {
  data: {},
  methods: {},
  mode: 'normal'
};

/**
 * 设置全局数据
 * @param key 键
 * @param value 值
 */
export const setGlobalData = (key: string, value: any): void => {
  globalStore.data[key] = value;
};

/**
 * 获取全局数据
 * @param key 键
 * @returns 值
 */
export const getGlobalData = (key: string): any => {
  return globalStore.data[key];
};

/**
 * 设置全局方法
 * @param key 键
 * @param method 方法
 */
export const setGlobalMethod = (key: string, method: Function): void => {
  globalStore.methods[key] = method;
};

/**
 * 获取全局方法
 * @param key 键
 * @returns 方法
 */
export const getGlobalMethod = (key: string): Function | undefined => {
  return globalStore.methods[key];
};

/**
 * 获取全局数据对象
 * @returns 全局数据对象
 */
export const getGlobalDataStore = (): ConfigData => {
  return globalStore.data;
};

/**
 * 获取全局方法对象
 * @returns 全局方法对象
 */
export const getGlobalMethodStore = (): ConfigMethods => {
  return globalStore.methods;
};

/**
 * 设置渲染模式
 * @param mode 渲染模式：normal | editor | preview
 */
export const setRenderMode = (mode: RenderMode): void => {
  globalStore.mode = mode;
};

/**
 * 获取当前渲染模式
 */
export const getRenderMode = (): RenderMode => {
  return globalStore.mode;
};

/** 是否为编辑模式 */
export const isEditorMode = (): boolean => globalStore.mode === 'editor';

/** 是否为预览模式 */
export const isPreviewMode = (): boolean => globalStore.mode === 'preview';