/**
 * Utility functions for handling regex operations in the Fast-JSON-UI library
 */

interface MethodInfo {
  method: string;
  args: string[];
}

/**
 * Extracts the method name and arguments from a method string
 * @param value - The method string in the format @{methodName(arg1, arg2, ...)}
 * @returns An object containing the method name and arguments
 */
export function getMethodNameByString(value: string): MethodInfo {
  // Remove @{ and } from the string
  const methodString = value.substring(2, value.length - 1);
  
  // Find the method name (everything before the first parenthesis)
  const methodNameEndIndex = methodString.indexOf('(');
  const methodName = methodString.substring(0, methodNameEndIndex);
  
  // Extract arguments string (everything between parentheses)
  const argsString = methodString.substring(methodNameEndIndex + 1, methodString.lastIndexOf(')'));
  
  // Split arguments by comma, but ignore commas inside ${} expressions
  const args: string[] = [];
  let currentArg = '';
  let insideVariable = false;
  
  for (let i = 0; i < argsString.length; i++) {
    const char = argsString[i];
    
    if (char === '$' && argsString[i + 1] === '{') {
      insideVariable = true;
      currentArg += char;
    } else if (char === '}' && insideVariable) {
      insideVariable = false;
      currentArg += char;
    } else if (char === ',' && !insideVariable) {
      args.push(currentArg.trim());
      currentArg = '';
    } else {
      currentArg += char;
    }
  }
  
  // Add the last argument if it exists
  if (currentArg.trim()) {
    args.push(currentArg.trim());
  }
  
  return {
    method: methodName.trim(),
    args
  };
}

/**
 * Extracts the variable name from a variable string
 * @param value - The variable string in the format ${variableName}
 * @returns The variable name
 */
export function getVariableNameByString(value: string): string {
  // Remove ${ and } from the string
  return value.substring(2, value.length - 1);
}

/**
 * 获取嵌套属性值
 * 支持如 "user.name" 或 "array.1.name" 这样的路径
 * @param obj 数据对象
 * @param path 属性路径，如 "user.name"
 * @returns 属性值
 */
function getNestedValue(obj: any, path: string): any {
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
}

/**
 * Replaces all variable placeholders in a string with their values
 * @param text - The text containing variable placeholders
 * @param data - The data object containing variable values
 * @returns The text with variables replaced by their values
 */
export function replaceStringVariable(text: string, data: Record<string, any>): string {
  // Regular expression to match ${variableName} patterns
  const variableRegex = /\${([^}]+)}/g;
  
  // Replace all matches with their corresponding values from the data object
  return text.replace(variableRegex, (match, variableName) => {
    const value = getNestedValue(data, variableName);
    return value !== undefined ? String(value) : match;
  });
}

export default {
  getMethodNameByString,
  getVariableNameByString,
  replaceStringVariable
}; 