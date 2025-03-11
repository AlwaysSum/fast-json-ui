import { App, Component } from 'vue';

export interface ComponentConfig {
  type: string;
  [key: string]: any;
}

export interface BaseConfig {
  type: string;
  [key: string]: any;
}

export interface ConfigData {
  [key: string]: any;
}

export interface ConfigMethods {
  [key: string]: any;
}

export interface SlotProps {
  child: ComponentConfig;
}

export function getMethodNameByString(value: string): { method: string; args: string[] };
export function getVariableNameByString(value: string): string;
export function replaceStringVariable(value: string, data: ConfigData): string;

export function getValueFromConfig(value: any, data: ConfigData, methods: ConfigMethods): any;
export function getMethodFromConfig(value: any, data: ConfigData, methods: ConfigMethods): Function | undefined;
export function callFunction(value: any, data: ConfigData, methods: ConfigMethods): void;
export function computeStyle(config: any): Record<string, any>;
export function setGlobalData(key: string, value: any): void;
export function getGlobalData(key: string): any;
export function setGlobalMethod(key: string, method: Function): void;
export function getGlobalMethod(key: string): Function | undefined;
export function getGlobalDataStore(): ConfigData;
export function getGlobalMethodStore(): ConfigMethods;

export const FastJsonWidget: Component;

declare const plugin: {
  install: (app: App) => void;
};

export default plugin; 