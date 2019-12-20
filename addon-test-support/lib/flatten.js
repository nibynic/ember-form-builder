import { isArray } from '@ember/array';

export default function flatten(attrs) {
  let result = {};
  Object.entries(attrs).forEach(([key, value]) => {
    if (isArray(value)) {
      if (value.find((v) => typeof v === 'object')) {
        // array of objects
        value.forEach((child, i) => {
          if (child) {
            Object.entries(flatten(child)).forEach(([childKey, childValue]) => {
              result[[key, i, childKey].join('.')] = childValue;
            });
          }
        });
      } else {
        // array of simple values
        result[key] = value;
      }
    } else if (value && typeof value === 'object' && Object.entries(value).length) {
      // nested object
      Object.entries(flatten(value)).forEach(([childKey, childValue]) => {
        result[[key, childKey].join('.')] = childValue;
      });
    } else {
      // simple value
      result[key] = value;
    }
  });
  return result;
}

export function flattenNames(attrs) {
  return isArray(attrs) ? attrs : Object.keys(flatten(attrs));
}
