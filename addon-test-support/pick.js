import { getProperties } from '@ember/object';
import { isArray } from '@ember/array';
import { flattenNames } from './lib/flatten';
import expand from './lib/expand';

export default function(source, attrs) {
  if (!isArray(attrs)) {
    attrs = flattenNames(attrs);
  }
  let props = getProperties(source, attrs);
  Object.entries(props).forEach(([key, value]) => {
    if (isArray(value)) {
      props[key] = value.map((v) => v.id || v);
    }
  });
  return expand(props);
}
