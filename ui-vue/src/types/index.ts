/**
 * Type definitions for the Fast-JSON-UI library
 */

/**
 * Base configuration for all components
 */
export interface BaseConfig {
  type: string;
  name?: string;
  [key: string]: any;
}

/**
 * Configuration for components that can have multiple children
 */
export interface ParentConfig extends BaseConfig {
  children: BaseConfig[];
}

/**
 * Configuration for components that can have a single child
 */
export interface ContainerConfig extends BaseConfig {
  child: BaseConfig;
}

/**
 * Configuration for text component
 */
export interface TextConfig extends BaseConfig {
  type: 'text';
  text: string;
}

/**
 * Configuration for image component
 */
export interface ImageConfig extends BaseConfig {
  type: 'image';
  src: string;
  width?: string;
  height?: string;
}

/**
 * Configuration for button component
 */
export interface ButtonConfig extends BaseConfig {
  type: 'button';
  text: string;
  onTap?: string;
}

/**
 * Configuration for container component
 */
export interface ContainerComponentConfig extends ContainerConfig {
  type: 'container';
  color?: string;
  padding?: string;
  margin?: string;
}

/**
 * Configuration for row layout
 */
export interface RowConfig extends ParentConfig {
  type: 'row';
}

/**
 * Configuration for column layout
 */
export interface ColumnConfig extends ParentConfig {
  type: 'column';
}

/**
 * Configuration for stack layout
 */
export interface StackConfig extends ParentConfig {
  type: 'stack';
}

/**
 * Union type for all component configurations
 */
export type ComponentConfig = 
  | TextConfig
  | ImageConfig
  | ButtonConfig
  | ContainerComponentConfig
  | RowConfig
  | ColumnConfig
  | StackConfig
  | BaseConfig;

/**
 * Type for the data object containing variables
 */
export type ConfigData = Record<string, any>;

/**
 * Type for the methods object containing functions
 */
export type ConfigMethods = Record<string, Function>;