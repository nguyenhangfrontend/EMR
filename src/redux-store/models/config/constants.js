import { isObject } from 'lodash';

export const combineFields = (json, result = {}, parentKey) => {
  const keys = json ? Object.keys(json) : [];
  
  keys.forEach((key) => {
    result[parentKey ? `${parentKey}_${key}` : key] = json[key] || '';
    
    if (isObject(json[key]) && !json[key].length) {
      combineFields(json[key], result, parentKey ? `${parentKey}_${key}` : key);
    }
  });
  
  return result;
};
