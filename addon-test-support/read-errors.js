import { flattenNames } from './lib/flatten';
import expand from './lib/expand';
import findInput from './lib/find-input';
import { A } from '@ember/array';

export default function (scope, attrs) {
  let result = {};
  flattenNames(attrs).forEach((key) => (result[key] = readError(scope, key)));
  return expand(result);
}

export function readError(scope, key) {
  let input = findInput(A([scope, key]).compact().join('.'));
  let errors = input.querySelector('[data-test-errors]');
  return errors ? errors.textContent.trim() : '';
}
