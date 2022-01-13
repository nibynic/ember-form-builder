import { flattenNames } from './lib/flatten';
import expand from './lib/expand';
import Accessors from './accessors/registry';
import findInput from './lib/find-input';
import { A } from '@ember/array';

export default function (scope, attrs) {
  let result = {};
  flattenNames(attrs).forEach(
    (key) =>
      (result[key] = Accessors.read(
        findInput(A([scope, key]).compact().join('.'))
      ))
  );
  return expand(result);
}
