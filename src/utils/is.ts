/**
 * 类型判断工具
 */

export const isString = (val: unknown): val is string => typeof val === 'string';

export const isNumber = (val: unknown): val is number => typeof val === 'number';

export const isBoolean = (val: unknown): val is boolean => typeof val === 'boolean';

export const isFunction = (val: unknown): val is Function => typeof val === 'function';

export const isObject = (val: unknown): val is Record<string, unknown> => 
  Object.prototype.toString.call(val) === '[object Object]';

export const isArray = (val: unknown): val is unknown[] => Array.isArray(val);

export const isEmpty = (val: unknown): boolean => {
  if (isArray(val) || isString(val)) {
    return val.length === 0;
  }
  if (isObject(val)) {
    return Object.keys(val).length === 0;
  }
  return true;
};
